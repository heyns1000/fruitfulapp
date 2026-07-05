/**
 * TreatyMonitor
 * Background service — mounts once in Layout.
 * Polls vault statuses every 30s and fires toasts + browser notifications
 * when any vault drifts from SEALED → BREACHED under OMNI-4321 standard.
 * Provides one-click remediation (re-seals the vault via entity update).
 */
import React, { useEffect, useRef, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { Shield, AlertTriangle, CheckCircle, X } from 'lucide-react';

const POLL_MS = 30_000;
const OMNI_STANDARD = 'OMNI-4321 §9.4.17';

function treatyStatus(vault) {
  if (vault.status === 'locked') return 'locked';
  if (vault.status === 'archived') return 'pending';
  if (vault.encryptionLevel === 'SGX' || vault.status === 'active') return 'sealed';
  return 'pending';
}

function isBreach(vault) {
  return vault.status !== 'active' && vault.status !== 'locked';
}

// In-app alert banner (rendered inside the monitor)
function BreachAlert({ vault, onRemediate, onDismiss }) {
  const [loading, setLoading] = useState(false);

  const handleRemediate = async () => {
    setLoading(true);
    await base44.entities.Vault.update(vault.id, { status: 'active', encryptionLevel: 'AES-256' });
    toast.success(`✅ Vault "${vault.name}" re-sealed under ${OMNI_STANDARD}`);
    onRemediate(vault.id);
    setLoading(false);
  };

  return (
    <div style={{
      position: 'fixed', bottom: '80px', right: '20px', zIndex: 9998,
      background: 'white', border: '2px solid #e53e3e', borderRadius: '14px',
      padding: '16px 20px', boxShadow: '0 8px 32px rgba(229,62,62,0.25)',
      maxWidth: '340px', animation: 'treatySlideIn 0.3s ease-out',
    }}>
      <style>{`@keyframes treatySlideIn { from { opacity:0; transform:translateX(30px); } to { opacity:1; transform:translateX(0); } }`}</style>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        <AlertTriangle style={{ color: '#e53e3e', width: 22, height: 22, flexShrink: 0, marginTop: '2px' }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, color: '#2d3748', fontSize: '14px' }}>Treaty Breach Detected</div>
          <div style={{ fontSize: '12px', color: '#718096', margin: '4px 0 2px' }}>
            <strong>{vault.name}</strong> has drifted from <strong>SEALED</strong>
          </div>
          <div style={{ fontSize: '10px', color: '#a0aec0', fontFamily: 'monospace' }}>{OMNI_STANDARD}</div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <button
              onClick={handleRemediate}
              disabled={loading}
              style={{ flex: 1, padding: '8px', background: '#e53e3e', color: 'white', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? '⏳ Sealing…' : '🔒 Remediate'}
            </button>
            <button
              onClick={() => onDismiss(vault.id)}
              style={{ padding: '8px 12px', background: '#f7fafc', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', color: '#718096' }}
            >
              Dismiss
            </button>
          </div>
        </div>
        <button onClick={() => onDismiss(vault.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a0aec0', flexShrink: 0 }}>
          <X style={{ width: 16, height: 16 }} />
        </button>
      </div>
    </div>
  );
}

export default function TreatyMonitor() {
  const [breaches, setBreaches] = useState([]);
  const knownBreachIds = useRef(new Set());
  const permGranted = useRef(false);

  // Request browser notification permission once
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(p => {
        permGranted.current = p === 'granted';
      });
    } else if ('Notification' in window && Notification.permission === 'granted') {
      permGranted.current = true;
    }
  }, []);

  const fireBrowserNotif = (vault) => {
    if (permGranted.current) {
      new Notification(`⚠️ Treaty Breach: ${vault.name}`, {
        body: `Vault has drifted from SEALED status. ${OMNI_STANDARD} violation.`,
        icon: '/favicon.ico',
      });
    }
  };

  const poll = async () => {
    let vaults;
    try {
      vaults = await base44.entities.Vault.list();
    } catch {
      return; // network blip — skip this cycle silently
    }
    const newBreaches = vaults.filter(isBreach);

    newBreaches.forEach(v => {
      if (!knownBreachIds.current.has(v.id)) {
        knownBreachIds.current.add(v.id);
        fireBrowserNotif(v);
        toast.error(
          `⚠️ TREATY BREACH: "${v.name}" — ${OMNI_STANDARD}`,
          { duration: 8000, id: `breach-${v.id}` }
        );
        setBreaches(prev => {
          if (prev.find(b => b.id === v.id)) return prev;
          return [...prev, v];
        });
      }
    });

    // Clear resolved breaches from known set
    const breachSet = new Set(newBreaches.map(v => v.id));
    knownBreachIds.current.forEach(id => {
      if (!breachSet.has(id)) knownBreachIds.current.delete(id);
    });
  };

  useEffect(() => {
    poll(); // immediate first check
    const id = setInterval(poll, POLL_MS);
    return () => clearInterval(id);
  }, []);

  const dismiss = (id) => setBreaches(prev => prev.filter(b => b.id !== id));
  const remediated = (id) => {
    knownBreachIds.current.delete(id);
    dismiss(id);
  };

  // Show only the most recent breach as a banner (others via toast)
  const topBreach = breaches[0] ?? null;

  return topBreach ? (
    <BreachAlert vault={topBreach} onRemediate={remediated} onDismiss={dismiss} />
  ) : null;
}
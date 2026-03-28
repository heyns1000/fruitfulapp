import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Shield, Box, FileKey, AlertTriangle, CheckCircle, Lock } from 'lucide-react';

const TREATY_STATUS = {
  sealed:   { label: 'SEALED',   color: '#48bb78', bg: '#f0fff4', icon: CheckCircle },
  pending:  { label: 'PENDING',  color: '#ed8936', bg: '#fffaf0', icon: AlertTriangle },
  breached: { label: 'BREACHED', color: '#e53e3e', bg: '#fff5f5', icon: AlertTriangle },
  locked:   { label: 'LOCKED',   color: '#667eea', bg: '#ebf4ff', icon: Lock },
};

function treatyFor(vault) {
  if (vault.status === 'locked') return 'locked';
  if (vault.status === 'archived') return 'pending';
  if (vault.encryptionLevel === 'SGX') return 'sealed';
  return vault.status === 'active' ? 'sealed' : 'pending';
}

function claimsFor(vault) {
  return [
    { id: `CLM-${vault.id?.slice(0,6)}-ROOT`, type: 'Ownership', owner: vault.brandName || 'System', verified: true },
    { id: `CLM-${vault.id?.slice(0,6)}-ENC`,  type: 'Encryption', owner: vault.encryptionLevel || 'AES-256', verified: true },
    { id: `CLM-${vault.id?.slice(0,6)}-ACC`,  type: 'Access', owner: vault.accessLevel || 'private', verified: vault.status === 'active' },
  ];
}

function DimCell({ dim, vault }) {
  const used = (vault.metadata?.sizeBytes || 0) > 0;
  return (
    <div title={`D${dim}`} style={{
      width: '28px', height: '28px', borderRadius: '5px', fontSize: '9px', fontFamily: 'monospace',
      display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'default',
      background: used && dim < 20 ? '#667eea' : used && dim < 35 ? '#764ba2' : '#e2e8f0',
      color: used && dim < 35 ? 'white' : '#718096',
      fontWeight: 700, transition: 'transform 0.15s',
    }}
      onMouseEnter={e => e.target.style.transform = 'scale(1.25)'}
      onMouseLeave={e => e.target.style.transform = 'scale(1)'}
    >D{dim}</div>
  );
}

function VaultCard({ vault, onClick, selected }) {
  const treaty = TREATY_STATUS[treatyFor(vault)];
  const Icon = treaty.icon;
  return (
    <div
      onClick={() => onClick(vault)}
      style={{
        background: selected ? '#ebf8ff' : 'white',
        border: `2px solid ${selected ? '#4299e1' : '#e2e8f0'}`,
        borderRadius: '12px', padding: '16px', cursor: 'pointer',
        transition: 'all 0.2s', boxShadow: selected ? '0 4px 14px rgba(66,153,225,0.25)' : '0 1px 4px rgba(0,0,0,0.06)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Box style={{ width: 18, height: 18, color: '#667eea' }} />
          <span style={{ fontWeight: 700, color: '#2d3748', fontSize: '14px' }}>{vault.name}</span>
        </div>
        <span style={{ background: treaty.bg, color: treaty.color, border: `1px solid ${treaty.color}`, borderRadius: '20px', padding: '2px 8px', fontSize: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Icon style={{ width: 10, height: 10 }} />{treaty.label}
        </span>
      </div>
      <div style={{ fontSize: '12px', color: '#718096' }}>
        <span>{vault.vaultType}</span> · <span>{vault.encryptionLevel || 'AES-256'}</span> · <span>{vault.accessLevel || 'private'}</span>
      </div>
      {vault.brandName && <div style={{ fontSize: '11px', color: '#a0aec0', marginTop: '4px' }}>🏷️ {vault.brandName}</div>}
    </div>
  );
}

export default function StorageGrid40D({ vaults }) {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? vaults : vaults.filter(v => treatyFor(v) === filter);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 420px' : '1fr', gap: '24px' }}>
      {/* Grid Panel */}
      <div>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {['all','sealed','pending','locked','breached'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', border: '1.5px solid',
              borderColor: filter === f ? '#667eea' : '#e2e8f0',
              background: filter === f ? '#667eea' : 'white',
              color: filter === f ? 'white' : '#4a5568',
            }}>{f.toUpperCase()}</button>
          ))}
          <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#718096', alignSelf: 'center' }}>{filtered.length} units</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '12px' }}>
          {filtered.length === 0 && (
            <p style={{ color: '#a0aec0', textAlign: 'center', padding: '40px', gridColumn: '1/-1' }}>No vaults found. Create one first.</p>
          )}
          {filtered.map(v => (
            <VaultCard key={v.id} vault={v} onClick={setSelected} selected={selected?.id === v.id} />
          ))}
        </div>
      </div>

      {/* Inspector Panel */}
      {selected && (
        <div style={{ background: 'white', border: '2px solid #e2e8f0', borderRadius: '16px', padding: '24px', position: 'sticky', top: '20px', height: 'fit-content' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield style={{ color: '#48bb78', width: 20, height: 20 }} />
              <span style={{ fontWeight: 800, fontSize: '16px', color: '#2d3748' }}>{selected.name}</span>
            </div>
            <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#a0aec0' }}>✕</button>
          </div>

          {/* 40D Storage Map */}
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>
              📦 40D Storage Map (D0–D39)
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {Array.from({ length: 40 }, (_, i) => <DimCell key={i} dim={i} vault={selected} />)}
            </div>
            <div style={{ fontSize: '10px', color: '#a0aec0', marginTop: '8px', display: 'flex', gap: '12px' }}>
              <span><span style={{ display:'inline-block', width:10, height:10, background:'#667eea', borderRadius:2, marginRight:4 }}/>Active</span>
              <span><span style={{ display:'inline-block', width:10, height:10, background:'#764ba2', borderRadius:2, marginRight:4 }}/>Warm</span>
              <span><span style={{ display:'inline-block', width:10, height:10, background:'#e2e8f0', borderRadius:2, marginRight:4 }}/>Free</span>
            </div>
          </div>

          {/* Treaty Status */}
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>
              📜 Treaty Status
            </p>
            {(() => {
              const t = TREATY_STATUS[treatyFor(selected)];
              const Icon = t.icon;
              return (
                <div style={{ background: t.bg, border: `1.5px solid ${t.color}`, borderRadius: '10px', padding: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icon style={{ color: t.color, width: 20, height: 20, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 800, color: t.color }}>{t.label}</div>
                    <div style={{ fontSize: '11px', color: '#718096' }}>TreatyHook™ OMNI-4321 §9.4.17</div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Ownership Claims */}
          <div>
            <p style={{ fontSize: '11px', fontWeight: 700, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>
              🔑 Ownership Claims
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {claimsFor(selected).map(c => (
                <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#f7fafc', borderRadius: '8px', fontSize: '12px' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#2d3748', fontFamily: 'monospace', fontSize: '11px' }}>{c.id}</div>
                    <div style={{ color: '#718096' }}>{c.type} · {c.owner}</div>
                  </div>
                  <span style={{ color: c.verified ? '#48bb78' : '#ed8936', fontWeight: 700, fontSize: '11px' }}>
                    {c.verified ? '✓ VERIFIED' : '⚠ PENDING'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Meta */}
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e2e8f0', fontSize: '11px', color: '#a0aec0', fontFamily: 'monospace', lineHeight: '1.8' }}>
            <div>ID: {selected.id}</div>
            <div>Items: {selected.metadata?.itemCount ?? 0}</div>
            <div>Size: {((selected.metadata?.sizeBytes || 0) / 1024).toFixed(1)} KB</div>
            <div>Region: {selected.metadata?.region || 'ZA-SOUTH'}</div>
          </div>
        </div>
      )}
    </div>
  );
}
/**
 * ShananaCheckoutPanel
 * Global cross-pollinated DIV overlay — mounts once in Layout,
 * listens for window 'shanana:purchase' events emitted by any
 * purchase/cart action across the entire app.
 */
import React, { useState, useEffect } from 'react';

const GRAIN = 0.01;
const CARE_PCT = 0.15;

function buildReceipt(amount, meta = {}) {
  const totalGrains = Math.round(amount / GRAIN);
  const careGrains  = Math.round(totalGrains * CARE_PCT);
  const bizGrains   = totalGrains - careGrains;
  return {
    orderId: `ORD_${Date.now()}`,
    totalUSD: amount.toFixed(2),
    totalGrains,
    careGrains,
    careUSD: (careGrains * GRAIN).toFixed(2),
    bizGrains,
    bizUSD: (bizGrains * GRAIN).toFixed(2),
    meta,
  };
}

export default function ShananaCheckoutPanel() {
  const [receipt, setReceipt] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      const { amount = 0, ...meta } = e.detail || {};
      setReceipt(buildReceipt(Number(amount), meta));
      setVisible(true);
    };
    window.addEventListener('shanana:purchase', handler);
    return () => window.removeEventListener('shanana:purchase', handler);
  }, []);

  if (!visible || !receipt) return null;

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
      onClick={() => setVisible(false)}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: 'white', borderRadius: '20px', maxWidth: '460px', width: '100%', overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.4)', animation: 'shanaPop 0.35s ease-out' }}
      >
        <style>{`
          @keyframes shanaPop { from { opacity:0; transform:scale(0.88) translateY(20px); } to { opacity:1; transform:scale(1) translateY(0); } }
        `}</style>

        {/* Great Wall bar */}
        <div style={{ height: '4px', background: 'linear-gradient(90deg,#48bb78,#4299e1)', boxShadow: '0 0 10px #48bb78' }} />

        <div style={{ padding: '32px' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '40px' }}>🌍🐘🐜</div>
            <h2 style={{ color: '#2d3748', fontSize: '22px', fontWeight: 700, marginTop: '8px' }}>Shanana™ Receipt</h2>
            <p style={{ color: '#667eea', fontSize: '13px', fontWeight: 600 }}>每粒番計, 零浪費</p>
          </div>

          {/* Order ID */}
          <div style={{ background: '#f7fafc', borderRadius: '10px', padding: '14px 18px', marginBottom: '16px', fontFamily: 'monospace', fontSize: '12px', color: '#4a5568' }}>
            <div><strong>ORDER:</strong> {receipt.orderId}</div>
            {receipt.meta.itemName && <div><strong>ITEM:</strong> {receipt.meta.itemName}</div>}
          </div>

          {/* Price gradient box */}
          <div style={{ background: 'linear-gradient(135deg,#667eea,#764ba2)', color: 'white', borderRadius: '12px', padding: '18px', textAlign: 'center', marginBottom: '16px' }}>
            <div style={{ fontSize: '13px', opacity: 0.85 }}>Total Charged</div>
            <div style={{ fontSize: '42px', fontWeight: 700 }}>${receipt.totalUSD}</div>
            <div style={{ fontSize: '11px', opacity: 0.75, marginTop: '4px' }}>{receipt.totalGrains.toLocaleString()} grains @ $0.01</div>
          </div>

          {/* Care split */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
            <div style={{ background: '#f0fff4', border: '1.5px solid #48bb78', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: '#276749', fontWeight: 700 }}>💚 Banimals™ Care</div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: '#38a169' }}>${receipt.careUSD}</div>
              <div style={{ fontSize: '10px', color: '#68d391' }}>{receipt.careGrains} grains (15%)</div>
            </div>
            <div style={{ background: '#ebf8ff', border: '1.5px solid #4299e1', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: '#2b6cb0', fontWeight: 700 }}>💼 Your Business</div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: '#3182ce' }}>${receipt.bizUSD}</div>
              <div style={{ fontSize: '10px', color: '#63b3ed' }}>{receipt.bizGrains} grains (85%)</div>
            </div>
          </div>

          {/* Security */}
          <div style={{ background: '#f7fafc', borderRadius: '8px', padding: '12px', textAlign: 'center', fontSize: '11px', color: '#718096', marginBottom: '20px', lineHeight: '1.7' }}>
            🔒 Great Wall (7 Layers) · Treaty OMNI-4321 §9.4.17 SEALED · Waste: ZERO
          </div>

          <button
            onClick={() => setVisible(false)}
            style={{ width: '100%', background: 'linear-gradient(135deg,#667eea,#764ba2)', color: 'white', border: 'none', padding: '13px', borderRadius: '10px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.05em' }}
          >
            CONFIRM RECEIPT ✓
          </button>
        </div>
      </div>
    </div>
  );
}

/** Helper: call this anywhere in the app to trigger the Shanana panel */
export function emitPurchase(amount, meta = {}) {
  window.dispatchEvent(new CustomEvent('shanana:purchase', { detail: { amount, ...meta } }));
}
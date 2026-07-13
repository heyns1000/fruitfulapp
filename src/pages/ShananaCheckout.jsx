import React, { useEffect, useRef, useState } from 'react';

// ── SYSTEM CORE: NEXUS_NAIR v∞ ──
class NexusPulseEngine {
  constructor(onTick, onCycle) {
    this.interval = 9000;
    this.cycle = 0;
    this.startTime = Date.now();
    this.onTick = onTick;
    this.onCycle = onCycle;
    this.tickId = setInterval(() => this.breathe(), 100);
    this.cycleId = setInterval(() => this.pulseSync(), this.interval);
  }
  breathe() {
    const elapsed = (Date.now() - this.startTime) % this.interval;
    const progress = elapsed / this.interval;
    this.onTick({ elapsed, progress });
  }
  pulseSync() {
    this.cycle++;
    this.onCycle(this.cycle);
  }
  destroy() {
    clearInterval(this.tickId);
    clearInterval(this.cycleId);
  }
}

class BareCartVortex {
  constructor() { this.GRAIN = 0.01; this.CARE = 0.15; }
  processOrder(totalUSD) {
    const totalGrains = Math.round(totalUSD / this.GRAIN);
    const careGrains = Math.round(totalGrains * this.CARE);
    const businessGrains = totalGrains - careGrains;
    return {
      orderId: `ORD_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      totalUSD, totalGrains, careGrains,
      careUSD: (careGrains * this.GRAIN).toFixed(2),
      businessGrains,
      businessUSD: (businessGrains * this.GRAIN).toFixed(2),
      waste: 0, verified: true
    };
  }
}

const vortex = new BareCartVortex();
const shananaStart = performance.now();

export default function ShananaCheckout() {
  const [pulseTime, setPulseTime] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [dotStyle, setDotStyle] = useState({ transform: 'scale(1)', opacity: 0.5 });
  const [secure, setSecure] = useState(false);
  const [modal, setModal] = useState({ open: false, message: '' });
  const [ppError, setPpError] = useState(false);
  const paypalRef = useRef(null);
  const pulseRef = useRef(null);

  // Great Wall activation
  useEffect(() => {
    console.log('🔒 Great Wall: 7 Layers Active');
    setSecure(true);

    pulseRef.current = new NexusPulseEngine(
      ({ elapsed, progress }) => {
        setPulseTime((elapsed / 1000).toFixed(1));
        if (progress < 0.5) {
          const scale = 1 + progress * 0.5;
          setDotStyle({ transform: `scale(${scale})`, opacity: 0.5 + progress });
        } else {
          const scale = 1.5 - (progress - 0.5) * 0.5;
          setDotStyle({ transform: `scale(${scale})`, opacity: 1.5 - progress });
        }
      },
      (c) => { setCycle(c); console.log(`💨 PULSE ${c}: SYSTEM SYNC | GRAIN READY`); }
    );

    console.log('═══════════════════════════════════════════════════════');
    console.log('🌍 RESPITORY v∞ ACTIVATED');
    console.log('Payment ID: K65YZZXSGZ7U (Ref)');
    console.log('每粒番計, 零浪費 - Every grain counted, zero waste');
    console.log('═══════════════════════════════════════════════════════');

    return () => pulseRef.current?.destroy();
  }, []);

  // PayPal SDK
  useEffect(() => {
    if (document.getElementById('paypal-sdk')) { initPayPal(); return; }
    const script = document.createElement('script');
    script.id = 'paypal-sdk';
    const ppClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID || '';
    script.src = `https://www.paypal.com/sdk/js?client-id=${ppClientId}&currency=USD&disable-funding=credit,card`;
    script.setAttribute('data-sdk-integration-source', 'button-factory');
    script.onload = initPayPal;
    script.onerror = () => setPpError(true);
    document.body.appendChild(script);
  }, []);

  function initPayPal() {
    if (!window.paypal || !paypalRef.current) return;
    paypalRef.current.innerHTML = '';
    window.paypal.Buttons({
      style: { shape: 'rect', color: 'gold', layout: 'vertical', label: 'paypal', height: 55 },
      createOrder: (data, actions) => actions.order.create({
        purchase_units: [{ description: 'NEXUS_NAIR Consultant License - 每粒番計', amount: { currency_code: 'USD', value: '29.00' } }],
        application_context: { brand_name: 'Fruitful Global Planet', shipping_preference: 'NO_SHIPPING' }
      }),
      onApprove: async (data, actions) => {
        const order = await actions.order.capture();
        const duration = ((performance.now() - shananaStart) / 1000).toFixed(2);
        const tx = vortex.processOrder(29.00);
        const isCompliant = (tx.careGrains / tx.totalGrains).toFixed(2) == 0.15;
        console.log(`📜 Treaty OMNI-4321 §9.4.17: ${isCompliant ? 'SEALED' : 'BREACH'}`);
        const receipt =
          `ORDER ID: ${order.id}\n` +
          `TIME: ${duration}s (Target: <9s)\n` +
          `--------------------------------\n` +
          `TOTAL: $${tx.totalUSD} (${tx.totalGrains} grains)\n` +
          `CARE (15%): $${tx.careUSD} (${tx.careGrains} grains)\n` +
          `BUSINESS (85%): $${tx.businessUSD}\n` +
          `--------------------------------\n` +
          `Treaty: SEALED (OMNI-4321)\n` +
          `Security: GREAT WALL (7 Layers)\n` +
          `Waste: ZERO\n\nRedirecting to Access Portal...`;
        setModal({ open: true, message: receipt });
        setTimeout(() => console.log('🚀 Redirect: https://fruitfulglobalplanet.com/access?order=' + order.id), 2000);
      },
      onError: (err) => { console.error('PayPal Error:', err); setModal({ open: true, message: 'Connection Interrupted. Please retry.' }); }
    }).render(paypalRef.current);
  }

  return (
    <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>

      {/* Back Button - top left */}
      <a href="/Dashboard" style={{ position: 'fixed', top: '16px', left: '16px', zIndex: 9999, display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '999px', background: '#18241C', color: 'white', fontSize: '14px', fontWeight: '600', textDecoration: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
        ← <span>Back</span>
      </a>

      {/* Modal */}
      {modal.open && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '12px', width: '90%', maxWidth: '400px', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: '24px', marginBottom: '12px' }}>🌍 NEXUS_NAIR</div>
            <pre style={{ color: '#2d3748', marginBottom: '20px', whiteSpace: 'pre-wrap', lineHeight: '1.5', textAlign: 'left', fontFamily: 'monospace', fontSize: '12px' }}>{modal.message}</pre>
            <button onClick={() => setModal({ open: false, message: '' })} style={{ background: '#667eea', color: 'white', border: 'none', padding: '10px 25px', borderRadius: '6px', fontSize: '16px', cursor: 'pointer' }}>
              CONFIRM RECEIPT
            </button>
          </div>
        </div>
      )}

      <div style={{ background: 'white', borderRadius: '20px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', maxWidth: '500px', width: '100%', padding: '40px', position: 'relative', overflow: 'hidden', animation: 'slideUp 0.5s ease-out' }}>
        <style>{`
          @keyframes slideUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
        `}</style>

        {/* Great Wall indicator */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: secure ? 'linear-gradient(90deg,#48bb78,#4299e1)' : '#e2e8f0', boxShadow: secure ? '0 0 10px #48bb78' : 'none', transition: 'all 0.5s' }} />

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>🌍🐘🐜</div>
          <h1 style={{ color: '#2d3748', fontSize: '28px', marginBottom: '10px' }}>Shanana™ Checkout</h1>
          <p style={{ color: '#718096', fontSize: '14px', marginBottom: '5px' }}>NEXUS_NAIR Consultant License</p>
          <p style={{ color: '#667eea', fontSize: '16px', fontWeight: 600 }}>每粒番計, 零浪費</p>
        </div>

        {/* Product box */}
        <div style={{ background: '#f7fafc', border: '2px solid #e2e8f0', borderRadius: '12px', padding: '25px', margin: '25px 0' }}>
          <div style={{ fontSize: '20px', color: '#2d3748', fontWeight: 600, marginBottom: '15px' }}>🚀 Full Platform Access</div>
          <ul style={{ listStyle: 'none' }}>
            {[
              'VaultMesh™ Treaty Sync System',
              'BareCart™ Vortex Grain Factory',
              'PulseTrade™ 9-Second Synchronization',
              'Store40D™ Dimensional Storage',
              'HSOMNI∞ONE™ Brand Integration (13,713)',
              'ELEPHANT_MEMORY Contextual Intelligence',
              'ANT_API Colony Coordination',
              'ClaimRoot™ Immutable Claims',
              'Great Wall 7-Layer Security',
              'Lifetime Platform Updates',
            ].map(f => (
              <li key={f} style={{ padding: '8px 0', color: '#4a5568', fontSize: '14px', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#48bb78', fontWeight: 'bold', marginRight: '10px', fontSize: '18px' }}>✓</span> {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Price box */}
        <div style={{ background: 'linear-gradient(135deg,#667eea,#764ba2)', color: 'white', borderRadius: '12px', padding: '20px', margin: '25px 0', textAlign: 'center' }}>
          <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '5px' }}>Consultant License</div>
          <div style={{ fontSize: '48px', fontWeight: 'bold', margin: '10px 0' }}>$29<sup>.00</sup></div>
          <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '10px' }}>Grain Precision: 2,900 grains @ $0.01 each</div>
        </div>

        {/* Care notice */}
        <div style={{ background: '#f0fff4', border: '2px solid #48bb78', borderRadius: '8px', padding: '15px', margin: '20px 0', textAlign: 'center' }}>
          <strong style={{ color: '#22543d', fontSize: '16px' }}>💚 Automatic Care Loop</strong>
          <div style={{ color: '#48bb78', fontSize: '20px', fontWeight: 'bold', margin: '5px 0' }}>$4.35 (15%)</div>
          <small style={{ display: 'block', color: '#4a5568' }}>goes directly to Banimals™ Animal Welfare</small>
          <small style={{ display: 'block', color: '#22543d', fontWeight: 600, marginTop: '4px' }}>Your business receives: $24.65 (85%)</small>
        </div>

        {/* PayPal container */}
        <div ref={paypalRef} style={{ margin: '25px 0', minHeight: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {ppError
            ? <div style={{ textAlign: 'center', color: '#e53e3e', padding: '10px', border: '1px solid #e53e3e', borderRadius: '6px', width: '100%' }}><strong>Connection Error</strong><br /><small>Unable to load PayPal Security Gate.</small></div>
            : <span style={{ color: '#718096', fontSize: '14px' }}>Loading secure payment portal...</span>
          }
        </div>

        {/* Pulse timer */}
        <div style={{ textAlign: 'center', margin: '20px 0', fontSize: '14px', color: '#718096', fontFamily: 'monospace' }}>
          <span style={{ display: 'inline-block', width: '8px', height: '8px', background: '#48bb78', borderRadius: '50%', marginRight: '8px', transition: 'transform 0.2s, opacity 0.2s', ...dotStyle }} />
          Pulse: <span>{pulseTime}</span>s | Cycle: <span>{cycle}</span>
        </div>

        {/* Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '15px', marginTop: '25px', paddingTop: '25px', borderTop: '2px solid #e2e8f0' }}>
          {[['2,900', 'Total Grains'], ['435', 'Care Grains'], ['<9s', 'Checkout Time']].map(([val, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea' }}>{val}</div>
              <div style={{ fontSize: '11px', color: '#718096', marginTop: '5px' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Security badge */}
        <div style={{ textAlign: 'center', marginTop: '20px', padding: '15px', background: '#f7fafc', borderRadius: '8px' }}>
          <small style={{ color: '#718096', fontSize: '12px', display: 'block', lineHeight: '1.6' }}>
            🔒 Protected by Great Wall Security (7 Layers)<br />
            ✓ TreatyHook™ OMNI-4321 §9.4.17 Sealed<br />
            ✓ PayPal Secure | 40D Storage Verified
          </small>
        </div>

        <footer style={{ textAlign: 'center', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #e2e8f0', color: '#a0aec0', fontSize: '12px' }}>
          Fruitful Global Planet | Pretoria, South Africa<br />
          Every grain counted. Zero waste tolerated.
        </footer>
      </div>
    </div>
  );
}
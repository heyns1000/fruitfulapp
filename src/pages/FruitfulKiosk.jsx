import React, { useState, useEffect, useMemo } from 'react';

/**
 * 🜏 FRUITFUL PUBLIC PORTAL: INTERSTELLAR SOVEREIGN MASTER v4.4.0 🜏
 * Core Node Anchor: 302 Dykor St, Silverton Hub (Pretoria)
 * Registry Identifier: 2021/121654/07 (Fruitful Shops Pty Ltd)
 * Governance Layer: FAA™ Vault Layer / CodeNest Omnidrop Signal Ingest
 * Synchronization: 9-Second VaultMesh Pulse Heartbeat to https://fruitfulapp.base44.app
 */

const BRAND_CATALOG = {
  "nourish": [
    {
      id: 'n01', name: 'Bushstack Pancakes', price: 5, stock: 40,
      image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&q=90&w=1600',
      desc: 'Double-stack artisan pancakes with wild Pretoria honey, organic bush berries, and hand-whipped velvet cream.', code: 'FAA-PAN-02'
    },
    {
      id: 'n02', name: 'Jura Flat White', price: 5, stock: 100,
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=90&w=1600',
      desc: 'Triple-shot premium Aquaspresso extraction brewed live over the HotStack Nexus framework.', code: 'FAA-COF-03'
    },
  ],
  "hathaven-hats": [
    {
      id: 'h01', name: 'Sovereign Fedora', price: 39, stock: 15,
      image: 'https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?auto=format&fit=crop&q=90&w=1600',
      desc: 'Luxury wide-brim straw hat featuring hand-crafted geometric beadwork band details and premium felt finish.', code: 'FAA-HAT-01'
    },
    {
      id: 'h02', name: 'Bouchetr Children Romper', price: 39, stock: 20,
      image: 'https://images.unsplash.com/photo-1576871337622-98d48d895e7d?auto=format&fit=crop&q=90&w=1600',
      desc: 'Authentic local artisan hand-knitted children garments, styled precisely for extreme South African terrain.', code: 'FAA-HAT-02'
    },
  ],
  "samfox-prints": [
    {
      id: 's01', name: 'Exclusive Combo Set', price: 119, stock: 10,
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=90&w=1600',
      desc: 'Exclusive SamFox illustrated corporate apparel shirt combined with matching beaded signature hat.', code: 'FAA-CMB-01'
    },
    {
      id: 's02', name: 'The Lion Ascends Print', price: 69, stock: 8,
      image: 'https://images.unsplash.com/photo-1614027164847-1b2809eb1895?auto=format&fit=crop&q=90&w=1600',
      desc: 'Museum grade physical wire topography art capture and fine art print mapping deep ecosystem lines.', code: 'FAA-PRNT-02'
    },
  ],
  "pottery": [
    {
      id: 'p01', name: 'Limpopo Earth Pot', price: 39, stock: 12,
      image: 'https://images.unsplash.com/photo-1565193998772-263d7f4d2bd9?auto=format&fit=crop&q=90&w=1600',
      desc: 'Traditional clayware collection piece pattern fired on location by local master artisans using ancient soils.', code: 'FAA-POT-01'
    }
  ]
};

const PAYSTACK_KEY = "pk_test_492187d58d9a9e19fa2c19042c9369eb1a6d9b01";

const SovereignAsset = ({ src, alt, className }) => {
  const [error, setError] = useState(false);
  const fallback = "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&q=90&w=1600";
  return (
    <img
      src={error ? fallback : src}
      alt={alt}
      className={`${className} transition-all duration-1000 ${error ? 'grayscale contrast-125' : ''}`}
      onError={() => setError(true)}
      loading="eager"
    />
  );
};

// Inline SVG Icons
const IconCart = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
  </svg>
);
const IconZap = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);
const IconCheck = () => (
  <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconSync = () => (
  <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <polyline points="23 4 23 10 17 10"/>
    <polyline points="1 20 1 14 7 14"/>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
  </svg>
);
const IconTerminal = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>
  </svg>
);
const IconChevron = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);
const IconX = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const TABS = [
  { id: 'nourish', label: 'Nourishment' },
  { id: 'hathaven-hats', label: 'HatHaven Hats' },
  { id: 'samfox-prints', label: 'SamFox Prints' },
  { id: 'pottery', label: 'Artisan Pottery' },
];

export default function FruitfulKiosk() {
  const [activeTab, setActiveTab] = useState('nourish');
  const [step, setStep] = useState('menu');
  const [logs, setLogs] = useState([
    "[SYSTEM] Node 042 Ingest System Active.",
    "[FAA] Vault Layer structural parameters locked."
  ]);
  const [reference, setReference] = useState(`FAA-REF-${Math.random().toString(36).substr(2, 7).toUpperCase()}`);
  const [pulseTime, setPulseTime] = useState(9);

  // --- 9-Second VaultMesh Pulse ---
  useEffect(() => {
    const t = setInterval(() => {
      setPulseTime(prev => {
        if (prev <= 1) {
          setLogs(old => [`[PULSE] VaultMesh state reconciliation pulse executed. Status: IRREVERSIBLE_LOCK_ACHIEVED`, ...old]);
          return 9;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  // --- Paystack SDK injection ---
  useEffect(() => {
    if (!window.PaystackPop) {
      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.async = true;
      script.onload = () => setLogs(prev => ["[PAYSTACK] Inline core package loaded into runtime domain.", ...prev]);
      document.body.appendChild(script);
    }
  }, []);

  // --- Persistent Cart ---
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem("fruitful_sovereign_cart") || "[]"); } catch { return []; }
  });
  useEffect(() => {
    localStorage.setItem("fruitful_sovereign_cart", JSON.stringify(cart));
  }, [cart]);

  // --- Persistent Inventory ---
  const [inventory, setInventory] = useState(() => {
    try {
      const saved = localStorage.getItem("fruitful_sovereign_inventory");
      if (saved) return JSON.parse(saved);
    } catch {}
    const defaults = {};
    Object.values(BRAND_CATALOG).forEach(cat => cat.forEach(item => { defaults[item.id] = item.stock; }));
    return defaults;
  });
  useEffect(() => {
    localStorage.setItem("fruitful_sovereign_inventory", JSON.stringify(inventory));
  }, [inventory]);

  const total = useMemo(() => cart.reduce((s, i) => s + i.price, 0), [cart]);

  // --- Telemetry ---
  const sendTelemetry = async (event, details) => {
    try {
      await fetch("https://fruitfulapp.base44.app/api/telemetry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          node: "FAA-Vault-Kiosk-042",
          location: "302 Dykor St, Silverton Hub (Pretoria)",
          timestamp: new Date().toISOString(),
          event,
          details
        })
      });
    } catch {
      console.warn("FAA-TELEMETRY: Offline state buffered.");
    }
  };

  const addToCart = (item) => {
    const inCart = cart.filter(i => i.id === item.id).length;
    const stock = inventory[item.id] ?? 0;
    if (inCart >= stock) {
      setLogs(prev => [`[ALERT] Stock exhausted for SKU ${item.code}.`, ...prev]);
      return;
    }
    setCart([...cart, { ...item, cartId: Math.random() }]);
    setLogs(prev => [`[INGEST] Tokenized item allocation: ${item.code}`, ...prev]);
    sendTelemetry("KIOSK_ITEM_INGESTED", { sku: item.code });
  };

  const removeFromCart = (cartId) => {
    const item = cart.find(i => i.cartId === cartId);
    setCart(cart.filter(i => i.cartId !== cartId));
    if (item) {
      setLogs(prev => [`[EVICTION] Evicted ${item.code} from local state array.`, ...prev]);
      sendTelemetry("KIOSK_ITEM_EVICTED", { sku: item.code });
    }
  };

  const handleCheckout = () => {
    setStep('processing');
    setLogs(prev => [`[PAYSTACK] Building pipeline wrapper for $ ${total} USD...`, ...prev]);

    if (!window.PaystackPop) {
      setLogs(prev => ["[ALERT] Paystack inline core unavailable. Retrying...", ...prev]);
      setTimeout(handleCheckout, 1000);
      return;
    }

    const handler = window.PaystackPop.setup({
      key: PAYSTACK_KEY,
      email: "kiosk@fruitful.app",
      amount: total * 100 * 18, // USD → ZAR conversion (kobo)
      currency: "ZAR",
      ref: reference,
      metadata: {
        custom_fields: [
          { display_name: "Transaction Reference", variable_name: "tx_ref", value: reference },
          { display_name: "Tenant Registry", variable_name: "tenant_reg", value: "2021/121654/07" },
          { display_name: "Omnidrop Signature", variable_name: "omnidrop_sig", value: "If you dont like the fruits you are growing, change the seed™" }
        ]
      },
      callback: (response) => {
        setLogs(prev => [`[SUCCESS] Transaction authorized. Reference: ${response.reference}`, ...prev]);
        const updatedInventory = { ...inventory };
        cart.forEach(item => {
          if (updatedInventory[item.id] !== undefined)
            updatedInventory[item.id] = Math.max(0, updatedInventory[item.id] - 1);
        });
        setInventory(updatedInventory);
        sendTelemetry("VAULT_TRANSACTION_COMMITTED", { reference: response.reference, totalUSD: total });
        setCart([]);
        setStep('success');
      },
      onClose: () => {
        setLogs(prev => [`[ALERT] Transaction cycle canceled by user.`, ...prev]);
        setStep('cart');
      }
    });

    handler.openIframe();
  };

  const reset = () => {
    setCart([]);
    setStep('menu');
    setReference(`FAA-REF-${Math.random().toString(36).substr(2, 7).toUpperCase()}`);
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-900 font-sans select-none overflow-x-hidden">
      {/* Background mesh */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full"
          style={{ background: 'radial-gradient(circle at 15% 15%, rgba(71,179,168,0.12) 0%, transparent 40%), radial-gradient(circle at 85% 85%, rgba(230,57,70,0.08) 0%, transparent 40%)' }} />
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'radial-gradient(#0f172a 1.5px, transparent 1.5px)', backgroundSize: '40px 40px' }} />
      </div>

      {/* Header */}
      <header className="w-full bg-white/80 backdrop-blur-3xl border-b border-slate-200 py-6 px-6 md:px-16 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-6 md:gap-10">
          <div className="relative cursor-pointer" onClick={reset}>
            <div className="w-14 h-16 md:w-20 md:h-24 bg-[#e63946] rounded-[20px] md:rounded-[28px] flex items-center justify-center text-white font-black italic text-3xl md:text-5xl shadow-2xl transition-all active:scale-90 border-b-[5px] border-red-950">f</div>
          </div>
          <div>
            <h1 className="text-3xl md:text-6xl font-black italic tracking-tighter uppercase leading-none text-slate-900">fruitful</h1>
            <div className="flex items-center gap-3 mt-1 md:mt-3 flex-wrap">
              <span className="text-[11px] md:text-[14px] font-black uppercase tracking-[0.4em] text-[#47b3a8]">Pretoria // Node 042</span>
              <span className="text-slate-300 hidden md:inline">|</span>
              <div className="hidden md:flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981] animate-pulse" />
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Treaty Grid Compliant</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-10">
          <div className="hidden lg:flex flex-col items-end border-r border-slate-200 pr-6">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-1">VaultMesh Pulse</span>
            <span className="text-xl font-black text-[#e63946] tabular-nums">{pulseTime}s</span>
          </div>
          <button
            onClick={() => cart.length > 0 && setStep('cart')}
            className={`relative px-5 py-4 md:px-8 md:py-6 rounded-[28px] md:rounded-[40px] flex items-center gap-4 md:gap-6 transition-all duration-500 ${cart.length > 0 ? 'bg-slate-900 text-white shadow-2xl scale-105 active:scale-95' : 'bg-white border border-slate-200 text-slate-300'}`}
          >
            <IconCart />
            <span className="font-black text-xl md:text-3xl tracking-tighter italic leading-none">
              ${total.toLocaleString()} <span className="text-xs opacity-60">USD</span>
            </span>
            {cart.length > 0 && (
              <span className="absolute -top-3 -right-3 bg-[#e63946] text-white w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border-2 border-[#f1f5f9] animate-bounce shadow-xl">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="w-full max-w-[1600px] mx-auto p-6 md:p-16 flex flex-col xl:flex-row gap-12 xl:gap-16 relative z-10">

        {/* Inventory */}
        <div className="flex-1 min-h-[70vh]">

          {step === 'menu' && (
            <div className="space-y-10">
              {/* Category tabs */}
              <nav className="flex bg-white/70 backdrop-blur-3xl p-3 rounded-[40px] shadow-sm border border-white gap-2 overflow-x-auto">
                {TABS.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-4 md:py-6 px-4 md:px-10 rounded-[32px] font-black text-[13px] md:text-[15px] uppercase tracking-widest transition-all duration-500 whitespace-nowrap ${activeTab === tab.id ? 'bg-[#47b3a8] text-white shadow-lg' : 'text-slate-400 hover:text-slate-700 hover:bg-white'}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>

              {/* Product grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                {BRAND_CATALOG[activeTab]?.map(item => {
                  const currentStock = inventory[item.id] ?? 0;
                  const countInCart = cart.filter(i => i.id === item.id).length;
                  const availableStock = Math.max(0, currentStock - countInCart);
                  return (
                    <div
                      key={item.id}
                      onClick={() => availableStock > 0 && addToCart(item)}
                      className={`bg-white rounded-[48px] md:rounded-[72px] shadow-sm flex flex-col hover:shadow-2xl hover:-translate-y-3 transition-all duration-700 cursor-pointer group relative overflow-hidden border border-white ${availableStock <= 0 ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      <div className="w-full h-[320px] md:h-[440px] overflow-hidden relative bg-slate-50">
                        <SovereignAsset
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 duration-[3000ms]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-700" />
                        <div className="absolute bottom-8 left-10 flex flex-col gap-2 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700">
                          <span className="text-[12px] font-black uppercase tracking-[0.5em] text-[#47b3a8]">Global Brand Verified</span>
                          <h4 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter leading-none">${item.price} USD</h4>
                        </div>
                      </div>

                      <div className="p-8 md:p-14 flex-1 flex flex-col">
                        <h3 className="font-black text-3xl md:text-5xl tracking-tighter leading-none text-slate-800 italic group-hover:text-[#47b3a8] transition-colors duration-500 mb-5">{item.name}</h3>
                        <p className="text-base md:text-lg text-slate-500 font-medium leading-relaxed mb-8 italic opacity-80">"{item.desc}"</p>
                        <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-50">
                          <div>
                            <span className="text-[11px] font-black uppercase tracking-[0.6em] text-slate-300 block mb-1">Code</span>
                            <span className="text-base font-black text-[#47b3a8] tracking-[0.15em]">{item.code}</span>
                            <span className={`text-[11px] font-black uppercase tracking-wider block mt-1 ${availableStock <= 0 ? 'text-red-500' : 'text-slate-400'}`}>
                              {availableStock <= 0 ? 'OUT OF STOCK' : `${availableStock} units available`}
                            </span>
                          </div>
                          <div className={`w-16 h-16 md:w-20 md:h-20 rounded-[28px] flex items-center justify-center shadow-xl transition-all duration-500 group-hover:scale-110 active:scale-95 ${availableStock <= 0 ? 'bg-slate-200 text-slate-400' : 'bg-slate-900 text-white group-hover:bg-[#e63946]'}`}>
                            <IconChevron />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {step === 'cart' && (
            <div className="bg-white rounded-[60px] md:rounded-[100px] p-10 md:p-24 shadow-2xl border border-white">
              <div className="flex justify-between items-end mb-16">
                <div>
                  <h2 className="text-6xl md:text-9xl font-black italic tracking-tighter uppercase leading-none text-slate-900">The Stack</h2>
                  <p className="text-[#47b3a8] font-black uppercase tracking-[0.6em] text-base md:text-xl mt-4">Consilience Sync Protocol Verified</p>
                </div>
                <button onClick={() => setStep('menu')} className="text-slate-400 font-black text-sm md:text-base uppercase tracking-[0.5em] px-8 py-4 md:px-14 md:py-6 bg-slate-50 rounded-[40px] hover:text-slate-900 transition-all border border-slate-100 active:scale-95">
                  Back
                </button>
              </div>

              <div className="space-y-8 mb-16 max-h-[500px] overflow-y-auto pr-4">
                {cart.length === 0 && (
                  <p className="text-slate-400 text-center py-12 font-bold uppercase tracking-widest">Cart is empty</p>
                )}
                {cart.map((item) => (
                  <div key={item.cartId} className="flex items-center justify-between border-b border-slate-100 pb-8 gap-6">
                    <div className="flex items-center gap-8">
                      <div className="w-20 h-20 md:w-28 md:h-28 rounded-[24px] overflow-hidden shadow-xl border-4 border-white bg-slate-50 shrink-0">
                        <SovereignAsset src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-black text-2xl md:text-4xl tracking-tighter text-slate-800 leading-none italic">{item.name}</h4>
                        <p className="text-sm font-black text-[#47b3a8] uppercase tracking-[0.5em] mt-1">{item.code}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 shrink-0">
                      <span className="font-black text-3xl md:text-5xl tracking-tighter italic">${item.price}</span>
                      <button onClick={() => removeFromCart(item.cartId)} className="w-12 h-12 md:w-16 md:h-16 rounded-[20px] bg-slate-50 flex items-center justify-center text-slate-300 hover:bg-red-50 hover:text-[#e63946] transition-all active:scale-90">
                        <IconX />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-slate-900 text-white rounded-[48px] md:rounded-[72px] p-10 md:p-20 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl border-b-[12px] border-black">
                <div>
                  <p className="text-slate-500 font-black uppercase text-sm tracking-[0.8em] mb-4">Total</p>
                  <span className="text-6xl md:text-9xl font-black italic text-white tracking-tighter leading-none">${total.toLocaleString()} <span className="text-2xl not-italic text-slate-500">USD</span></span>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={cart.length === 0}
                  className="bg-[#e63946] text-white px-12 md:px-20 py-8 md:py-12 rounded-[48px] font-black text-3xl md:text-5xl uppercase tracking-wide shadow-xl shadow-red-500/40 active:scale-95 hover:scale-105 transition-all flex items-center gap-6 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  DEPLOY
                  <IconZap />
                </button>
              </div>
            </div>
          )}

          {step === 'processing' && (
            <div className="bg-slate-900 text-white p-12 md:p-24 rounded-[80px] text-center shadow-2xl h-full flex flex-col items-center justify-center min-h-[70vh]">
              <div className="w-48 h-48 md:w-80 md:h-80 bg-white/5 rounded-full flex items-center justify-center mb-16 border-[12px] border-white/5 relative">
                <div className="absolute inset-0 rounded-full border-[8px] border-[#47b3a8] animate-ping opacity-20" />
                <div className="animate-spin text-[#47b3a8]"><IconSync /></div>
              </div>
              <h2 className="text-5xl md:text-9xl font-black italic tracking-tighter uppercase mb-8 leading-none">Syncing <span className="text-[#47b3a8]">Vault</span></h2>
              <p className="text-slate-400 font-bold uppercase tracking-[0.8em] text-sm md:text-lg mb-16 max-w-xl mx-auto">Mineralizing secure ledger verification...</p>
              <div className="flex flex-wrap justify-center gap-6">
                <div className="px-8 py-4 bg-white/5 rounded-[32px] text-sm font-black uppercase tracking-[0.6em] border border-white/10">Node: Silverton-Hub-042</div>
                <div className="px-8 py-4 bg-white/5 rounded-[32px] text-sm font-black uppercase tracking-[0.6em] border border-white/10 text-[#47b3a8]">G149 Synchronized</div>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="bg-[#47b3a8] text-white p-12 md:p-24 rounded-[80px] text-center shadow-2xl h-full flex flex-col items-center justify-center min-h-[70vh]">
              <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center mb-16 shadow-2xl text-[#47b3a8] animate-bounce">
                <IconCheck />
              </div>
              <h2 className="text-6xl md:text-[120px] font-black italic tracking-tighter uppercase mb-8 text-slate-900 leading-none">Ascended</h2>
              <p className="text-slate-900/70 font-black uppercase tracking-[0.6em] text-sm md:text-base mb-16 italic max-w-xl mx-auto leading-loose">
                The Asivereiger deployment protocol executed completely.<br/>Handcrafted assets manifest at 302 Dykor St, Pretoria.
              </p>
              <button onClick={reset} className="bg-slate-900 text-white py-8 px-16 rounded-[56px] font-black uppercase tracking-widest text-xl shadow-2xl active:scale-95 hover:scale-105 transition-all">
                Start New Ingest Cycle
              </button>
            </div>
          )}
        </div>

        {/* Vault Ledger Console */}
        <aside className="w-full xl:w-[480px] xl:sticky xl:top-[120px] xl:self-start">
          <div className="bg-slate-900 rounded-[60px] p-10 md:p-16 text-white border border-white/5 shadow-2xl flex flex-col max-h-[80vh] xl:max-h-[calc(100vh-160px)]">
            <div className="flex items-center gap-6 mb-12">
              <div className="p-4 bg-[#47b3a8]/20 rounded-[24px] text-[#47b3a8]">
                <IconTerminal />
              </div>
              <div>
                <h3 className="text-base font-black uppercase tracking-[0.8em] text-[#47b3a8] leading-none">Vault Ledger</h3>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2">Sovereign SDE Core Execution</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 font-mono text-xs text-slate-600 pr-2 min-h-0">
              {logs.map((log, i) => (
                <div key={i} className={`flex gap-3 leading-relaxed ${log.includes('SUCCESS') || log.includes('INGEST') ? 'text-white font-bold' : log.includes('ALERT') ? 'text-[#e63946]' : ''}`}>
                  <span className="opacity-20 font-black select-none">[{logs.length - i}]</span>
                  <span className="uppercase leading-none">{log}</span>
                </div>
              ))}
              {step === 'processing' && (
                <div className="flex gap-3 text-[#47b3a8] animate-pulse">
                  <span className="opacity-20">[~]</span>
                  <span className="uppercase font-black">Syncing via VaultMesh...</span>
                </div>
              )}
            </div>

            <div className="mt-8 pt-8 border-t border-white/10 space-y-6">
              <div className="bg-white/5 p-6 rounded-[32px] border border-white/5 flex justify-between items-center">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.5em] block mb-2">GAIA DRIFT</span>
                  <span className="text-2xl font-black tracking-tighter text-white leading-none">0.08s <span className="text-[10px] text-[#47b3a8] ml-2">SYNCHRONOUS</span></span>
                </div>
                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_20px_#10b981] animate-pulse" />
              </div>

              <div className="bg-[#47b3a8] p-8 rounded-[32px] text-slate-900 flex flex-col items-center text-center border-b-4 border-teal-900">
                <h4 className="font-black uppercase tracking-tighter italic text-3xl leading-none">Crate to Crown</h4>
                <p className="text-xs font-black uppercase tracking-widest opacity-60 mt-3">Industrial hardware mineralization active.</p>
              </div>
            </div>
          </div>
        </aside>
      </main>

      <footer className="w-full bg-white border-t border-slate-200 py-10 px-8 md:px-16 flex flex-col md:flex-row justify-between items-center gap-6 text-xs md:text-sm font-black text-slate-400 uppercase tracking-[0.8em] mt-auto">
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_20px_#10b981]" />
            <span className="text-slate-900">Silverton Hub 042</span>
          </div>
          <span className="opacity-20 text-slate-900">|</span>
          <span className="hover:text-[#47b3a8] transition-colors cursor-pointer">302 Dykor St, Pretoria</span>
        </div>
        <div className="flex items-center gap-6 flex-wrap">
          <span className="text-[#47b3a8]">HS-OMNI-9000</span>
          <span className="opacity-20 text-slate-900">|</span>
          <span className="italic tracking-tighter hover:text-slate-900 transition-all">The Lion Sees You Have Returned</span>
        </div>
      </footer>
    </div>
  );
}
import React, { useState } from 'react';

// ─── Brand tokens ───────────────────────────────────────────
const BB = {
  navy:   '#0e2148',
  yellow: '#f5c518',
  cream:  '#f5f0e6',
  sand:   '#e8e0cc',
  white:  '#ffffff',
  navyLight: '#1a3366',
  navyDark:  '#091530',
};

// ─── Block Box Logo SVG ─────────────────────────────────────
function BBLogo({ size = 40, dark = false }) {
  const bg = dark ? BB.navy : BB.yellow;
  const wave = dark ? BB.yellow : BB.navy;
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="9" fill={bg} />
      <path
        d="M8 20 Q13 13 19 20 T29 20"
        stroke={wave}
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

// ─── Navigation ─────────────────────────────────────────────
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav style={{ background: BB.navy }} className="sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BBLogo size={38} />
          <span className="font-black text-xl tracking-tight" style={{ color: BB.white }}>Block Box</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {['Product', 'Technology', 'Retailers', 'About'].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`}
              className="text-sm font-semibold transition-colors hover:opacity-70"
              style={{ color: 'rgba(255,255,255,0.75)' }}>
              {l}
            </a>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-3">
          <a href="#retailers"
            className="text-sm font-black px-5 py-2.5 rounded-lg transition-all hover:opacity-90"
            style={{ background: BB.yellow, color: BB.navy }}>
            Find a Retailer
          </a>
        </div>
        {/* Mobile hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2" style={{ color: BB.white }}>
          <div className="w-5 h-0.5 mb-1.5" style={{ background: BB.white }} />
          <div className="w-5 h-0.5 mb-1.5" style={{ background: BB.white }} />
          <div className="w-5 h-0.5" style={{ background: BB.white }} />
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden px-6 pb-5 pt-2 border-t border-white/10 flex flex-col gap-3">
          {['Product', 'Technology', 'Retailers', 'About'].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMenuOpen(false)}
              className="text-sm font-semibold py-1" style={{ color: 'rgba(255,255,255,0.8)' }}>{l}</a>
          ))}
          <a href="#retailers"
            className="text-sm font-black px-5 py-2.5 rounded-lg text-center mt-1"
            style={{ background: BB.yellow, color: BB.navy }}>
            Find a Retailer
          </a>
        </div>
      )}
    </nav>
  );
}

// ─── Hero ────────────────────────────────────────────────────
function Hero() {
  return (
    <section id="product" style={{ background: BB.navy }} className="relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: `repeating-linear-gradient(0deg, ${BB.yellow} 0px, ${BB.yellow} 1px, transparent 1px, transparent 60px), repeating-linear-gradient(90deg, ${BB.yellow} 0px, ${BB.yellow} 1px, transparent 1px, transparent 60px)` }} />

      <div className="max-w-6xl mx-auto px-6 pt-20 pb-16 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            {/* Category pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8"
              style={{ background: 'rgba(245,197,24,0.12)', border: '1px solid rgba(245,197,24,0.3)' }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: BB.yellow }} />
              <span className="text-xs font-black tracking-widest uppercase" style={{ color: BB.yellow }}>
                NT108 · 110mm Profile
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight mb-6" style={{ color: BB.white }}>
              One block.<br />
              <span style={{ color: BB.yellow }}>Every</span><br />
              profile.
            </h1>
            <p className="text-lg font-medium leading-relaxed mb-8 max-w-md" style={{ color: 'rgba(255,255,255,0.55)' }}>
              South Africa's first universal foam sealant block — one recyclable micro-expanded EPS product that fits every gap, every profile, every time. No waste.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mb-12">
              <a href="#technology"
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-black text-sm transition-all hover:opacity-90"
                style={{ background: BB.yellow, color: BB.navy }}>
                See How It Works
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke={BB.navy} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </a>
              <a href="#retailers"
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-black text-sm border transition-all"
                style={{ borderColor: 'rgba(255,255,255,0.2)', color: BB.white }}>
                Find a Stockist
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              {[
                { val: '50%', label: 'Less packaging cost' },
                { val: '1', label: 'SKU for all profiles' },
                { val: '100%', label: 'Recyclable EPS' },
              ].map(s => (
                <div key={s.label}>
                  <div className="text-3xl font-black" style={{ color: BB.yellow }}>{s.val}</div>
                  <div className="text-xs font-semibold mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Product visual */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              {/* Glow */}
              <div className="absolute inset-0 rounded-3xl blur-3xl opacity-20 scale-90"
                style={{ background: BB.yellow }} />
              {/* Package card */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl"
                style={{ background: BB.yellow, width: 340, minHeight: 420 }}>
                {/* Header bar */}
                <div className="flex items-center justify-between px-6 pt-6 pb-4">
                  <BBLogo size={36} />
                  <span className="font-black text-lg tracking-tight" style={{ color: BB.navy }}>Block Box</span>
                </div>
                {/* Product name */}
                <div className="px-6 pb-4">
                  <p className="text-xs font-black tracking-widest uppercase mb-1" style={{ color: BB.navy }}>
                    NT108 · 110mm PROFILE
                  </p>
                  <p className="text-2xl font-black leading-tight" style={{ color: BB.navy }}>
                    One block.<br />Every profile.<br />No waste.
                  </p>
                </div>
                {/* Product illustration */}
                <div className="mx-6 mb-6 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(14,33,72,0.08)', height: 160 }}>
                  <BlockIllustration />
                </div>
                {/* Bottom CTA strip */}
                <div className="px-6 pb-6">
                  <div className="rounded-xl py-3 px-4 font-black text-sm text-center" style={{ background: BB.navy, color: BB.yellow }}>
                    VOLLE KOOKPLAAT
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Block product illustration ─────────────────────────────
function BlockIllustration() {
  return (
    <svg width="180" height="100" viewBox="0 0 180 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Block body */}
      <rect x="20" y="30" width="140" height="50" rx="8" fill="#0e2148" opacity="0.15"/>
      <rect x="20" y="25" width="140" height="50" rx="8" fill="#0e2148" opacity="0.9"/>
      {/* Profile cuts/notches */}
      <rect x="35" y="25" width="16" height="20" rx="3" fill="#f5c518"/>
      <rect x="62" y="25" width="12" height="25" rx="3" fill="#f5c518" opacity="0.7"/>
      <rect x="88" y="25" width="20" height="15" rx="3" fill="#f5c518" opacity="0.85"/>
      <rect x="122" y="25" width="18" height="22" rx="3" fill="#f5c518"/>
      {/* Tilde wave brand mark */}
      <path d="M70 60 Q80 53 90 60 T110 60" stroke="#f5c518" strokeWidth="3" strokeLinecap="round" fill="none"/>
      {/* Side shading */}
      <rect x="20" y="75" width="140" height="8" rx="4" fill="#0e2148" opacity="0.3"/>
    </svg>
  );
}

// ─── Technology section ──────────────────────────────────────
function Technology() {
  const steps = [
    { num: '01', title: 'Universal Fit', body: 'The NT108 EPS block is precision micro-expanded to compress into any gap width — 40mm, 75mm, 110mm and beyond — without a separate SKU per profile.' },
    { num: '02', title: 'Tear & Fit', body: 'Installers simply tear the block by hand to the exact profile needed. No cutting tools, no off-cuts, no wastage on site.' },
    { num: '03', title: 'Recyclable EPS', body: '100% micro-expanded polystyrene. Fully recyclable at end of life. No foam aerosols, no toxic off-gassing, zero single-use waste on site.' },
    { num: '04', title: 'One SKU', body: 'Retailers stock one product code — NT108. No fragmented range, no overstocked variants collecting dust. 50% less packaging cost.' },
  ];
  return (
    <section id="technology" style={{ background: BB.cream }} className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-14">
          <span className="text-xs font-black tracking-widest uppercase mb-3 block" style={{ color: BB.yellow }}>— Technology</span>
          <h2 className="text-4xl sm:text-5xl font-black leading-tight" style={{ color: BB.navy }}>
            Engineered for the<br />installer, not the factory.
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {steps.map((s) => (
            <div key={s.num} className="rounded-2xl p-8 border transition-all hover:shadow-lg"
              style={{ background: BB.white, borderColor: BB.sand }}>
              <div className="text-5xl font-black mb-4 leading-none" style={{ color: BB.yellow }}>{s.num}</div>
              <h3 className="text-xl font-black mb-2" style={{ color: BB.navy }}>{s.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#5a6580' }}>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Product Specs strip ─────────────────────────────────────
function Specs() {
  const specs = [
    { label: 'Product Code', val: 'NT108' },
    { label: 'Profile Width', val: '110mm' },
    { label: 'Material', val: 'Micro-EPS' },
    { label: 'Finish', val: 'Recyclable' },
    { label: 'Origin', val: 'Made in ZA' },
    { label: 'Reg.', val: '2025/000007' },
  ];
  return (
    <section style={{ background: BB.navy }}>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 divide-y sm:divide-y-0 sm:divide-x" style={{ '--tw-divide-color': 'rgba(255,255,255,0.08)' }}>
          {specs.map((s) => (
            <div key={s.label} className="py-4 sm:py-0 sm:px-4 first:pl-0 last:pr-0">
              <p className="text-[10px] font-black tracking-widest uppercase mb-1" style={{ color: 'rgba(255,255,255,0.3)' }}>{s.label}</p>
              <p className="text-base font-black" style={{ color: BB.yellow }}>{s.val}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Retail / POS section ────────────────────────────────────
function Retail() {
  const cards = [
    { icon: '🏪', title: 'Shelf Strip',     body: 'Edge-lit shelf strips with product code, profile spec, and barcode — designed to the millimetre for standard hardware gondola shelving.' },
    { icon: '📦', title: 'Unit Carton',     body: 'Small and medium unit cartons with full-bleed yellow front panel, product name, tear-action photo, and recycling info on the back panel.' },
    { icon: '🚚', title: 'In-Store Display', body: 'End-cap header, wobbler and aisle header templates — all co-brandable with retailer identity for exclusive stocking deals.' },
    { icon: '🤝', title: 'Co-Brand Ready',  body: 'Retailer co-brand pack front and POS set — your logo, Block Box lock-up, professional print-ready artwork at no cost.' },
  ];
  return (
    <section id="retailers" style={{ background: BB.cream }} className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <span className="text-xs font-black tracking-widest uppercase mb-3 block" style={{ color: BB.yellow }}>— Retail Programme</span>
            <h2 className="text-4xl sm:text-5xl font-black leading-tight mb-6" style={{ color: BB.navy }}>
              Built for the<br />hardware aisle.
            </h2>
            <p className="text-base leading-relaxed mb-8" style={{ color: '#5a6580' }}>
              Block Box ships with a complete retail-ready POS suite — from shelf strips and wobblers to full co-brand pack fronts. Stock one SKU, profit from every profile.
            </p>
            <a href="mailto:hello@blockbox.co"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-black text-sm transition-all hover:opacity-90"
              style={{ background: BB.navy, color: BB.yellow }}>
              Become a Stockist
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke={BB.yellow} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cards.map((c) => (
              <div key={c.title} className="rounded-2xl p-6 border"
                style={{ background: BB.white, borderColor: BB.sand }}>
                <div className="text-3xl mb-3">{c.icon}</div>
                <h3 className="font-black text-base mb-1.5" style={{ color: BB.navy }}>{c.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: '#7a8599' }}>{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Digital / App icon showcase ─────────────────────────────
function Digital() {
  return (
    <section id="about" style={{ background: BB.navy }} className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Icon showcase */}
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            {[48, 64, 80, 96, 120].map(sz => (
              <div key={sz} className="flex flex-col items-center gap-2">
                <BBLogo size={sz} />
                <span className="text-[10px] font-mono" style={{ color: 'rgba(255,255,255,0.25)' }}>{sz}px</span>
              </div>
            ))}
            {/* Inverse variants */}
            {[48, 64, 80].map(sz => (
              <div key={`d-${sz}`} className="flex flex-col items-center gap-2">
                <BBLogo size={sz} dark />
                <span className="text-[10px] font-mono" style={{ color: 'rgba(255,255,255,0.25)' }}>{sz}px ↓</span>
              </div>
            ))}
          </div>

          <div>
            <span className="text-xs font-black tracking-widest uppercase mb-3 block" style={{ color: BB.yellow }}>— Identity System</span>
            <h2 className="text-4xl sm:text-5xl font-black leading-tight mb-6" style={{ color: BB.white }}>
              The tilde.<br />
              <span style={{ color: BB.yellow }}>A wave between<br />two worlds.</span>
            </h2>
            <p className="text-base leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
              The Block Box logomark — a single tilde wave — represents the flexible interface between profile and product: always adapting, always fitting, never wasting.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: 'Navy', hex: '#0E2148', bg: BB.navy, text: BB.yellow, border: true },
                { name: 'Yellow', hex: '#F5C518', bg: BB.yellow, text: BB.navy, border: false },
                { name: 'Cream', hex: '#F5F0E6', bg: BB.cream, text: BB.navy, border: false },
                { name: 'White', hex: '#FFFFFF', bg: BB.white, text: BB.navy, border: false },
              ].map(c => (
                <div key={c.name} className="rounded-xl overflow-hidden border"
                  style={{ borderColor: c.border ? 'rgba(255,255,255,0.15)' : 'transparent' }}>
                  <div className="h-12" style={{ background: c.bg }} />
                  <div className="px-3 py-2" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <p className="text-xs font-black" style={{ color: BB.white }}>{c.name}</p>
                    <p className="text-[10px] font-mono" style={{ color: 'rgba(255,255,255,0.3)' }}>{c.hex}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Testimonial / Tagline banner ────────────────────────────
function TaglineBanner() {
  return (
    <section style={{ background: BB.yellow }} className="py-20">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <BBLogo size={56} dark />
        <h2 className="text-5xl sm:text-6xl font-black mt-8 mb-4 leading-tight" style={{ color: BB.navy }}>
          Tear. Fit. Done.
        </h2>
        <p className="text-lg font-semibold" style={{ color: 'rgba(14,33,72,0.6)' }}>
          NT108 · 110mm profile · Made in South Africa
        </p>
      </div>
    </section>
  );
}

// ─── Contact / Footer ────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: BB.navyDark }} className="py-14">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <BBLogo size={34} />
              <span className="font-black text-lg" style={{ color: BB.white }}>Block Box</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>
              One block. Every profile. No waste.<br />
              Manufactured for Block Box (Pty) Ltd<br />
              Reg. 2025/000000/07 · Made in ZA
            </p>
          </div>
          <div>
            <p className="text-xs font-black tracking-widest uppercase mb-4" style={{ color: 'rgba(255,255,255,0.25)' }}>Contact</p>
            <div className="space-y-2 text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
              <p>Thandwe Nkosi</p>
              <p>Licensing Manager</p>
              <a href="mailto:thandwe@blockbox.co" className="hover:opacity-80 transition-opacity" style={{ color: BB.yellow }}>
                thandwe@blockbox.co
              </a>
              <p>+27 82 000 0000</p>
            </div>
          </div>
          <div>
            <p className="text-xs font-black tracking-widest uppercase mb-4" style={{ color: 'rgba(255,255,255,0.25)' }}>Product</p>
            <div className="space-y-2 text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
              <p>NT108 · 110mm Profile</p>
              <p>Micro-expanded EPS</p>
              <p>Universal fit · Tear & use</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>Patent Pending · Made under licence</p>
            </div>
          </div>
        </div>
        <div className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
            © 2025 Block Box (Pty) Ltd · All rights reserved
          </p>
          <div className="flex items-center gap-2">
            <BBLogo size={22} />
            <span className="text-xs font-black" style={{ color: BB.yellow }}>blockbox.co</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ────────────────────────────────────────────────────
export default function BlockBox() {
  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif' }}>
      <Navbar />
      <Hero />
      <Specs />
      <Technology />
      <TaglineBanner />
      <Retail />
      <Digital />
      <Footer />
    </div>
  );
}
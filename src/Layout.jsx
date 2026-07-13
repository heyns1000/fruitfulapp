import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { CartProvider } from './components/cart/CartContext';
import ShananaCheckoutPanel from './components/shanana/ShananaCheckoutPanel';
import TreatyMonitor from './components/vaultmesh/TreatyMonitor';
import { WishlistProvider } from './components/wishlist/WishlistContext';
import CartIcon from './components/cart/CartIcon';
import { Menu, X, ArrowLeft, ChevronDown } from 'lucide-react';

// ── Fruitful Pear Icon (SVG) ─────────────────────────────────────────────────
function PearIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Leaf */}
      <path d="M20 4 C20 4 24 1 28 4 C28 4 25 8 20 8 Z" fill="#0FB5A6" opacity="0.9"/>
      {/* Stem */}
      <path d="M20 4 L20 10" stroke="#0FB5A6" strokeWidth="1.5" strokeLinecap="round"/>
      {/* Pear body */}
      <ellipse cx="20" cy="24" rx="7" ry="8" fill="#18241C" opacity="0.15"/>
      <path d="M13 30 C13 37 17 42 20 42 C23 42 27 37 27 30 C27 24 24 20 20 20 C16 20 13 24 13 30Z" fill="#18241C"/>
      <ellipse cx="20" cy="18" rx="5" ry="6" fill="#18241C"/>
      {/* Highlight */}
      <ellipse cx="17" cy="26" rx="2" ry="3" fill="white" opacity="0.12"/>
    </svg>
  );
}

// ── FPSL License Footer ───────────────────────────────────────────────────────
function LicenseFooter() {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="border-t" style={{ background: '#18241C', borderColor: '#1e3028' }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-center gap-2 py-2 text-xs transition-colors"
        style={{ color: open ? '#0FB5A6' : '#4a6b5a' }}
      >
        {open ? <ChevronDown className="w-3 h-3" /> : <ChevronDown className="w-3 h-3 rotate-180" />}
        <span>FPSL v1.0 — Fruitful Proprietary Source License</span>
        <span style={{ color: '#2a4a36' }}>|</span>
        <span className="font-mono text-[10px]" style={{ color: '#2a4a36' }}>GC7:FSP2021121654:FAA13713</span>
      </button>
      {open && (
        <div className="max-w-4xl mx-auto px-6 pb-5 text-[10px] leading-relaxed font-mono whitespace-pre-wrap" style={{ color: '#3a6050' }}>
{`FRUITFUL PROPRIETARY SOURCE LICENSE (FPSL) v1.0 — Copyright (c) 2024–2026 Fruitful Holdings (Pty) Ltd & Heyns Schoeman. All rights reserved.

NOTICE: BY CLONING, FORKING, DOWNLOADING, READING, EXECUTING, DEPLOYING, OR OTHERWISE INTERACTING WITH ANY PART OF THIS REPOSITORY YOU ACCEPT THE FULL TERMS OF THIS LICENSE WITH IMMEDIATE EFFECT.

1. GRANT OF RIGHTS — No rights granted by default. Authorised use: a) Internal evaluation; b) Contribution back under Fruitful Holdings review; c) Deployment within the Fruitful Ecosystem (*.faa.zone) by authorised operators only.
2. RESTRICTIONS — You may NOT: a) Redistribute, sublicense, sell or transfer the Work; b) Use in competing products; c) Remove this license or fruitful-banner.png attribution; d) Deploy outside the Fruitful Ecosystem without licence.
4. NO WARRANTY — THE WORK IS PROVIDED "AS IS". 5. LIMITATION OF LIABILITY — FRUITFUL HOLDINGS NOT LIABLE FOR ANY DAMAGES.
6. GOVERNING LAW — Republic of South Africa. Disputes: Gauteng courts. Contact: vault@faa.zone | https://faa.zone
GC7:FSP2021121654:4400302974:VM9s:BL1501:GHOST7CHAIN:FAA13713`}
        </div>
      )}
    </div>
  );
}

// ── Nav link groups ───────────────────────────────────────────────────────────
const NAV_GROUPS = [
  {
    label: 'Commerce',
    links: [
      { label: 'Marketplace', page: 'Marketplace' },
      { label: 'Artisan Shop', page: 'ArtisanShop' },
      { label: 'Sub Boxes', page: 'SubscriptionBoxes' },
      { label: 'Sub Shop', page: 'SubscriptionShop' },
      { label: 'Loyalty', page: 'LoyaltyProgram' },
      { label: 'Wishlist', page: 'Wishlist' },
      { label: 'Orders', page: 'OrderHistory' },
      { label: 'Order Dashboard', page: 'OrderDashboard' },
      { label: 'Fulfilment', page: 'OrderFulfillment' },
      { label: 'Payments', page: 'Payments' },
      { label: 'My Plans', page: 'MySubscriptions' },
    ]
  },
  {
    label: 'Brands',
    links: [
      { label: 'Brand Explorer', page: 'BrandNodeExplorer' },
      { label: 'Brand Insights', page: 'BrandInsights' },
      { label: 'Onboard Brand', page: 'BrandOnboarding' },
      { label: 'Gallery', page: 'Gallery' },
      { label: 'Asset Library', page: 'AssetLibrary' },
      { label: 'Grand Mashadlela', page: 'GrandMashadlelaCollection' },
      { label: 'Collaboration', page: 'CollaborationSuite' },
      { label: 'Block Box', page: 'BlockBox' },
    ]
  },
  {
    label: 'Intelligence',
    links: [
      { label: 'Analytics', page: 'Analytics' },
      { label: 'Sector Analytics', page: 'SectorAnalytics' },
      { label: 'Market Intel', page: 'MarketIntelligence' },
      { label: 'Discovery', page: 'DiscoveryEngine' },
      { label: 'Ecosystem', page: 'EcosystemExplorer' },
      { label: 'Global Map', page: 'GlobalBrandMap' },
      { label: 'PulseTrade', page: 'PulseTradeAnalytics' },
      { label: 'Mkt Blueprint', page: 'MarketplaceBlueprint' },
    ]
  },
  {
    label: 'Platform',
    links: [
      { label: 'Artisan Dashboard', page: 'ArtisanDashboard' },
      { label: 'Financials', page: 'ArtisanFinancials' },
      { label: 'Messages', page: 'Messages' },
      { label: 'Automation', page: 'AutomationEngine' },
      { label: 'AI Content', page: 'ContentGenerator' },
      { label: 'Video Studio', page: 'VideoScriptStudio' },
      { label: 'Vault Mesh', page: 'VaultMesh' },
      { label: 'App Builder', page: 'AppBuilder' },
    ]
  },
  {
    label: 'Admin',
    links: [
      { label: 'Sector Hub', page: 'SectorAdminHub' },
      { label: 'Seedwave Admin', page: 'AdminSeedwave' },
      { label: 'Data Sync', page: 'DataSyncCenter' },
      { label: 'CSV Import', page: 'CSVImport' },
      { label: 'Banimal', page: 'Banimal' },
      { label: 'Banimal Store', page: 'BanimalStore' },
      { label: 'Banimal Dashboard', page: 'BanimalDashboard' },
      { label: 'Banimal Admin', page: 'BanimalAdmin' },
      { label: 'Banimal Checkout', page: 'BanimalLoopCheckout', direct: true },
      { label: 'Shanana™', page: 'ShananaCheckout' },
      { label: 'Care Grains Map', page: 'CareGrainsMap' },
      { label: 'Legal Docs', page: 'LegalDocuments' },
    ]
  }
];

// Flat list for mobile
const ALL_NAV_LINKS = NAV_GROUPS.flatMap(g => g.links);

export default function Layout({ children, currentPageName }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState(null);
  const navigate = useNavigate();

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(createPageUrl('Dashboard'));
    }
  };

  const isDashboard = currentPageName === 'Dashboard';

  return (
    <WishlistProvider>
    <CartProvider>
      <ShananaCheckoutPanel />
      <TreatyMonitor />

      <div className="min-h-screen" style={{ background: '#F6F2E9' }}>

        {/* ── Fruitful Banner Ad ── */}
        <a href="/BanimalDashboard" className="block w-full overflow-hidden" style={{ aspectRatio: '1440/120', background: '#a89080' }}>
          <img
            src="https://media.base44.com/images/public/6953a072de46207f94f2b9d2/1f1c5f1b0_banner_copy.png"
            alt="Fruitful™ — BUY ARTISAN. CREATE APPS. EAT PANCAKES."
            className="w-full h-full object-cover object-center"
          />
        </a>

        {/* ── Navigation Bar ── */}
        <nav
          className="sticky top-0 z-40 border-b backdrop-blur-md"
          style={{ background: 'rgba(246, 242, 233, 0.92)', borderColor: '#d8d0c0' }}
        >
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-14">

              {/* Logo */}
              <Link to={createPageUrl('Dashboard')} className="flex items-center gap-2.5 shrink-0 group">
                <PearIcon size={28} />
                <div className="flex flex-col leading-none">
                  <span className="font-heading font-bold text-sm tracking-tight" style={{ color: '#18241C' }}>Fruitful</span>
                  <span className="text-[9px] font-mono tracking-widest uppercase" style={{ color: '#0FB5A6' }}>FAA.ZONE™</span>
                </div>
              </Link>

              {/* Desktop Nav Groups */}
              <div className="hidden lg:flex items-center gap-0.5">
                {NAV_GROUPS.map((group) => (
                  <div key={group.label} className="relative group">
                    <button
                      className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                      style={{ color: '#18241C' }}
                      onMouseEnter={() => setActiveGroup(group.label)}
                      onMouseLeave={() => setActiveGroup(null)}
                    >
                      {group.label}
                      <ChevronDown className="w-3 h-3 opacity-50" />
                    </button>
                    {/* Dropdown */}
                    <div
                      className="absolute top-full left-0 mt-1 w-48 rounded-xl border shadow-xl py-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50"
                      style={{ background: '#F6F2E9', borderColor: '#d0c8b8', boxShadow: '0 8px 32px rgba(24,36,28,0.12)' }}
                    >
                      {group.links.map(({ label, page, direct }) => (
                        <Link
                          key={page}
                          to={direct ? `/${page}` : createPageUrl(page)}
                          className="block px-4 py-1.5 text-sm transition-colors rounded-md mx-1"
                          style={{
                            color: currentPageName === page ? '#0FB5A6' : '#18241C',
                            fontWeight: currentPageName === page ? 600 : 400,
                            background: currentPageName === page ? 'rgba(15, 181, 166, 0.08)' : 'transparent',
                          }}
                        >
                          {label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Right side */}
              <div className="flex items-center gap-2">
                <CartIcon />
                {/* Mobile hamburger */}
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="lg:hidden p-2 rounded-md transition-colors"
                  style={{ color: '#18241C' }}
                >
                  {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
              <div
                className="lg:hidden border-t pb-4 pt-3"
                style={{ borderColor: '#d8d0c0' }}
              >
                <div className="grid grid-cols-2 gap-1">
                  {ALL_NAV_LINKS.map(({ label, page, direct }) => (
                    <Link
                      key={page}
                      to={direct ? `/${page}` : createPageUrl(page)}
                      onClick={() => setMenuOpen(false)}
                      className="px-3 py-2 rounded-md text-sm font-medium transition-colors"
                      style={{
                        color: currentPageName === page ? '#0FB5A6' : '#18241C',
                        background: currentPageName === page ? 'rgba(15, 181, 166, 0.1)' : 'transparent',
                      }}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* ── Main Content ── */}
        <main className="min-h-screen">
          {children}
        </main>

        {/* ── Floating Back Button ── */}
        {!isDashboard && (
          <button
            onClick={goBack}
            className="fixed bottom-6 right-6 z-[9999] flex items-center gap-2 px-4 py-2.5 rounded-full text-white text-sm font-semibold shadow-lg transition-all hover:scale-105 active:scale-95"
            style={{ background: '#18241C', boxShadow: '0 4px 20px rgba(24,36,28,0.25)' }}
            title="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>
        )}

        {/* ── FPSL License Footer ── */}
        <LicenseFooter />

        {/* ── Global Footer ── */}
        <footer className="py-10 px-6 border-t" style={{ background: '#18241C', borderColor: '#1e3028' }}>
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div className="flex items-center gap-2.5">
                <PearIcon size={24} />
                <span className="font-heading font-bold text-sm" style={{ color: '#F6F2E9' }}>Fruitful Holdings</span>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs" style={{ color: '#4a6b5a' }}>
                {[
                  ['Privacy', 'privacy.html'],
                  ['Terms', 'terms.html'],
                  ['Contact', 'contact.html'],
                  ['Copyright', 'copyright.html'],
                  ['Developers', 'developers.html'],
                  ['VaultMesh', 'vaultmesh.html'],
                  ['FAA.Zone', 'faa.zone.html'],
                  ['About', 'about.html'],
                ].map(([label, file]) => (
                  <a key={label} href={`https://footer.global.repo.seedwave.faa.zone/${file}`}
                    className="transition-colors hover:text-[#0FB5A6]">
                    {label}
                  </a>
                ))}
              </div>
            </div>
            <div className="border-t pt-5 flex flex-wrap items-center justify-between gap-2" style={{ borderColor: '#1e3028' }}>
              <span className="text-xs" style={{ color: '#3a5a48' }}>© 2025 FAA™ Treaty System™. All Rights Reserved.</span>
              <span className="text-xs font-mono" style={{ color: '#2a4a36' }}>Powered by 🦍 glyphs + Vault API. Synced with Seedwave™.</span>
            </div>
          </div>
        </footer>
      </div>
    </CartProvider>
    </WishlistProvider>
  );
}
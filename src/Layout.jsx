import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { CartProvider } from './components/cart/CartContext';
import ShananaCheckoutPanel from './components/shanana/ShananaCheckoutPanel';
import TreatyMonitor from './components/vaultmesh/TreatyMonitor';
import { WishlistProvider } from './components/wishlist/WishlistContext';
import CartIcon from './components/cart/CartIcon';
import { ArrowLeft, ChevronDown, Menu, X } from 'lucide-react';

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
        <ChevronDown className="w-3 h-3" style={{ transform: open ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.2s' }} />
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

const ALL_NAV_LINKS = [
  { label: 'Dashboard',         page: 'Dashboard' },
  { label: 'Marketplace',       page: 'Marketplace' },
  { label: 'Artisan Shop',      page: 'ArtisanShop' },
  { label: 'Sub Shop',          page: 'SubscriptionShop' },
  { label: 'Sub Boxes',         page: 'SubscriptionBoxes' },
  { label: 'Loyalty',           page: 'LoyaltyProgram' },
  { label: 'Wishlist',          page: 'Wishlist' },
  { label: 'Orders',            page: 'OrderHistory' },
  { label: 'Order Dashboard',   page: 'OrderDashboard' },
  { label: 'Fulfilment',        page: 'OrderFulfillment' },
  { label: 'Payments',          page: 'Payments' },
  { label: 'My Plans',          page: 'MySubscriptions' },
  { label: 'Brand Explorer',    page: 'BrandNodeExplorer' },
  { label: 'Brand Insights',    page: 'BrandInsights' },
  { label: 'Onboard Brand',     page: 'BrandOnboarding' },
  { label: 'Gallery',           page: 'Gallery' },
  { label: 'Asset Library',     page: 'AssetLibrary' },
  { label: 'Grand Mashadlela',  page: 'GrandMashadlelaCollection' },
  { label: 'Collaboration',     page: 'CollaborationSuite' },
  { label: 'Block Box',         page: 'BlockBox' },
  { label: 'Analytics',         page: 'Analytics' },
  { label: 'Sector Analytics',  page: 'SectorAnalytics' },
  { label: 'Market Intel',      page: 'MarketIntelligence' },
  { label: 'Discovery',         page: 'DiscoveryEngine' },
  { label: 'Ecosystem',         page: 'EcosystemExplorer' },
  { label: 'Global Map',        page: 'GlobalBrandMap' },
  { label: 'PulseTrade',        page: 'PulseTradeAnalytics' },
  { label: 'Mkt Blueprint',     page: 'MarketplaceBlueprint' },
  { label: 'Artisan Dashboard', page: 'ArtisanDashboard' },
  { label: 'Financials',        page: 'ArtisanFinancials' },
  { label: 'Messages',          page: 'Messages' },
  { label: 'Automation',        page: 'AutomationEngine' },
  { label: 'AI Content',        page: 'ContentGenerator' },
  { label: 'Video Studio',      page: 'VideoScriptStudio' },
  { label: 'Vault Mesh',        page: 'VaultMesh' },
  { label: 'App Builder',       page: 'AppBuilder' },
  { label: 'Sector Hub',        page: 'SectorAdminHub' },
  { label: 'Seedwave Admin',    page: 'AdminSeedwave' },
  { label: 'Data Sync',         page: 'DataSyncCenter' },
  { label: 'CSV Import',        page: 'CSVImport' },
  { label: 'Banimal',           page: 'Banimal' },
  { label: 'Banimal Store',     page: 'BanimalStore' },
  { label: 'Banimal Dashboard', page: 'BanimalDashboard' },
  { label: 'Banimal Admin',     page: 'BanimalAdmin' },
  { label: 'Shanana™',          page: 'ShananaCheckout' },
  { label: 'Care Grains Map',   page: 'CareGrainsMap' },
  { label: 'Legal Docs',        page: 'LegalDocuments' },
];

export default function Layout({ children, currentPageName }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const goBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate(createPageUrl('Dashboard'));
  };

  const isDashboard = currentPageName === 'Dashboard';

  return (
    <WishlistProvider>
    <CartProvider>
      <ShananaCheckoutPanel />
      <TreatyMonitor />

      <div className="min-h-screen" style={{ background: '#F6F2E9' }}>

        {/* ── Fruitful Banner — fixed height, covers centre, never distorts ── */}
        <a href="/BanimalDashboard" className="block w-full overflow-hidden" style={{ lineHeight: 0, height: '90px' }}>
          <img
            src="https://media.base44.com/images/public/6953a072de46207f94f2b9d2/1f1c5f1b0_banner_copy.png"
            alt="Fruitful™ — BUY ARTISAN. CREATE APPS. EAT PANCAKES."
            style={{ width: '100%', height: '90px', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
          />
        </a>

        {/* ── Navigation Bar ── */}
        <nav
          className="sticky top-0 z-40 border-b backdrop-blur-md"
          style={{ background: 'rgba(246, 242, 233, 0.94)', borderColor: '#d8d0c0' }}
        >
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-14">

              {/* Logo — Fruitful teal logo */}
              <Link to={createPageUrl('Dashboard')} className="flex items-center gap-2 shrink-0">
                <img
                  src="https://media.base44.com/images/public/6953a072de46207f94f2b9d2/51d2d1a75_Fruitful_logo_200px-02.png"
                  alt="Fruitful"
                  className="h-9 w-auto object-contain"
                />
              </Link>

              {/* Desktop: scrollable flat nav */}
              <div className="hidden lg:flex items-center gap-0.5 overflow-x-auto flex-1 mx-6">
                {ALL_NAV_LINKS.map(({ label, page }) => (
                  <Link
                    key={page}
                    to={createPageUrl(page)}
                    className="px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors shrink-0"
                    style={{
                      color: currentPageName === page ? '#0FB5A6' : '#18241C',
                      background: currentPageName === page ? 'rgba(15,181,166,0.1)' : 'transparent',
                      fontWeight: currentPageName === page ? 600 : 400,
                    }}
                  >
                    {label}
                  </Link>
                ))}
              </div>

              {/* Right side */}
              <div className="flex items-center gap-2 shrink-0">
                <CartIcon />
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="lg:hidden p-2 rounded-md"
                  style={{ color: '#18241C' }}
                >
                  {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
              <div className="lg:hidden border-t pb-4 pt-3" style={{ borderColor: '#d8d0c0' }}>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                  {ALL_NAV_LINKS.map(({ label, page }) => (
                    <Link
                      key={page}
                      to={createPageUrl(page)}
                      onClick={() => setMenuOpen(false)}
                      className="px-3 py-2 rounded-md text-sm font-medium transition-colors"
                      style={{
                        color: currentPageName === page ? '#0FB5A6' : '#18241C',
                        background: currentPageName === page ? 'rgba(15,181,166,0.1)' : 'transparent',
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
              <img
                src="https://media.base44.com/images/public/6953a072de46207f94f2b9d2/f9f43a7d3_Fruitful_logo_200px-01.png"
                alt="Fruitful"
                className="h-9 w-auto object-contain"
              />
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs" style={{ color: '#4a6b5a' }}>
                {['Privacy','Terms','Contact','Copyright','Developers','VaultMesh','FAA.Zone','About'].map(label => (
                  <a key={label} href="#" className="transition-colors hover:text-[#0FB5A6]">{label}</a>
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
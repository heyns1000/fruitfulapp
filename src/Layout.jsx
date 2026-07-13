import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { CartProvider } from './components/cart/CartContext';
import ShananaCheckoutPanel from './components/shanana/ShananaCheckoutPanel';
import TreatyMonitor from './components/vaultmesh/TreatyMonitor';
import { WishlistProvider } from './components/wishlist/WishlistContext';
import CartIcon from './components/cart/CartIcon';
import { Menu, X, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';

function LicenseFooter() {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="bg-slate-950 border-t border-slate-800 text-slate-500">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-center gap-2 py-2 text-xs hover:text-slate-300 transition-colors"
      >
        {open ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
        <span>FPSL v1.0 — Fruitful Proprietary Source License</span>
        <span className="text-slate-700">|</span>
        <span className="font-mono text-slate-700 text-[10px]">GC7:FSP2021121654:FAA13713</span>
        {open ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
      </button>
      {open && (
        <div className="max-w-4xl mx-auto px-6 pb-5 text-[10px] leading-relaxed font-mono text-slate-600 whitespace-pre-wrap">
{`FRUITFUL PROPRIETARY SOURCE LICENSE (FPSL) v1.0 — Copyright (c) 2024–2026 Fruitful Holdings (Pty) Ltd & Heyns Schoeman. All rights reserved.

NOTICE: BY CLONING, FORKING, DOWNLOADING, READING, EXECUTING, DEPLOYING, OR OTHERWISE INTERACTING WITH ANY PART OF THIS REPOSITORY — INCLUDING BUT NOT LIMITED TO TEMPLATES, CONFIGS, WORKERS, WORKFLOWS, SCRIPTS, OR DOCS — YOU ACCEPT THE FULL TERMS OF THIS LICENSE WITH IMMEDIATE EFFECT. NO FURTHER AGREEMENT IS REQUIRED. IGNORANCE OF THESE TERMS IS NOT A DEFENCE.

1. GRANT OF RIGHTS — No rights are granted by default. Use requires prior written authorisation from Fruitful Holdings (Pty) Ltd. Authorised use: a) Internal evaluation by the named licensee; b) Contribution back under Fruitful Holdings review; c) Deployment within the Fruitful Ecosystem (*.faa.zone, *.seedwave.faa.zone) by authorised operators only.

2. RESTRICTIONS — You may NOT without explicit written permission: a) Redistribute, sublicense, sell, rent, or transfer the Work; b) Use in a competing product or service; c) Remove or alter this license, any copyright notice, or the fruitful-banner.png attribution; d) Deploy worker/DNS/routing configs outside the Fruitful Ecosystem; e) Use seedwave domain structure or loadBrandConfig pattern commercially without a separate commercial licence.

3. BANNER & ATTRIBUTION REQUIREMENT — All repositories and deployments must include the fruitful-banner.png asset. Removal constitutes a material breach.

4. NO WARRANTY — THE WORK IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED.

5. LIMITATION OF LIABILITY — FRUITFUL HOLDINGS SHALL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES. THIS TAKES EFFECT FROM THE MOMENT YOU FIRST INTERACT WITH THE WORK.

6. GOVERNING LAW — Republic of South Africa. Disputes: courts of Gauteng, South Africa. Contact: vault@faa.zone | https://faa.zone

Applies to: github.com/Fruitful-Global-Planet/* | github.com/heyns1000/* — GC7:FSP2021121654:4400302974:VM9s:BL1501:GHOST7CHAIN:FAA13713`}
        </div>
      )}
    </div>
  );
}

const NAV_LINKS = [
  { label: 'Dashboard', page: 'Dashboard' },
  { label: 'Marketplace', page: 'Marketplace' },
  { label: 'Gallery', page: 'Gallery' },
  { label: 'Collaboration', page: 'CollaborationSuite' },
  { label: 'Analytics', page: 'Analytics' },
  { label: '📈 Brand Insights', page: 'BrandInsights' },
  { label: 'Sector Analytics', page: 'SectorAnalytics' },
  { label: 'AI Content', page: 'ContentGenerator' },
  { label: 'Onboard Brand', page: 'BrandOnboarding' },
  { label: '🏆 Loyalty', page: 'LoyaltyProgram' },
  { label: '💳 My Plans', page: 'MySubscriptions' },
  { label: '🛍️ Sub Shop', page: 'SubscriptionShop' },
  { label: '🎨 My Shop', page: 'ArtisanDashboard' },
  { label: '💰 Financials', page: 'ArtisanFinancials' },
  { label: '📦 Orders', page: 'OrderHistory' },
  { label: '🚚 Order Dashboard', page: 'OrderDashboard' },
  { label: '📋 Fulfillment', page: 'OrderFulfillment' },
  { label: '💬 Messages', page: 'Messages' },
  { label: '❤️ Wishlist', page: 'Wishlist' },
  { label: '📦 Sub Boxes', page: 'SubscriptionBoxes' },
  { label: '🌐 Ecosystem', page: 'EcosystemExplorer' },
  { label: '🔍 Discovery', page: 'DiscoveryEngine' },
  { label: '📊 Intelligence', page: 'MarketIntelligence' },
  { label: '⚡ Automation', page: 'AutomationEngine' },
  { label: '🗺️ Global Map', page: 'GlobalBrandMap' },
  { label: '🎬 Video Studio', page: 'VideoScriptStudio' },
  { label: '🖼️ Asset Library', page: 'AssetLibrary' },
  { label: '💵 Payments', page: 'Payments' },
  { label: '🔐 Vault Mesh', page: 'VaultMesh' },
  { label: '🐾 Banimal', page: 'Banimal' },
  { label: '🛠️ App Builder', page: 'AppBuilder' },
  { label: '🐘 Shanana™', page: 'ShananaCheckout' },
  { label: '🖤 Care Grains Map', page: 'CareGrainsMap' },
  { label: '⚡ PulseTrade', page: 'PulseTradeAnalytics' },
  { label: '🌐 Brand Explorer', page: 'BrandNodeExplorer' },
  { label: '🎨 Grand Mashadlela', page: 'GrandMashadlelaCollection' },
  { label: '🛡️ Seedwave Admin', page: 'AdminSeedwave' },
  { label: '⚙️ Sector Hub', page: 'SectorAdminHub' },
  { label: '🔄 Data Sync', page: 'DataSyncCenter' },
  { label: '📦 Block Box', page: 'BlockBox' },
  { label: '⚖️ Legal Docs', page: 'LegalDocuments' },
  { label: '🛒 Banimal Checkout', page: 'BanimalLoopCheckout', direct: true },
  { label: '🗺️ Mkt Blueprint', page: 'MarketplaceBlueprint' },
];

export default function Layout({ children, currentPageName }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(createPageUrl('Dashboard'));
    }
  };

  return (
    <WishlistProvider>
    <CartProvider>
      <ShananaCheckoutPanel />
      <TreatyMonitor />
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-green-50">
        {/* Global Fruitful Banner Ad */}
        <a href="/BanimalDashboard" className="block w-full overflow-hidden bg-[#a89080]" style={{ aspectRatio: '1440/120' }}>
          <img
            src="https://media.base44.com/images/public/6953a072de46207f94f2b9d2/1f1c5f1b0_banner_copy.png"
            alt="Fruitful™ — BUY ARTISAN. CREATE APPS. EAT PANCAKES."
            className="w-full h-full object-cover object-center"
          />
        </a>
        {/* Top Navigation Bar */}
        <nav className="bg-white shadow-md border-b-2 border-teal-200">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link to={createPageUrl('Dashboard')} className="flex items-center gap-2 shrink-0">
                <img
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6953a072de46207f94f2b9d2/52acd159d_Chief_02_1753263376705.png"
                  alt="FAA.ZONE"
                  className="w-10 h-10 object-contain"
                />
                <span className="text-xl font-bold text-teal-900 hidden sm:block">FAA.ZONE™</span>
              </Link>

              {/* Desktop Nav */}
              <div className="hidden lg:flex items-center gap-1 flex-wrap justify-end">
                {NAV_LINKS.map(({ label, page, direct }) => (
                  <Link key={page} to={direct ? `/${page}` : createPageUrl(page)}>
                    <button className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                      currentPageName === page
                        ? 'bg-teal-600 text-white'
                        : 'text-teal-700 hover:bg-teal-50'
                    }`}>
                      {label}
                    </button>
                  </Link>
                ))}
                <CartIcon />
              </div>

              {/* Mobile: Cart + Hamburger */}
              <div className="flex items-center gap-2 lg:hidden">
                <CartIcon />
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="p-2 rounded-lg text-teal-700 hover:bg-teal-50 transition-colors"
                >
                  {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {menuOpen && (
              <div className="lg:hidden mt-3 pb-2 border-t border-teal-100 pt-3 flex flex-col gap-1">
                {NAV_LINKS.map(({ label, page, direct }) => (
                  <Link key={page} to={direct ? `/${page}` : createPageUrl(page)} onClick={() => setMenuOpen(false)}>
                    <button className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPageName === page
                        ? 'bg-teal-600 text-white'
                        : 'text-teal-700 hover:bg-teal-50'
                    }`}>
                      {label}
                    </button>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Main Content */}
        <main className="pt-6">
          {children}
        </main>

        {/* Floating Back Button — visible on all pages */}
        {currentPageName !== 'Dashboard' && (
          <button
            onClick={goBack}
            className="fixed bottom-6 right-6 z-[9999] flex items-center gap-2 px-4 py-3 rounded-full bg-teal-600 text-white shadow-lg hover:bg-teal-700 transition-all hover:scale-105 active:scale-95 group"
            title="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-semibold hidden sm:inline group-hover:inline">Back</span>
          </button>
        )}

        {/* FPSL License Footer */}
        <LicenseFooter />

        {/* Footer — Global Footer Repository: DO NOT MODIFY */}
        <footer className="py-8 px-6 md:px-12 text-center border-t" style={{ background: '#f5f5f7', color: '#6b7280', borderColor: '#e8e8ed' }}>
          <div className="flex flex-wrap justify-center mb-4 text-sm">
            {[
              ['Privacy', 'privacy.html'],
              ['Terms', 'terms.html'],
              ['Contact', 'contact.html'],
              ['Copyright', 'copyright.html'],
              ['Developers', 'developers.html'],
              ['VaultMesh', 'vaultmesh.html'],
              ['Fruitful', 'fruitful.html'],
              ['FAA.Zone', 'faa.zone.html'],
              ['About', 'about.html'],
              ['Accessibility', 'accessibility.html'],
            ].map(([label, file]) => (
              <a key={label} href={`https://footer.global.repo.seedwave.faa.zone/${file}`}
                className="hover:text-gray-900 transition-colors mx-2 my-1 text-sm">
                {label}
              </a>
            ))}
          </div>
          <span>© 2025 FAA™ Treaty System™. All Rights Reserved.</span>{' '}
          <span>Powered by 🦍 glyphs + Vault API. Synced with Seedwave™.</span>
        </footer>
      </div>
    </CartProvider>
    </WishlistProvider>
  );
}
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { CartProvider } from './components/cart/CartContext';
import ShananaCheckoutPanel from './components/shanana/ShananaCheckoutPanel';
import TreatyMonitor from './components/vaultmesh/TreatyMonitor';
import { WishlistProvider } from './components/wishlist/WishlistContext';
import CartIcon from './components/cart/CartIcon';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Dashboard', page: 'Dashboard' },
  { label: 'Marketplace', page: 'Marketplace' },
  { label: 'Gallery', page: 'Gallery' },
  { label: 'Collaboration', page: 'CollaborationSuite' },
  { label: 'Analytics', page: 'Analytics' },
  { label: 'Sector Analytics', page: 'SectorAnalytics' },
  { label: 'AI Content', page: 'ContentGenerator' },
  { label: 'Onboard Brand', page: 'BrandOnboarding' },
  { label: '🏆 Loyalty', page: 'LoyaltyProgram' },
  { label: '💳 My Plans', page: 'MySubscriptions' },
  { label: '🎨 My Shop', page: 'ArtisanDashboard' },
  { label: '💰 Financials', page: 'ArtisanFinancials' },
  { label: '📦 Orders', page: 'OrderHistory' },
  { label: '🚚 Order Dashboard', page: 'OrderDashboard' },
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
  { label: '🛍️ Homemart Bibs', page: 'HomemartListing' },
];

export default function Layout({ children, currentPageName }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <WishlistProvider>
    <CartProvider>
      <ShananaCheckoutPanel />
      <TreatyMonitor />
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-green-50">
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
                {NAV_LINKS.map(({ label, page }) => (
                  <Link key={page} to={createPageUrl(page)}>
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
                {NAV_LINKS.map(({ label, page }) => (
                  <Link key={page} to={createPageUrl(page)} onClick={() => setMenuOpen(false)}>
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
        <main>
          {children}
        </main>

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
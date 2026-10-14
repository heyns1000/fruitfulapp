import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { href: '/Dashboard',                 label: 'Dashboard' },
  { href: '/FruitfulCoffee',            label: '☕ Fruitful Coffee' },
  { href: '/Marketplace',               label: 'Marketplace' },
  { href: '/Gallery',                   label: 'Gallery' },
  { href: '/CollaborationSuite',        label: 'Collaboration' },
  { href: '/Analytics',                 label: 'Analytics' },
  { href: '/BrandInsights',             label: '📈 Brand Insights' },
  { href: '/SectorAnalytics',           label: 'Sector Analytics' },
  { href: '/ContentGenerator',          label: 'AI Content' },
  { href: '/BrandOnboarding',           label: 'Onboard Brand' },
  { href: '/LoyaltyProgram',            label: '🏆 Loyalty' },
  { href: '/MySubscriptions',           label: '💳 My Plans' },
  { href: '/SubscriptionShop',          label: '🛍️ Sub Shop' },
  { href: '/ArtisanDashboard',          label: '🎨 My Shop' },
  { href: '/ArtisanFinancials',         label: '💰 Financials' },
  { href: '/OrderHistory',              label: '📦 Orders' },
  { href: '/OrderDashboard',            label: '🚚 Order Dashboard' },
  { href: '/OrderFulfillment',          label: '📋 Fulfillment' },
  { href: '/Messages',                  label: '💬 Messages' },
  { href: '/Wishlist',                  label: '❤️ Wishlist' },
  { href: '/SubscriptionBoxes',         label: '📦 Sub Boxes' },
  { href: '/EcosystemExplorer',         label: '🌐 Ecosystem' },
  { href: '/DiscoveryEngine',           label: '🔍 Discovery' },
  { href: '/MarketIntelligence',        label: '📊 Intelligence' },
  { href: '/AutomationEngine',          label: '⚡ Automation' },
  { href: '/GlobalBrandMap',            label: '🗺️ Global Map' },
  { href: '/VideoScriptStudio',         label: '🎬 Video Studio' },
  { href: '/AssetLibrary',              label: '🖼️ Asset Library' },
  { href: '/Payments',                  label: '💵 Payments' },
  { href: '/VaultMesh',                 label: '🔐 Vault Mesh' },
  { href: '/Banimal',                   label: '🐾 Banimal' },
  { href: '/AppBuilder',                label: '🛠️ App Builder' },
  { href: '/ShananaCheckout',           label: '🐘 Shanana™' },
  { href: '/CareGrainsMap',             label: '🖤 Care Grains Map' },
  { href: '/PulseTradeAnalytics',       label: '⚡ PulseTrade' },
  { href: '/BrandNodeExplorer',         label: '🌐 Brand Explorer' },
  { href: '/GrandMashadlelaCollection', label: '🎨 Grand Mashadlela' },
  { href: '/AdminSeedwave',             label: '🛡️ Seedwave Admin' },
  { href: '/SectorAdminHub',            label: '⚙️ Sector Hub' },
  { href: '/DataSyncCenter',            label: '🔄 Data Sync' },
  { href: '/TakealotApi',               label: '🔌 API Integrations' },
  { href: '/BlockBox',                  label: '📦 Block Box' },
  { href: '/About',                     label: 'ℹ️ About' },
  { href: '/Contact',                   label: '✉️ Contact' },
  { href: '/WaterfallMemory',           label: '💧 Waterfall Memory' },
];

export default function GlobalNavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname: currentPath } = useLocation();

  return (
    <>
      {/* Banner */}
      <a href="/BanimalDashboard" className="block w-full overflow-hidden" style={{ background: '#a89080', height: '80px' }}>
        <img
          src="https://media.base44.com/images/public/6953a072de46207f94f2b9d2/1f1c5f1b0_banner_copy.png"
          alt="Fruitful™ — BUY ARTISAN. CREATE APPS. EAT PANCAKES."
          className="w-full h-full object-cover object-center"
        />
      </a>

      {/* Nav bar */}
      <div className="sticky top-0 z-[9990]">
        <nav className="bg-white shadow-md border-b-2 border-teal-200">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link to="/Dashboard" className="flex items-center gap-2 shrink-0">
                <img
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6953a072de46207f94f2b9d2/52acd159d_Chief_02_1753263376705.png"
                  alt="FAA.ZONE"
                  className="w-10 h-10 object-contain"
                />
                <span className="text-xl font-bold text-teal-900 hidden sm:block">FAA.ZONE™</span>
              </Link>

              {/* Desktop links */}
              <div className="hidden lg:flex items-center gap-1 flex-wrap justify-end">
                {NAV_LINKS.map(({ href, label }) => (
                  <Link key={href} to={href}>
                    <button
                      className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                      style={currentPath === href
                        ? { background: '#0d9488', color: '#fff' }
                        : { color: '#0f766e' }
                      }
                      onMouseEnter={e => { if (currentPath !== href) e.currentTarget.style.background = '#f0fdfa'; }}
                      onMouseLeave={e => { if (currentPath !== href) e.currentTarget.style.background = 'transparent'; }}
                    >
                      {label}
                    </button>
                  </Link>
                ))}
              </div>

              {/* Mobile hamburger */}
              <div className="flex items-center gap-2 lg:hidden">
                <button
                  onClick={() => setMobileOpen(o => !o)}
                  className="p-2 rounded-lg text-teal-700 hover:bg-teal-50 transition-colors"
                >
                  {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
              <div className="lg:hidden mt-3 pb-2 border-t border-teal-100 pt-3">
                <div className="flex flex-wrap gap-1">
                  {NAV_LINKS.map(({ href, label }) => (
                    <Link key={href} to={href} onClick={() => setMobileOpen(false)}>
                      <button className="px-3 py-1.5 rounded-lg text-sm font-medium text-teal-700 hover:bg-teal-50 transition-colors whitespace-nowrap">
                        {label}
                      </button>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </>
  );
}
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const BANIMAL_LOGO = 'https://media.base44.com/images/public/workspaces/691b9e0c3e8a5d73f58ef8e3/brands/74c726a6d_brand_upload_logo.png';

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
  { href: '/BlockBox',                  label: '📦 Block Box' },
];

export default function GlobalNavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname: currentPath } = useLocation();

  return (
    <>
      {/* Brand announcement bar — pink color block */}
      <div className="bn-section-pink w-full">
        <div className="container mx-auto px-4 py-2.5 flex items-center justify-center gap-3">
          <span className="bn-tag-highlight">New</span>
          <p className="text-sm font-medium" style={{ color: 'var(--brand-on-primary)' }}>
            Thoughtful essentials for soft beginnings — explore the Banimal collection
          </p>
        </div>
      </div>

      {/* Nav bar — warm off-white */}
      <div className="sticky top-0 z-[9990]" style={{ background: 'var(--brand-warm-paper)', borderBottom: '1px solid var(--brand-soft-border)' }}>
        <nav className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/Dashboard" className="flex items-center gap-2.5 shrink-0">
              <img src={BANIMAL_LOGO} alt="Banimal logo" className="h-10 w-auto object-contain" />
            </Link>

            {/* Desktop links */}
            <div className="hidden lg:flex items-center gap-1 flex-wrap justify-end">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  to={href}
                  className="bn-nav px-2.5 py-1.5"
                  aria-current={currentPath === href ? 'page' : undefined}
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Mobile hamburger */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={() => setMobileOpen(o => !o)}
                aria-label="Menu"
                className="bn-icon"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileOpen && (
            <div className="lg:hidden mt-3 pt-3" style={{ borderTop: '1px solid var(--brand-soft-border)' }}>
              <div className="flex flex-wrap gap-1">
                {NAV_LINKS.map(({ href, label }) => (
                  <Link
                    key={href}
                    to={href}
                    onClick={() => setMobileOpen(false)}
                    className="bn-nav px-2.5 py-1.5"
                    aria-current={currentPath === href ? 'page' : undefined}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </nav>
      </div>
    </>
  );
}

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutGrid, X } from 'lucide-react';

const PAGE_GROUPS = [
  {
    id: 'commerce',
    label: '🛍️ Commerce',
    pages: [
      { href: '/Marketplace',               emoji: '🛍️', label: 'Marketplace',       bg: '#7c3aed' },
      { href: '/ArtisanShop',               emoji: '🎨', label: 'Artisan Shop',       bg: '#db2777' },
      { href: '/SubscriptionShop',          emoji: '🛒', label: 'Sub Shop',           bg: '#e11d48' },
      { href: '/GrandMashadlelaCollection', emoji: '🎩', label: 'Grand Mashadlela',   bg: '#b45309' },
      { href: '/HomemartListing',           emoji: '🏠', label: 'Homemart',           bg: '#9a3412' },
      { href: '/FruitfulKiosk',             emoji: '☕', label: 'Fruitful Kiosk',     bg: '#78350f' },
      { href: '/ShananaCheckout',           emoji: '🐘', label: 'Shanana™',          bg: '#064e3b' },
      { href: '/Checkout',                  emoji: '💰', label: 'Checkout',           bg: '#065f46' },
    ]
  },
  {
    id: 'banimal',
    label: '🐾 Banimal',
    pages: [
      { href: '/Banimal',          emoji: '🐾', label: 'Banimal™',         bg: '#ea580c' },
      { href: '/BanimalDashboard', emoji: '🦁', label: 'Banimal Dashboard', bg: '#dc2626' },
      { href: '/BanimalStore',     emoji: '👶', label: 'Banimal Store',     bg: '#c2410c' },
      { href: '/BanimalAdmin',     emoji: '⚙️', label: 'Banimal Admin',     bg: '#7c2d12' },
    ]
  },
  {
    id: 'artisan',
    label: '🖌️ Artisan',
    pages: [
      { href: '/ArtisanDashboard',  emoji: '🖌️', label: 'My Artisan Shop',  bg: '#c026d3' },
      { href: '/ArtisanFinancials', emoji: '💰', label: 'Financials',        bg: '#16a34a' },
      { href: '/ArtisanProfile',    emoji: '👤', label: 'Artisan Profile',   bg: '#7e22ce' },
      { href: '/Gallery',           emoji: '🎭', label: 'Gallery',           bg: '#86198f' },
    ]
  },
  {
    id: 'orders',
    label: '📦 Orders',
    pages: [
      { href: '/OrderHistory',     emoji: '📦', label: 'Order History',  bg: '#c2410c' },
      { href: '/OrderDashboard',   emoji: '🚚', label: 'Order Dashboard',bg: '#b91c1c' },
      { href: '/OrderFulfillment', emoji: '📋', label: 'Fulfillment',    bg: '#475569' },
      { href: '/Messages',         emoji: '💬', label: 'Messages',       bg: '#1d4ed8' },
      { href: '/Wishlist',         emoji: '❤️', label: 'Wishlist',       bg: '#be185d' },
    ]
  },
  {
    id: 'subscriptions',
    label: '💎 Subs',
    pages: [
      { href: '/MySubscriptions',   emoji: '💎', label: 'My Plans',        bg: '#65a30d' },
      { href: '/SubscriptionBoxes', emoji: '🎁', label: 'Sub Boxes',       bg: '#7e22ce' },
      { href: '/LoyaltyProgram',    emoji: '🏆', label: 'Loyalty Program', bg: '#ca8a04' },
    ]
  },
  {
    id: 'intelligence',
    label: '📊 Intel',
    pages: [
      { href: '/Analytics',          emoji: '📊', label: 'Analytics',       bg: '#0891b2' },
      { href: '/SectorAnalytics',    emoji: '📈', label: 'Sector Analytics',bg: '#0369a1' },
      { href: '/MarketIntelligence', emoji: '🧠', label: 'Market Intel',    bg: '#3730a3' },
      { href: '/DiscoveryEngine',    emoji: '🔍', label: 'Discovery',       bg: '#0f766e' },
      { href: '/PulseTradeAnalytics',emoji: '⚡', label: 'PulseTrade',      bg: '#78350f' },
      { href: '/CareGrainsMap',      emoji: '🖤', label: 'Care Grains Map', bg: '#1c1917' },
    ]
  },
  {
    id: 'brands',
    label: '🌿 Brands',
    pages: [
      { href: '/BrandOnboarding',    emoji: '🏢', label: 'Onboard Brand',   bg: '#075985' },
      { href: '/BrandNodeExplorer',  emoji: '🌿', label: 'Brand Explorer',  bg: '#134e4a' },
      { href: '/EcosystemExplorer',  emoji: '🌐', label: 'Ecosystem',       bg: '#0d9488' },
      { href: '/GlobalBrandMap',     emoji: '🗺️', label: 'Global Map',      bg: '#047857' },
      { href: '/CollaborationSuite', emoji: '🤝', label: 'Collab Suite',    bg: '#4f46e5' },
    ]
  },
  {
    id: 'creative',
    label: '🎬 Creative',
    pages: [
      { href: '/ContentGenerator',  emoji: '✍️', label: 'AI Content',   bg: '#5b21b6' },
      { href: '/VideoScriptStudio', emoji: '🎬', label: 'Video Studio', bg: '#991b1b' },
      { href: '/AssetLibrary',      emoji: '🖼️', label: 'Asset Library',bg: '#92400e' },
    ]
  },
  {
    id: 'infrastructure',
    label: '🔐 Infra',
    pages: [
      { href: '/VaultMesh',       emoji: '🔐', label: 'VaultMesh™', bg: '#059669' },
      { href: '/Payments',        emoji: '💳', label: 'Payments',   bg: '#2563eb' },
      { href: '/AppBuilder',      emoji: '🏗️', label: 'App Builder',bg: '#6d28d9' },
      { href: '/AutomationEngine',emoji: '⚡', label: 'Automation', bg: '#0e7490' },
    ]
  },
  {
    id: 'admin',
    label: '🛡️ Admin',
    pages: [
      { href: '/AdminSeedwave',  emoji: '🛡️', label: 'Seedwave Admin',bg: '#334155' },
      { href: '/SectorAdminHub', emoji: '⚙️', label: 'Sector Hub',    bg: '#374151' },
      { href: '/DataSyncCenter', emoji: '🔄', label: 'Data Sync',     bg: '#1f2937' },
      { href: '/CSVImport',      emoji: '📤', label: 'CSV Import',    bg: '#0f766e' },
    ]
  },
];

export default function GlobalNavBar() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('commerce');

  const activeGroup = PAGE_GROUPS.find(g => g.id === activeTab);

  return (
    <>
      {/* ── BANNER (always visible, links to BanimalDashboard) ── */}
      <div className="fixed top-0 left-0 right-0 z-[9990]" style={{ lineHeight: 0 }}>
        <a href="/BanimalDashboard">
          <img
            src="https://media.base44.com/images/public/6953a072de46207f94f2b9d2/1f1c5f1b0_banner_copy.png"
            alt="Fruitful™"
            style={{ width: '100%', display: 'block', maxHeight: '56px', objectFit: 'cover', objectPosition: 'center' }}
          />
        </a>

        {/* ── NAV BAR strip below banner ── */}
        <div className="flex items-center gap-2 px-3 py-1.5 overflow-x-auto" style={{ background: '#011f0e', borderBottom: '1px solid #00ff9920' }}>
          {/* Home button */}
          <Link
            to="/"
            className="flex-shrink-0 text-xs font-black px-3 py-1.5 rounded-lg whitespace-nowrap"
            style={{ background: '#00b37a', color: '#fff' }}
          >
            🏠 Home
          </Link>

          {/* Quick category buttons */}
          {PAGE_GROUPS.map(group => (
            <button
              key={group.id}
              onClick={() => { setActiveTab(group.id); setOpen(o => group.id === activeTab ? !o : true); }}
              className="flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap transition-all"
              style={{
                background: open && activeTab === group.id ? '#00b37a' : 'rgba(0,255,160,0.07)',
                color: open && activeTab === group.id ? '#fff' : '#9dfcdc99',
                border: '1px solid #00ff9915',
              }}
            >
              {group.label}
            </button>
          ))}

          {/* Close button when open */}
          {open && (
            <button
              onClick={() => setOpen(false)}
              className="flex-shrink-0 ml-auto p-1.5 rounded-lg"
              style={{ background: 'rgba(255,60,60,0.15)', color: '#ff6b6b' }}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* ── Dropdown page grid ── */}
        {open && activeGroup && (
          <div className="px-4 py-3" style={{ background: 'rgba(0,20,10,0.97)', borderBottom: '1px solid #00ff9920' }}>
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 gap-2">
              {activeGroup.pages.map(({ href, emoji, label, bg }) => (
                <Link
                  key={href}
                  to={href}
                  onClick={() => setOpen(false)}
                  className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl text-white text-center hover:scale-105 transition-all"
                  style={{ backgroundColor: bg, minHeight: '60px' }}
                >
                  <span className="text-xl leading-none">{emoji}</span>
                  <span className="text-[10px] font-bold leading-tight">{label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Spacer so content doesn't hide behind fixed nav */}
      <div style={{ height: open ? '180px' : '96px', transition: 'height 0.2s' }} />
    </>
  );
}
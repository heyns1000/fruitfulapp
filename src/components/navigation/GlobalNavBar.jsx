import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, ChevronDown, ChevronUp } from 'lucide-react';

const PAGE_GROUPS = [
  {
    id: 'commerce',
    label: '🛍️ Commerce',
    pages: [
      { href: '/Marketplace',               emoji: '🛍️', label: 'Marketplace',          bg: '#7c3aed' },
      { href: '/ArtisanShop',               emoji: '🎨', label: 'Artisan Shop',          bg: '#db2777' },
      { href: '/SubscriptionShop',          emoji: '🛒', label: 'Subscription Shop',     bg: '#e11d48' },
      { href: '/GrandMashadlelaCollection', emoji: '🎩', label: 'Grand Mashadlela',      bg: '#b45309' },
      { href: '/HomemartListing',           emoji: '🏠', label: 'Homemart',              bg: '#9a3412' },
      { href: '/FruitfulKiosk',             emoji: '☕', label: 'Fruitful Kiosk',        bg: '#78350f' },
      { href: '/ShananaCheckout',           emoji: '🐘', label: 'Shanana™',             bg: '#064e3b' },
      { href: '/Checkout',                  emoji: '💰', label: 'Checkout',              bg: '#065f46' },
    ]
  },
  {
    id: 'banimal',
    label: '🐾 Banimal',
    pages: [
      { href: '/Banimal',          emoji: '🐾', label: 'Banimal™ Orchestrator', bg: '#ea580c' },
      { href: '/BanimalDashboard', emoji: '🦁', label: 'Banimal Dashboard',     bg: '#dc2626' },
      { href: '/BanimalStore',     emoji: '👶', label: 'Banimal Store',         bg: '#c2410c' },
      { href: '/BanimalAdmin',     emoji: '⚙️', label: 'Banimal Admin',         bg: '#7c2d12' },
    ]
  },
  {
    id: 'artisan',
    label: '🖌️ Artisan',
    pages: [
      { href: '/ArtisanDashboard',  emoji: '🖌️', label: 'My Artisan Shop',      bg: '#c026d3' },
      { href: '/ArtisanFinancials', emoji: '💰', label: 'Artisan Financials',    bg: '#16a34a' },
      { href: '/ArtisanProfile',    emoji: '👤', label: 'Artisan Profile',       bg: '#7e22ce' },
      { href: '/Gallery',           emoji: '🎭', label: 'Gallery',               bg: '#86198f' },
    ]
  },
  {
    id: 'orders',
    label: '📦 Orders',
    pages: [
      { href: '/OrderHistory',     emoji: '📦', label: 'Order History',    bg: '#c2410c' },
      { href: '/OrderDashboard',   emoji: '🚚', label: 'Order Dashboard',  bg: '#b91c1c' },
      { href: '/OrderFulfillment', emoji: '📋', label: 'Fulfillment',      bg: '#475569' },
      { href: '/Messages',         emoji: '💬', label: 'Messages',         bg: '#1d4ed8' },
      { href: '/Wishlist',         emoji: '❤️', label: 'Wishlist',         bg: '#be185d' },
    ]
  },
  {
    id: 'subscriptions',
    label: '💎 Subscriptions',
    pages: [
      { href: '/MySubscriptions',   emoji: '💎', label: 'My Plans',         bg: '#65a30d' },
      { href: '/SubscriptionBoxes', emoji: '🎁', label: 'Sub Boxes',        bg: '#7e22ce' },
      { href: '/LoyaltyProgram',    emoji: '🏆', label: 'Loyalty Program',  bg: '#ca8a04' },
    ]
  },
  {
    id: 'intelligence',
    label: '📊 Intelligence',
    pages: [
      { href: '/Analytics',          emoji: '📊', label: 'Analytics',         bg: '#0891b2' },
      { href: '/SectorAnalytics',    emoji: '📈', label: 'Sector Analytics',  bg: '#0369a1' },
      { href: '/MarketIntelligence', emoji: '🧠', label: 'Market Intel',      bg: '#3730a3' },
      { href: '/DiscoveryEngine',    emoji: '🔍', label: 'Discovery Engine',  bg: '#0f766e' },
      { href: '/PulseTradeAnalytics',emoji: '⚡', label: 'PulseTrade',        bg: '#78350f' },
      { href: '/CareGrainsMap',      emoji: '🖤', label: 'Care Grains Map',   bg: '#1c1917' },
    ]
  },
  {
    id: 'brands',
    label: '🌿 Brands & Ecosystem',
    pages: [
      { href: '/BrandOnboarding',    emoji: '🏢', label: 'Onboard Brand',    bg: '#075985' },
      { href: '/BrandNodeExplorer',  emoji: '🌿', label: 'Brand Explorer',   bg: '#134e4a' },
      { href: '/EcosystemExplorer',  emoji: '🌐', label: 'Ecosystem',        bg: '#0d9488' },
      { href: '/GlobalBrandMap',     emoji: '🗺️', label: 'Global Brand Map', bg: '#047857' },
      { href: '/CollaborationSuite', emoji: '🤝', label: 'Collab Suite',     bg: '#4f46e5' },
    ]
  },
  {
    id: 'creative',
    label: '🎬 Creative',
    pages: [
      { href: '/ContentGenerator',  emoji: '✍️', label: 'AI Content',       bg: '#5b21b6' },
      { href: '/VideoScriptStudio', emoji: '🎬', label: 'Video Studio',     bg: '#991b1b' },
      { href: '/AssetLibrary',      emoji: '🖼️', label: 'Asset Library',    bg: '#92400e' },
    ]
  },
  {
    id: 'infrastructure',
    label: '🔐 Infrastructure',
    pages: [
      { href: '/VaultMesh',        emoji: '🔐', label: 'VaultMesh™',    bg: '#059669' },
      { href: '/Payments',         emoji: '💳', label: 'Payments',      bg: '#2563eb' },
      { href: '/AppBuilder',       emoji: '🏗️', label: 'App Builder',   bg: '#6d28d9' },
      { href: '/AutomationEngine', emoji: '⚡', label: 'Automation',    bg: '#0e7490' },
    ]
  },
  {
    id: 'admin',
    label: '🛡️ Admin',
    pages: [
      { href: '/AdminSeedwave',  emoji: '🛡️', label: 'Seedwave Admin', bg: '#334155' },
      { href: '/SectorAdminHub', emoji: '⚙️', label: 'Sector Hub',     bg: '#374151' },
      { href: '/DataSyncCenter', emoji: '🔄', label: 'Data Sync',      bg: '#1f2937' },
      { href: '/CSVImport',      emoji: '📤', label: 'CSV Import',     bg: '#0f766e' },
    ]
  },
];

export default function GlobalNavBar() {
  const [expanded, setExpanded] = useState(true);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[9990]">

        {/* ── BANNER ── */}
        <a href="/BanimalDashboard" style={{ lineHeight: 0, display: 'block' }}>
          <img
            src="https://media.base44.com/images/public/6953a072de46207f94f2b9d2/1f1c5f1b0_banner_copy.png"
            alt="Fruitful™"
            style={{ width: '100%', display: 'block', maxHeight: '56px', objectFit: 'cover', objectPosition: 'center' }}
          />
        </a>

        {/* ── TOGGLE BAR ── */}
        <div
          className="flex items-center justify-between px-3 py-1 cursor-pointer select-none"
          style={{ background: '#011f0e', borderBottom: '1px solid #00ff9920' }}
          onClick={() => setExpanded(e => !e)}
        >
          <div className="flex items-center gap-2">
            <Link
              to="/"
              onClick={e => e.stopPropagation()}
              className="text-xs font-black px-2 py-1 rounded-lg"
              style={{ background: '#00b37a', color: '#fff' }}
            >
              🏠 Home
            </Link>
            <span className="text-[10px] font-bold" style={{ color: '#9dfcdc60' }}>
              {PAGE_GROUPS.reduce((s, g) => s + g.pages.length, 0)} pages · {PAGE_GROUPS.length} categories
            </span>
          </div>
          {expanded
            ? <ChevronUp className="w-4 h-4" style={{ color: '#00ffc8' }} />
            : <ChevronDown className="w-4 h-4" style={{ color: '#00ffc8' }} />
          }
        </div>

        {/* ── ALL PAGE GROUPS — always visible when expanded ── */}
        {expanded && (
          <div style={{ background: 'rgba(0,15,8,0.98)', borderBottom: '2px solid #00ff9920', maxHeight: '60vh', overflowY: 'auto' }}>
            {PAGE_GROUPS.map(group => (
              <div key={group.id} style={{ borderBottom: '1px solid #00ff9910' }}>
                {/* Group label */}
                <div className="px-3 py-1" style={{ background: 'rgba(0,30,15,0.8)' }}>
                  <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#00ffc8' }}>{group.label}</span>
                </div>
                {/* Pages row — horizontally scrollable */}
                <div className="flex gap-2 px-3 py-2 overflow-x-auto">
                  {group.pages.map(({ href, emoji, label, bg }) => (
                    <Link
                      key={href}
                      to={href}
                      onClick={() => setExpanded(false)}
                      className="flex-shrink-0 flex flex-col items-center justify-center gap-1 rounded-xl text-white text-center hover:scale-105 active:scale-95 transition-all"
                      style={{ backgroundColor: bg, minWidth: '72px', minHeight: '64px', padding: '6px 4px' }}
                    >
                      <span className="text-2xl leading-none">{emoji}</span>
                      <span className="text-[9px] font-bold leading-tight text-center px-1">{label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Spacer */}
      <div style={{ height: expanded ? '420px' : '92px', transition: 'height 0.2s' }} />
    </>
  );
}
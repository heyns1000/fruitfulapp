import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu, X, LayoutDashboard, Store, Image, Users, BarChart3, TrendingUp,
  PieChart, Sparkles, UserPlus, Award, CreditCard, ShoppingBag, Palette,
  Wallet, Package, Truck, ClipboardList, MessageCircle, Heart, Boxes,
  Globe, Search, Activity, Zap, Map, Clapperboard, Images, Banknote,
  Lock, PawPrint, Wrench, Github as Elephant, HeartHandshake, Network,
  Brush, ShieldCheck, Settings, RefreshCw, Box,
} from 'lucide-react';

/* Clean, emoji-free nav. Each link carries a lucide icon for CI + a11y. */
const NAV_LINKS = [
  { href: '/Dashboard',                 label: 'Dashboard',        icon: LayoutDashboard },
  { href: '/Marketplace',               label: 'Marketplace',      icon: Store },
  { href: '/Gallery',                   label: 'Gallery',          icon: Image },
  { href: '/CollaborationSuite',        label: 'Collaboration',    icon: Users },
  { href: '/Analytics',                 label: 'Analytics',        icon: BarChart3 },
  { href: '/BrandInsights',             label: 'Brand Insights',   icon: TrendingUp },
  { href: '/SectorAnalytics',           label: 'Sector Analytics', icon: PieChart },
  { href: '/ContentGenerator',          label: 'AI Content',       icon: Sparkles },
  { href: '/BrandOnboarding',           label: 'Onboard Brand',    icon: UserPlus },
  { href: '/LoyaltyProgram',            label: 'Loyalty',          icon: Award },
  { href: '/MySubscriptions',           label: 'My Plans',         icon: CreditCard },
  { href: '/SubscriptionShop',          label: 'Sub Shop',         icon: ShoppingBag },
  { href: '/ArtisanDashboard',          label: 'My Shop',          icon: Palette },
  { href: '/ArtisanFinancials',         label: 'Financials',       icon: Wallet },
  { href: '/OrderHistory',              label: 'Orders',           icon: Package },
  { href: '/OrderDashboard',            label: 'Order Dashboard',  icon: Truck },
  { href: '/OrderFulfillment',          label: 'Fulfillment',      icon: ClipboardList },
  { href: '/Messages',                  label: 'Messages',         icon: MessageCircle },
  { href: '/Wishlist',                  label: 'Wishlist',         icon: Heart },
  { href: '/SubscriptionBoxes',         label: 'Sub Boxes',        icon: Boxes },
  { href: '/EcosystemExplorer',         label: 'Ecosystem',        icon: Globe },
  { href: '/DiscoveryEngine',           label: 'Discovery',        icon: Search },
  { href: '/MarketIntelligence',        label: 'Intelligence',     icon: Activity },
  { href: '/AutomationEngine',          label: 'Automation',       icon: Zap },
  { href: '/GlobalBrandMap',            label: 'Global Map',       icon: Map },
  { href: '/VideoScriptStudio',         label: 'Video Studio',     icon: Clapperboard },
  { href: '/AssetLibrary',              label: 'Asset Library',    icon: Images },
  { href: '/Payments',                  label: 'Payments',         icon: Banknote },
  { href: '/VaultMesh',                 label: 'Vault Mesh',       icon: Lock },
  { href: '/Banimal',                   label: 'Banimal',          icon: PawPrint },
  { href: '/AppBuilder',                label: 'App Builder',      icon: Wrench, subbrand: true },
  { href: '/ShananaCheckout',           label: 'Shanana',          icon: Elephant },
  { href: '/CareGrainsMap',             label: 'Care Grains Map',  icon: HeartHandshake },
  { href: '/PulseTradeAnalytics',       label: 'PulseTrade',       icon: Zap },
  { href: '/BrandNodeExplorer',         label: 'Brand Explorer',   icon: Network },
  { href: '/GrandMashadlelaCollection', label: 'Grand Mashadlela', icon: Brush },
  { href: '/AdminSeedwave',             label: 'Seedwave Admin',   icon: ShieldCheck },
  { href: '/SectorAdminHub',            label: 'Sector Hub',       icon: Settings },
  { href: '/DataSyncCenter',            label: 'Data Sync',        icon: RefreshCw },
  { href: '/BlockBox',                  label: 'Block Box',        icon: Box },
];

function NavButton({ href, label, icon: Icon, active, subbrand, onClick }) {
  return (
    <Link to={href} onClick={onClick}>
      <button
        className={[
          'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
          active
            ? 'bg-primary text-primary-foreground shadow-sm'
            : subbrand
            ? 'text-accent hover:bg-accent/10'
            : 'text-fruitful-teal-deep hover:bg-secondary',
        ].join(' ')}
      >
        <Icon className="w-4 h-4 shrink-0" />
        <span>{label}</span>
      </button>
    </Link>
  );
}

export default function GlobalNavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname: currentPath } = useLocation();

  return (
    <>
      {/* VIP hero banner — Fruitful Global™ artwork, full-bleed without distortion */}
      <a
        href="/EcosystemExplorer"
        className="block w-full overflow-hidden"
        style={{ background: '#2b1b52' }}
        aria-label="Fruitful Global — If you don't like the fruits you are growing, change the seeds"
      >
        <img
          src="/brand/banner-global.png"
          alt="Fruitful Global — if you don't like the fruits you are growing, change the seeds"
          className="mx-auto h-24 sm:h-32 lg:h-40 w-auto max-w-full object-contain"
        />
      </a>

      {/* Nav bar */}
      <div className="sticky top-0 z-[9990]">
        <nav className="bg-card/95 backdrop-blur shadow-sm border-b border-border">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              {/* Logo — Fruitful™ pear mark (global brand icon) + wordmark */}
              <Link to="/Dashboard" className="flex items-center gap-2.5 shrink-0" aria-label="Fruitful home">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-fruitful-mint/60 shrink-0">
                  <img
                    src="/brand/favicon.png"
                    alt="Fruitful pear"
                    className="w-7 h-7 object-contain"
                  />
                </span>
                <img
                  src="/brand/fruitful-logo.png"
                  alt="Fruitful"
                  className="h-8 w-auto object-contain hidden sm:block"
                />
                <span className="text-sm font-semibold text-muted-foreground hidden md:block border-l border-border pl-2.5">
                  FAA.ZONE<sup className="text-[10px]">™</sup>
                </span>
              </Link>

              {/* Desktop links */}
              <div className="hidden lg:flex items-center gap-1 flex-wrap justify-end">
                {NAV_LINKS.map((l) => (
                  <NavButton key={l.href} {...l} active={currentPath === l.href} />
                ))}
              </div>

              {/* Mobile hamburger */}
              <div className="flex items-center gap-2 lg:hidden">
                <button
                  onClick={() => setMobileOpen((o) => !o)}
                  aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                  aria-expanded={mobileOpen}
                  className="p-2 rounded-lg text-fruitful-teal-deep hover:bg-secondary transition-colors"
                >
                  {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
              <div className="lg:hidden mt-3 pb-2 border-t border-border pt-3">
                <div className="flex flex-wrap gap-1">
                  {NAV_LINKS.map((l) => (
                    <NavButton
                      key={l.href}
                      {...l}
                      active={currentPath === l.href}
                      onClick={() => setMobileOpen(false)}
                    />
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

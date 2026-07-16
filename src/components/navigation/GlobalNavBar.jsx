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
      {/* Banner — full artwork shown without distortion, centered on brand ink */}
      <a
        href="/BanimalDashboard"
        className="block w-full overflow-hidden"
        style={{ background: 'var(--fruitful-ink)' }}
        aria-label="Fruitful — Buy artisan. Create apps. Eat pancakes."
      >
        <img
          src="https://media.base44.com/images/public/6953a072de46207f94f2b9d2/1f1c5f1b0_banner_copy.png"
          alt="Fruitful — Buy artisan, create apps, eat pancakes"
          className="mx-auto h-16 sm:h-20 w-auto max-w-full object-contain"
        />
      </a>

      {/* Nav bar */}
      <div className="sticky top-0 z-[9990]">
        <nav className="bg-card/95 backdrop-blur shadow-sm border-b border-border">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              {/* Logo */}
              <Link to="/Dashboard" className="flex items-center gap-2 shrink-0">
                <img
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6953a072de46207f94f2b9d2/52acd159d_Chief_02_1753263376705.png"
                  alt="FAA.ZONE logo"
                  className="w-10 h-10 object-contain"
                />
                <span className="text-xl font-bold text-fruitful-teal-deep hidden sm:block">
                  FAA.ZONE<sup className="text-xs">™</sup>
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

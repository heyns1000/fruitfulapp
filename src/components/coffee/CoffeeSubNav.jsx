import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Coffee, Package, Globe, BarChart3, TrendingUp } from 'lucide-react';

const BRAND_GREEN = '#4ECDC4';
const BRAND_RED = '#E91E63';
const BRAND_DARK = '#1a1a2e';

const NAV_ITEMS = [
  { to: '/FruitfulCoffee?tab=overview',  label: 'Overview & KPI',             icon: Coffee,      key: 'overview' },
  { to: '/KioskLandedCost',              label: 'Kiosk Capital & Amortization', icon: Package,  key: 'kiosk' },
  { to: '/FruitfulCoffee?tab=sourcing',  label: 'Sourcing & Suppliers',      icon: Globe,       key: 'sourcing' },
  { to: '/FruitfulCoffee?tab=costing',   label: 'BOM Costing & Menu',         icon: BarChart3,   key: 'costing' },
  { to: '/FruitfulCoffee?tab=overview',  label: 'Projections & Drawdown',     icon: TrendingUp,  key: 'projections' },
];

export default function CoffeeSubNav() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get('tab') || 'overview';
  const isKiosk = location.pathname === '/KioskLandedCost';
  const isCoffee = location.pathname === '/FruitfulCoffee';

  const isActive = (item) => {
    if (item.key === 'kiosk') return isKiosk;
    if (item.key === 'projections') return isCoffee && currentTab === 'overview';
    return isCoffee && currentTab === item.key;
  };

  return (
    <div className="sticky top-0 z-30 shadow-md" style={{ background: `linear-gradient(135deg, ${BRAND_DARK} 0%, #2d1b4e 60%, #1a3a3a 100%)` }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-1 overflow-x-auto py-2.5">
          <span className="text-white/40 text-xs font-black uppercase tracking-[0.2em] mr-3 hidden md:block whitespace-nowrap">
            ☕ Fruitful Coffee
          </span>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <Link
                key={item.key}
                to={item.to}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all"
                style={active
                  ? { background: BRAND_RED, color: 'white', boxShadow: '0 2px 8px rgba(233,30,99,0.3)' }
                  : { color: 'rgba(255,255,255,0.65)' }
                }
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">{item.label}</span>
                <span className="sm:hidden">{item.label.split(' ')[0]}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
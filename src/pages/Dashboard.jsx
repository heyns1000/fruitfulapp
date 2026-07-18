import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminPanel from '../components/admin/AdminPanel';
import DataSeeder from '../components/admin/DataSeeder';
import BrandManager from '../components/admin/BrandManager';
import CollaborationManager from '../components/collaboration/CollaborationManager';
import MetricsCards from '../components/dashboard/MetricsCards';
import LicenseProjection from '../components/dashboard/LicenseProjection';
import SectorGrid from '../components/sectors/SectorGrid';
import DataExporter from '../components/data/DataExporter';
import CompleteDataExporter from '../components/data/CompleteDataExporter';
import BulkOperations from '../components/admin/BulkOperations';
import BulkFinancialManager from '../components/admin/BulkFinancialManager';
import BrandFinancialBulkEditor from '../components/admin/BrandFinancialBulkEditor';
import AllocationKanban from '../components/admin/AllocationKanban';
import BrandHealthAudit from '../components/admin/BrandHealthAudit';
import ZeroWasteExporter from '../components/data/ZeroWasteExporter';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const SECTORS = {
  agriculture: '🌱 Agriculture & Biotech',
  fsf: '🥦 Food, Soil & Farming',
  banking: '🏦 Banking & Finance',
  creative: '🖋️ Creative Tech',
  logistics: '📦 Logistics & Packaging',
  'education-ip': '📚 Education & IP',
  fashion: '✂ Fashion & Identity',
  gaming: '🎮 Gaming & Simulation',
  health: '🧠 Health & Hygiene',
  housing: '🏗️ Housing & Infrastructure',
  justice: '⚖ Justice & Ethics',
  knowledge: '📖 Knowledge & Archives',
  micromesh: '☰ Micro-Mesh Logistics',
  media: '🎬 Motion, Media & Sonic',
  nutrition: '✿ Nutrition & Food Chain',
  'ai-logic': '🧠 AI, Logic & Grid',
  packaging: '📦 Packaging & Materials',
  quantum: '✴️ Quantum Protocols',
  ritual: '☯ Ritual & Culture',
  saas: '🔑 SaaS & Licensing',
  trade: '🧺 Trade Systems',
  utilities: '🔋 Utilities & Energy',
  voice: '🎙️ Voice & Audio',
  webless: '📡 Webless Tech & Nodes',
  nft: '🔁 NFT & Ownership',
  'education-youth': '🎓 Education & Youth',
  zerowaste: '♻️ Zero Waste',
  professional: '🧾 Professional Services',
  'payroll-mining': '🪙 Payroll Mining & Accounting',
  mining: '⛏️ Mining & Resources',
  wildlife: '🦁 Wildlife & Habitat'
};

// All pages grouped by category for the nav tabs
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
      { href: '/Gallery',           emoji: '🎭', label: 'Gallery',              bg: '#86198f' },
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
      { href: '/MySubscriptions',  emoji: '💎', label: 'My Plans',         bg: '#65a30d' },
      { href: '/SubscriptionBoxes',emoji: '🎁', label: 'Sub Boxes',        bg: '#7e22ce' },
      { href: '/LoyaltyProgram',   emoji: '🏆', label: 'Loyalty Program',  bg: '#ca8a04' },
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
      { href: '/BrandOnboarding',   emoji: '🏢', label: 'Onboard Brand',    bg: '#075985' },
      { href: '/BrandNodeExplorer', emoji: '🌿', label: 'Brand Explorer',   bg: '#134e4a' },
      { href: '/EcosystemExplorer', emoji: '🌐', label: 'Ecosystem',        bg: '#0d9488' },
      { href: '/GlobalBrandMap',    emoji: '🗺️', label: 'Global Brand Map', bg: '#047857' },
      { href: '/CollaborationSuite',emoji: '🤝', label: 'Collab Suite',     bg: '#4f46e5' },
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
      { href: '/VaultMesh',      emoji: '🔐', label: 'VaultMesh™',     bg: '#059669' },
      { href: '/Payments',       emoji: '💳', label: 'Payments',       bg: '#2563eb' },
      { href: '/AppBuilder',     emoji: '🏗️', label: 'App Builder',    bg: '#6d28d9' },
      { href: '/AutomationEngine',emoji: '⚡', label: 'Automation',    bg: '#0e7490' },
    ]
  },
  {
    id: 'admin',
    label: '🛡️ Admin',
    pages: [
      { href: '/AdminSeedwave', emoji: '🛡️', label: 'Seedwave Admin', bg: '#334155' },
      { href: '/SectorAdminHub',emoji: '⚙️', label: 'Sector Hub',     bg: '#374151' },
      { href: '/DataSyncCenter',emoji: '🔄', label: 'Data Sync',      bg: '#1f2937' },
      { href: '/CSVImport',     emoji: '📤', label: 'CSV Import',     bg: '#0f766e' },
    ]
  },
];

const NAV_BG = 'rgba(0,20,10,0.85)';
const CARD_BG = 'rgba(0,40,20,0.7)';
const BORDER = '#00ff9930';

function PageGrid({ pages }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
      {pages.map(({ href, emoji, label, bg }) => (
        <Link key={href} to={href} className="group block">
          <div
            className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-lg text-white text-center transition-all duration-200 hover:scale-[1.03] hover:shadow-lg active:scale-95 cursor-pointer min-h-[76px]"
            style={{ backgroundColor: bg }}
          >
            <span className="text-2xl leading-none">{emoji}</span>
            <span className="text-[11px] font-semibold leading-tight tracking-tight">{label}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const [activePageTab, setActivePageTab] = useState('commerce');
  const [activeSectorTab, setActiveSectorTab] = useState('admin');
  const queryClient = useQueryClient();

  const { data: brands = [], isLoading } = useQuery({
    queryKey: ['brands'],
    queryFn: () => base44.entities.Brand.list('-updated_date')
  });

  const calculateMetrics = () => {
    const totalBrands = brands.length;
    const totalNodes = brands.reduce((sum, b) => sum + (b.subnodes?.length || 0), 0);
    return {
      activeNodes: totalBrands,
      licensesActive: totalBrands * 2,
      vaultDeployments: Math.round(totalBrands * 1.5),
      syncLogs: totalBrands * 5,
      auditsRunning: Math.ceil(totalBrands / 10),
      signalZones: Math.floor(totalBrands / 3),
      scrollGridIndex: totalBrands + totalNodes
    };
  };

  const metrics = calculateMetrics();

  const coreBrand = brands.find(b => b.isSystemBrand)
    || [...brands].sort((a, b) => (b.subnodes?.length || 0) - (a.subnodes?.length || 0))[0]
    || null;
  const coreSubnodes = coreBrand?.subnodes || [];

  const getBrandsBySector = (sectorKey) => brands.filter(b => b.sector === sectorKey);

  const handleBrandAdded = () => queryClient.invalidateQueries({ queryKey: ['brands'] });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#001a0f] via-[#012b19] to-[#001a0f] relative overflow-hidden">
      {/* Subtle dot-grid background */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #00ff99 1px, transparent 0)', backgroundSize: '32px 32px' }} />

      {/* ── MAIN HEADER ── */}
      <header className="relative overflow-hidden border-b border-[#00ff9920]" style={{ background: '#011f0e' }}>
        <div className="container mx-auto px-6 py-5 relative z-10">
          <div className="flex items-center gap-5">
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6953a072de46207f94f2b9d2/52acd159d_Chief_02_1753263376705.png"
              alt="FAA Chief"
              className="w-14 h-14 object-contain rounded-xl"
              style={{ filter: 'drop-shadow(0 0 10px #00ffc855)' }}
            />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: '#00ffc8', textShadow: '0 0 12px #00ffcc66' }}>
                FAA.ZONE™
              </h1>
              <p className="text-xs font-medium mt-0.5" style={{ color: '#9dfcdc99' }}>
                Financial Allocation Architecture · Seeds of Appreciation · Live Grid
              </p>
            </div>
            <div className="ml-auto hidden sm:flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold" style={{ color: '#00ff9980' }}>Pulse Grid Active</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 pb-10 relative z-10 space-y-5 pt-5">

        {/* ── SEEDWAVE CORE BRAND HEADER ── */}
        <header className="text-white shadow-xl rounded-2xl relative overflow-hidden border border-purple-500/30" style={{ background: 'linear-gradient(135deg, #2d1b69, #1e3a5f, #1a1a2e)' }}>
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #a855f7 1px, transparent 0)', backgroundSize: '28px 28px' }} />
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute right-5 top-1/2 -translate-y-1/2 opacity-20">
            <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6953a072de46207f94f2b9d2/4540be9bd_Monster_01_1753263376704.png" alt="" className="w-24 h-24 object-contain" />
          </div>
          <div className="px-6 pt-6 pb-3 relative z-10">
            <p className="text-purple-400 text-xs font-bold tracking-[0.3em] uppercase mb-2">✦ Seedwave™ Admin Portal</p>
            {coreBrand ? (
              <>
                <div className="flex items-baseline gap-3 flex-wrap mb-1">
                  <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
                    {coreBrand.name}™
                  </h2>
                  {coreBrand.sector && (
                    <span className="text-purple-300 text-sm font-semibold capitalize">{SECTORS[coreBrand.sector] || coreBrand.sector}</span>
                  )}
                  {coreBrand.isSystemBrand && (
                    <span className="text-[10px] bg-purple-600/40 border border-purple-500/50 text-purple-200 rounded-full px-2 py-0.5 font-bold uppercase tracking-wider">Core Brand</span>
                  )}
                </div>
                {coreBrand.description && (
                  <p className="text-purple-200/60 text-sm max-w-2xl line-clamp-1">{coreBrand.description}</p>
                )}
                {coreSubnodes.length > 0 && (
                  <p className="text-purple-400/60 text-xs mt-1">{coreSubnodes.length} subnodes active</p>
                )}
              </>
            ) : (
              <h2 className="text-3xl font-black text-white">🦁 Seedwave™ Core</h2>
            )}
          </div>
          {coreSubnodes.length > 0 && (
            <div className="overflow-hidden border-t border-purple-500/20 relative" style={{ height: '38px' }}>
              <style>{`@keyframes marqueeScroll{0%{transform:translateX(0)}100%{transform:translateX(-33.333%)}}`}</style>
              <div className="flex items-center gap-10 absolute top-0 bottom-0 whitespace-nowrap" style={{ animation: 'marqueeScroll 35s linear infinite' }}>
                {[...coreSubnodes, ...coreSubnodes, ...coreSubnodes].map((node, i) => (
                  <span key={i} className="text-xs font-bold text-purple-300/80 flex items-center gap-2 shrink-0">
                    <span className="text-purple-500 text-[10px]">✦</span>{node}
                  </span>
                ))}
              </div>
            </div>
          )}
        </header>

        {/* ── METRICS ── */}
        <MetricsCards metrics={metrics} />
        <LicenseProjection />

        {/* ═══════════════════════════════════════════════════════════════
            PAGE NAVIGATION — tabbed by category
        ═══════════════════════════════════════════════════════════════ */}
        <div className="rounded-2xl shadow-xl border overflow-hidden" style={{ background: CARD_BG, borderColor: BORDER }}>
          <div className="px-5 pt-5 pb-3">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] mb-1" style={{ color: '#00ffc8' }}>✦ Platform Navigation</p>
            <p className="text-xs" style={{ color: '#9dfcdc60' }}>{PAGE_GROUPS.reduce((s, g) => s + g.pages.length, 0)} pages across {PAGE_GROUPS.length} categories</p>
          </div>

          {/* Category tab strip */}
          <div className="overflow-x-auto border-b" style={{ borderColor: BORDER }}>
            <div className="flex min-w-max px-4 gap-1 py-1.5">
              {PAGE_GROUPS.map(group => (
                <button
                  key={group.id}
                  onClick={() => setActivePageTab(group.id)}
                  className="px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all"
                  style={{
                    background: activePageTab === group.id ? '#00b37a' : 'transparent',
                    color: activePageTab === group.id ? '#fff' : '#9dfcdc99',
                  }}
                >
                  {group.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active group grid */}
          <div className="p-5">
            {PAGE_GROUPS.filter(g => g.id === activePageTab).map(group => (
              <div key={group.id}>
                <PageGrid pages={group.pages} />
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            SECTOR / ADMIN TABS (brands by sector)
        ═══════════════════════════════════════════════════════════════ */}
        <Tabs value={activeSectorTab} onValueChange={setActiveSectorTab} className="space-y-4">
          <div className="rounded-xl border overflow-hidden" style={{ background: NAV_BG, borderColor: BORDER }}>
            <div className="px-4 pt-4 pb-2">
              <p className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: '#00ffc8' }}>✦ Brand & Sector Management</p>
            </div>
            <div className="overflow-x-auto">
              <TabsList className="flex min-w-max gap-1 px-4 pb-3 h-auto bg-transparent">
                <TabsTrigger value="admin" className="data-[state=active]:bg-emerald-700 data-[state=active]:text-white font-semibold text-slate-300 whitespace-nowrap">⚙️ Admin Panel</TabsTrigger>
                <TabsTrigger value="collaborations" className="data-[state=active]:bg-emerald-700 data-[state=active]:text-white font-semibold text-slate-300 whitespace-nowrap">🤝 Collaborations</TabsTrigger>
                {Object.entries(SECTORS).map(([key, label]) => (
                  <TabsTrigger key={key} value={key} className="data-[state=active]:bg-emerald-700 data-[state=active]:text-white text-sm font-medium text-slate-400 whitespace-nowrap">
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </div>

          <TabsContent value="admin" className="space-y-6">
            <AllocationKanban />
            <BrandFinancialBulkEditor />
            <BulkFinancialManager />
            <BrandHealthAudit />
            <BulkOperations />
            <ZeroWasteExporter />
            <CompleteDataExporter />
            <DataExporter />
            <DataSeeder />
            <AdminPanel onBrandAdded={handleBrandAdded} />
            <BrandManager />
            <div className="rounded-xl border p-6" style={{ background: 'rgba(0,30,15,0.7)', borderColor: '#00ff9920' }}>
              <h2 className="text-lg font-black mb-4" style={{ color: '#00ffc8' }}>📊 All Brands Overview</h2>
              {brands.length === 0 ? (
                <p style={{ color: '#9dfcdc60' }}>No brands yet. Add via admin panel above.</p>
              ) : (
                <div className="space-y-4">
                  {Object.entries(SECTORS).map(([sectorKey, sectorName]) => {
                    const sectorBrands = getBrandsBySector(sectorKey);
                    if (sectorBrands.length === 0) return null;
                    return (
                      <div key={sectorKey} className="border-b pb-4 last:border-b-0" style={{ borderColor: '#00ff9915' }}>
                        <h3 className="font-semibold text-sm mb-2" style={{ color: '#b5ffe5' }}>{sectorName}</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1.5">
                          {sectorBrands.map(brand => (
                            <div key={brand.id} className="rounded-lg p-2 text-xs" style={{ background: 'rgba(0,70,35,0.5)', border: '1px solid #00ff9920' }}>
                              <span className="font-bold" style={{ color: '#b5ffe5' }}>{brand.name}™</span>
                              <div className="mt-0.5" style={{ color: '#9dfcdc60' }}>{brand.subnodes?.length || 0} subnodes</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="collaborations" className="space-y-6">
            <CollaborationManager />
          </TabsContent>

          {Object.entries(SECTORS).map(([sectorKey, sectorName]) => (
            <TabsContent key={sectorKey} value={sectorKey}>
              <div className="rounded-xl border p-6" style={{ background: 'rgba(0,30,15,0.7)', borderColor: '#00ff9920' }}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-black" style={{ color: '#00ffc8' }}>{sectorName}</h2>
                  <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: 'rgba(0,255,160,0.1)', color: '#00ff99' }}>{getBrandsBySector(sectorKey).length} brands</span>
                </div>
                {getBrandsBySector(sectorKey).length === 0 ? (
                  <p className="text-center py-8 text-sm" style={{ color: '#9dfcdc50' }}>No brands in this sector yet.</p>
                ) : (
                  <SectorGrid brands={getBrandsBySector(sectorKey)} sectorKey={sectorKey} sectorName={sectorName} />
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="border-t py-6 mt-8 text-center" style={{ background: '#012b19', borderColor: '#00ff9920', color: '#9dfcdc' }}>
        <p className="text-xs">🛡️ Powered by HSOMNI9000 · FAA.Zone Grid Protocol · ScrollGrid · PulseTrade Certified · TreatyMesh Validated</p>
        <p className="text-xs mt-1" style={{ color: '#9dfcdc60' }}>© 2026 Fruitful Holdings (Pty) Ltd · Seeds of Appreciation · Glyphs Pulse Every 9s</p>
      </footer>
    </div>
  );
}
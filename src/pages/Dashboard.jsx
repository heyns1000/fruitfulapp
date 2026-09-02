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
import BlockVaultAdmin from '../components/blockvault/BlockVaultAdmin';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const BANIMAL_LOGO = 'https://media.base44.com/images/public/workspaces/691b9e0c3e8a5d73f58ef8e3/brands/74c726a6d_brand_upload_logo.png';

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
      { href: '/Marketplace',               emoji: '🛍️', label: 'Marketplace',          tone: 'teal' },
      { href: '/ArtisanShop',               emoji: '🎨', label: 'Artisan Shop',          tone: 'pink' },
      { href: '/SubscriptionShop',          emoji: '🛒', label: 'Subscription Shop',     tone: 'teal' },
      { href: '/GrandMashadlelaCollection', emoji: '🎩', label: 'Grand Mashadlela',      tone: 'pink' },
      { href: '/HomemartListing',           emoji: '🏠', label: 'Homemart',              tone: 'teal' },
      { href: '/FruitfulKiosk',             emoji: '☕', label: 'Fruitful Kiosk',        tone: 'pink' },
      { href: '/FruitfulCoffee',            emoji: '🥤', label: 'Coffee Engine',         tone: 'pink' },
      { href: '/ShananaCheckout',           emoji: '🐘', label: 'Shanana™',             tone: 'teal' },
      { href: '/Checkout',                  emoji: '💰', label: 'Checkout',              tone: 'teal' },
    ]
  },
  {
    id: 'banimal',
    label: '🐾 Banimal',
    pages: [
      { href: '/Banimal',          emoji: '🐾', label: 'Banimal™ Orchestrator', tone: 'pink' },
      { href: '/BanimalDashboard', emoji: '🦁', label: 'Banimal Dashboard',     tone: 'teal' },
      { href: '/BanimalStore',     emoji: '👶', label: 'Banimal Store',         tone: 'pink' },
      { href: '/BanimalAdmin',     emoji: '⚙️', label: 'Banimal Admin',         tone: 'teal' },
    ]
  },
  {
    id: 'artisan',
    label: '🖌️ Artisan',
    pages: [
      { href: '/ArtisanDashboard',  emoji: '🖌️', label: 'My Artisan Shop',      tone: 'pink' },
      { href: '/ArtisanFinancials', emoji: '💰', label: 'Artisan Financials',    tone: 'teal' },
      { href: '/ArtisanProfile',    emoji: '👤', label: 'Artisan Profile',       tone: 'pink' },
      { href: '/Gallery',           emoji: '🎭', label: 'Gallery',              tone: 'teal' },
    ]
  },
  {
    id: 'orders',
    label: '📦 Orders',
    pages: [
      { href: '/OrderHistory',     emoji: '📦', label: 'Order History',    tone: 'teal' },
      { href: '/OrderDashboard',   emoji: '🚚', label: 'Order Dashboard',  tone: 'pink' },
      { href: '/OrderFulfillment', emoji: '📋', label: 'Fulfillment',      tone: 'teal' },
      { href: '/Messages',         emoji: '💬', label: 'Messages',         tone: 'pink' },
      { href: '/Wishlist',         emoji: '❤️', label: 'Wishlist',         tone: 'teal' },
    ]
  },
  {
    id: 'subscriptions',
    label: '💎 Subscriptions',
    pages: [
      { href: '/MySubscriptions',  emoji: '💎', label: 'My Plans',         tone: 'teal' },
      { href: '/SubscriptionBoxes',emoji: '🎁', label: 'Sub Boxes',        tone: 'pink' },
      { href: '/LoyaltyProgram',   emoji: '🏆', label: 'Loyalty Program',  tone: 'teal' },
    ]
  },
  {
    id: 'intelligence',
    label: '📊 Intelligence',
    pages: [
      { href: '/Analytics',          emoji: '📊', label: 'Analytics',         tone: 'teal' },
      { href: '/SectorAnalytics',    emoji: '📈', label: 'Sector Analytics',  tone: 'pink' },
      { href: '/MarketIntelligence', emoji: '🧠', label: 'Market Intel',      tone: 'teal' },
      { href: '/DiscoveryEngine',    emoji: '🔍', label: 'Discovery Engine',  tone: 'pink' },
      { href: '/PulseTradeAnalytics',emoji: '⚡', label: 'PulseTrade',        tone: 'teal' },
      { href: '/CareGrainsMap',      emoji: '🖤', label: 'Care Grains Map',   tone: 'pink' },
    ]
  },
  {
    id: 'brands',
    label: '🌿 Brands & Ecosystem',
    pages: [
      { href: '/BrandOnboarding',   emoji: '🏢', label: 'Onboard Brand',    tone: 'teal' },
      { href: '/BrandNodeExplorer', emoji: '🌿', label: 'Brand Explorer',   tone: 'pink' },
      { href: '/EcosystemExplorer', emoji: '🌐', label: 'Ecosystem',        tone: 'teal' },
      { href: '/GlobalBrandMap',    emoji: '🗺️', label: 'Global Brand Map', tone: 'pink' },
      { href: '/CollaborationSuite',emoji: '🤝', label: 'Collab Suite',     tone: 'teal' },
    ]
  },
  {
    id: 'creative',
    label: '🎬 Creative',
    pages: [
      { href: '/ContentGenerator',  emoji: '✍️', label: 'AI Content',       tone: 'pink' },
      { href: '/VideoScriptStudio', emoji: '🎬', label: 'Video Studio',     tone: 'teal' },
      { href: '/AssetLibrary',      emoji: '🖼️', label: 'Asset Library',    tone: 'pink' },
    ]
  },
  {
    id: 'infrastructure',
    label: '🔐 Infrastructure',
    pages: [
      { href: '/BlockVault',     emoji: '🔐', label: 'BlockVault Core', tone: 'teal' },
      { href: '/VaultMesh',      emoji: '🔐', label: 'VaultMesh™',     tone: 'pink' },
      { href: '/Payments',       emoji: '💳', label: 'Payments',       tone: 'teal' },
      { href: '/AppBuilder',     emoji: '🏗️', label: 'App Builder',    tone: 'pink' },
      { href: '/AutomationEngine',emoji: '⚡', label: 'Automation',    tone: 'teal' },
    ]
  },
  {
    id: 'admin',
    label: '🛡️ Admin',
    pages: [
      { href: '/AdminSeedwave', emoji: '🛡️', label: 'Seedwave Admin', tone: 'pink' },
      { href: '/SectorAdminHub',emoji: '⚙️', label: 'Sector Hub',     tone: 'teal' },
      { href: '/DataSyncCenter',emoji: '🔄', label: 'Data Sync',      tone: 'pink' },
      { href: '/CSVImport',     emoji: '📤', label: 'CSV Import',     tone: 'teal' },
    ]
  },
];

function PageGrid({ pages }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {pages.map(({ href, emoji, label, tone }) => (
        <Link key={href} to={href} className="group block">
          <div
            className="flex flex-col items-center justify-center gap-2 p-4 text-center transition-all duration-200 hover:-translate-y-0.5 cursor-pointer min-h-[88px]"
            style={{
              borderRadius: 'var(--brand-radius-md)',
              background: tone === 'teal' ? 'var(--brand-secondary)' : 'var(--brand-campaign-pink)',
              color: 'var(--brand-on-primary)',
              boxShadow: 'var(--brand-shadow-sm)',
            }}
          >
            <span className="text-2xl leading-none">{emoji}</span>
            <span className="text-xs font-semibold leading-tight">{label}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const [activePageTab, setActivePageTab] = useState('commerce');
  const [activeSectorTab, setActiveSectorTab] = useState('blockvault');
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
      <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--brand-background)' }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--brand-primary)' }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'var(--brand-background)' }}>

      <div className="container mx-auto px-4 sm:px-6 pb-10 relative z-10 space-y-6 pt-6">

        {/* ── HERO HEADER — warm paper, serif heading ── */}
        <header className="bn-surface overflow-hidden" style={{ borderRadius: 'var(--brand-radius-lg)' }}>
          <div className="flex flex-col md:flex-row items-center gap-6 p-6 md:p-8">
            <div className="flex-1">
              <span className="bn-tag-subtle mb-3">Soft essentials</span>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2" style={{ color: 'var(--brand-ink-brown)' }}>
                Banimal
              </h1>
              <p className="text-base max-w-xl mb-5" style={{ color: 'var(--brand-muted-foreground)' }}>
                Thoughtful essentials for soft beginnings. A gentle, considered platform for brands, commerce and operations — made to be lived in and loved long.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/Marketplace" className="bn-primary">
                  Browse softly
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                </Link>
                <Link to="/BanimalDashboard" className="bn-outline">
                  See essentials
                </Link>
              </div>
            </div>
            <div className="shrink-0">
              <img src={BANIMAL_LOGO} alt="Banimal logo" className="w-32 h-32 md:w-40 md:h-40 object-contain" />
            </div>
          </div>
        </header>

        {/* ── SEEDWAVE CORE BRAND HEADER — teal color block ── */}
        <header className="bn-section-teal relative overflow-hidden" style={{ borderRadius: 'var(--brand-radius-lg)', boxShadow: 'var(--brand-shadow)' }}>
          <div className="px-6 pt-6 pb-3 relative z-10">
            <span className="bn-tag-ghost mb-2">Seedwave™ Admin Portal</span>
            {coreBrand ? (
              <>
                <div className="flex items-baseline gap-3 flex-wrap mb-1 mt-3">
                  <h2 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: 'var(--brand-on-primary)' }}>
                    {coreBrand.name}™
                  </h2>
                  {coreBrand.sector && (
                    <span className="text-sm font-semibold capitalize" style={{ color: 'rgba(255,255,255,0.85)' }}>{SECTORS[coreBrand.sector] || coreBrand.sector}</span>
                  )}
                  {coreBrand.isSystemBrand && (
                    <span className="bn-tag-ghost">Core Brand</span>
                  )}
                </div>
                {coreBrand.description && (
                  <p className="text-sm max-w-2xl line-clamp-1" style={{ color: 'rgba(255,255,255,0.75)' }}>{coreBrand.description}</p>
                )}
                {coreSubnodes.length > 0 && (
                  <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.65)' }}>{coreSubnodes.length} subnodes active</p>
                )}
              </>
            ) : (
              <h2 className="text-3xl font-bold mt-3" style={{ color: 'var(--brand-on-primary)' }}>🦁 Seedwave™ Core</h2>
            )}
          </div>
          {coreSubnodes.length > 0 && (
            <div className="overflow-hidden border-t relative" style={{ height: '38px', borderColor: 'rgba(255,255,255,0.2)' }}>
              <style>{`@keyframes marqueeScroll{0%{transform:translateX(0)}100%{transform:translateX(-33.333%)}}`}</style>
              <div className="flex items-center gap-10 absolute top-0 bottom-0 whitespace-nowrap" style={{ animation: 'marqueeScroll 35s linear infinite' }}>
                {[...coreSubnodes, ...coreSubnodes, ...coreSubnodes].map((node, i) => (
                  <span key={i} className="text-xs font-bold flex items-center gap-2 shrink-0" style={{ color: 'rgba(255,255,255,0.8)' }}>
                    <span className="text-[10px]">✦</span>{node}
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
        <div className="bn-surface overflow-hidden">
          <div className="px-5 pt-5 pb-3">
            <p className="text-xs font-bold uppercase tracking-[0.2em] mb-1" style={{ color: 'var(--brand-primary)' }}>Platform Navigation</p>
            <p className="text-sm" style={{ color: 'var(--brand-muted-foreground)' }}>{PAGE_GROUPS.reduce((s, g) => s + g.pages.length, 0)} pages across {PAGE_GROUPS.length} categories</p>
          </div>

          {/* Category tab strip */}
          <div className="overflow-x-auto border-b" style={{ borderColor: 'var(--brand-soft-border)' }}>
            <div className="flex min-w-max px-4 gap-1 py-2">
              {PAGE_GROUPS.map(group => (
                <button
                  key={group.id}
                  onClick={() => setActivePageTab(group.id)}
                  className="px-4 py-2 text-sm font-semibold whitespace-nowrap transition-all"
                  style={{
                    borderRadius: 'var(--brand-radius-full)',
                    background: activePageTab === group.id ? 'var(--brand-primary)' : 'transparent',
                    color: activePageTab === group.id ? 'var(--brand-on-primary)' : 'var(--brand-muted-foreground)',
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
          <div className="bn-surface overflow-hidden">
            <div className="px-4 pt-4 pb-2">
              <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--brand-primary)' }}>Brand & Sector Management</p>
            </div>
            <div className="overflow-x-auto">
              <TabsList className="flex min-w-max gap-1 px-4 pb-3 h-auto bg-transparent">
                <TabsTrigger value="admin" className="font-semibold whitespace-nowrap" style={{ borderRadius: 'var(--brand-radius-full)' }}>⚙️ Admin Panel</TabsTrigger>
                <TabsTrigger value="blockvault" className="font-semibold whitespace-nowrap" style={{ borderRadius: 'var(--brand-radius-full)' }}>🔐 BlockVault</TabsTrigger>
                <TabsTrigger value="fruitfulcoffee" className="font-semibold whitespace-nowrap" style={{ borderRadius: 'var(--brand-radius-full)' }}>☕ Fruitful Coffee</TabsTrigger>
                <TabsTrigger value="collaborations" className="font-semibold whitespace-nowrap" style={{ borderRadius: 'var(--brand-radius-full)' }}>🤝 Collaborations</TabsTrigger>
                {Object.entries(SECTORS).map(([key, label]) => (
                  <TabsTrigger key={key} value={key} className="text-sm font-medium whitespace-nowrap" style={{ borderRadius: 'var(--brand-radius-full)' }}>
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
            <div className="bn-surface p-6">
              <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--brand-ink-brown)' }}>All Brands Overview</h2>
              {brands.length === 0 ? (
                <p style={{ color: 'var(--brand-muted-foreground)' }}>No brands yet. Add via admin panel above.</p>
              ) : (
                <div className="space-y-4">
                  {Object.entries(SECTORS).map(([sectorKey, sectorName]) => {
                    const sectorBrands = getBrandsBySector(sectorKey);
                    if (sectorBrands.length === 0) return null;
                    return (
                      <div key={sectorKey} className="border-b pb-4 last:border-b-0" style={{ borderColor: 'var(--brand-soft-border)' }}>
                        <h3 className="font-semibold text-sm mb-2" style={{ color: 'var(--brand-primary)' }}>{sectorName}</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                          {sectorBrands.map(brand => (
                            <div key={brand.id} className="p-2.5 text-xs" style={{ borderRadius: 'var(--brand-radius-sm)', background: 'var(--brand-warm-cream)', border: '1px solid var(--brand-soft-border)' }}>
                              <span className="font-bold" style={{ color: 'var(--brand-ink-brown)' }}>{brand.name}™</span>
                              <div className="mt-0.5" style={{ color: 'var(--brand-muted-foreground)' }}>{brand.subnodes?.length || 0} subnodes</div>
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

          <TabsContent value="blockvault" className="space-y-6">
            <BlockVaultAdmin />
          </TabsContent>

          <TabsContent value="fruitfulcoffee" className="space-y-4">
            <div className="bn-surface overflow-hidden">
              <div className="p-6 flex flex-col md:flex-row items-center gap-6">
                <img src="https://media.base44.com/images/public/6953a072de46207f94f2b9d2/4be882485_PHOTO-2023-06-19-06-55-454_1754425495817.jpg" alt="Kiosk" className="w-32 h-32 object-cover" style={{ borderRadius: 'var(--brand-radius-md)' }} />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--brand-ink-brown)' }}>☕ Fruitful Coffee — Kiosk Costing Engine</h2>
                  <p className="text-sm mb-4" style={{ color: 'var(--brand-muted-foreground)' }}>Full BOM costing, monthly profit projections (22 months), food menu pricing & Guangzhou→Johannesburg kiosk shipping estimate (R58,510 incl. VAT).</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bn-tag-subtle">R14.16 BOM per cup</span>
                    <span className="bn-tag-subtle">64.6% coffee margin</span>
                    <span className="bn-tag-subtle">~R20k/mo net profit</span>
                    <span className="bn-tag-subtle">R58,510 landed kiosk</span>
                  </div>
                  <Link to="/FruitfulCoffee" className="bn-primary">
                    Open Coffee Dashboard
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                  </Link>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="collaborations" className="space-y-6">
            <CollaborationManager />
          </TabsContent>

          {Object.entries(SECTORS).map(([sectorKey, sectorName]) => (
            <TabsContent key={sectorKey} value={sectorKey}>
              <div className="bn-surface p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold" style={{ color: 'var(--brand-ink-brown)' }}>{sectorName}</h2>
                  <span className="bn-tag-subtle">{getBrandsBySector(sectorKey).length} brands</span>
                </div>
                {getBrandsBySector(sectorKey).length === 0 ? (
                  <p className="text-center py-8 text-sm" style={{ color: 'var(--brand-muted-foreground)' }}>No brands in this sector yet.</p>
                ) : (
                  <SectorGrid brands={getBrandsBySector(sectorKey)} sectorKey={sectorKey} sectorName={sectorName} />
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Footer — warm, brand voice */}
      <footer className="border-t py-8 mt-8" style={{ background: 'var(--brand-warm-paper)', borderColor: 'var(--brand-soft-border)' }}>
        <div className="container mx-auto px-6 text-center">
          <img src={BANIMAL_LOGO} alt="Banimal" className="h-8 w-auto object-contain mx-auto mb-3" />
          <p className="text-sm font-medium" style={{ color: 'var(--brand-ink-brown)' }}>Thoughtful essentials for soft beginnings.</p>
          <p className="text-xs mt-1" style={{ color: 'var(--brand-muted-foreground)' }}>© 2026 Fruitful Holdings (Pty) Ltd · Seeds of Appreciation</p>
        </div>
      </footer>
    </div>
  );
}

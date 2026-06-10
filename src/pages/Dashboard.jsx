import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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

export default function Dashboard() {
  const [selectedSector, setSelectedSector] = useState('admin');
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

  // Core brand: prefer isSystemBrand, else most subnodes
  const coreBrand = brands.find(b => b.isSystemBrand)
    || [...brands].sort((a, b) => (b.subnodes?.length || 0) - (a.subnodes?.length || 0))[0]
    || null;
  const coreSubnodes = coreBrand?.subnodes || [];

  const getBrandsBySector = (sectorKey) => brands.filter(b => b.sector === sectorKey);

  const handleBrandAdded = () => {
    queryClient.invalidateQueries({ queryKey: ['brands'] });
  };

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

      {/* Main Header — clean, proportioned */}
      <header className="relative overflow-hidden border-b border-[#00ff9920]" style={{ background: '#011f0e' }}>
        <div className="container mx-auto px-6 py-8 relative z-10">
          <div className="flex items-center gap-5">
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6953a072de46207f94f2b9d2/52acd159d_Chief_02_1753263376705.png"
              alt="FAA Chief"
              className="w-14 h-14 object-contain rounded-xl"
              style={{ filter: 'drop-shadow(0 0 10px #00ffc855)' }}
            />
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: '#00ffc8', textShadow: '0 0 12px #00ffcc66' }}>
                FAA.ZONE™
              </h1>
              <p className="text-xs font-semibold mt-0.5" style={{ color: '#9dfcdc99' }}>
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

      <div className="container mx-auto px-4 sm:px-6 pb-12 relative z-10">

        {/* ── SMART GRID SCROLL BLOCKS — Fruitful Global Planet (subtle) ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-6">
          {[
            { emoji: '🌀', title: 'Enter Grid', desc: 'Navigate the full 2.3M item index' },
            { emoji: '🔍', title: 'Explore Industries', desc: 'Every scroll-certified category' },
            { emoji: '🌱', title: 'Deploy Brand', desc: 'Start your vault-verified product' },
            { emoji: '⚙️', title: 'API Config', desc: 'PulseTrade, ClaimRoot, HSOMNI9000' },
            { emoji: '🧬', title: 'Treaty Brands', desc: 'Biowave ancestral scroll commerce' },
            { emoji: '📦', title: 'Logistics', desc: 'Vault-locked token routing' },
            { emoji: '🌿', title: 'Bioregional', desc: 'Root-based pulse-verified goods' },
            { emoji: '📚', title: 'Scroll Library', desc: 'Glyphs, treaties & signals' },
          ].map(({ emoji, title, desc }) => (
            <div key={title}
              className="rounded-xl p-4 border-l-2 transition-all duration-300 hover:scale-[1.02] cursor-default"
              style={{ background: 'rgba(0,70,35,0.55)', borderColor: '#00ff99', boxShadow: '0 0 10px rgba(0,255,160,0.12)' }}>
              <p className="text-lg mb-1">{emoji} <span className="font-bold text-sm" style={{ color: '#b5ffe5' }}>{title}</span></p>
              <p className="text-[11px] leading-relaxed" style={{ color: '#9dfcdc80' }}>{desc}</p>
            </div>
          ))}
        </div>

        {/* ── SEEDWAVE CORE BRAND HEADER ── */}
        <header className="text-white mb-8 shadow-xl rounded-2xl relative overflow-hidden border border-purple-500/30" style={{ background: 'linear-gradient(135deg, #2d1b69, #1e3a5f, #1a1a2e)' }}>
          {/* Dot grid */}
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #a855f7 1px, transparent 0)', backgroundSize: '28px 28px' }} />
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute right-5 top-1/2 -translate-y-1/2 opacity-20">
            <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6953a072de46207f94f2b9d2/4540be9bd_Monster_01_1753263376704.png" alt="" className="w-24 h-24 object-contain" />
          </div>

          {/* Core brand identity */}
          <div className="px-6 pt-6 pb-3 relative z-10">
            <p className="text-purple-400 text-xs font-bold tracking-[0.3em] uppercase mb-2">✦ Seedwave™ Admin Portal</p>
            {coreBrand ? (
              <>
                <div className="flex items-baseline gap-3 flex-wrap mb-1">
                  <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
                    {coreBrand.name}™
                  </h1>
                  {coreBrand.sector && (
                    <span className="text-purple-300 text-sm font-semibold capitalize">
                      {SECTORS[coreBrand.sector] || coreBrand.sector}
                    </span>
                  )}
                  {coreBrand.isSystemBrand && (
                    <span className="text-[10px] bg-purple-600/40 border border-purple-500/50 text-purple-200 rounded-full px-2 py-0.5 font-bold uppercase tracking-wider">Core Brand</span>
                  )}
                </div>
                {coreBrand.description && (
                  <p className="text-purple-200/60 text-sm max-w-2xl line-clamp-1">{coreBrand.description}</p>
                )}
                {/* Subnode count badge */}
                {coreSubnodes.length > 0 && (
                  <p className="text-purple-400/60 text-xs mt-1">{coreSubnodes.length} subnodes active</p>
                )}
              </>
            ) : (
              <h1 className="text-3xl font-black text-white">🦁 Seedwave™ Core</h1>
            )}
          </div>

          {/* Flying subnodes ticker — real subnode names from the core brand */}
          {coreSubnodes.length > 0 && (
            <div className="overflow-hidden border-t border-purple-500/20 relative" style={{ height: '38px' }}>
              <style>{`
                @keyframes marqueeScroll {
                  0%   { transform: translateX(0); }
                  100% { transform: translateX(-33.333%); }
                }
              `}</style>
              <div
                className="flex items-center gap-10 absolute top-0 bottom-0 whitespace-nowrap"
                style={{ animation: 'marqueeScroll 35s linear infinite' }}
              >
                {[...coreSubnodes, ...coreSubnodes, ...coreSubnodes].map((node, i) => (
                  <span key={i} className="text-xs font-bold text-purple-300/80 flex items-center gap-2 shrink-0">
                    <span className="text-purple-500 text-[10px]">✦</span>
                    {node}
                  </span>
                ))}
              </div>
            </div>
          )}
        </header>

        {/* Metrics Cards */}
        <MetricsCards metrics={metrics} />

        {/* License Value Projection */}
        <LicenseProjection />

        {/* Main Tabs */}
        <Tabs value={selectedSector} onValueChange={setSelectedSector} className="space-y-6">

          {/* ── PAGE NAVIGATION GRID ── */}
          <div className="rounded-2xl shadow-xl border p-5" style={{ background: 'rgba(0,40,20,0.7)', borderColor: '#00ff9930' }}>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-4" style={{ color: '#00ffc8' }}>✦ Platform Navigation — All Pages</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
              {[
                { href: '/Marketplace',            emoji: '🛍️', label: 'Marketplace',     bg: '#7c3aed' },
                { href: '/ArtisanShop',            emoji: '🎨', label: 'Artisan Shop',     bg: '#db2777' },
                { href: '/SubscriptionShop',       emoji: '🛒', label: 'Sub Shop',         bg: '#e11d48' },
                { href: '/GrandMashadlelaCollection', emoji: '🎩', label: 'Mashadlela',    bg: '#b45309' },
                { href: '/Banimal',                emoji: '🐾', label: 'Banimal™',         bg: '#ea580c' },
                { href: '/BanimalDashboard',       emoji: '🦁', label: 'Banimal Dash',     bg: '#dc2626' },
                { href: '/VaultMesh',              emoji: '🔐', label: 'VaultMesh™',       bg: '#059669' },
                { href: '/Payments',               emoji: '💳', label: 'Payments',         bg: '#2563eb' },
                { href: '/AppBuilder',             emoji: '🏗️', label: 'App Builder',      bg: '#6d28d9' },
                { href: '/EcosystemExplorer',      emoji: '🌐', label: 'Ecosystem',        bg: '#0d9488' },
                { href: '/Analytics',              emoji: '📊', label: 'Analytics',        bg: '#0891b2' },
                { href: '/SectorAnalytics',        emoji: '📈', label: 'Sector Stats',     bg: '#0369a1' },
                { href: '/CollaborationSuite',     emoji: '🤝', label: 'Collab Suite',     bg: '#4f46e5' },
                { href: '/LoyaltyProgram',         emoji: '🏆', label: 'Loyalty',          bg: '#ca8a04' },
                { href: '/MySubscriptions',        emoji: '💎', label: 'My Plans',         bg: '#65a30d' },
                { href: '/ArtisanDashboard',       emoji: '🖌️', label: 'My Shop',          bg: '#c026d3' },
                { href: '/ArtisanFinancials',      emoji: '💰', label: 'Financials',       bg: '#16a34a' },
                { href: '/OrderHistory',           emoji: '📦', label: 'Orders',           bg: '#c2410c' },
                { href: '/OrderDashboard',         emoji: '🚚', label: 'Order Dash',       bg: '#b91c1c' },
                { href: '/OrderFulfillment',       emoji: '📋', label: 'Fulfillment',      bg: '#475569' },
                { href: '/Messages',               emoji: '💬', label: 'Messages',         bg: '#1d4ed8' },
                { href: '/Wishlist',               emoji: '❤️', label: 'Wishlist',         bg: '#be185d' },
                { href: '/SubscriptionBoxes',      emoji: '🎁', label: 'Sub Boxes',        bg: '#7e22ce' },
                { href: '/DiscoveryEngine',        emoji: '🔍', label: 'Discovery',        bg: '#0f766e' },
                { href: '/MarketIntelligence',     emoji: '🧠', label: 'Intelligence',     bg: '#3730a3' },
                { href: '/AutomationEngine',       emoji: '⚡', label: 'Automation',       bg: '#0e7490' },
                { href: '/GlobalBrandMap',         emoji: '🗺️', label: 'Global Map',       bg: '#047857' },
                { href: '/VideoScriptStudio',      emoji: '🎬', label: 'Video Studio',     bg: '#991b1b' },
                { href: '/AssetLibrary',           emoji: '🖼️', label: 'Asset Library',    bg: '#92400e' },
                { href: '/ContentGenerator',       emoji: '✍️', label: 'AI Content',       bg: '#5b21b6' },
                { href: '/BrandOnboarding',        emoji: '🏢', label: 'Onboard Brand',    bg: '#075985' },
                { href: '/Gallery',                emoji: '🎭', label: 'Gallery',          bg: '#86198f' },
                { href: '/AdminSeedwave',          emoji: '🛡️', label: 'Seedwave Admin',   bg: '#334155' },
                { href: '/SectorAdminHub',         emoji: '⚙️', label: 'Sector Hub',       bg: '#374151' },
                { href: '/DataSyncCenter',         emoji: '🔄', label: 'Data Sync',        bg: '#1f2937' },
                { href: '/CSVImport',              emoji: '📤', label: 'CSV Import',       bg: '#0f766e' },
                { href: '/PulseTradeAnalytics',    emoji: '⚡', label: 'PulseTrade',       bg: '#78350f' },
                { href: '/BrandNodeExplorer',      emoji: '🌿', label: 'Brand Explorer',   bg: '#134e4a' },
                { href: '/CareGrainsMap',          emoji: '🖤', label: 'Care Grains',      bg: '#1c1917' },
                { href: '/ShananaCheckout',        emoji: '🐘', label: 'Shanana™',         bg: '#064e3b' },
                { href: '/FruitfulKiosk',          emoji: '☕', label: 'Kiosk',            bg: '#78350f' },
                { href: '/HomemartListing',        emoji: '🏠', label: 'Homemart',         bg: '#9a3412' },
              ].map(({ href, emoji, label, bg }) => (
                <a key={href} href={href} className="group block">
                  <div
                    className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl text-white text-center transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95 cursor-pointer"
                    style={{ backgroundColor: bg }}
                  >
                    <span className="text-2xl leading-none">{emoji}</span>
                    <span className="text-[10px] font-bold leading-tight tracking-wide">{label}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* ── SECTOR TABS ── */}
          <TabsList className="flex flex-wrap gap-2 h-auto p-4 rounded-xl shadow-xl border" style={{ background: 'rgba(0,30,15,0.8)', borderColor: '#00ff9930' }}>
            <TabsTrigger value="admin" className="data-[state=active]:bg-emerald-700 data-[state=active]:text-white font-semibold text-slate-300">⚙️ Admin Panel</TabsTrigger>
            <TabsTrigger value="collaborations" className="data-[state=active]:bg-emerald-700 data-[state=active]:text-white font-semibold text-slate-300">🤝 Collaborations</TabsTrigger>
            {Object.entries(SECTORS).map(([key, label]) => (
              <TabsTrigger key={key} value={key} className="data-[state=active]:bg-emerald-700 data-[state=active]:text-white text-sm font-medium text-slate-400">
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="admin" className="space-y-6">
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
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
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
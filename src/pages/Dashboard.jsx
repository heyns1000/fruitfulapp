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
import BrandHealthAudit from '../components/admin/BrandHealthAudit';
import ZeroWasteExporter from '../components/data/ZeroWasteExporter';
import { Link } from 'react-router-dom';
import {
  Loader2, Sprout, Wheat, Landmark, PenTool, Package, GraduationCap, Scissors,
  Gamepad2, Brain, Building2, Scale, BookOpen, Network, Clapperboard, Apple,
  Cpu, Boxes, Atom, Sparkles, KeyRound, ShoppingBasket, BatteryCharging, Mic,
  Radio, Repeat, School, Recycle, Briefcase, Coins, Pickaxe, Rabbit,
  ShoppingBag, Palette, ShoppingCart, Crown, Home, Coffee, Wallet, PawPrint,
  Baby, Settings, User, Drama, Truck, ClipboardList, MessageSquare, Heart,
  Gem, Gift, Trophy, BarChart3, TrendingUp, Search, Zap, HeartHandshake,
  Globe, Map, Users, FileText, Video, ImageIcon, Lock, CreditCard, Hammer,
  Shield, RefreshCw, Upload, Store, LayoutGrid,
} from 'lucide-react';

const SECTORS = {
  agriculture: { label: 'Agriculture & Biotech', icon: Sprout },
  fsf: { label: 'Food, Soil & Farming', icon: Wheat },
  banking: { label: 'Banking & Finance', icon: Landmark },
  creative: { label: 'Creative Tech', icon: PenTool },
  logistics: { label: 'Logistics & Packaging', icon: Package },
  'education-ip': { label: 'Education & IP', icon: GraduationCap },
  fashion: { label: 'Fashion & Identity', icon: Scissors },
  gaming: { label: 'Gaming & Simulation', icon: Gamepad2 },
  health: { label: 'Health & Hygiene', icon: Brain },
  housing: { label: 'Housing & Infrastructure', icon: Building2 },
  justice: { label: 'Justice & Ethics', icon: Scale },
  knowledge: { label: 'Knowledge & Archives', icon: BookOpen },
  micromesh: { label: 'Micro-Mesh Logistics', icon: Network },
  media: { label: 'Motion, Media & Sonic', icon: Clapperboard },
  nutrition: { label: 'Nutrition & Food Chain', icon: Apple },
  'ai-logic': { label: 'AI, Logic & Grid', icon: Cpu },
  packaging: { label: 'Packaging & Materials', icon: Boxes },
  quantum: { label: 'Quantum Protocols', icon: Atom },
  ritual: { label: 'Ritual & Culture', icon: Sparkles },
  saas: { label: 'SaaS & Licensing', icon: KeyRound },
  trade: { label: 'Trade Systems', icon: ShoppingBasket },
  utilities: { label: 'Utilities & Energy', icon: BatteryCharging },
  voice: { label: 'Voice & Audio', icon: Mic },
  webless: { label: 'Webless Tech & Nodes', icon: Radio },
  nft: { label: 'NFT & Ownership', icon: Repeat },
  'education-youth': { label: 'Education & Youth', icon: School },
  zerowaste: { label: 'Zero Waste', icon: Recycle },
  professional: { label: 'Professional Services', icon: Briefcase },
  'payroll-mining': { label: 'Payroll Mining & Accounting', icon: Coins },
  mining: { label: 'Mining & Resources', icon: Pickaxe },
  wildlife: { label: 'Wildlife & Habitat', icon: Rabbit },
};

// All pages grouped by category for the nav tabs
const PAGE_GROUPS = [
  {
    id: 'commerce',
    label: 'Commerce',
    icon: ShoppingBag,
    pages: [
      { href: '/Marketplace',               icon: ShoppingBag,    label: 'Marketplace' },
      { href: '/ArtisanShop',               icon: Palette,        label: 'Artisan Shop' },
      { href: '/SubscriptionShop',          icon: ShoppingCart,   label: 'Subscription Shop' },
      { href: '/GrandMashadlelaCollection', icon: Crown,          label: 'Grand Mashadlela' },
      { href: '/HomemartListing',           icon: Home,           label: 'Homemart' },
      { href: '/FruitfulKiosk',             icon: Coffee,         label: 'Fruitful Kiosk' },
      { href: '/ShananaCheckout',           icon: Wallet,         label: 'Shanana\u2122' },
      { href: '/Checkout',                  icon: CreditCard,     label: 'Checkout' },
    ],
  },
  {
    id: 'banimal',
    label: 'Banimal',
    icon: PawPrint,
    pages: [
      { href: '/Banimal',          icon: PawPrint,  label: 'Banimal\u2122 Orchestrator' },
      { href: '/BanimalDashboard', icon: LayoutGrid, label: 'Banimal Dashboard' },
      { href: '/BanimalStore',     icon: Baby,      label: 'Banimal Store' },
      { href: '/BanimalAdmin',     icon: Settings,  label: 'Banimal Admin' },
    ],
  },
  {
    id: 'artisan',
    label: 'Artisan',
    icon: PenTool,
    pages: [
      { href: '/ArtisanDashboard',  icon: Palette,    label: 'My Artisan Shop' },
      { href: '/ArtisanFinancials', icon: Wallet,     label: 'Artisan Financials' },
      { href: '/ArtisanProfile',    icon: User,       label: 'Artisan Profile' },
      { href: '/Gallery',           icon: Drama,      label: 'Gallery' },
    ],
  },
  {
    id: 'orders',
    label: 'Orders',
    icon: Package,
    pages: [
      { href: '/OrderHistory',     icon: Package,        label: 'Order History' },
      { href: '/OrderDashboard',   icon: Truck,          label: 'Order Dashboard' },
      { href: '/OrderFulfillment', icon: ClipboardList,  label: 'Fulfillment' },
      { href: '/Messages',         icon: MessageSquare,  label: 'Messages' },
      { href: '/Wishlist',         icon: Heart,          label: 'Wishlist' },
    ],
  },
  {
    id: 'subscriptions',
    label: 'Subscriptions',
    icon: Gem,
    pages: [
      { href: '/MySubscriptions',   icon: Gem,     label: 'My Plans' },
      { href: '/SubscriptionBoxes', icon: Gift,    label: 'Sub Boxes' },
      { href: '/LoyaltyProgram',    icon: Trophy,  label: 'Loyalty Program' },
    ],
  },
  {
    id: 'intelligence',
    label: 'Intelligence',
    icon: BarChart3,
    pages: [
      { href: '/Analytics',           icon: BarChart3,  label: 'Analytics' },
      { href: '/SectorAnalytics',     icon: TrendingUp, label: 'Sector Analytics' },
      { href: '/MarketIntelligence',  icon: Brain,      label: 'Market Intel' },
      { href: '/DiscoveryEngine',     icon: Search,     label: 'Discovery Engine' },
      { href: '/PulseTradeAnalytics', icon: Zap,        label: 'PulseTrade' },
      { href: '/CareGrainsMap',       icon: Map,        label: 'Care Grains Map' },
    ],
  },
  {
    id: 'brands',
    label: 'Brands & Ecosystem',
    icon: Sprout,
    pages: [
      { href: '/BrandOnboarding',    icon: Building2,       label: 'Onboard Brand' },
      { href: '/BrandNodeExplorer',  icon: Network,         label: 'Brand Explorer' },
      { href: '/EcosystemExplorer',  icon: Globe,           label: 'Ecosystem' },
      { href: '/GlobalBrandMap',     icon: Map,             label: 'Global Brand Map' },
      { href: '/CollaborationSuite', icon: HeartHandshake,  label: 'Collab Suite' },
    ],
  },
  {
    id: 'creative',
    label: 'Creative',
    icon: Clapperboard,
    pages: [
      { href: '/ContentGenerator',  icon: FileText,   label: 'AI Content' },
      { href: '/VideoScriptStudio', icon: Video,      label: 'Video Studio' },
      { href: '/AssetLibrary',      icon: ImageIcon,  label: 'Asset Library' },
    ],
  },
  {
    id: 'infrastructure',
    label: 'Infrastructure',
    icon: Lock,
    pages: [
      { href: '/VaultMesh',       icon: Lock,        label: 'VaultMesh\u2122' },
      { href: '/Payments',        icon: CreditCard,  label: 'Payments' },
      { href: '/AppBuilder',      icon: Hammer,      label: 'App Builder', subbrand: true },
      { href: '/AutomationEngine', icon: Zap,        label: 'Automation' },
    ],
  },
  {
    id: 'admin',
    label: 'Admin',
    icon: Shield,
    pages: [
      { href: '/AdminSeedwave',  icon: Shield,    label: 'Seedwave Admin' },
      { href: '/SectorAdminHub', icon: Settings,  label: 'Sector Hub' },
      { href: '/DataSyncCenter', icon: RefreshCw, label: 'Data Sync' },
      { href: '/CSVImport',      icon: Upload,    label: 'CSV Import' },
    ],
  },
];

function PageGrid({ pages }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {pages.map(({ href, icon: Icon, label, subbrand }) => (
        <Link key={href} to={href} className="group block">
          <div
            className={`flex flex-col items-center justify-center gap-2.5 p-4 rounded-xl text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-95 cursor-pointer min-h-[92px] border ${
              subbrand
                ? 'bg-hotstack-ember/10 border-hotstack-ember/30 hover:border-hotstack-ember/60'
                : 'bg-card border-border hover:border-primary/40'
            }`}
          >
            <span className={`flex items-center justify-center w-10 h-10 rounded-lg ${subbrand ? 'bg-hotstack-ember/15 text-hotstack-ember' : 'bg-primary/10 text-primary'}`}>
              <Icon className="w-5 h-5" strokeWidth={2} />
            </span>
            <span className="text-[11px] font-bold leading-tight tracking-wide text-foreground">{label}</span>
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
    queryFn: () => base44.entities.Brand.list('-updated_date'),
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
      scrollGridIndex: totalBrands + totalNodes,
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
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">

      {/* ── MAIN HEADER ── */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6953a072de46207f94f2b9d2/52acd159d_Chief_02_1753263376705.png"
              alt="FAA Chief emblem"
              className="w-12 h-12 object-contain rounded-xl bg-primary/5 p-1"
            />
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-primary">
                FAA.ZONE&trade;
              </h1>
              <p className="text-xs font-medium mt-0.5 text-muted-foreground">
                Financial Allocation Architecture &middot; Seeds of Appreciation &middot; Live Grid
              </p>
            </div>
            <div className="ml-auto hidden sm:flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs font-bold text-muted-foreground">Pulse Grid Active</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 pb-12 space-y-8 pt-6">

        {/* ── SEEDWAVE CORE BRAND HEADER ── */}
        <section className="rounded-2xl relative overflow-hidden border border-border bg-gradient-to-br from-fruitful-teal via-fruitful-teal-deep to-fruitful-green shadow-sm">
          <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #ffffff 1px, transparent 0)', backgroundSize: '28px 28px' }} />
          <div className="px-6 pt-6 pb-4 relative">
            <p className="text-white/80 text-xs font-bold tracking-[0.3em] uppercase mb-2">Seedwave&trade; Admin Portal</p>
            {coreBrand ? (
              <>
                <div className="flex items-baseline gap-3 flex-wrap mb-1">
                  <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                    {coreBrand.name}&trade;
                  </h2>
                  {coreBrand.sector && (
                    <span className="text-fruitful-mint text-sm font-semibold capitalize">
                      {SECTORS[coreBrand.sector]?.label || coreBrand.sector}
                    </span>
                  )}
                  {coreBrand.isSystemBrand && (
                    <span className="text-[10px] bg-white/20 border border-white/30 text-white rounded-full px-2 py-0.5 font-bold uppercase tracking-wider">Core Brand</span>
                  )}
                </div>
                {coreBrand.description && (
                  <p className="text-white/70 text-sm max-w-2xl line-clamp-1">{coreBrand.description}</p>
                )}
                {coreSubnodes.length > 0 && (
                  <p className="text-white/60 text-xs mt-1">{coreSubnodes.length} subnodes active</p>
                )}
              </>
            ) : (
              <h2 className="text-3xl font-black text-white">Seedwave&trade; Core</h2>
            )}
          </div>
          {coreSubnodes.length > 0 && (
            <div className="overflow-hidden border-t border-white/15 relative" style={{ height: '38px' }}>
              <style>{`@keyframes marqueeScroll{0%{transform:translateX(0)}100%{transform:translateX(-33.333%)}}`}</style>
              <div className="flex items-center gap-10 absolute top-0 bottom-0 whitespace-nowrap" style={{ animation: 'marqueeScroll 35s linear infinite' }}>
                {[...coreSubnodes, ...coreSubnodes, ...coreSubnodes].map((node, i) => (
                  <span key={i} className="text-xs font-bold text-white/80 flex items-center gap-2 shrink-0">
                    <Sparkles className="w-3 h-3 text-fruitful-mint" />{node}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* ── METRICS ── */}
        <MetricsCards metrics={metrics} />
        <LicenseProjection />

        {/* ═══ PAGE NAVIGATION — tabbed by category ═══ */}
        <div className="rounded-2xl shadow-sm border border-border overflow-hidden bg-card">
          <div className="px-5 pt-5 pb-3">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] mb-1 text-primary">Platform Navigation</p>
            <p className="text-xs text-muted-foreground">{PAGE_GROUPS.reduce((s, g) => s + g.pages.length, 0)} pages across {PAGE_GROUPS.length} categories</p>
          </div>

          {/* Category tab strip */}
          <div className="overflow-x-auto border-b border-border">
            <div className="flex min-w-max px-4 gap-1 py-2">
              {PAGE_GROUPS.map(group => {
                const GroupIcon = group.icon;
                const active = activePageTab === group.id;
                return (
                  <button
                    key={group.id}
                    onClick={() => setActivePageTab(group.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${
                      active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    <GroupIcon className="w-4 h-4" />
                    {group.label}
                  </button>
                );
              })}
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

        {/* ═══ SECTOR / ADMIN TABS (brands by sector) ═══ */}
        <Tabs value={activeSectorTab} onValueChange={setActiveSectorTab} className="space-y-4">
          <div className="rounded-xl border border-border overflow-hidden bg-card">
            <div className="px-4 pt-4 pb-2">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Brand &amp; Sector Management</p>
            </div>
            <div className="overflow-x-auto">
              <TabsList className="flex min-w-max gap-1 px-4 pb-3 h-auto bg-transparent">
                <TabsTrigger value="admin" className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold text-muted-foreground whitespace-nowrap">
                  <Settings className="w-4 h-4" />Admin Panel
                </TabsTrigger>
                <TabsTrigger value="collaborations" className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold text-muted-foreground whitespace-nowrap">
                  <HeartHandshake className="w-4 h-4" />Collaborations
                </TabsTrigger>
                {Object.entries(SECTORS).map(([key, { label, icon: SectorIcon }]) => (
                  <TabsTrigger key={key} value={key} className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-sm font-medium text-muted-foreground whitespace-nowrap">
                    <SectorIcon className="w-4 h-4" />{label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </div>

          <TabsContent value="admin" className="space-y-6">
            <BrandHealthAudit />
            <BulkOperations />
            <ZeroWasteExporter />
            <CompleteDataExporter />
            <DataExporter />
            <DataSeeder />
            <AdminPanel onBrandAdded={handleBrandAdded} />
            <BrandManager />
            <div className="rounded-xl border border-border p-6 bg-card">
              <h2 className="text-lg font-black mb-4 flex items-center gap-2 text-foreground">
                <BarChart3 className="w-5 h-5 text-primary" />All Brands Overview
              </h2>
              {brands.length === 0 ? (
                <p className="text-muted-foreground">No brands yet. Add via admin panel above.</p>
              ) : (
                <div className="space-y-4">
                  {Object.entries(SECTORS).map(([sectorKey, { label: sectorName, icon: SectorIcon }]) => {
                    const sectorBrands = getBrandsBySector(sectorKey);
                    if (sectorBrands.length === 0) return null;
                    return (
                      <div key={sectorKey} className="border-b border-border pb-4 last:border-b-0">
                        <h3 className="font-semibold text-sm mb-2 flex items-center gap-2 text-foreground">
                          <SectorIcon className="w-4 h-4 text-primary" />{sectorName}
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                          {sectorBrands.map(brand => (
                            <div key={brand.id} className="rounded-lg p-2 text-xs bg-muted border border-border">
                              <span className="font-bold text-foreground">{brand.name}&trade;</span>
                              <div className="mt-0.5 text-muted-foreground">{brand.subnodes?.length || 0} subnodes</div>
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

          {Object.entries(SECTORS).map(([sectorKey, { label: sectorName }]) => (
            <TabsContent key={sectorKey} value={sectorKey}>
              <div className="rounded-xl border border-border p-6 bg-card">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-black text-foreground">{sectorName}</h2>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary/10 text-primary">{getBrandsBySector(sectorKey).length} brands</span>
                </div>
                {getBrandsBySector(sectorKey).length === 0 ? (
                  <p className="text-center py-8 text-sm text-muted-foreground">No brands in this sector yet.</p>
                ) : (
                  <SectorGrid brands={getBrandsBySector(sectorKey)} sectorKey={sectorKey} sectorName={sectorName} />
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-8 text-center bg-card">
        <p className="text-xs flex items-center justify-center gap-1.5 text-muted-foreground">
          <Shield className="w-3.5 h-3.5 text-primary" />
          Powered by HSOMNI9000 &middot; FAA.Zone Grid Protocol &middot; ScrollGrid &middot; PulseTrade Certified &middot; TreatyMesh Validated
        </p>
        <p className="text-xs mt-1 text-muted-foreground/70">&copy; 2026 Fruitful Holdings (Pty) Ltd &middot; Seeds of Appreciation &middot; Glyphs Pulse Every 9s</p>
      </footer>
    </div>
  );
}

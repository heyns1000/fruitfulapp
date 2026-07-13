import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import {
  TrendingUp, Package, CreditCard, Download, Shield, Search, BarChart2, Globe, Zap,
  AlertTriangle, CheckCircle, Clock, ArrowRight, ChevronDown, ChevronUp, Sparkles, Loader2,
  Database, Code, ShoppingCart, Star, Lock
} from 'lucide-react';

const GAP_DATA = [
  { id: 1, title: 'Unified Product Database', severity: 'critical', impact: 'HIGH', effort: 'Medium', priority: 'P1', status: 'missing', icon: Database, existing: 'MarketplaceService entity exists (limited fields)', needed: 'Full product registry: pricing tiers, download_url, version, documentation_url, features[], screenshots', appFiles: ['base44/entities/MarketplaceService.jsonc', 'src/components/marketplace/ServiceMarketplace.jsx'], action: 'Expand MarketplaceService entity + enrich ServiceMarketplace component with full product detail views' },
  { id: 2, title: 'Complete Pricing Models', severity: 'critical', impact: 'HIGH', effort: 'Low', priority: 'P1', status: 'partial', icon: CreditCard, existing: 'MarketplaceService.pricing has USD/ZAR/EUR/GBP/NGN/KES fields. Subscription entity has plan tiers.', needed: 'Free/Starter/Pro/Enterprise tier structure. pricingFormula ZAR ex-works model already in src/lib/pricingFormula.js', appFiles: ['src/lib/pricingFormula.js', 'base44/entities/Subscription.jsonc', 'base44/entities/MarketplaceService.jsonc'], action: 'Wire pricingFormula.js into MarketplaceService checkout. Add tier selector to every product listing.' },
  { id: 3, title: 'Fragmented Checkout', severity: 'critical', impact: 'CRITICAL', effort: 'High', priority: 'P0', status: 'fragmented', icon: ShoppingCart, existing: 'CartContext exists (src/components/cart/CartContext.jsx). ShananaCheckout + BanimalStore + Checkout all use separate flows. Paystack keys exist in secrets.', needed: 'One universal cart → single VaultMesh™ checkout → provider selection (Paystack/Ozow/Yoco) → order', appFiles: ['src/components/cart/CartContext.jsx', 'src/pages/Checkout.jsx', 'src/pages/BanimalStore.jsx', 'src/pages/ShananaCheckout.jsx', 'src/components/payments/PaymentGateway.jsx'], action: 'Consolidate all checkout flows. CartContext already provides the state layer. PaymentGateway component needs VaultMesh router added on top.' },
  { id: 4, title: 'Download / License Delivery', severity: 'critical', impact: 'CRITICAL', effort: 'High', priority: 'P0', status: 'missing', icon: Download, existing: 'VaultItem entity exists. AssetLibrary entity has fileUrl. No automated license generation or download manager.', needed: 'Post-purchase: generate license key → store in VaultItem → send email with download link via Core.SendEmail', appFiles: ['base44/entities/VaultItem.jsonc', 'base44/entities/AssetLibrary.jsonc', 'base44/entities/Order.jsonc'], action: 'Add downloadUrl + licenseKey fields to Order entity. Backend function: generateLicenseAndDeliver() — triggers on Order.paymentStatus = paid.' },
  { id: 5, title: 'Order Management Pipeline', severity: 'high', impact: 'HIGH', effort: 'Medium', priority: 'P1', status: 'partial', icon: Package, existing: 'Order entity fully designed with statusHistory[], trackingEvents[], aftershipSlug. OrderDashboard + OrderFulfillment pages exist.', needed: 'Automation: Order created → artisan notified (ArtisanNotification entity) → tracking activated → buyer emailed', appFiles: ['base44/entities/Order.jsonc', 'src/pages/OrderDashboard.jsx', 'src/pages/OrderFulfillment.jsx', 'base44/entities/ArtisanNotification.jsonc'], action: 'Create entity automation: on Order create → fire sendOrderNotification backend function. AfterShip integration for live tracking.' },
  { id: 6, title: 'Search & Discovery Layer', severity: 'medium', impact: 'MEDIUM', effort: 'Medium', priority: 'P2', status: 'partial', icon: Search, existing: 'DiscoveryEngine page exists. MarketplaceAIAssistant component exists. ServiceMarketplace has basic filtering.', needed: 'Full-text search across 162 brands + products. Tag/category filter. AI-powered recommendations via InvokeLLM.', appFiles: ['src/pages/DiscoveryEngine.jsx', 'src/components/marketplace/MarketplaceAIAssistant.jsx', 'src/components/marketplace/ServiceMarketplace.jsx'], action: 'Add search index via InvokeLLM semantic search. DiscoveryEngine already wired — expand it to query MarketplaceService + ArtisanProfile.' },
  { id: 7, title: 'Analytics & Revenue Intelligence', severity: 'medium', impact: 'MEDIUM', effort: 'Medium', priority: 'P2', status: 'partial', icon: BarChart2, existing: 'Analytics page + all sub-components exist. PaymentTransaction entity. Metrics entity. CrossPollinationMetrics component.', needed: 'Real sales funnel: product views → cart add → checkout → paid. Revenue by brand/sector. MRR/ARR/AOV charts.', appFiles: ['src/pages/Analytics.jsx', 'src/pages/BrandInsights.jsx', 'base44/entities/PaymentTransaction.jsonc', 'base44/entities/Metrics.jsonc'], action: 'Add analytics.track() calls at: product view, cart add, checkout_start, payment_success. Feed into existing Analytics charts.' },
  { id: 8, title: 'Loyalty ↔ Marketplace Bridge', severity: 'medium', impact: 'MEDIUM', effort: 'Low', priority: 'P2', status: 'partial', icon: Star, existing: 'LoyaltyAccount entity fully designed. RewardOffer entity. LoyaltyProgram page. awardPoints.jsx component.', needed: 'Auto-award points on purchase. Loyalty tier discounts at checkout. Redemption at payment step.', appFiles: ['base44/entities/LoyaltyAccount.jsonc', 'src/components/loyalty/awardPoints.jsx', 'src/pages/LoyaltyProgram.jsx'], action: 'Entity automation: on Order.paymentStatus = paid → awardPoints based on totalAmount. Add discount code field at checkout wired to LoyaltyAccount.availablePoints.' },
  { id: 9, title: 'Brand Collaboration Commerce', severity: 'low', impact: 'MEDIUM', effort: 'Medium', priority: 'P3', status: 'partial', icon: Globe, existing: 'BrandCollaboration entity. CollaborationSuite page. AIProposalEngine. MessageThread + Commission flow fully built.', needed: 'Co-branded product listings. Revenue split between brand1 and brand2. Collaborative checkout attribution.', appFiles: ['base44/entities/BrandCollaboration.jsonc', 'src/pages/CollaborationSuite.jsx', 'src/components/collaboration/CoBrandedSales.jsx'], action: 'Add revenueShare object to BrandCollaboration entity. CoBrandedSales component already exists — wire it to create MarketplaceService with dual brandId attribution.' },
  { id: 10, title: '9s Pulse Sync / Real-Time', severity: 'low', impact: 'LOW', effort: 'High', priority: 'P3', status: 'future', icon: Zap, existing: 'base44.entities.X.subscribe() real-time available on all entities. TreatyMonitor component exists.', needed: 'Live product inventory updates, price changes broadcast, order status real-time push to buyer', appFiles: ['src/components/vaultmesh/TreatyMonitor.jsx', 'src/Layout.jsx'], action: 'Subscribe to MarketplaceService changes for live price/stock updates. Subscribe to Order changes for real-time tracking status. Already supported by base44 SDK.' },
];

const ROADMAP_PHASES = [
  { phase: 'Phase 1', title: 'Foundation', months: 'Month 1', color: 'red', tasks: ['Expand MarketplaceService entity with pricing tiers + download_url + licenseKey', 'Consolidate CartContext into universal checkout flow', 'Wire pricingFormula.js into product listings', 'Add analytics.track() on all conversion events'] },
  { phase: 'Phase 2', title: 'Commerce Core', months: 'Month 2–3', color: 'orange', tasks: ['Build generateLicenseAndDeliver() backend function', 'Create entity automation: Order paid → notify artisan + send email', 'Add Paystack checkout to universal cart (keys already in secrets)', 'Implement loyalty points auto-award on purchase'] },
  { phase: 'Phase 3', title: 'Discovery & Intelligence', months: 'Month 4', color: 'yellow', tasks: ['Expand DiscoveryEngine with InvokeLLM semantic search', 'Build revenue funnel charts in Analytics dashboard', 'Add co-branded product listing via BrandCollaboration', 'Loyalty discount code redemption at checkout'] },
  { phase: 'Phase 4', title: 'Scale & Sync', months: 'Month 5–6', color: 'green', tasks: ['Real-time product/order subscriptions via base44.entities.subscribe()', 'Download manager with license verification', 'Partner/affiliate revenue sharing', 'Public launch: 20+ products live'] },
];

const ARCH_LAYERS = [
  { layer: 'Presentation', items: ['ServiceMarketplace', 'DiscoveryEngine', 'BrandNodeExplorer', 'ArtisanShop', 'SubscriptionShop'], color: 'blue' },
  { layer: 'Catalog', items: ['MarketplaceService (162 brands)', 'ArtisanProfile', 'SubscriptionBox', 'Brand registry'], color: 'purple' },
  { layer: 'Commerce', items: ['CartContext (universal)', 'ShananaCheckout', 'Paystack/Ozow/Yoco', 'Order entity'], color: 'green' },
  { layer: 'Delivery', items: ['generateLicenseAndDeliver()', 'VaultItem (license store)', 'AssetLibrary (files)', 'Core.SendEmail'], color: 'orange' },
  { layer: 'Intelligence', items: ['Analytics dashboard', 'BrandInsights', 'LoyaltyAccount', 'PaymentTransaction metrics'], color: 'red' },
];

const SEVERITY_CONFIG = {
  critical: { bg: 'bg-red-900/30', border: 'border-red-700/60', badge: 'bg-red-800 text-red-200', dot: 'bg-red-500' },
  high: { bg: 'bg-orange-900/20', border: 'border-orange-700/40', badge: 'bg-orange-800 text-orange-200', dot: 'bg-orange-500' },
  medium: { bg: 'bg-yellow-900/20', border: 'border-yellow-700/40', badge: 'bg-yellow-800 text-yellow-200', dot: 'bg-yellow-500' },
  low: { bg: 'bg-blue-900/20', border: 'border-blue-700/40', badge: 'bg-blue-800 text-blue-200', dot: 'bg-blue-400' },
};

export default function MarketplaceBlueprint() {
  const [activeTab, setActiveTab] = useState('gaps');
  const [expandedGap, setExpandedGap] = useState(null);
  const [aiInsight, setAiInsight] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [readiness, setReadiness] = useState(null);

  const { data: services = [] } = useQuery({ queryKey: ['mkt-services'], queryFn: () => base44.entities.MarketplaceService.list() });
  const { data: brands = [] } = useQuery({ queryKey: ['mkt-brands'], queryFn: () => base44.entities.Brand.list() });
  const { data: orders = [] } = useQuery({ queryKey: ['mkt-orders'], queryFn: () => base44.entities.Order.list() });
  const { data: artisans = [] } = useQuery({ queryKey: ['mkt-artisans'], queryFn: () => base44.entities.ArtisanProfile.list() });
  const { data: payments = [] } = useQuery({ queryKey: ['mkt-payments'], queryFn: () => base44.entities.Payment.filter({ status: 'completed' }) });

  useEffect(() => {
    const paidOrders = orders.filter(o => o.paymentStatus === 'paid').length;
    const revenue = payments.reduce((s, p) => s + (p.amount || 0), 0);
    setReadiness({
      brands: brands.length,
      services: services.length,
      artisans: artisans.length,
      orders: orders.length,
      paidOrders,
      revenue: revenue / 100,
    });
  }, [brands, services, orders, artisans, payments]);

  const getAIInsight = async () => {
    setAiLoading(true);
    setAiInsight('');
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a marketplace strategy advisor for FAA.ZONE — a South African artisan + tech ecosystem platform. 
      Current data: ${brands.length} brands, ${services.length} marketplace services, ${artisans.length} artisans, ${orders.length} orders.
      The platform has: CartContext, Paystack keys, Order entity, ArtisanProfile, MarketplaceService, LoyaltyAccount, BrandCollaboration.
      Give 3 specific, immediately actionable next steps to accelerate marketplace revenue in the next 30 days. Be concrete, reference the actual entities and pages that exist.`,
    });
    setAiInsight(res);
    setAiLoading(false);
  };

  const TABS = [
    { id: 'gaps', label: 'Gap Analysis', icon: AlertTriangle },
    { id: 'arch', label: 'Architecture', icon: Database },
    { id: 'roadmap', label: 'Roadmap', icon: Clock },
    { id: 'metrics', label: 'Live Metrics', icon: BarChart2 },
    { id: 'ai', label: 'AI Strategy', icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 border-b border-slate-700 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Globe className="w-8 h-8 text-purple-400" />
                <h1 className="text-3xl font-black text-white">Marketplace Blueprint</h1>
                <span className="px-3 py-1 bg-purple-900/60 text-purple-300 text-xs font-bold rounded-full border border-purple-700">STRATEGIC RESEARCH</span>
              </div>
              <p className="text-slate-400 max-w-xl">Deep code-dive analysis of all existing entities, pages, and components — mapped to the Unified Global Tech Marketplace roadmap.</p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 text-center min-w-[140px]">
              <p className="text-4xl font-black text-purple-400">45%</p>
              <p className="text-slate-400 text-xs mt-1">Market Readiness</p>
              <div className="w-full bg-slate-700 rounded-full h-1.5 mt-2">
                <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: '45%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-slate-900 border-b border-slate-700 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto py-2">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                  activeTab === id ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* GAP ANALYSIS */}
        {activeTab === 'gaps' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">10 Critical Gaps — Identified in This App's Codebase</h2>
              <div className="flex gap-3 text-xs">
                {['critical', 'high', 'medium', 'low'].map(s => (
                  <span key={s} className="flex items-center gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${SEVERITY_CONFIG[s].dot}`} />
                    <span className="text-slate-400 capitalize">{s}</span>
                  </span>
                ))}
              </div>
            </div>

            {GAP_DATA.map(gap => {
              const cfg = SEVERITY_CONFIG[gap.severity];
              const Icon = gap.icon;
              const isOpen = expandedGap === gap.id;
              return (
                <div key={gap.id} className={`${cfg.bg} border ${cfg.border} rounded-2xl overflow-hidden`}>
                  <button
                    className="w-full flex items-center gap-4 p-5 text-left"
                    onClick={() => setExpandedGap(isOpen ? null : gap.id)}
                  >
                    <Icon className="w-5 h-5 text-slate-300 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-white text-sm">{gap.title}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${cfg.badge}`}>{gap.severity.toUpperCase()}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 font-medium">{gap.priority}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          gap.status === 'missing' ? 'bg-red-900 text-red-300' :
                          gap.status === 'fragmented' ? 'bg-orange-900 text-orange-300' :
                          gap.status === 'partial' ? 'bg-yellow-900 text-yellow-300' :
                          'bg-blue-900 text-blue-300'
                        }`}>{gap.status}</span>
                      </div>
                    </div>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 border-t border-slate-700/50 pt-4 grid sm:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">What Already Exists</p>
                        <p className="text-slate-300 leading-relaxed">{gap.existing}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">What's Needed</p>
                        <p className="text-slate-300 leading-relaxed">{gap.needed}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Concrete Action</p>
                        <p className="text-green-400 leading-relaxed">{gap.action}</p>
                        <div className="mt-3 space-y-1">
                          {gap.appFiles.map(f => (
                            <code key={f} className="block text-xs text-purple-300 bg-slate-900 px-2 py-1 rounded">{f}</code>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ARCHITECTURE */}
        {activeTab === 'arch' && (
          <div>
            <h2 className="text-xl font-bold mb-6">5-Layer Marketplace Architecture — Mapped to This App</h2>
            <div className="space-y-4">
              {ARCH_LAYERS.map((layer, i) => (
                <div key={layer.layer} className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black
                      ${layer.color === 'blue' ? 'bg-blue-900 text-blue-400' :
                        layer.color === 'purple' ? 'bg-purple-900 text-purple-400' :
                        layer.color === 'green' ? 'bg-green-900 text-green-400' :
                        layer.color === 'orange' ? 'bg-orange-900 text-orange-400' :
                        'bg-red-900 text-red-400'}`}>
                      {i + 1}
                    </div>
                    <h3 className="font-bold text-white">{layer.layer} Layer</h3>
                    {i < ARCH_LAYERS.length - 1 && (
                      <div className="ml-auto text-slate-600 text-xs flex items-center gap-1">
                        feeds into ↓ <ArrowRight className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {layer.items.map(item => (
                      <span key={item} className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-300 font-medium">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-slate-900 border border-slate-700 rounded-2xl p-6">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Code className="w-5 h-5 text-purple-400" /> Unified Checkout Flow — Current State</h3>
              <div className="space-y-2 text-sm font-mono">
                {[
                  { step: 'CartContext.jsx', note: '✅ EXISTS — session + localStorage cart', color: 'green' },
                  { step: 'Universal Cart UI', note: '⚠️ FRAGMENTED — 3 separate implementations', color: 'yellow' },
                  { step: 'VaultMesh™ Router', note: '❌ MISSING — needs PaymentGateway.jsx enhancement', color: 'red' },
                  { step: 'Paystack Integration', note: '✅ KEYS EXIST — PAYSTACK_SECRET_KEY + PUBLIC_KEY', color: 'green' },
                  { step: 'Order Entity', note: '✅ EXISTS — full schema with statusHistory + tracking', color: 'green' },
                  { step: 'License Generation', note: '❌ MISSING — backend function needed', color: 'red' },
                  { step: 'Email Delivery', note: '✅ Core.SendEmail available', color: 'green' },
                  { step: 'AfterShip Tracking', note: '✅ trackingEvents[] in Order entity — needs activation', color: 'yellow' },
                ].map(row => (
                  <div key={row.step} className="flex items-center gap-3 bg-slate-800 rounded-lg px-4 py-2.5">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${row.color === 'green' ? 'bg-green-500' : row.color === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                    <span className="text-slate-300 font-semibold min-w-[220px]">{row.step}</span>
                    <span className="text-slate-500">{row.note}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ROADMAP */}
        {activeTab === 'roadmap' && (
          <div>
            <h2 className="text-xl font-bold mb-6">4-Phase Launch Roadmap — Using This App's Existing Foundation</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {ROADMAP_PHASES.map(phase => (
                <div key={phase.phase} className={`bg-slate-900 border rounded-2xl p-6 ${
                  phase.color === 'red' ? 'border-red-800/60' :
                  phase.color === 'orange' ? 'border-orange-800/60' :
                  phase.color === 'yellow' ? 'border-yellow-800/60' :
                  'border-green-800/60'
                }`}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`text-xs font-black px-3 py-1 rounded-full ${
                      phase.color === 'red' ? 'bg-red-900/60 text-red-400' :
                      phase.color === 'orange' ? 'bg-orange-900/60 text-orange-400' :
                      phase.color === 'yellow' ? 'bg-yellow-900/60 text-yellow-400' :
                      'bg-green-900/60 text-green-400'
                    }`}>{phase.months}</span>
                    <div>
                      <p className="font-black text-white text-sm">{phase.phase}: {phase.title}</p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {phase.tasks.map(task => (
                      <li key={task} className="flex items-start gap-2 text-sm text-slate-300">
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-purple-950/30 border border-purple-800/50 rounded-2xl p-6">
              <h3 className="font-bold text-purple-300 mb-3">Launch Success Criteria</h3>
              <div className="grid sm:grid-cols-3 gap-4 text-sm">
                {[
                  { label: 'Checkout success rate', target: '> 95%' },
                  { label: 'Page load time', target: '< 2s' },
                  { label: 'Products live at launch', target: '20+' },
                  { label: 'Download delivery rate', target: '> 99%' },
                  { label: 'Year 1 revenue target', target: 'R500K–R1M' },
                  { label: 'Registered users (Y1)', target: '1,000+' },
                ].map(c => (
                  <div key={c.label} className="bg-slate-900 rounded-xl p-3 border border-slate-700">
                    <p className="text-slate-400 text-xs">{c.label}</p>
                    <p className="text-white font-bold mt-0.5">{c.target}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* LIVE METRICS */}
        {activeTab === 'metrics' && (
          <div>
            <h2 className="text-xl font-bold mb-6">Live App Data — Current Marketplace State</h2>
            {readiness ? (
              <div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                  {[
                    { label: 'Brands in DB', value: readiness.brands, target: 162, icon: Globe, color: 'blue' },
                    { label: 'Marketplace Services', value: readiness.services, target: 50, icon: Package, color: 'purple' },
                    { label: 'Artisan Profiles', value: readiness.artisans, target: 30, icon: Star, color: 'orange' },
                    { label: 'Total Orders', value: readiness.orders, target: 100, icon: ShoppingCart, color: 'green' },
                    { label: 'Paid Orders', value: readiness.paidOrders, target: 50, icon: CheckCircle, color: 'green' },
                    { label: 'Revenue (ZAR)', value: `R${readiness.revenue.toLocaleString()}`, target: null, icon: TrendingUp, color: 'yellow' },
                  ].map(m => {
                    const Icon = m.icon;
                    const pct = m.target ? Math.min(100, Math.round((m.value / m.target) * 100)) : null;
                    return (
                      <div key={m.label} className="bg-slate-900 border border-slate-700 rounded-2xl p-5">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className={`w-4 h-4 ${
                            m.color === 'blue' ? 'text-blue-400' :
                            m.color === 'purple' ? 'text-purple-400' :
                            m.color === 'orange' ? 'text-orange-400' :
                            m.color === 'green' ? 'text-green-400' :
                            'text-yellow-400'
                          }`} />
                          <p className="text-slate-400 text-xs">{m.label}</p>
                        </div>
                        <p className="text-3xl font-black text-white">{m.value}</p>
                        {m.target && (
                          <div className="mt-2">
                            <div className="w-full bg-slate-700 rounded-full h-1.5">
                              <div className={`h-1.5 rounded-full ${pct >= 80 ? 'bg-green-500' : pct >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                style={{ width: `${pct}%` }} />
                            </div>
                            <p className="text-xs text-slate-500 mt-1">{pct}% of target ({m.target})</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
                  <h3 className="font-bold text-white mb-4">Readiness Score by Component</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Brand Catalog', pct: 100, note: `${readiness.brands} brands loaded` },
                      { label: 'Product Listings', pct: Math.min(100, readiness.services * 3), note: `${readiness.services} services` },
                      { label: 'Artisan Profiles', pct: Math.min(100, readiness.artisans * 5), note: `${readiness.artisans} artisans` },
                      { label: 'Checkout Infrastructure', pct: 40, note: 'CartContext ✅ · Paystack keys ✅ · Unified flow ❌' },
                      { label: 'Order Management', pct: 70, note: 'Entity ✅ · Dashboard ✅ · Automation ❌' },
                      { label: 'License Delivery', pct: 10, note: 'VaultItem ✅ · Auto-generate ❌' },
                      { label: 'Analytics', pct: 60, note: 'Dashboard ✅ · Revenue funnel ❌' },
                    ].map(r => (
                      <div key={r.label} className="flex items-center gap-4">
                        <span className="text-sm text-slate-300 w-48 shrink-0">{r.label}</span>
                        <div className="flex-1 bg-slate-700 rounded-full h-2">
                          <div className={`h-2 rounded-full transition-all ${r.pct >= 80 ? 'bg-green-500' : r.pct >= 50 ? 'bg-yellow-500' : r.pct >= 20 ? 'bg-orange-500' : 'bg-red-500'}`}
                            style={{ width: `${r.pct}%` }} />
                        </div>
                        <span className="text-xs text-slate-500 w-8 text-right">{r.pct}%</span>
                        <span className="text-xs text-slate-600 hidden sm:block">{r.note}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
              </div>
            )}
          </div>
        )}

        {/* AI STRATEGY */}
        {activeTab === 'ai' && (
          <div>
            <h2 className="text-xl font-bold mb-2">AI Strategic Advisor</h2>
            <p className="text-slate-400 text-sm mb-6">AI analysis of your live app data — specific, actionable next steps for marketplace growth.</p>

            <button
              onClick={getAIInsight}
              disabled={aiLoading}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-full text-white font-bold transition-colors disabled:opacity-60 mb-6"
            >
              {aiLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              {aiLoading ? 'Analysing your app...' : 'Generate AI Strategy Brief'}
            </button>

            {aiInsight && (
              <div className="bg-purple-950/30 border border-purple-700/50 rounded-2xl p-6 prose prose-invert prose-sm max-w-none prose-headings:text-purple-300 prose-p:text-slate-300 prose-li:text-slate-300 prose-strong:text-white">
                <ReactMarkdown>{aiInsight}</ReactMarkdown>
              </div>
            )}

            <div className="mt-8 bg-slate-900 border border-slate-700 rounded-2xl p-6">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Lock className="w-4 h-4 text-slate-400" /> Key Ecosystem Assets Already Built</h3>
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                {[
                  ['PAYSTACK_SECRET_KEY + PUBLIC_KEY', 'Ready for immediate checkout activation'],
                  ['CartContext + CartProvider', 'Universal cart state — just needs unified UI'],
                  ['Order entity + statusHistory[]', 'Full order lifecycle tracking built'],
                  ['ArtisanNotification entity', 'Artisan alert system ready to wire'],
                  ['LoyaltyAccount + RewardOffer', 'Full loyalty engine — just needs purchase hook'],
                  ['Core.SendEmail', 'Email receipts + license delivery available'],
                  ['base44.entities.X.subscribe()', 'Real-time updates on all entities built-in'],
                  ['pricingFormula.js', 'ZAR ex-works cost → wholesale → retail calculator'],
                  ['BrandCollaboration entity', 'Co-branded revenue split data model exists'],
                  ['InvokeLLM integration', 'AI product recommendations + search available'],
                ].map(([asset, note]) => (
                  <div key={asset} className="bg-slate-800 rounded-xl p-3 border border-slate-700">
                    <p className="text-green-400 font-mono text-xs">{asset}</p>
                    <p className="text-slate-400 text-xs mt-1">{note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
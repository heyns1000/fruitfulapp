/**
 * SectorLandingPage — Full immersive landing when a sector is selected.
 * Merges: sector hero + subnodes + live artisan products + pricing tiers + AI App Builder panel
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  ChevronLeft, Zap, ShoppingBag, Tag, Sparkles, Loader2,
  Globe, Star, ArrowRight, Package, CheckCircle2, Layers, Code2
} from 'lucide-react';
import { TIER_COLORS } from './SectorData';
import { calcPrices, applyTierDiscount, PLAN_CONFIG } from '@/lib/pricingFormula';
import { useCart } from '../cart/CartContext';
import { toast } from 'sonner';

const TIER_GRADIENTS = {
  'A+': 'from-yellow-600 to-amber-500',
  'A':  'from-blue-600 to-cyan-500',
  'B+': 'from-teal-600 to-green-500',
  'B':  'from-gray-600 to-slate-500',
};

const BG_GLYPHS = {
  'agriculture': 'from-green-900 via-emerald-900 to-teal-900',
  'fashion':     'from-pink-900 via-rose-900 to-red-900',
  'creative':    'from-purple-900 via-violet-900 to-indigo-900',
  'health':      'from-blue-900 via-sky-900 to-cyan-900',
  'mining':      'from-stone-900 via-zinc-900 to-neutral-900',
  'banking':     'from-slate-900 via-gray-900 to-zinc-900',
  'gaming':      'from-fuchsia-900 via-pink-900 to-purple-900',
  'ritual':      'from-orange-900 via-amber-900 to-yellow-900',
  'wildlife':    'from-lime-900 via-green-900 to-emerald-900',
  'default':     'from-teal-900 via-green-900 to-cyan-900',
};

function getBg(key) {
  return BG_GLYPHS[key] || BG_GLYPHS.default;
}

// ── AI App Builder panel embedded inside sector page ─────────────────────────
function SectorAppBuilder({ sector, subnodes, products }) {
  const [appName, setAppName] = useState(`${sector.label} Hub`);
  const [appDesc, setAppDesc] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);

  const generate = async () => {
    if (!appName.trim()) return;
    setIsGenerating(true);
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an FAA.ZONE™ AI app architect. Generate a NEW user interface concept for the "${sector.label}" sector within the FAA.ZONE platform.

SECTOR DATA:
- Sector: ${sector.label} (${sector.key})
- Tier: ${sector.tier}
- Region: ${sector.region}
- Monthly price: $${sector.monthly} | Annual: $${sector.annual}
- Subnodes: ${subnodes.map(s => s.name).join(', ')}
- Live products: ${products.map(p => p.serviceName).slice(0, 8).join(', ')}

APP CONFIG:
- Name: "${appName}"
- Description: ${appDesc || 'Sector commerce and intelligence hub'}

Generate a production-ready UI specification: pages, features, color scheme, key components, and how it integrates with subscription pricing and artisan products.`,
        response_json_schema: {
          type: 'object',
          properties: {
            tagline: { type: 'string' },
            colorScheme: { type: 'object', properties: { primary: { type: 'string' }, accent: { type: 'string' }, bg: { type: 'string' } } },
            pages: { type: 'array', items: { type: 'object', properties: { name: { type: 'string' }, description: { type: 'string' }, keyFeatures: { type: 'array', items: { type: 'string' } } } } },
            integrations: { type: 'array', items: { type: 'string' } },
            subscriptionFlow: { type: 'string' },
            heroHeadline: { type: 'string' },
            heroSubline: { type: 'string' },
          }
        }
      });
      setResult(res);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-black/30 border border-purple-700/50 rounded-3xl p-6 space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-white font-black text-lg">FAA AI App Builder</p>
          <p className="text-purple-300 text-xs">Generate a new interface for this sector</p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs text-purple-300 uppercase tracking-wider font-bold mb-1 block">App Name</label>
          <Input value={appName} onChange={e => setAppName(e.target.value)}
            className="bg-white/10 border-purple-700/60 text-white placeholder:text-purple-400 focus-visible:ring-purple-500" />
        </div>
        <div>
          <label className="text-xs text-purple-300 uppercase tracking-wider font-bold mb-1 block">Description (optional)</label>
          <Textarea value={appDesc} onChange={e => setAppDesc(e.target.value)} rows={2}
            placeholder="What should this app do for the sector?"
            className="bg-white/10 border-purple-700/60 text-white placeholder:text-purple-400 focus-visible:ring-purple-500" />
        </div>
        <Button onClick={generate} disabled={isGenerating || !appName.trim()}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 font-bold gap-2">
          {isGenerating ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating…</> : <><Sparkles className="w-4 h-4" /> Generate Interface with AI</>}
        </Button>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="border-t border-purple-700/50 pt-4">
              <p className="text-white font-black text-xl mb-1">{appName}</p>
              <p className="text-purple-300 text-sm italic mb-4">"{result.tagline}"</p>
              {result.heroHeadline && (
                <div className="bg-white/5 rounded-2xl p-4 mb-4">
                  <p className="text-white font-bold text-lg">{result.heroHeadline}</p>
                  <p className="text-purple-200 text-sm">{result.heroSubline}</p>
                </div>
              )}
              {result.colorScheme && (
                <div className="flex gap-2 mb-4">
                  {Object.entries(result.colorScheme).map(([k, v]) => (
                    <div key={k} title={`${k}: ${v}`} className="w-8 h-8 rounded-full border-2 border-white/20 shadow" style={{ background: v }} />
                  ))}
                </div>
              )}
              {result.pages?.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-purple-400 uppercase tracking-wider font-bold">Generated Pages</p>
                  {result.pages.map((p, i) => (
                    <div key={i} className="bg-white/5 border border-purple-700/30 rounded-xl p-3">
                      <p className="text-white font-semibold text-sm">{p.name}</p>
                      <p className="text-purple-300 text-xs">{p.description}</p>
                      {p.keyFeatures?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {p.keyFeatures.map((f, j) => (
                            <span key={j} className="text-xs bg-purple-900/40 border border-purple-700/30 text-purple-300 rounded-full px-2 py-0.5">{f}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {result.subscriptionFlow && (
                <div className="bg-green-900/20 border border-green-700/40 rounded-xl p-3 mt-3">
                  <p className="text-xs text-green-400 uppercase tracking-wider font-bold mb-1">Subscription Flow</p>
                  <p className="text-green-200 text-sm">{result.subscriptionFlow}</p>
                </div>
              )}
              {result.integrations?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {result.integrations.map((int, i) => (
                    <Badge key={i} className="bg-purple-900/40 text-purple-200 border-purple-700/40 text-xs">{int}</Badge>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main SectorLandingPage ────────────────────────────────────────────────────
export default function SectorLandingPage({ sector, onBack, sectorPulseCount }) {
  const [selectedSubnode, setSelectedSubnode] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState('professional');
  const { addToCart } = useCart();

  const tierConfig = PLAN_CONFIG[selectedPlan] || PLAN_CONFIG.professional;
  const bg = getBg(sector.key);

  // Pull live products that match this sector
  const { data: products = [], isLoading: loadingProducts } = useQuery({
    queryKey: ['sector-products', sector.key],
    queryFn: async () => {
      const all = await base44.entities.MarketplaceService.filter({ status: 'active' });
      return all.filter(p =>
        (p.tags || []).some(t => t.toLowerCase().includes(sector.key.toLowerCase()) ||
          sector.subnodes.some(sn => t.toLowerCase().includes(sn.toLowerCase()))) ||
        sector.subnodes.some(sn => (p.brandName || '').toLowerCase().includes(sn.toLowerCase()))
      );
    },
  });

  // Build subnode objects enriched with matching products
  const subnodes = sector.subnodes.map((name, i) => ({
    name,
    code: `${sector.key.toUpperCase().slice(0, 3)}-SN-${String(i + 1).padStart(2, '0')}`,
    products: products.filter(p =>
      (p.tags || []).some(t => t.toLowerCase().includes(name.toLowerCase())) ||
      (p.brandName || '').toLowerCase().includes(name.toLowerCase())
    ),
  }));

  const displayProducts = selectedSubnode
    ? products.filter(p =>
        (p.tags || []).some(t => t.toLowerCase().includes(selectedSubnode.toLowerCase())) ||
        (p.brandName || '').toLowerCase().includes(selectedSubnode.toLowerCase())
      )
    : products;

  const handleAddToCart = (product, subscriberPrice) => {
    addToCart({ ...product, name: product.serviceName, price: subscriberPrice, quantity: 1 });
    toast.success(`${product.serviceName} added with ${tierConfig.discountPct}% subscriber discount`);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>

      {/* ── HERO ── */}
      <div className={`relative overflow-hidden bg-gradient-to-br ${bg} rounded-3xl mb-8`}>
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)', backgroundSize: '30px 30px' }} />
        <div className="relative px-6 md:px-12 py-14">
          <button onClick={onBack} className="flex items-center gap-1.5 text-white/60 hover:text-white text-sm font-semibold mb-6 transition-colors">
            <ChevronLeft className="w-4 h-4" /> All Sectors
          </button>
          <div className="flex items-start gap-6 flex-wrap">
            <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${TIER_GRADIENTS[sector.tier] || TIER_GRADIENTS.B} flex items-center justify-center text-5xl shadow-2xl shrink-0`}>
              {sector.glyph}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>{sector.label}</h1>
                <Badge className={`border text-sm px-3 py-1 ${TIER_COLORS[sector.tier]}`}>Tier {sector.tier}</Badge>
              </div>
              <p className="text-white/60 text-lg mb-4">{sector.region} · FAA.ZONE™ Ecosystem Sector</p>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="bg-white/10 rounded-xl px-4 py-2">
                  <p className="text-xs text-white/50 uppercase tracking-wider">Monthly</p>
                  <p className="text-white font-black text-xl">${sector.monthly}</p>
                </div>
                <div className="bg-white/10 rounded-xl px-4 py-2">
                  <p className="text-xs text-white/50 uppercase tracking-wider">Annual</p>
                  <p className="text-white font-black text-xl">${sector.annual}</p>
                </div>
                <div className="bg-white/10 rounded-xl px-4 py-2">
                  <p className="text-xs text-white/50 uppercase tracking-wider">Subnodes</p>
                  <p className="text-white font-black text-xl">{sector.subnodes.length}</p>
                </div>
                <div className="bg-white/10 rounded-xl px-4 py-2">
                  <p className="text-xs text-white/50 uppercase tracking-wider">Live Products</p>
                  <p className="text-white font-black text-xl">{loadingProducts ? '…' : products.length}</p>
                </div>
                {sectorPulseCount > 0 && (
                  <div className="bg-yellow-500/20 border border-yellow-500/40 rounded-xl px-4 py-2">
                    <p className="text-xs text-yellow-300 uppercase tracking-wider">Audit Pulses</p>
                    <p className="text-yellow-300 font-black text-xl">{sectorPulseCount}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* ── LEFT: Subnodes + Products ── */}
        <div className="xl:col-span-2 space-y-8">

          {/* Subnode navigation */}
          <div>
            <p className="text-white font-black text-lg mb-3 flex items-center gap-2">
              <Layers className="w-5 h-5 text-teal-400" /> Core Subnodes
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedSubnode(null)}
                className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${
                  !selectedSubnode ? 'bg-teal-600 border-teal-600 text-white' : 'border-teal-700/50 text-teal-300 hover:border-teal-500 bg-white/5'
                }`}
              >
                All ({products.length})
              </button>
              {subnodes.map(sn => (
                <button key={sn.name}
                  onClick={() => setSelectedSubnode(selectedSubnode === sn.name ? null : sn.name)}
                  className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${
                    selectedSubnode === sn.name
                      ? 'bg-teal-600 border-teal-600 text-white'
                      : 'border-teal-700/50 text-teal-300 hover:border-teal-500 bg-white/5'
                  }`}
                >
                  {sn.name} {sn.products.length > 0 && <span className="opacity-60">({sn.products.length})</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Subnode detail strip */}
          {selectedSubnode && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              className="bg-teal-900/30 border border-teal-700/40 rounded-2xl p-4">
              <p className="text-teal-300 font-bold">{selectedSubnode} — Subnode Detail</p>
              <p className="text-teal-400/70 text-sm mt-1">
                Monthly access: <strong className="text-white">${sector.monthly}</strong> ·
                Annual: <strong className="text-white">${sector.annual}</strong> ·
                Linked to <strong className="text-white">{sector.label}</strong> core sector
              </p>
            </motion.div>
          )}

          {/* Subscriber plan picker */}
          <div>
            <p className="text-white font-black text-lg mb-3 flex items-center gap-2">
              <Star className="w-5 h-5 text-orange-400" /> Apply Subscription Discount
            </p>
            <div className="flex gap-2 flex-wrap">
              {Object.entries(PLAN_CONFIG).map(([key, plan]) => (
                <button key={key} onClick={() => setSelectedPlan(key)}
                  className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${
                    selectedPlan === key
                      ? 'bg-orange-700 border-orange-700 text-white'
                      : 'border-stone-600 text-stone-300 hover:border-orange-600 bg-white/5'
                  }`}
                >
                  {plan.label} · {plan.discountPct}% off
                </button>
              ))}
            </div>
          </div>

          {/* Live products grid */}
          <div>
            <p className="text-white font-black text-lg mb-3 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-green-400" />
              {selectedSubnode ? `${selectedSubnode} Products` : `${sector.label} Products`}
              {loadingProducts && <Loader2 className="w-4 h-4 animate-spin text-teal-400" />}
            </p>

            {!loadingProducts && displayProducts.length === 0 && (
              <div className="bg-white/5 border border-teal-700/30 rounded-2xl p-10 text-center">
                <Package className="w-10 h-10 mx-auto mb-3 text-teal-600 opacity-50" />
                <p className="text-teal-400 font-semibold">No live products for this sector yet.</p>
                <p className="text-teal-600 text-sm mt-1">Use the AI App Builder below to generate a product interface.</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {displayProducts.map(product => {
                const formula = product.pricingFormula || {};
                const derived = formula.costPriceZAR
                  ? calcPrices(formula)
                  : { onlineZAR: product.pricing?.ZAR || 0, retailZAR: product.pricing?.ZAR || 0, wholesaleZAR: 0 };
                const subscriberPrice = applyTierDiscount(derived.onlineZAR, tierConfig.discountPct);
                const savings = +(derived.onlineZAR - subscriberPrice).toFixed(2);

                return (
                  <motion.div key={product.id}
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 border border-teal-700/30 hover:border-teal-500/60 rounded-2xl overflow-hidden transition-all group">
                    {product.imageUrl && (
                      <div className="h-40 overflow-hidden">
                        <img src={product.imageUrl} alt={product.serviceName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <p className="text-white font-bold text-sm">{product.serviceName}</p>
                          <p className="text-teal-400 text-xs">{product.brandName}</p>
                        </div>
                        {product.tags?.slice(0, 1).map(t => (
                          <Badge key={t} className="text-xs bg-teal-900/40 border-teal-700/40 text-teal-300 shrink-0">{t}</Badge>
                        ))}
                      </div>

                      {/* Pricing chain */}
                      <div className="space-y-0.5 mb-3">
                        {derived.wholesaleZAR > 0 && (
                          <p className="text-xs text-stone-600">Wholesale: R{derived.wholesaleZAR.toLocaleString()}</p>
                        )}
                        {derived.retailZAR > 0 && (
                          <p className="text-xs text-stone-500 line-through">Retail: R{derived.retailZAR.toLocaleString()}</p>
                        )}
                        <div className="flex items-baseline gap-2">
                          <p className="text-orange-400 font-black text-lg">R{subscriberPrice.toLocaleString()}</p>
                          {savings > 0 && (
                            <span className="text-green-400 text-xs font-semibold flex items-center gap-0.5">
                              <Tag className="w-3 h-3" /> Save R{savings}
                            </span>
                          )}
                        </div>
                        {formula.costPriceZAR > 0 && (
                          <p className="text-xs text-stone-700">Ex-works cost: R{formula.costPriceZAR}</p>
                        )}
                      </div>

                      {/* Sector / subnode links */}
                      <div className="flex gap-1 flex-wrap mb-3">
                        <Badge className="text-xs bg-white/5 border-teal-800/40 text-teal-400">
                          {sector.label}
                        </Badge>
                        {sector.subnodes.slice(0, 2).map(sn => (
                          <Badge key={sn} className="text-xs bg-white/5 border-teal-800/40 text-teal-500">{sn}</Badge>
                        ))}
                      </div>

                      {/* Subscription pricing badges */}
                      <div className="flex gap-1 flex-wrap mb-3 text-xs">
                        <span className="bg-stone-800 text-stone-300 rounded-full px-2 py-0.5">${sector.monthly}/mo</span>
                        <span className="bg-stone-800 text-stone-300 rounded-full px-2 py-0.5">${sector.annual}/yr</span>
                      </div>

                      <Button size="sm"
                        className="w-full bg-teal-700 hover:bg-teal-600 text-white font-bold"
                        onClick={() => handleAddToCart(product, subscriberPrice)}>
                        <ShoppingBag className="w-3.5 h-3.5 mr-1.5" /> Add · R{subscriberPrice}
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Pricing tiers for this sector */}
          <div>
            <p className="text-white font-black text-lg mb-3 flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-400" /> Sector Pricing Plans
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Monthly Access', price: `$${sector.monthly}`, sub: 'per month', badge: 'Starter', color: 'border-blue-700/50 bg-blue-900/10' },
                { label: 'Annual Access', price: `$${sector.annual}`, sub: 'per year · best value', badge: 'Save ~15%', color: 'border-teal-700/50 bg-teal-900/10' },
                { label: 'Enterprise', price: 'Custom', sub: 'unlimited subnodes', badge: 'Contact us', color: 'border-orange-700/50 bg-orange-900/10' },
              ].map(p => (
                <div key={p.label} className={`rounded-2xl border p-5 ${p.color}`}>
                  <Badge className="text-xs mb-3 bg-white/10 text-white border-white/20">{p.badge}</Badge>
                  <p className="text-white font-black text-2xl">{p.price}</p>
                  <p className="text-white font-bold text-sm">{p.label}</p>
                  <p className="text-white/50 text-xs mt-1">{p.sub}</p>
                  <div className="mt-3 space-y-1">
                    {sector.subnodes.slice(0, 3).map(sn => (
                      <div key={sn} className="flex items-center gap-1.5 text-xs text-white/60">
                        <CheckCircle2 className="w-3 h-3 text-green-400" /> {sn}
                      </div>
                    ))}
                    {sector.subnodes.length > 3 && (
                      <p className="text-xs text-white/40">+{sector.subnodes.length - 3} more subnodes</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT: AI App Builder ── */}
        <div className="xl:col-span-1 space-y-6">
          <div className="sticky top-24">
            <p className="text-white font-black text-lg mb-3 flex items-center gap-2">
              <Code2 className="w-5 h-5 text-purple-400" /> AI Interface Builder
            </p>
            <SectorAppBuilder sector={sector} subnodes={subnodes} products={products} />

            {/* Quick sector stats */}
            <div className="mt-6 bg-white/5 border border-teal-700/30 rounded-2xl p-5 space-y-3">
              <p className="text-white font-bold text-sm">Sector Intelligence</p>
              {[
                { label: 'Sector Key', value: sector.key },
                { label: 'Tier', value: `Tier ${sector.tier}` },
                { label: 'Region', value: sector.region },
                { label: 'Monthly Fee', value: `$${sector.monthly}` },
                { label: 'Annual Fee', value: `$${sector.annual}` },
                { label: 'Total Subnodes', value: sector.subnodes.length },
                { label: 'Live Products', value: loadingProducts ? '…' : products.length },
              ].map(row => (
                <div key={row.label} className="flex justify-between text-xs">
                  <span className="text-teal-400/70">{row.label}</span>
                  <span className="text-white font-semibold">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
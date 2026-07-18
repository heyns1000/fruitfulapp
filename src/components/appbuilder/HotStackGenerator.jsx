import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Zap, Shield, X, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const LOADING_STEPS = [
  '🔍 Scanning real brand metadata…',
  '⬡ Mapping ecosystem subnodes…',
  '🧠 Calculating cross-pollination synergies…',
  '🎨 Designing page architecture…',
  '🗄️  Building database schema…',
  '⚡ Compiling feature matrix…',
  '🚀 Finalising HotStack™ output…',
];

const APP_TYPES = [
  { val: 'webapp',      label: '⚡ Web App' },
  { val: 'website',     label: '🌐 Website' },
  { val: 'mobile',      label: '📱 Mobile (Responsive)' },
  { val: 'dashboard',   label: '📊 Dashboard' },
  { val: 'marketplace', label: '🏪 Marketplace' },
];

export default function HotStackGenerator({ selectedBrands, vibePrompt, customization, onGenerated, onBack }) {
  const [appName, setAppName] = useState('');
  const [appType, setAppType] = useState('webapp');
  const [userRoles, setUserRoles] = useState(['admin', 'user', 'artisan']);
  const [newRole, setNewRole] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  useEffect(() => {
    if (vibePrompt && !appName) {
      const words = vibePrompt.trim().split(' ').slice(0, 4);
      setAppName(words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
    }
  }, [vibePrompt]);

  useEffect(() => {
    if (!isGenerating) return;
    const interval = setInterval(() => {
      setLoadingStep(prev => Math.min(prev + 1, LOADING_STEPS.length - 1));
    }, 1400);
    return () => clearInterval(interval);
  }, [isGenerating]);

  const generate = async () => {
    if (!appName.trim()) { toast.error('Give your app a name'); return; }
    setIsGenerating(true);
    setLoadingStep(0);

    // Compact brand data — enough for the AI to use, small enough to not time out.
    const brandsSummary = selectedBrands.map(b => ({
      name: b.name,
      sector: b.sector,
      subnodes: b.subnodes || [],
      tags: b.tags || [],
      meta: b.metadata || {},
    }));

    const customColors = customization?.colors || {};
    const hasCustomColors = customColors.primary || customColors.secondary || customColors.accent;
    const refFiles = customization?.referenceFiles || [];

    try {
      const result = await base44.integrations.Core.InvokeLLM({
        model: 'gemini_3_flash',
        prompt: `You are HotStack™, a world-class AI app builder like Base44, Replit, and Lovable. Generate a COMPLETE, PRODUCTION-GRADE app blueprint as JSON. The output will be rendered as a LIVE app — every piece of content must be real, specific, and detailed. NO placeholders, NO lorem ipsum, NO generic text.

VIBE: "${vibePrompt || 'Build a full ecosystem app for the FAA.ZONE brands.'}"
APP NAME: ${appName}
TYPE: ${appType}
ROLES: ${JSON.stringify(userRoles)}
${hasCustomColors ? `BRAND COLORS (MUST use exactly): primary=${customColors.primary} secondary=${customColors.secondary} accent=${customColors.accent}` : ''}
${refFiles.length > 0 ? `REFERENCE FILES: ${refFiles.length} file(s) attached — analyze and incorporate their style.` : ''}

REAL BRANDS (${selectedBrands.length}):
${JSON.stringify(brandsSummary)}

═══ CONTENT REQUIREMENTS — THIS IS CRITICAL ═══

GENERATE 6-8 PAGES. Every page MUST have 4-6 contentBlocks. Every block MUST have 6-12 items with REAL, SPECIFIC data.

BLOCK TYPES & WHAT EACH MUST CONTAIN:

1. "hero" — badge (short tagline), title (bold headline), body (2-sentence description), ctaLabel (button text)

2. "kpi_grid" — 4 items, each with: label (metric name), value (REAL number like "12,847" or "$284K" or "94.2%"), sub (trend like "↑ 12% vs last month" or "3,201 active"), icon (one of: trending_up, users, package, dollar_sign, shopping_cart, eye, star, activity)

3. "card_grid" — 6-9 items, each with: name (real product/brand/item name), description (1-sentence specific description), sector or category (real category), status (active/pending/featured), metric (real number like "234 orders" or "$12K revenue")

4. "data_table" — 6-10 items (ROWS), each with 4-5 fields. Use real field names like: name, email, status, amount, date, orderId, sector, revenue. Fill EVERY field with REAL data (real names, real amounts like "$1,247", real statuses like "completed" or "pending", real dates like "2026-07-14").

5. "chart" — 8-12 items, each with: label (month/category name like "Jan", "Feb" or brand name), value (real number like 842, 1203, 967). These render as bar charts.

6. "activity_feed" — 6-10 items, each with: message (full sentence like "Sarah M. placed order #ORD-2847 for $1,247"), time (relative like "2m ago", "1h ago", "3d ago"), user (real-sounding name)

7. "timeline" — 5-8 items, each with: title (event name), description (1 sentence), time (date or relative)

8. "stat_list" — 6-8 items, each with: label (metric name), value (real number), sub (context like "of 500 target")

9. "form" — 4-6 items, each with: label (field name like "Email Address" or "Brand Name"), type (text/email/number/select/textarea)

10. "split_panel" — left side: title + body (paragraph). right side: 4-5 items with name + description.

11. "image_gallery" — 6 items, each with: name (real item name), category (real category)

12. "cta" — title (headline), body (1 sentence), items[0].label (button text)

LAYOUT-TO-BLOCK MAPPING (follow this for each page):
- "dashboard": kpi_grid + chart + data_table + activity_feed
- "list": hero + card_grid + data_table
- "detail": hero + split_panel + stat_list + card_grid
- "landing": hero + card_grid + cta
- "analytics": kpi_grid + chart + stat_list + data_table
- "settings": form + split_panel
- "form": form + split_panel
- "split": split_panel + card_grid

ALSO GENERATE:
- 8-10 features: name, description (specific — what it does, not generic), relatedBrands (real brand names from the list)
- 5-8 crossPollination: brand1, brand2 (real names), connectionType (supply_chain|data_share|co_brand|referral|bundle), feature (specific), synergyScore (60-95)
- 5-7 databaseSchema: tableName, fields (array of "name:type" like "id:string", "created_at:date", "amount:number"), relationships (array)
- techStack: frontend (array), backend (array), database (string)
- rolePermissions: roles array, each with name, permissions (array of specific strings), description
- loyaltyProgram (if 3+ sectors): programName, earnRate, tiers (array), crossBrandBenefits (array)

EVERY string must be specific and real. Examples of GOOD content:
- name: "Artisan Pottery Collection" (not "Product 1")
- description: "Hand-thrown ceramic vessels from master potters in KwaZulu-Natal" (not "A product description")
- value: "12,847" (not "123")
- message: "Thandiwe N. completed order #ORD-9241 for R3,240 — Banimal Leather Tote" (not "New order received")

Return ONLY the JSON object. Make it world-class.`,
        file_urls: refFiles.length > 0 ? refFiles : undefined,
        response_json_schema: {
          type: 'object',
          properties: {
            appName:     { type: 'string' },
            tagline:     { type: 'string' },
            colorScheme: { type: 'object', properties: { primary: { type: 'string' }, secondary: { type: 'string' }, accent: { type: 'string' } } },
            pages: { type: 'array', items: { type: 'object', properties: {
              name: { type: 'string' },
              route: { type: 'string' },
              description: { type: 'string' },
              layout: { type: 'string' },
              sections: { type: 'array', items: { type: 'string' } },
              contentBlocks: { type: 'array', items: { type: 'object', properties: {
                type: { type: 'string' },
                title: { type: 'string' },
                body: { type: 'string' },
                badge: { type: 'string' },
                ctaLabel: { type: 'string' },
                items: { type: 'array', items: { type: 'object', properties: {
                  name: { type: 'string' },
                  title: { type: 'string' },
                  label: { type: 'string' },
                  description: { type: 'string' },
                  body: { type: 'string' },
                  value: { type: 'string' },
                  count: { type: 'string' },
                  sub: { type: 'string' },
                  trend: { type: 'string' },
                  metric: { type: 'string' },
                  sector: { type: 'string' },
                  category: { type: 'string' },
                  status: { type: 'string' },
                  message: { type: 'string' },
                  time: { type: 'string' },
                  date: { type: 'string' },
                  user: { type: 'string' },
                  icon: { type: 'string' },
                  type: { type: 'string' },
                  amount: { type: 'string' },
                  orderId: { type: 'string' },
                  email: { type: 'string' },
                  revenue: { type: 'string' },
                  price: { type: 'string' },
                } } }
              } } }
            } } },
            features: { type: 'array', items: { type: 'object', properties: { name: { type: 'string' }, description: { type: 'string' }, relatedBrands: { type: 'array', items: { type: 'string' } } } } },
            crossPollination: { type: 'array', items: { type: 'object', properties: { brand1: { type: 'string' }, brand2: { type: 'string' }, connectionType: { type: 'string' }, feature: { type: 'string' }, synergyScore: { type: 'number' } } } },
            databaseSchema: { type: 'array', items: { type: 'object', properties: { tableName: { type: 'string' }, fields: { type: 'array', items: { type: 'string' } }, relationships: { type: 'array', items: { type: 'string' } } } } },
            techStack: { type: 'object', properties: { frontend: { type: 'array', items: { type: 'string' } }, backend: { type: 'array', items: { type: 'string' } }, database: { type: 'string' } } },
            rolePermissions: { type: 'object', properties: { roles: { type: 'array', items: { type: 'object', properties: { name: { type: 'string' }, permissions: { type: 'array', items: { type: 'string' } }, description: { type: 'string' } } } } } },
            loyaltyProgram: { type: 'object', properties: { programName: { type: 'string' }, earnRate: { type: 'string' }, tiers: { type: 'array', items: { type: 'string' } }, crossBrandBenefits: { type: 'array', items: { type: 'string' } } } },
          },
        },
      });

      setIsGenerating(false);
      // Override AI colors with user's custom colors if provided
      const finalResult = hasCustomColors
        ? { ...result, colorScheme: { ...result.colorScheme, ...customColors } }
        : result;
      onGenerated({ ...finalResult, appName, vibePrompt, appType, userRoles, selectedBrands, customization, generatedAt: new Date().toISOString() });
      toast.success('🔥 HotStack™ app generated!');
    } catch (err) {
      setIsGenerating(false);
      console.error('HotStack generation error:', err);
      const msg = err?.message || err?.data?.error || 'Unknown error';
      toast.error(`Generation failed: ${msg}. Try fewer brands.`, { duration: 6000 });
    }
  };

  if (isGenerating) {
    return (
      <div className="max-w-xl mx-auto pt-16 pb-8 text-center space-y-8">
        <div className="text-5xl">🔥</div>
        <h2 className="text-3xl font-black text-white">HotStack™ is building…</h2>
        <div className="rounded-2xl p-6 font-mono text-sm text-left space-y-3 border border-stone-700"
          style={{ background: '#0d0b10' }}>
          {LOADING_STEPS.map((s, idx) => (
            <div key={idx} className={`flex items-center gap-2.5 transition-all duration-500 ${
              idx < loadingStep ? 'text-green-400' : idx === loadingStep ? 'text-orange-300 animate-pulse' : 'text-stone-700'
            }`}>
              {idx < loadingStep
                ? <CheckCircle2 className="w-4 h-4 shrink-0 text-green-400" />
                : <div className={`w-4 h-4 border rounded-full shrink-0 ${idx === loadingStep ? 'border-orange-500 animate-spin' : 'border-stone-700'}`} />
              }
              {s}
            </div>
          ))}
        </div>
        <div className="space-y-1">
          <p className="text-stone-500 text-sm">Using {selectedBrands.length} real brands · {selectedBrands.reduce((s, b) => s + (b.subnodes?.length || 0), 0)} subnodes</p>
          <p className="text-stone-700 text-xs">No mock data · Powered by FAA.ZONE ecosystem</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pt-6 space-y-8">
      <div>
        <p className="text-orange-500 text-xs font-black tracking-widest uppercase mb-1.5">Step 3 — Configure & Build</p>
        <h2 className="text-3xl font-black text-white flex items-center gap-2.5">
          <Zap className="w-7 h-7 text-orange-500" />
          Finalise your HotStack™ build
        </h2>
      </div>

      {/* Vibe preview */}
      {vibePrompt && (
        <div className="rounded-xl p-5 border border-stone-700" style={{ background: '#111019' }}>
          <p className="text-orange-500 text-[10px] font-black tracking-widest uppercase mb-2">Your Vibe Prompt</p>
          <p className="text-stone-300 text-sm leading-relaxed font-mono">"{vibePrompt}"</p>
        </div>
      )}

      {/* Brand summary */}
      <div className="rounded-xl p-5 border" style={{ background: '#111019', borderColor: 'rgba(249,115,22,0.18)' }}>
        <p className="text-orange-500 text-[10px] font-black tracking-widest uppercase mb-3">
          Stacked Brands ({selectedBrands.length})
        </p>
        <div className="flex flex-wrap gap-2">
          {selectedBrands.map(b => (
            <span key={b.id} className="flex items-center gap-1 bg-stone-800 border border-stone-700 text-stone-300 text-xs font-bold px-2.5 py-1 rounded-full">
              {b.name}™
              {b.subnodes?.length > 0 && <span className="ml-0.5 text-orange-500">{b.subnodes.length}n</span>}
            </span>
          ))}
        </div>
      </div>

      {/* Config */}
      <div className="space-y-5 rounded-xl p-6 border border-stone-800" style={{ background: '#111019' }}>

        {/* App name */}
        <div>
          <label className="text-stone-400 text-xs font-black uppercase tracking-wider mb-2 block">App Name *</label>
          <input
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            placeholder="e.g. FAA Artisan Hub"
            className="w-full px-4 py-2.5 rounded-xl border border-stone-700 bg-stone-900 text-white placeholder-stone-600 text-sm focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>

        {/* App Type */}
        <div>
          <label className="text-stone-400 text-xs font-black uppercase tracking-wider mb-2 block">App Type</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {APP_TYPES.map(t => (
              <button key={t.val} onClick={() => setAppType(t.val)}
                className="px-3 py-2.5 rounded-xl border text-xs font-bold transition-all text-left"
                style={appType === t.val
                  ? { background: 'rgba(249,115,22,0.12)', borderColor: '#f97316', color: '#f97316' }
                  : { borderColor: 'rgb(68,64,60)', color: 'rgb(120,113,108)', background: 'transparent' }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* User Roles */}
        <div>
          <label className="text-stone-400 text-xs font-black uppercase tracking-wider mb-2 block flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" /> User Roles
          </label>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {userRoles.map((r, i) => (
              <button key={i} onClick={() => setUserRoles(userRoles.filter((_, idx) => idx !== i))}
                className="flex items-center gap-1 bg-stone-800 border border-stone-700 text-stone-300 text-xs font-bold px-2.5 py-1 rounded-full hover:border-red-500/50 hover:text-red-300 transition-all">
                {r} <X className="w-2.5 h-2.5" />
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              placeholder="Add role…"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newRole.trim() && !userRoles.includes(newRole.trim())) {
                  setUserRoles([...userRoles, newRole.trim()]);
                  setNewRole('');
                }
              }}
              className="flex-1 px-4 py-2.5 rounded-xl border border-stone-700 bg-stone-900 text-white placeholder-stone-600 text-sm focus:outline-none focus:border-orange-500 transition-colors"
            />
            <button
              onClick={() => {
                if (newRole.trim() && !userRoles.includes(newRole.trim())) {
                  setUserRoles([...userRoles, newRole.trim()]);
                  setNewRole('');
                }
              }}
              className="px-4 py-2.5 rounded-xl border border-stone-700 text-stone-300 hover:bg-stone-800 text-sm font-bold transition-all shrink-0">
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between pt-2">
        <button onClick={onBack}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-stone-700 text-stone-300 hover:bg-stone-800 text-sm font-bold transition-all">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={generate}
          disabled={!appName.trim()}
          className="flex items-center gap-2 px-10 py-3 rounded-xl text-base font-black transition-all disabled:opacity-30 disabled:cursor-not-allowed text-black"
          style={{ background: appName.trim() ? 'linear-gradient(135deg, #f97316, #f59e0b)' : '#444' }}>
          🔥 Generate with HotStack™
        </button>
      </div>
    </div>
  );
}
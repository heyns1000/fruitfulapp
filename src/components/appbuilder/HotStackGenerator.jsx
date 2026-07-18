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
        prompt: `You are HotStack™, an AI app builder. Generate a production-grade app blueprint as JSON.

VIBE: "${vibePrompt || 'Build a full ecosystem app for the FAA.ZONE brands.'}"
APP NAME: ${appName}
TYPE: ${appType}
ROLES: ${JSON.stringify(userRoles)}
${hasCustomColors ? `BRAND COLORS (use these exact hex): primary=${customColors.primary} secondary=${customColors.secondary} accent=${customColors.accent}` : ''}
${refFiles.length > 0 ? `REFERENCE FILES: ${refFiles.length} file(s) attached — incorporate their style.` : ''}

BRANDS (${selectedBrands.length}):
${JSON.stringify(brandsSummary)}

RULES:
- Use every subnode from every brand somewhere in pages/features/content.
- Reference brand metadata (layer, securityRating, activeNodes) where relevant.
- 5-8 pages, each with layout + 3-6 contentBlocks (type, title, body, items with real data).
- Layouts: dashboard|list|detail|form|landing|analytics|settings|split
- Block types: hero|kpi_grid|card_grid|data_table|chart|form|timeline|cta|split_panel|stat_list|image_gallery|activity_feed
- 6-10 features mapped to real brands. 4-8 cross-pollination pairs (synergyScore 60-95).
- 4-7 database tables. Loyalty program if 3+ sectors. Role permissions for provided roles.
- Sophisticated color palette (not generic blue/purple). No placeholders — real content only.

Return ONLY the JSON object.`,
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
                items: { type: 'array', items: { type: 'object' } }
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
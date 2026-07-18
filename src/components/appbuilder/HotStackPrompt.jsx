import React, { useState } from 'react';
import { ArrowRight, Sparkles, Zap, Globe, Smartphone, Database, Layers, Code2, Command } from 'lucide-react';

const VIBE_STARTERS = [
  { icon: '🏺', label: 'Artisan Marketplace',  prompt: 'Build a premium artisan marketplace that connects heritage craft makers with conscious buyers. Include artisan profiles, product galleries, subscription boxes, and a loyalty rewards system.', tag: 'E-commerce' },
  { icon: '🌍', label: 'Cross-Sector Hub',      prompt: 'Create an ecosystem dashboard that shows cross-pollination between agriculture, fashion, and logistics brands. Include synergy scoring, collaboration proposals, and a unified analytics view.', tag: 'Dashboard' },
  { icon: '🎨', label: 'Creative Studio',       prompt: 'Build a creative studio platform for artists and designers to showcase work, sell digital products, manage commissions, and collaborate with brands in the creative sector.', tag: 'Platform' },
  { icon: '🪙', label: 'Loyalty Engine',        prompt: 'Generate a full loyalty and rewards platform for the FAA ecosystem. Members earn points across all brands, unlock tier benefits, and redeem curated offers from artisans.', tag: 'Loyalty' },
  { icon: '📦', label: 'Sub Box Platform',      prompt: 'Build a subscription box platform where artisans curate monthly collections. Include gift options, customization flows, subscriber dashboards, and shipping management.', tag: 'Subscription' },
  { icon: '🤝', label: 'B2B Collaboration',     prompt: 'Create a B2B collaboration suite for ecosystem brands to propose joint ventures, co-brand products, share data, and track synergy performance metrics.', tag: 'B2B' },
];

const FEATURES = [
  { icon: Database,   title: 'Real Brand Data',       desc: 'Pulls directly from your live FAA.ZONE Brand database — no placeholders.', color: '#fbbf24' },
  { icon: Globe,      title: 'Cross-Pollination AI',   desc: 'Discovers synergies between your brands and generates collaboration features.', color: '#2dd4bf' },
  { icon: Code2,      title: 'Export-Ready Code',      desc: 'Download full React starter code, README, and JSON schema.', color: '#a78bfa' },
];

export default function HotStackPrompt({ vibePrompt, setVibePrompt, onNext }) {
  const [focused, setFocused] = useState(false);
  const charCount = vibePrompt.length;
  const minChars = 10;
  const ready = vibePrompt.trim().length >= minChars;

  return (
    <div className="max-w-5xl mx-auto px-1 pt-6 pb-4">

      {/* ── Compact hero ── */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase mb-4"
          style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)', color: '#f97316' }}>
          <Sparkles className="w-3 h-3" />
          HotStack™ Vibe Builder
          <span className="text-stone-600">·</span>
          <span className="text-stone-500 normal-case tracking-normal">Real Ecosystem Data</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white leading-[1.1] tracking-tight mb-2.5">
          What do you want{' '}
          <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">
            to build today?
          </span>
        </h1>
        <p className="text-stone-500 text-sm max-w-xl leading-relaxed">
          Describe your app in plain language. HotStack™ pulls real brand data from your FAA ecosystem — no mocks, no fake data.
        </p>
      </div>

      {/* ── Prompt editor — IDE-style ── */}
      <div className={`relative rounded-xl transition-all duration-200 ${focused ? 'ring-1 ring-orange-500/40' : ''}`}
        style={{ background: '#0d0b12', border: '1px solid rgba(255,255,255,0.06)' }}>
        {/* Window chrome */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
          </div>
          <span className="text-stone-600 text-xs ml-2 font-mono">hotstack_prompt.txt</span>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-[10px] font-mono text-stone-700 hidden sm:inline">⌘ + Enter to submit</span>
            <span className="text-[10px] font-mono" style={{ color: vibePrompt ? '#f97316' : 'rgb(87,83,78)' }}>
              {charCount} chars
            </span>
          </div>
        </div>
        {/* Textarea */}
        <textarea
          value={vibePrompt}
          onChange={(e) => setVibePrompt(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && ready) onNext();
          }}
          placeholder="e.g. Build a marketplace for African heritage artisans with subscription boxes, loyalty rewards, and artisan profiles..."
          className="w-full bg-transparent text-white placeholder-stone-700 text-sm p-4 resize-none h-32 focus:outline-none font-mono leading-relaxed"
          style={{ caretColor: '#f97316' }}
        />
        {/* Footer bar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full transition-colors ${ready ? 'bg-emerald-400' : 'bg-stone-700'}`} />
            <span className="text-stone-600 text-xs font-mono">
              {ready ? 'Ready to stack →' : `Need ${minChars - vibePrompt.trim().length} more chars`}
            </span>
          </div>
          <button
            onClick={onNext}
            disabled={!ready}
            className="flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed text-black"
            style={{ background: ready ? 'linear-gradient(135deg, #f97316, #f59e0b)' : '#3a3a3a' }}
          >
            Stack Brands <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── Templates — dense grid ── */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-3">
          <p className="text-stone-600 text-[11px] font-black tracking-widest uppercase">Or start from a template</p>
          <span className="text-stone-700 text-[11px] font-mono">{VIBE_STARTERS.length} templates</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {VIBE_STARTERS.map((s) => (
            <button
              key={s.label}
              onClick={() => setVibePrompt(s.prompt)}
              className="group p-3.5 text-left rounded-lg transition-all duration-150 hover:scale-[1.02]"
              style={{ background: '#0d0b12', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl">{s.icon}</span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded text-stone-600"
                  style={{ background: 'rgba(255,255,255,0.04)' }}>
                  {s.tag}
                </span>
              </div>
              <p className="text-white font-bold text-xs group-hover:text-orange-300 transition-colors leading-tight">{s.label}</p>
              <p className="text-stone-600 text-[11px] mt-1 line-clamp-2 leading-relaxed">{s.prompt.slice(0, 55)}…</p>
            </button>
          ))}
        </div>
      </div>

      {/* ── Feature strip — compact ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-6">
        {FEATURES.map((f) => {
          const Icon = f.icon;
          return (
            <div key={f.title} className="p-3.5 rounded-lg flex items-start gap-3"
              style={{ background: '#0d0b12', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: `${f.color}15`, border: `1px solid ${f.color}25` }}>
                <Icon className="w-4 h-4" style={{ color: f.color }} />
              </div>
              <div className="min-w-0">
                <p className="text-white font-bold text-xs">{f.title}</p>
                <p className="text-stone-600 text-[11px] mt-0.5 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
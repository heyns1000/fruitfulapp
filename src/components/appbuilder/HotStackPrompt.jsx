import React, { useState } from 'react';
import { ArrowRight, Sparkles, Zap, Globe, Smartphone } from 'lucide-react';

const VIBE_STARTERS = [
  { icon: '🏺', label: 'Artisan Marketplace',  prompt: 'Build a premium artisan marketplace that connects heritage craft makers with conscious buyers. Include artisan profiles, product galleries, subscription boxes, and a loyalty rewards system.' },
  { icon: '🌍', label: 'Cross-Sector Hub',      prompt: 'Create an ecosystem dashboard that shows cross-pollination between agriculture, fashion, and logistics brands. Include synergy scoring, collaboration proposals, and a unified analytics view.' },
  { icon: '🎨', label: 'Creative Studio',       prompt: 'Build a creative studio platform for artists and designers to showcase work, sell digital products, manage commissions, and collaborate with brands in the creative sector.' },
  { icon: '🪙', label: 'Loyalty Engine',        prompt: 'Generate a full loyalty and rewards platform for the FAA ecosystem. Members earn points across all brands, unlock tier benefits, and redeem curated offers from artisans.' },
  { icon: '📦', label: 'Sub Box Platform',      prompt: 'Build a subscription box platform where artisans curate monthly collections. Include gift options, customization flows, subscriber dashboards, and shipping management.' },
  { icon: '🤝', label: 'B2B Collaboration',     prompt: 'Create a B2B collaboration suite for ecosystem brands to propose joint ventures, co-brand products, share data, and track synergy performance metrics.' },
];

export default function HotStackPrompt({ vibePrompt, setVibePrompt, onNext }) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="max-w-4xl mx-auto pt-8 pb-4 space-y-10">

      {/* Hero */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-black tracking-widest uppercase"
          style={{ background: 'rgba(249,115,22,0.08)', borderColor: 'rgba(249,115,22,0.25)', color: '#f97316' }}>
          <Sparkles className="w-3.5 h-3.5" />
          HotStack™ Vibe Builder — Real Ecosystem Data
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight tracking-tight">
          What do you want<br />
          <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">
            to build today?
          </span>
        </h1>
        <p className="text-stone-400 text-lg max-w-2xl mx-auto leading-relaxed">
          Describe your app in plain language. HotStack™ pulls real brand data from your FAA ecosystem — no mocks, no fake data.
        </p>
      </div>

      {/* Prompt box */}
      <div className={`relative rounded-2xl transition-all duration-300 border-2 ${focused ? 'border-orange-500 shadow-xl shadow-orange-500/10' : 'border-stone-700'}`}
        style={{ background: '#111019' }}>
        {/* Fake window chrome */}
        <div className="flex items-center gap-2 px-4 pt-4 pb-2 border-b border-stone-800">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
          <span className="text-stone-600 text-xs ml-2 font-mono">hotstack_prompt.txt</span>
          <span className="ml-auto text-[10px] font-mono" style={{ color: vibePrompt ? '#f97316' : 'rgb(87,83,78)' }}>
            {vibePrompt ? `${vibePrompt.length} chars` : 'empty'}
          </span>
        </div>
        <textarea
          value={vibePrompt}
          onChange={(e) => setVibePrompt(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="e.g. Build a marketplace for African heritage artisans with subscription boxes, loyalty rewards, and artisan profiles..."
          className="w-full bg-transparent text-white placeholder-stone-700 text-base p-5 resize-none h-44 focus:outline-none font-mono leading-relaxed"
          style={{ caretColor: '#f97316' }}
        />
        <div className="flex items-center justify-between px-5 py-3 border-t border-stone-800">
          <span className="text-stone-600 text-xs font-mono">
            {vibePrompt.length > 0 ? `${vibePrompt.length} chars · ready to stack →` : 'Type your vibe or pick a template below'}
          </span>
          <button
            onClick={onNext}
            disabled={vibePrompt.trim().length < 10}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed text-black"
            style={{ background: vibePrompt.trim().length >= 10 ? 'linear-gradient(135deg, #f97316, #f59e0b)' : '#444' }}
          >
            Stack Brands <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Templates */}
      <div>
        <p className="text-stone-600 text-xs font-black tracking-widest uppercase mb-4">— Or start from a template</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {VIBE_STARTERS.map((s) => (
            <button
              key={s.label}
              onClick={() => setVibePrompt(s.prompt)}
              className="group p-4 text-left rounded-xl border border-stone-800 transition-all duration-200 hover:border-orange-500/40"
              style={{ background: '#111019' }}
            >
              <span className="text-2xl block mb-2.5">{s.icon}</span>
              <p className="text-white font-bold text-sm group-hover:text-orange-300 transition-colors">{s.label}</p>
              <p className="text-stone-600 text-xs mt-1 line-clamp-2">{s.prompt.slice(0, 60)}…</p>
            </button>
          ))}
        </div>
      </div>

      {/* Feature strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: <Zap className="w-5 h-5 text-yellow-400" />,    title: 'Real Brand Data',      desc: 'Pulls directly from your live FAA.ZONE Brand database — no placeholders.' },
          { icon: <Globe className="w-5 h-5 text-teal-400" />,    title: 'Cross-Pollination AI',  desc: 'Discovers synergies between your brands and generates collaboration features.' },
          { icon: <Smartphone className="w-5 h-5 text-violet-400" />, title: 'Export-Ready Code', desc: 'Download full React starter code, README, and JSON schema.' },
        ].map((f) => (
          <div key={f.title} className="p-4 rounded-xl border border-stone-800" style={{ background: '#111019' }}>
            <div className="mb-2.5">{f.icon}</div>
            <p className="text-white font-bold text-sm">{f.title}</p>
            <p className="text-stone-600 text-xs mt-1 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
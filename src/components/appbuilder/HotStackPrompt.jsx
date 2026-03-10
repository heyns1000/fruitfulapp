import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Zap, Globe, Smartphone, Package } from 'lucide-react';

const VIBE_STARTERS = [
  { icon: '🏺', label: 'Artisan Marketplace', prompt: 'Build a premium artisan marketplace that connects heritage craft makers with conscious buyers. Include artisan profiles, product galleries, subscription boxes, and a loyalty rewards system.' },
  { icon: '🌍', label: 'Cross-Sector Hub', prompt: 'Create an ecosystem dashboard that shows cross-pollination between agriculture, fashion, and logistics brands. Include synergy scoring, collaboration proposals, and a unified analytics view.' },
  { icon: '🎨', label: 'Creative Studio', prompt: 'Build a creative studio platform for artists and designers to showcase work, sell digital products, manage commissions, and collaborate with brands in the creative sector.' },
  { icon: '🪙', label: 'Loyalty Engine', prompt: 'Generate a full loyalty and rewards platform for the FAA ecosystem. Members earn points across all brands, unlock tier benefits, and redeem curated offers from artisans.' },
  { icon: '📦', label: 'Sub Box Platform', prompt: 'Build a subscription box platform where artisans curate monthly collections. Include gift options, customization flows, subscriber dashboards, and shipping management.' },
  { icon: '🤝', label: 'B2B Collaboration', prompt: 'Create a B2B collaboration suite for ecosystem brands to propose joint ventures, co-brand products, share data, and track synergy performance metrics.' },
];

export default function HotStackPrompt({ vibePrompt, setVibePrompt, onNext }) {
  const [focused, setFocused] = useState(false);

  const handleStarter = (starter) => {
    setVibePrompt(starter.prompt);
  };

  return (
    <div className="max-w-4xl mx-auto pt-8 pb-4 space-y-10">
      {/* Hero */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-full px-4 py-1.5 text-orange-400 text-xs font-bold tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          HotStack™ Vibe Builder — Real Ecosystem Data
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight">
          What do you want<br />
          <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">to build today?</span>
        </h1>
        <p className="text-stone-400 text-lg max-w-2xl mx-auto">
          Describe your app in plain language. HotStack™ pulls real brand data from your FAA ecosystem — no mocks, no fake data.
        </p>
      </div>

      {/* Prompt textarea */}
      <div className={`relative rounded-2xl border-2 transition-all duration-300 ${focused ? 'border-orange-500 shadow-lg shadow-orange-500/10' : 'border-stone-700'} bg-stone-900`}>
        <div className="flex items-center gap-2 px-4 pt-4 pb-2 border-b border-stone-800">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <div className="w-2 h-2 rounded-full bg-amber-500" />
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-stone-600 text-xs ml-2 font-mono">hotstack_prompt.txt</span>
        </div>
        <textarea
          value={vibePrompt}
          onChange={(e) => setVibePrompt(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="e.g. Build a marketplace for African heritage artisans with subscription boxes, loyalty rewards, and artisan profiles..."
          className="w-full bg-transparent text-white placeholder:text-stone-600 text-base p-5 resize-none h-40 focus:outline-none font-mono leading-relaxed"
        />
        <div className="flex items-center justify-between px-5 py-3 border-t border-stone-800">
          <span className="text-stone-600 text-xs font-mono">
            {vibePrompt.length > 0 ? `${vibePrompt.length} chars · ready to stack →` : 'Type your vibe or pick a starter below'}
          </span>
          <Button
            onClick={onNext}
            disabled={vibePrompt.trim().length < 10}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-black rounded-xl px-6 disabled:opacity-30 disabled:cursor-not-allowed gap-2"
          >
            Stack Brands <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Vibe starters */}
      <div>
        <p className="text-stone-500 text-xs font-bold tracking-widest uppercase mb-4">— Or start from a template</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {VIBE_STARTERS.map((s) => (
            <button
              key={s.label}
              onClick={() => handleStarter(s)}
              className="group p-4 bg-stone-900 border border-stone-800 rounded-xl text-left hover:border-orange-500/50 hover:bg-stone-800 transition-all duration-200"
            >
              <span className="text-2xl block mb-2">{s.icon}</span>
              <p className="text-white font-bold text-sm group-hover:text-orange-300 transition-colors">{s.label}</p>
              <p className="text-stone-500 text-xs mt-1 line-clamp-2">{s.prompt.slice(0, 60)}…</p>
            </button>
          ))}
        </div>
      </div>

      {/* Features grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        {[
          { icon: <Zap className="w-5 h-5 text-yellow-400" />, title: 'Real Brand Data', desc: 'Pulls directly from your live FAA.ZONE Brand database — no placeholders.' },
          { icon: <Globe className="w-5 h-5 text-teal-400" />, title: 'Cross-Pollination AI', desc: 'Discovers synergies between your brands and generates collaboration features.' },
          { icon: <Smartphone className="w-5 h-5 text-purple-400" />, title: 'Export-Ready', desc: 'Download full React/Vue/Next.js starter code, README, and schema.' },
        ].map((f) => (
          <div key={f.title} className="p-4 bg-stone-900/60 border border-stone-800 rounded-xl">
            <div className="mb-2">{f.icon}</div>
            <p className="text-white font-bold text-sm">{f.title}</p>
            <p className="text-stone-500 text-xs mt-1">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
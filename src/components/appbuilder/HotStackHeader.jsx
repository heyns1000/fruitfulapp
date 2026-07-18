import React from 'react';
import { ChevronRight, Check } from 'lucide-react';

const STEPS = [
  { key: 'prompt',    label: 'Vibe',      icon: '✦' },
  { key: 'brands',    label: 'Stack',     icon: '⬡' },
  { key: 'customize', label: 'Customize', icon: '◐' },
  { key: 'generate',  label: 'Build',      icon: '⚡' },
  { key: 'preview',   label: 'Ship',       icon: '→' },
];

export default function HotStackHeader({ step, setStep, selectedBrands, generatedApp }) {
  const canNavigate = (key) => {
    if (key === 'prompt')     return true;
    if (key === 'brands')     return true;
    if (key === 'customize')  return selectedBrands.length > 0;
    if (key === 'generate')   return selectedBrands.length > 0;
    if (key === 'preview')    return !!generatedApp;
    return false;
  };

  const currentIdx = STEPS.findIndex(x => x.key === step);

  return (
    <header className="sticky top-0 z-50 border-b backdrop-blur-xl"
      style={{ background: 'rgba(8,7,11,0.8)', borderColor: 'rgba(255,255,255,0.05)' }}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between py-3 gap-4">

          {/* Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
              style={{ background: 'linear-gradient(135deg, #f97316, #dc2626)', boxShadow: '0 4px 12px rgba(249,115,22,0.25)' }}>
              🔥
            </div>
            <div>
              <div className="font-black text-white text-base leading-none tracking-tight">HotStack™</div>
              <div className="text-orange-500 text-[9px] font-bold tracking-widest uppercase leading-none mt-1">Vibe Builder</div>
            </div>
            <div className="hidden sm:block h-5 w-px ml-1.5" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <span className="hidden sm:block text-stone-600 text-xs font-mono">FAA.ZONE</span>
          </div>

          {/* Step breadcrumb */}
          <div className="flex items-center gap-0.5 p-1 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.04)' }}>
            {STEPS.map((s, idx) => {
              const isActive = step === s.key;
              const isPast = currentIdx > idx;
              const canGo = canNavigate(s.key);
              return (
                <React.Fragment key={s.key}>
                  <button
                    onClick={() => canGo && setStep(s.key)}
                    disabled={!canGo}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all"
                    style={
                      isActive
                        ? { background: 'rgba(249,115,22,0.15)', color: '#fb923c', boxShadow: 'inset 0 0 0 1px rgba(249,115,22,0.3)' }
                        : isPast && canGo
                        ? { color: '#78716c', cursor: 'pointer' }
                        : canGo
                        ? { color: '#57534e', cursor: 'pointer' }
                        : { color: '#292524', cursor: 'not-allowed' }
                    }
                  >
                    {isPast && !isActive
                      ? <Check className="w-3 h-3 text-emerald-400" />
                      : <span className="text-[11px]">{s.icon}</span>
                    }
                    <span className="hidden sm:inline">{s.label}</span>
                  </button>
                  {idx < STEPS.length - 1 && (
                    <ChevronRight className="w-3 h-3 text-stone-800 shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Ecosystem stats */}
          <div className="hidden md:flex items-center gap-3 text-xs shrink-0">
            {selectedBrands.length > 0 && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold"
                style={{ background: 'rgba(249,115,22,0.08)', color: '#fb923c' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                {selectedBrands.length} stacked
              </span>
            )}
            <span className="text-stone-700 font-mono text-[11px]">Real data · No mocks</span>
          </div>
        </div>
      </div>
    </header>
  );
}
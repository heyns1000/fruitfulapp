import React from 'react';
import { ChevronRight } from 'lucide-react';

const STEPS = [
  { key: 'prompt',   label: 'Vibe',  icon: '✦' },
  { key: 'brands',   label: 'Stack', icon: '⬡' },
  { key: 'generate', label: 'Build', icon: '⚡' },
  { key: 'preview',  label: 'Ship',  icon: '🚀' },
];

export default function HotStackHeader({ step, setStep, selectedBrands, generatedApp }) {
  const canNavigate = (key) => {
    if (key === 'prompt')   return true;
    if (key === 'brands')   return true;
    if (key === 'generate') return selectedBrands.length > 0;
    if (key === 'preview')  return !!generatedApp;
    return false;
  };

  const currentIdx = STEPS.findIndex(x => x.key === step);

  return (
    <header className="sticky top-0 z-50 border-b border-stone-800/60"
      style={{ background: 'rgba(12,10,15,0.95)', backdropFilter: 'blur(12px)' }}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between py-3 gap-4">

          {/* Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-lg shadow-lg shadow-orange-500/20">
              🔥
            </div>
            <div>
              <div className="font-black text-white text-lg leading-none tracking-tight">HotStack™</div>
              <div className="text-orange-500 text-[10px] font-bold tracking-widest uppercase leading-none mt-0.5">Vibe Builder</div>
            </div>
            <div className="hidden sm:block h-5 w-px bg-stone-800 ml-1" />
            <span className="hidden sm:block text-stone-600 text-xs">FAA.ZONE Ecosystem</span>
          </div>

          {/* Step breadcrumb */}
          <div className="flex items-center gap-1">
            {STEPS.map((s, idx) => {
              const isActive = step === s.key;
              const isPast = currentIdx > idx;
              const canGo = canNavigate(s.key);
              return (
                <React.Fragment key={s.key}>
                  <button
                    onClick={() => canGo && setStep(s.key)}
                    disabled={!canGo}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                    style={
                      isActive
                        ? { background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.6)', color: '#fb923c' }
                        : isPast && canGo
                        ? { color: 'rgb(120,113,108)', cursor: 'pointer', border: '1px solid transparent' }
                        : canGo
                        ? { color: 'rgb(87,83,78)', cursor: 'pointer', border: '1px solid transparent' }
                        : { color: 'rgb(41,37,36)', cursor: 'not-allowed', border: '1px solid transparent' }
                    }
                  >
                    <span className={isPast && !isActive ? 'text-green-400' : ''}>{isPast && !isActive ? '✓' : s.icon}</span>
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
          <div className="hidden md:flex items-center gap-4 text-xs text-stone-600 shrink-0">
            {selectedBrands.length > 0 && (
              <span className="text-orange-500 font-black">{selectedBrands.length} brands stacked</span>
            )}
            <span>Real data · No mocks</span>
          </div>
        </div>
      </div>
    </header>
  );
}
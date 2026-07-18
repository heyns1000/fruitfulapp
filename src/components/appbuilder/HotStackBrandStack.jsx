import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search, Check, X, ArrowRight, ArrowLeft, Layers } from 'lucide-react';
import { toast } from 'sonner';

const SECTOR_ICONS = {
  agriculture: '🌱', fsf: '🥦', banking: '🏦', creative: '🖋️', logistics: '📦',
  'education-ip': '📚', fashion: '✂️', gaming: '🎮', health: '🧠', housing: '🏗️',
  justice: '⚖️', knowledge: '📖', micromesh: '☰', media: '🎬', nutrition: '✿',
  'ai-logic': '🤖', packaging: '📦', quantum: '✴️', ritual: '☯️', saas: '🔑',
  trade: '🧺', utilities: '🔋', voice: '🎙️', webless: '📡', nft: '🔁',
  'education-youth': '🎓', zerowaste: '♻️', professional: '🧾', 'payroll-mining': '🪙',
  mining: '⛏️', wildlife: '🦁',
};

const SECTOR_ACCENT = {
  agriculture: '#22c55e', fsf: '#86efac', banking: '#60a5fa', creative: '#a78bfa',
  logistics: '#fb923c', 'education-ip': '#facc15', fashion: '#f472b6', gaming: '#818cf8',
  health: '#34d399', housing: '#94a3b8', justice: '#fbbf24', knowledge: '#67e8f9',
  media: '#f87171', nutrition: '#4ade80', 'ai-logic': '#c084fc', saas: '#f59e0b',
  trade: '#d97706', wildlife: '#84cc16', mining: '#a16207', professional: '#93c5fd',
  'payroll-mining': '#fcd34d',
};

export default function HotStackBrandStack({ brands, selectedBrands, setSelectedBrands, onNext, onBack }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState('all');

  const sectors = [...new Set(brands.map(b => b.sector).filter(Boolean))];

  const filtered = brands.filter(b => {
    const matchSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchSector = sectorFilter === 'all' || b.sector === sectorFilter;
    return matchSearch && matchSector;
  });

  const toggle = (brand) => {
    const isIn = selectedBrands.find(b => b.id === brand.id);
    if (isIn) {
      setSelectedBrands(selectedBrands.filter(b => b.id !== brand.id));
    } else {
      if (selectedBrands.length >= 12) { toast.error('Max 12 brands per build'); return; }
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  const handleNext = () => {
    if (selectedBrands.length === 0) { toast.error('Select at least 1 brand to continue'); return; }
    onNext();
  };

  const totalSubnodes = selectedBrands.reduce((sum, b) => sum + (b.subnodes?.length || 0), 0);

  return (
    <div className="max-w-6xl mx-auto pt-4 space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-orange-500 text-[11px] font-black tracking-widest uppercase mb-1.5">Step 2 — Brand Stack</p>
          <h2 className="text-2xl font-black text-white flex items-center gap-2.5 tracking-tight">
            <Layers className="w-6 h-6 text-orange-500" />
            Select your ecosystem brands
          </h2>
          <p className="text-stone-500 text-sm mt-1.5">
            Real brands from your FAA.ZONE database. Select up to 12 to stack.
          </p>
        </div>
        {selectedBrands.length > 0 && (
          <div className="hidden sm:block px-4 py-3 rounded-xl text-right"
            style={{ background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.2)' }}>
            <div className="text-2xl font-black text-orange-400 leading-none">{selectedBrands.length}</div>
            <div className="text-stone-500 text-[11px] mt-1 font-mono">brands · {totalSubnodes} nodes</div>
          </div>
        )}
      </div>

      {/* Selected pills */}
      {selectedBrands.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 rounded-xl"
          style={{ background: 'rgba(249,115,22,0.04)', border: '1px solid rgba(249,115,22,0.15)' }}>
          {selectedBrands.map(b => {
            const accent = SECTOR_ACCENT[b.sector] || '#f97316';
            return (
              <button key={b.id} onClick={() => toggle(b)}
                className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full transition-all hover:opacity-70"
                style={{ background: `${accent}18`, border: `1px solid ${accent}40`, color: accent }}>
                {SECTOR_ICONS[b.sector] || '●'} {b.name}™ <X className="w-3 h-3" />
              </button>
            );
          })}
          <button onClick={() => setSelectedBrands([])}
            className="text-stone-600 text-xs px-2 py-1 hover:text-red-400 transition-colors">
            Clear all
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-3 flex-col sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-600" />
          <input
            placeholder="Search brands…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-white placeholder-stone-600 text-sm focus:outline-none transition-colors"
            style={{ background: '#0d0b12', border: '1px solid rgba(255,255,255,0.06)' }}
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <button onClick={() => setSectorFilter('all')}
            className="px-3 py-2 rounded-lg text-xs font-bold transition-all"
            style={sectorFilter === 'all'
              ? { background: '#f97316', color: '#000' }
              : { color: '#78716c', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
            All ({brands.length})
          </button>
          {sectors.map(s => (
            <button key={s} onClick={() => setSectorFilter(s === sectorFilter ? 'all' : s)}
              className="px-3 py-2 rounded-lg text-xs font-bold transition-all"
              style={sectorFilter === s
                ? { background: SECTOR_ACCENT[s] || '#f97316', color: '#000' }
                : { color: '#78716c', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
              {SECTOR_ICONS[s] || '●'} {s}
            </button>
          ))}
        </div>
      </div>

      {/* Brand grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 max-h-[500px] overflow-y-auto pr-1"
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgb(68,64,60) transparent' }}>
        {filtered.map((brand) => {
          const isSelected = !!selectedBrands.find(b => b.id === brand.id);
          const accent = SECTOR_ACCENT[brand.sector] || '#f97316';
          return (
            <button key={brand.id} onClick={() => toggle(brand)}
              className="relative p-3.5 rounded-xl text-left transition-all duration-150 hover:scale-[1.02]"
              style={isSelected
                ? { border: `1px solid ${accent}`, background: `${accent}10`, boxShadow: `0 0 20px ${accent}15` }
                : { border: '1px solid rgba(255,255,255,0.05)', background: '#0d0b12' }
              }>
              <div className="flex items-start justify-between mb-2">
                <span className="text-xl">{SECTOR_ICONS[brand.sector] || '●'}</span>
                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all"
                  style={isSelected
                    ? { background: accent, border: `1px solid ${accent}` }
                    : { border: '1px solid rgba(255,255,255,0.1)', background: 'transparent' }}>
                  {isSelected && <Check className="w-3 h-3 text-black" />}
                </div>
              </div>
              <h3 className="font-black text-sm mb-1 transition-colors leading-tight"
                style={{ color: isSelected ? accent : '#fff' }}>
                {brand.name}™
              </h3>
              <p className="text-stone-600 text-xs line-clamp-2 leading-relaxed">
                {brand.description || 'No description'}
              </p>
              <div className="flex flex-wrap gap-1 mt-2.5">
                {brand.subnodes?.length > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                    style={isSelected
                      ? { background: `${accent}18`, color: accent }
                      : { background: 'rgba(255,255,255,0.05)', color: '#78716c' }}>
                    {brand.subnodes.length} nodes
                  </span>
                )}
                {brand.tags?.length > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                    style={{ background: 'rgba(255,255,255,0.04)', color: '#57534e' }}>
                    {brand.tags.length} tags
                  </span>
                )}
              </div>
            </button>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-full py-16 text-center text-stone-600 text-sm">
            No brands match your search — try a different term or sector.
          </div>
        )}
      </div>

      {/* Nav */}
      <div className="flex justify-between pt-2">
        <button onClick={onBack}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-stone-300 hover:bg-white/5 text-sm font-bold transition-all"
          style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button onClick={handleNext}
          disabled={selectedBrands.length === 0}
          className="flex items-center gap-2 px-7 py-2.5 rounded-xl text-sm font-black transition-all disabled:opacity-30 disabled:cursor-not-allowed text-black"
          style={{ background: selectedBrands.length > 0 ? 'linear-gradient(135deg, #f97316, #f59e0b)' : '#3a3a3a', boxShadow: selectedBrands.length > 0 ? '0 4px 16px rgba(249,115,22,0.3)' : 'none' }}>
          Build with {selectedBrands.length} brand{selectedBrands.length !== 1 ? 's' : ''} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
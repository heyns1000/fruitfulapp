import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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

const SECTOR_COLORS = [
  'from-orange-900/40 border-orange-700/50', 'from-teal-900/40 border-teal-700/50',
  'from-purple-900/40 border-purple-700/50', 'from-blue-900/40 border-blue-700/50',
  'from-green-900/40 border-green-700/50', 'from-pink-900/40 border-pink-700/50',
];

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
      if (selectedBrands.length >= 12) { toast.error('Max 12 brands'); return; }
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  const handleNext = () => {
    if (selectedBrands.length === 0) { toast.error('Select at least 1 brand'); return; }
    onNext();
  };

  const totalSubnodes = selectedBrands.reduce((sum, b) => sum + (b.subnodes?.length || 0), 0);

  return (
    <div className="max-w-6xl mx-auto pt-6 space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-orange-400 text-xs font-bold tracking-widest uppercase mb-1">Step 2 — Brand Stack</p>
          <h2 className="text-3xl font-black text-white flex items-center gap-2">
            <Layers className="w-7 h-7 text-orange-500" />
            Select your ecosystem brands
          </h2>
          <p className="text-stone-400 text-sm mt-1">
            Real brands from your FAA.ZONE database. Select up to 12 to stack.
          </p>
        </div>
        {selectedBrands.length > 0 && (
          <div className="hidden sm:block bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 text-right">
            <div className="text-3xl font-black text-orange-400">{selectedBrands.length}</div>
            <div className="text-stone-400 text-xs">brands · {totalSubnodes} subnodes</div>
          </div>
        )}
      </div>

      {/* Selected pills */}
      {selectedBrands.length > 0 && (
        <div className="flex flex-wrap gap-2 p-4 bg-stone-900 border border-orange-500/20 rounded-xl">
          {selectedBrands.map(b => (
            <button
              key={b.id}
              onClick={() => toggle(b)}
              className="flex items-center gap-1.5 bg-orange-500/20 border border-orange-500/50 text-orange-300 text-xs font-bold px-3 py-1.5 rounded-full hover:bg-red-900/30 hover:border-red-500/50 hover:text-red-300 transition-all"
            >
              {SECTOR_ICONS[b.sector] || '●'} {b.name}™ <X className="w-3 h-3" />
            </button>
          ))}
          <button
            onClick={() => setSelectedBrands([])}
            className="text-stone-600 text-xs px-2 py-1.5 hover:text-red-400 transition-colors"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-3 flex-col sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
          <Input
            placeholder="Search brands…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-stone-900 border-stone-700 text-white placeholder:text-stone-600 focus:border-orange-500"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSectorFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${sectorFilter === 'all' ? 'bg-orange-500 border-orange-500 text-black' : 'border-stone-700 text-stone-400 hover:border-stone-500'}`}
          >
            All
          </button>
          {sectors.slice(0, 8).map(s => (
            <button
              key={s}
              onClick={() => setSectorFilter(s === sectorFilter ? 'all' : s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${sectorFilter === s ? 'bg-orange-500 border-orange-500 text-black' : 'border-stone-700 text-stone-400 hover:border-stone-500'}`}
            >
              {SECTOR_ICONS[s] || '●'} {s}
            </button>
          ))}
        </div>
      </div>

      {/* Brand grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-h-[480px] overflow-y-auto pr-1 custom-scrollbar">
        {filtered.map((brand, idx) => {
          const isSelected = !!selectedBrands.find(b => b.id === brand.id);
          const colorClass = SECTOR_COLORS[idx % SECTOR_COLORS.length];
          return (
            <button
              key={brand.id}
              onClick={() => toggle(brand)}
              className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 bg-gradient-to-br ${
                isSelected
                  ? 'border-orange-500 bg-orange-950/30 shadow-lg shadow-orange-500/10'
                  : `border-stone-800 ${colorClass.split(' ')[1]} hover:border-stone-600 bg-stone-900`
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-xl">{SECTOR_ICONS[brand.sector] || '●'}</span>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                  isSelected ? 'bg-orange-500 border-orange-500' : 'border-stone-600'
                }`}>
                  {isSelected && <Check className="w-3 h-3 text-black" />}
                </div>
              </div>
              <h3 className={`font-black text-sm ${isSelected ? 'text-orange-300' : 'text-white'}`}>
                {brand.name}™
              </h3>
              <p className="text-stone-500 text-xs mt-1 line-clamp-2">
                {brand.description || 'No description'}
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {brand.subnodes?.length > 0 && (
                  <span className="text-[10px] font-bold bg-stone-800 text-stone-400 px-1.5 py-0.5 rounded">
                    {brand.subnodes.length} nodes
                  </span>
                )}
                {brand.tags?.length > 0 && (
                  <span className="text-[10px] font-bold bg-stone-800 text-stone-400 px-1.5 py-0.5 rounded">
                    {brand.tags.length} tags
                  </span>
                )}
              </div>
            </button>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-stone-600">
            No brands match your search
          </div>
        )}
      </div>

      {/* Nav */}
      <div className="flex justify-between pt-2">
        <Button onClick={onBack} variant="outline" className="border-stone-700 text-stone-300 hover:bg-stone-800 gap-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={selectedBrands.length === 0}
          className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-black px-8 gap-2 disabled:opacity-30"
        >
          Build with {selectedBrands.length} brand{selectedBrands.length !== 1 ? 's' : ''} <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
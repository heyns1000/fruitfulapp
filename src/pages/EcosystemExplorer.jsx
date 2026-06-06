import React, { useState, useMemo } from 'react';
import { SECTOR_LIST } from '../components/data/ecosystemData';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, ChevronDown, ChevronUp, Globe, DollarSign, Layers, Cpu, Network, LayoutGrid, Loader2 } from 'lucide-react';
import NetworkMap from '../components/ecosystem/NetworkMap';

const SECTOR_ICONS = Object.fromEntries(
  Object.entries(SECTOR_LIST).map(([k, v]) => [k, v.split(' ')[0]])
);

export default function EcosystemExplorer() {
  const [selectedSector, setSelectedSector] = useState('banking');
  const [search, setSearch] = useState('');
  const [expandedBrand, setExpandedBrand] = useState(null);
  const [view, setView] = useState('grid');

  const { data: allBrands = [], isLoading } = useQuery({
    queryKey: ['ecosystem-brands'],
    queryFn: () => base44.entities.Brand.list(),
  });

  const sectorBrands = useMemo(() => {
    const raw = allBrands.filter(b => b.sector === selectedSector);
    if (!search.trim()) return raw;
    const q = search.toLowerCase();
    return raw.filter(b =>
      b.name.toLowerCase().includes(q) ||
      b.subnodes?.some(s => s.toLowerCase().includes(q))
    );
  }, [allBrands, selectedSector, search]);

  const totalSubnodes = useMemo(() =>
    sectorBrands.reduce((sum, b) => sum + (b.subnodes?.length || 0), 0),
  [sectorBrands]);

  // Count brands per sector from real data
  const sectorCounts = useMemo(() => {
    const counts = {};
    allBrands.forEach(b => { counts[b.sector] = (counts[b.sector] || 0) + 1; });
    return counts;
  }, [allBrands]);

  const allSectors = Object.keys(SECTOR_LIST);

  return (
    <div className="min-h-screen bg-[#1a202c] text-[#e2e8f0]" style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* Header */}
      <header className="bg-gradient-to-r from-[#2d3748] via-[#1a365d] to-[#2d3748] border-b border-[#4a5568] px-6 py-10 text-center">
        <h1 className="text-4xl sm:text-5xl font-black text-[#90cdf4] mb-2 tracking-tight">
          🌐 Ecosystem Explorer
        </h1>
        <p className="text-[#a0aec0] text-lg max-w-2xl mx-auto">
          Dive into every sector — monitor brand performance, node health, and global master license pricing.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 mt-6 text-sm">
          <div className="flex items-center gap-2 bg-[#2d3748] border border-[#4a5568] px-4 py-2 rounded-xl">
            <Globe className="w-4 h-4 text-[#90cdf4]" />
            <span className="text-[#a0aec0]">{allSectors.length} Sectors</span>
          </div>
          <div className="flex items-center gap-2 bg-[#2d3748] border border-[#4a5568] px-4 py-2 rounded-xl">
            <Layers className="w-4 h-4 text-[#6ee7b7]" />
            <span className="text-[#a0aec0]">{allBrands.length} Core Brands</span>
          </div>
          <div className="flex items-center gap-2 bg-[#2d3748] border border-[#4a5568] px-4 py-2 rounded-xl">
            <Cpu className="w-4 h-4 text-[#fbd38d]" />
            <span className="text-[#a0aec0]">{allBrands.reduce((s, b) => s + (b.subnodes?.length || 0), 0)} Subnodes</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">

        {/* View toggle */}
        <div className="flex justify-end gap-2">
          <button onClick={() => setView('grid')} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${view === 'grid' ? 'bg-[#4299e1] border-[#4299e1] text-white' : 'border-[#4a5568] text-[#a0aec0] hover:border-[#63b3ed]'}`}>
            <LayoutGrid className="w-4 h-4" /> Grid
          </button>
          <button onClick={() => setView('network')} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${view === 'network' ? 'bg-[#4299e1] border-[#4299e1] text-white' : 'border-[#4a5568] text-[#a0aec0] hover:border-[#63b3ed]'}`}>
            <Network className="w-4 h-4" /> Network Map
          </button>
        </div>

        {/* Network map view */}
        {view === 'network' && <NetworkMap />}

        {/* Sector filter chips — hidden in network view */}
        {view === 'grid' && <div className="bg-[#2d3748] border border-[#4a5568] rounded-xl p-5">
          <p className="text-sm font-bold text-[#90cdf4] uppercase tracking-widest mb-4">Select Sector</p>
          <div className="flex flex-wrap gap-2">
            {allSectors.map(k => {
              return (
                <button
                  key={k}
                  onClick={() => { setSelectedSector(k); setSearch(''); setExpandedBrand(null); }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                    selectedSector === k
                      ? 'bg-[#4299e1] border-[#4299e1] text-white shadow-lg'
                      : sectorCounts[k]
                      ? 'border-[#4a5568] text-[#a0aec0] hover:border-[#63b3ed] hover:text-[#90cdf4]'
                      : 'border-[#2d3748] text-[#4a5568] cursor-default'
                  }`}
                >
                  {SECTOR_LIST[k]}
                  {sectorCounts[k] && <span className="ml-1 text-[10px] opacity-70">({sectorCounts[k]})</span>}
                </button>
              );
            })}
          </div>
        </div>}

        {/* Stats row — grid view only */}
        {view === 'grid' && <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { label: 'Brands in Sector', value: isLoading ? '…' : sectorBrands.length, color: 'text-[#6ee7b7]' },
            { label: 'Total Subnodes', value: isLoading ? '…' : totalSubnodes, color: 'text-[#90cdf4]' },
            { label: 'AI-Generated', value: isLoading ? '…' : sectorBrands.filter(b => b.aiGenerated).length, color: 'text-[#fbd38d]' },
          ].map(s => (
            <div key={s.label} className="bg-[#2d3748] border border-[#4a5568] rounded-xl p-4 text-center">
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-xs text-[#a0aec0] mt-1">{s.label}</p>
            </div>
          ))}
        </div>}

        {/* Search + Brand Grid — grid view only */}
        {view === 'grid' && <div className="bg-[#2d3748] border border-[#4a5568] rounded-xl p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-black text-[#90cdf4]">{SECTOR_LIST[selectedSector]}</h2>
              <p className="text-[#a0aec0] text-sm mt-0.5">
                Global Master License Pricing — FAA.ZONE™ Fruitful Treaty System™
              </p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a0aec0]" />
              <Input
                placeholder="Search brands or subnodes…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 bg-[#1a202c] border-[#4a5568] text-[#e2e8f0] placeholder:text-[#4a5568] focus:border-[#4299e1]"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-[#4299e1]" />
            </div>
          ) : sectorBrands.length === 0 ? (
            <div className="text-center py-16 text-[#4a5568]">
              <Globe className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="text-lg">No brands found{search ? ` for "${search}"` : ' in this sector yet'}.</p>
              <p className="text-sm mt-1">Add brands via Brand Onboarding to populate this sector.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {sectorBrands.map((brand, idx) => {
                const isOpen = expandedBrand === idx;
                const subnodes = brand.subnodes || [];
                return (
                  <div
                    key={brand.id || brand.name + idx}
                    className="bg-[#1a202c] border border-[#4a5568] rounded-xl overflow-hidden hover:border-[#63b3ed] hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                    onClick={() => setExpandedBrand(isOpen ? null : idx)}
                  >
                    <div className="p-5">
                      <div className="text-4xl mb-3 leading-none">{SECTOR_ICONS[selectedSector] || '🔷'}</div>
                      <h3 className="text-lg font-black text-[#a7f3d0] group-hover:text-[#6ee7b7] transition-colors">
                        {brand.name}™
                      </h3>
                      <p className="text-xs text-[#a0aec0] mt-1 line-clamp-2">{brand.description || SECTOR_LIST[selectedSector]?.split(' ').slice(1).join(' ')}</p>
                      {brand.aiGenerated && (
                        <Badge className="mt-2 bg-[#2d3748] text-[#90cdf4] border border-[#4a5568] text-[10px]">AI Generated</Badge>
                      )}
                      {subnodes.length > 0 && (
                        <div className="flex items-center gap-1 mt-3 text-xs text-[#a0aec0]">
                          <Layers className="w-3 h-3" />
                          {subnodes.length} subnodes
                          {isOpen ? <ChevronUp className="w-3 h-3 ml-auto text-[#90cdf4]" /> : <ChevronDown className="w-3 h-3 ml-auto text-[#4a5568]" />}
                        </div>
                      )}
                    </div>

                    {/* Subnodes (expanded) */}
                    {isOpen && subnodes.length > 0 && (
                      <div className="border-t border-[#4a5568] px-5 pb-4 pt-3 bg-[#171e2b]">
                        <p className="text-[10px] font-bold tracking-widest text-[#90cdf4] uppercase mb-2">Subnodes</p>
                        <ul className="space-y-1">
                          {subnodes.map((node, ni) => (
                            <li key={ni} className="flex items-center gap-2 text-xs text-[#a0aec0]">
                              <span className="text-[#6ee7b7] font-bold">•</span>
                              {node}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>}

        {/* Footer */}
        <footer className="border-t border-[#4a5568] pt-8 pb-4 text-center text-[#a0aec0] text-sm space-y-3">
          <div className="flex flex-wrap justify-center gap-4 text-xs">
            {['Privacy', 'Terms', 'Contact', 'Copyright', 'Developers', 'VaultMesh', 'Fruitful', 'FAA.Zone', 'About', 'Accessibility'].map(link => (
              <a key={link} href={`https://footer.global.repo.seedwave.faa.zone/${link.toLowerCase()}.html`}
                className="text-[#90cdf4] hover:text-[#63b3ed] transition-colors" target="_blank" rel="noopener noreferrer">
                {link}
              </a>
            ))}
          </div>
          <p>© 2026 FAA™ Treaty System™. All Rights Reserved.</p>
          <p className="text-xs text-[#4a5568]">Powered by 🦍 glyphs + Vault API · Synced with Seedwave™ · Global Master License Pricing</p>
        </footer>
      </div>
    </div>
  );
}
import React, { useState, useMemo } from 'react';
import { SECTOR_LIST, ECOSYSTEM_DATA, licensePrice } from '../components/data/ecosystemData';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, ChevronDown, ChevronUp, Globe, DollarSign, Layers, Cpu } from 'lucide-react';

const SECTOR_ICONS = Object.fromEntries(
  Object.entries(SECTOR_LIST).map(([k, v]) => [k, v.split(' ')[0]])
);

export default function EcosystemExplorer() {
  const [selectedSector, setSelectedSector] = useState('banking');
  const [search, setSearch] = useState('');
  const [expandedBrand, setExpandedBrand] = useState(null);

  const sectorBrands = useMemo(() => {
    const raw = ECOSYSTEM_DATA[selectedSector] || [];
    if (!search.trim()) return raw;
    const q = search.toLowerCase();
    return raw.filter(b =>
      b.name.toLowerCase().includes(q) ||
      b.subNodes.some(s => s.toLowerCase().includes(q))
    );
  }, [selectedSector, search]);

  const totalLicenseValue = useMemo(() =>
    sectorBrands.reduce((sum, b) => sum + b.masterLicensePrice, 0),
  [sectorBrands]);

  const totalSubnodes = useMemo(() =>
    sectorBrands.reduce((sum, b) => sum + b.subNodes.length, 0),
  [sectorBrands]);

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
            <span className="text-[#a0aec0]">{Object.values(ECOSYSTEM_DATA).reduce((s,arr) => s + arr.length, 0)} Core Brands</span>
          </div>
          <div className="flex items-center gap-2 bg-[#2d3748] border border-[#4a5568] px-4 py-2 rounded-xl">
            <Cpu className="w-4 h-4 text-[#fbd38d]" />
            <span className="text-[#a0aec0]">{Object.values(ECOSYSTEM_DATA).reduce((s,arr) => s + arr.reduce((ss,b) => ss + b.subNodes.length, 0), 0)} Subnodes</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">

        {/* Sector filter chips */}
        <div className="bg-[#2d3748] border border-[#4a5568] rounded-xl p-5">
          <p className="text-sm font-bold text-[#90cdf4] uppercase tracking-widest mb-4">Select Sector</p>
          <div className="flex flex-wrap gap-2">
            {allSectors.map(k => {
              const hasData = ECOSYSTEM_DATA[k]?.length > 0;
              return (
                <button
                  key={k}
                  onClick={() => { setSelectedSector(k); setSearch(''); setExpandedBrand(null); }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                    selectedSector === k
                      ? 'bg-[#4299e1] border-[#4299e1] text-white shadow-lg'
                      : hasData
                      ? 'border-[#4a5568] text-[#a0aec0] hover:border-[#63b3ed] hover:text-[#90cdf4]'
                      : 'border-[#2d3748] text-[#4a5568] cursor-default'
                  }`}
                >
                  {SECTOR_LIST[k]}
                  {hasData && <span className="ml-1 text-[10px] opacity-70">({ECOSYSTEM_DATA[k].length})</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Brands in Sector', value: sectorBrands.length, color: 'text-[#6ee7b7]' },
            { label: 'Total Subnodes', value: totalSubnodes, color: 'text-[#90cdf4]' },
            { label: 'Avg License', value: `$${Math.round(totalLicenseValue / (sectorBrands.length || 1)).toLocaleString()}`, color: 'text-[#fbd38d]' },
            { label: 'Total License Value', value: `$${totalLicenseValue.toLocaleString()}`, color: 'text-[#fc8181]' },
          ].map(s => (
            <div key={s.label} className="bg-[#2d3748] border border-[#4a5568] rounded-xl p-4 text-center">
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-xs text-[#a0aec0] mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Search + Brand Grid */}
        <div className="bg-[#2d3748] border border-[#4a5568] rounded-xl p-5">
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

          {sectorBrands.length === 0 ? (
            <div className="text-center py-16 text-[#4a5568]">
              <Globe className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="text-lg">No brands found{search ? ` for "${search}"` : ' in this sector yet'}.</p>
              <p className="text-sm mt-1">Data will populate as brands are seeded from the ecosystem.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {sectorBrands.map((brand, idx) => {
                const isOpen = expandedBrand === idx;
                return (
                  <div
                    key={brand.name + idx}
                    className="bg-[#1a202c] border border-[#4a5568] rounded-xl overflow-hidden hover:border-[#63b3ed] hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                    onClick={() => setExpandedBrand(isOpen ? null : idx)}
                  >
                    {/* Gradient overlay on hover */}
                    <div className="p-5">
                      <div className="text-4xl mb-3 leading-none">{SECTOR_ICONS[selectedSector] || '🔷'}</div>
                      <h3 className="text-lg font-black text-[#a7f3d0] group-hover:text-[#6ee7b7] transition-colors">
                        {brand.name}™
                      </h3>
                      <p className="text-xs text-[#a0aec0] mt-1">{SECTOR_LIST[selectedSector]?.split(' ').slice(1).join(' ')}</p>
                      <div className="flex items-center gap-1 mt-3">
                        <DollarSign className="w-3.5 h-3.5 text-[#6ee7b7]" />
                        <span className="text-[#6ee7b7] font-bold text-sm">${brand.masterLicensePrice.toLocaleString()}</span>
                        <span className="text-[#4a5568] text-xs ml-1">/ master license</span>
                      </div>
                      {brand.subNodes.length > 0 && (
                        <div className="flex items-center gap-1 mt-1.5 text-xs text-[#a0aec0]">
                          <Layers className="w-3 h-3" />
                          {brand.subNodes.length} subnodes
                          {isOpen ? <ChevronUp className="w-3 h-3 ml-auto text-[#90cdf4]" /> : <ChevronDown className="w-3 h-3 ml-auto text-[#4a5568]" />}
                        </div>
                      )}
                    </div>

                    {/* Subnodes (expanded) */}
                    {isOpen && brand.subNodes.length > 0 && (
                      <div className="border-t border-[#4a5568] px-5 pb-4 pt-3 bg-[#171e2b]">
                        <p className="text-[10px] font-bold tracking-widest text-[#90cdf4] uppercase mb-2">Subnodes</p>
                        <ul className="space-y-1">
                          {brand.subNodes.map((node, ni) => (
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
        </div>

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
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SECTORS, generateBrands, TIER_COLORS } from '../components/explorer/SectorData';
import SectorCard from '../components/explorer/SectorCard';
import BrandNodeCard from '../components/explorer/BrandNodeCard';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Zap, Globe, Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

const TOTAL_BRANDS = 27426;

export default function BrandNodeExplorer() {
  const [selectedSector, setSelectedSector] = useState(null);
  const [brands, setBrands] = useState([]);
  const [sectorPulses, setSectorPulses] = useState({});
  const [totalPulse, setTotalPulse] = useState(0);
  const [search, setSearch] = useState('');

  const handleSelectSector = useCallback((sector) => {
    setSelectedSector(sector);
    setBrands(generateBrands(sector, 24));
    setSearch('');
  }, []);

  const handleVisit = useCallback((brand) => {
    setSectorPulses(prev => ({
      ...prev,
      [selectedSector.key]: (prev[selectedSector.key] || 0) + 1,
    }));
    setTotalPulse(p => p + 1);
  }, [selectedSector]);

  const handleBack = () => {
    setSelectedSector(null);
    setBrands([]);
    setSearch('');
  };

  const filteredSectors = SECTORS.filter(s =>
    search === '' || s.label.toLowerCase().includes(search.toLowerCase()) || s.key.includes(search.toLowerCase())
  );

  const filteredBrands = brands.filter(b =>
    search === '' || b.name.toLowerCase().includes(search.toLowerCase()) || b.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-green-900 to-cyan-900">

      {/* Header */}
      <div className="sticky top-0 z-30 bg-black/40 backdrop-blur-md border-b border-teal-700/50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            {selectedSector && (
              <button
                onClick={handleBack}
                className="flex items-center gap-1 text-teal-300 hover:text-white transition-colors text-sm font-semibold"
              >
                <ChevronLeft className="w-4 h-4" /> All Sectors
              </button>
            )}
            <div className="flex items-center gap-2">
              <span className="text-2xl">ᠮ</span>
              <div>
                <p className="text-white font-extrabold text-sm leading-none">Brand Node Explorer</p>
                <p className="text-teal-400 text-xs">FAA.ZONE™ · Glory Synthesis 158%</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 bg-teal-800/60 rounded-xl px-3 py-1.5">
              <Globe className="w-3.5 h-3.5 text-teal-400" />
              <span className="text-white text-xs font-bold">{TOTAL_BRANDS.toLocaleString()} endpoints</span>
            </div>
            <div className="flex items-center gap-1.5 bg-yellow-500/20 border border-yellow-500/40 rounded-xl px-3 py-1.5">
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              <span className="text-yellow-300 text-xs font-bold">{totalPulse} audit pulses</span>
            </div>
            {selectedSector && (
              <Badge className={`text-xs border ${TIER_COLORS[selectedSector.tier]}`}>
                Tier {selectedSector.tier} · ${selectedSector.monthly}/mo
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-400" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={selectedSector ? 'Search brand nodes…' : 'Search sectors…'}
            className="pl-9 pr-9 bg-white/10 border-teal-600 text-white placeholder:text-teal-400 focus-visible:ring-teal-400"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-teal-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {!selectedSector ? (
            /* Sector Grid */
            <motion.div key="sectors" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <p className="text-teal-300 text-sm mb-4 font-semibold">
                {filteredSectors.length} of 31 sectors · Select a sector to drill into brand nodes
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {filteredSectors.map((sector, i) => (
                  <motion.div
                    key={sector.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <SectorCard
                      sector={sector}
                      isSelected={false}
                      onClick={() => handleSelectSector(sector)}
                      visitCount={sectorPulses[sector.key] || 0}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Pricing Table */}
              <div className="mt-10 bg-white/5 border border-teal-700/50 rounded-2xl overflow-hidden">
                <div className="px-5 py-3 border-b border-teal-700/40">
                  <h3 className="text-white font-bold text-sm">FAA.ZONE Pricing Index — All 31 Sectors</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-teal-900/50 text-teal-300">
                        <th className="text-left px-4 py-2">Sector</th>
                        <th className="px-4 py-2">Monthly</th>
                        <th className="px-4 py-2">Annual</th>
                        <th className="px-4 py-2">Tier</th>
                        <th className="text-left px-4 py-2">Region</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SECTORS.map((s, i) => (
                        <tr
                          key={s.key}
                          onClick={() => handleSelectSector(s)}
                          className={`cursor-pointer transition-colors hover:bg-teal-700/30 ${i % 2 === 0 ? 'bg-white/3' : ''}`}
                        >
                          <td className="px-4 py-2 text-white font-medium">{s.glyph} {s.label}</td>
                          <td className="px-4 py-2 text-center text-green-400 font-bold">${s.monthly}</td>
                          <td className="px-4 py-2 text-center text-teal-300">${s.annual}</td>
                          <td className="px-4 py-2 text-center">
                            <span className={`px-2 py-0.5 rounded-full border text-xs font-bold ${TIER_COLORS[s.tier]}`}>{s.tier}</span>
                          </td>
                          <td className="px-4 py-2 text-gray-400">{s.region}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          ) : (
            /* Brand Node Grid */
            <motion.div key="brands" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="text-4xl">{selectedSector.glyph}</span>
                <div>
                  <h2 className="text-white font-extrabold text-xl">{selectedSector.label}</h2>
                  <p className="text-teal-400 text-sm">{selectedSector.region} · ${selectedSector.monthly}/mo · ${selectedSector.annual}/yr</p>
                </div>
              </div>
              <p className="text-teal-400 text-sm mb-4">
                Showing {filteredBrands.length} brand nodes · Tap to fire Audit Pulse
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {filteredBrands.map((brand, i) => (
                  <motion.div
                    key={brand.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.04, type: 'spring', stiffness: 260, damping: 18 }}
                  >
                    <BrandNodeCard brand={brand} sector={selectedSector} onVisit={handleVisit} />
                  </motion.div>
                ))}
              </div>

              {/* Sector info strip */}
              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Payout Tier', value: selectedSector.tier },
                  { label: 'Monthly Fee', value: `$${selectedSector.monthly}` },
                  { label: 'Annual Fee', value: `$${selectedSector.annual}` },
                  { label: 'Pulses Fired', value: (sectorPulses[selectedSector.key] || 0).toString() },
                ].map(stat => (
                  <div key={stat.label} className="bg-white/10 border border-teal-700/40 rounded-2xl p-4 text-center">
                    <p className="text-teal-400 text-xs font-semibold">{stat.label}</p>
                    <p className="text-white text-2xl font-extrabold mt-1">{stat.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
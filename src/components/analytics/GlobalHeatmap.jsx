import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Zap, Network, TrendingUp } from 'lucide-react';

const SECTOR_LABELS = {
  agriculture: '🌱 Agriculture',
  fsf: '🥦 Food & Soil',
  banking: '🏦 Banking',
  creative: '🖋️ Creative',
  logistics: '📦 Logistics',
  'education-ip': '📚 Education IP',
  fashion: '✂ Fashion',
  gaming: '🎮 Gaming',
  health: '🧠 Health',
  housing: '🏗️ Housing',
  justice: '⚖ Justice',
  knowledge: '📖 Knowledge',
  micromesh: '☰ Micro-Mesh',
  media: '🎬 Media',
  nutrition: '✿ Nutrition',
  'ai-logic': '🧠 AI Logic',
  packaging: '📦 Packaging',
  quantum: '✴️ Quantum',
  ritual: '☯ Ritual',
  saas: '🔑 SaaS',
  trade: '🧺 Trade',
  utilities: '🔋 Utilities',
  voice: '🎙️ Voice',
  webless: '📡 Webless',
  nft: '🔁 NFT',
  'education-youth': '🎓 Edu Youth',
  zerowaste: '♻️ Zero Waste',
  professional: '🧾 Professional',
  'payroll-mining': '🪙 Payroll',
  mining: '⛏️ Mining',
  wildlife: '🦁 Wildlife'
};

// Color intensity based on node count
function getHeatColor(value, max) {
  const ratio = max > 0 ? value / max : 0;
  if (ratio > 0.8) return { bg: 'bg-red-500', text: 'text-white', border: 'border-red-600' };
  if (ratio > 0.6) return { bg: 'bg-orange-400', text: 'text-white', border: 'border-orange-500' };
  if (ratio > 0.4) return { bg: 'bg-yellow-400', text: 'text-gray-900', border: 'border-yellow-500' };
  if (ratio > 0.2) return { bg: 'bg-teal-300', text: 'text-gray-900', border: 'border-teal-400' };
  if (ratio > 0) return { bg: 'bg-teal-100', text: 'text-gray-700', border: 'border-teal-200' };
  return { bg: 'bg-gray-100', text: 'text-gray-400', border: 'border-gray-200' };
}

export default function GlobalHeatmap() {
  const [selectedSector, setSelectedSector] = useState(null);
  const [metric, setMetric] = useState('activeNodes'); // activeNodes | brandCount | subnodeCount

  const { data: brands = [], isLoading } = useQuery({
    queryKey: ['brands'],
    queryFn: () => base44.entities.Brand.list('-updated_date')
  });

  const { data: collaborations = [] } = useQuery({
    queryKey: ['collaborations'],
    queryFn: () => base44.entities.BrandCollaboration.list('-updated_date')
  });

  // Aggregate sector data
  const sectorData = useMemo(() => {
    const map = {};
    brands.forEach(brand => {
      if (!brand.sector) return;
      if (!map[brand.sector]) {
        map[brand.sector] = { brandCount: 0, subnodeCount: 0, activeNodes: 0, brands: [], subnodes: new Set() };
      }
      map[brand.sector].brandCount++;
      map[brand.sector].subnodeCount += brand.subnodes?.length || 0;
      map[brand.sector].activeNodes += brand.metadata?.activeNodes || 0;
      map[brand.sector].brands.push(brand);
      brand.subnodes?.forEach(s => map[brand.sector].subnodes.add(s));
    });
    return map;
  }, [brands]);

  // Cross-sector collaboration links
  const crossLinks = useMemo(() => {
    const links = {};
    collaborations.forEach(c => {
      const b1 = brands.find(b => b.id === c.brand1Id);
      const b2 = brands.find(b => b.id === c.brand2Id);
      if (!b1 || !b2 || b1.sector === b2.sector) return;
      const key = [b1.sector, b2.sector].sort().join('||');
      links[key] = (links[key] || 0) + 1;
    });
    return links;
  }, [collaborations, brands]);

  const maxValue = useMemo(() => {
    return Math.max(...Object.values(sectorData).map(d => d[metric] || 0), 1);
  }, [sectorData, metric]);

  const selectedBrands = selectedSector ? (sectorData[selectedSector]?.brands || []) : [];
  const selectedSubnodes = selectedSector ? [...(sectorData[selectedSector]?.subnodes || [])] : [];

  // Top cross-sector pairs
  const topCrossLinks = Object.entries(crossLinks)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-semibold text-gray-700">Heat by:</span>
        {[
          { key: 'activeNodes', label: '⚡ Active Nodes' },
          { key: 'brandCount', label: '🏷️ Brand Count' },
          { key: 'subnodeCount', label: '🔗 Subnodes' }
        ].map(m => (
          <button
            key={m.key}
            onClick={() => setMetric(m.key)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
              metric === m.key
                ? 'bg-teal-600 text-white border-teal-600'
                : 'bg-white text-gray-600 border-gray-300 hover:border-teal-400'
            }`}
          >
            {m.label}
          </button>
        ))}
        <span className="ml-auto text-xs text-gray-500">{brands.length} brands · {Object.keys(sectorData).length} active sectors</span>
      </div>

      {/* Heatmap Grid */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Network className="w-5 h-5 text-teal-600" />
            Global Sector Heatmap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {Object.entries(SECTOR_LABELS).map(([key, label]) => {
              const data = sectorData[key];
              const value = data?.[metric] || 0;
              const colors = getHeatColor(value, maxValue);
              const isSelected = selectedSector === key;

              return (
                <button
                  key={key}
                  onClick={() => setSelectedSector(isSelected ? null : key)}
                  className={`
                    relative p-2 rounded-lg border-2 text-center transition-all cursor-pointer
                    ${colors.bg} ${colors.text} ${colors.border}
                    ${isSelected ? 'ring-2 ring-offset-1 ring-indigo-500 scale-105' : 'hover:scale-105'}
                    ${!data ? 'opacity-40' : ''}
                  `}
                >
                  <div className="text-xs font-semibold leading-tight">{label}</div>
                  {data && (
                    <div className="text-xs mt-1 font-bold">
                      {metric === 'activeNodes' ? data.activeNodes.toLocaleString() :
                       metric === 'brandCount' ? `${data.brandCount}b` :
                       `${data.subnodeCount}s`}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <span className="text-xs text-gray-500 mr-1">Intensity:</span>
            {[
              { color: 'bg-gray-100 border-gray-200', label: 'None' },
              { color: 'bg-teal-100 border-teal-200', label: 'Low' },
              { color: 'bg-teal-300 border-teal-400', label: 'Med' },
              { color: 'bg-yellow-400 border-yellow-500', label: 'High' },
              { color: 'bg-orange-400 border-orange-500', label: 'Very High' },
              { color: 'bg-red-500 border-red-600', label: 'Peak' },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-1">
                <div className={`w-4 h-4 rounded border ${l.color}`} />
                <span className="text-xs text-gray-500">{l.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Sector Detail */}
      {selectedSector && sectorData[selectedSector] && (
        <Card className="border-2 border-indigo-300 bg-indigo-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-indigo-800">
              {SECTOR_LABELS[selectedSector]} — Sector Detail
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center bg-white rounded-lg p-3 shadow-sm">
                <div className="text-2xl font-bold text-indigo-700">{sectorData[selectedSector].brandCount}</div>
                <div className="text-xs text-gray-500">Brands</div>
              </div>
              <div className="text-center bg-white rounded-lg p-3 shadow-sm">
                <div className="text-2xl font-bold text-teal-700">{sectorData[selectedSector].subnodeCount}</div>
                <div className="text-xs text-gray-500">Subnodes</div>
              </div>
              <div className="text-center bg-white rounded-lg p-3 shadow-sm">
                <div className="text-2xl font-bold text-orange-600">{sectorData[selectedSector].activeNodes.toLocaleString()}</div>
                <div className="text-xs text-gray-500">Active Nodes</div>
              </div>
            </div>

            {/* Brands */}
            <div className="mb-3">
              <p className="text-xs font-semibold text-gray-600 mb-2">Core Brands:</p>
              <div className="flex flex-wrap gap-1">
                {selectedBrands.map(b => (
                  <Badge key={b.id} variant="outline" className="text-xs bg-white border-indigo-300 text-indigo-700">
                    {b.name}™
                  </Badge>
                ))}
              </div>
            </div>

            {/* Subnodes */}
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2">Registered Subnodes:</p>
              <div className="flex flex-wrap gap-1">
                {selectedSubnodes.map(s => (
                  <Badge key={s} className="text-xs bg-teal-100 text-teal-800 border-teal-200">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cross-Sector Integration Logic */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              Cross-Sector Integration Links
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topCrossLinks.length === 0 ? (
              <p className="text-sm text-gray-400">No cross-sector collaborations yet.</p>
            ) : (
              <div className="space-y-2">
                {topCrossLinks.map(([key, count]) => {
                  const [s1, s2] = key.split('||');
                  return (
                    <div key={key} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                      <div className="text-xs font-medium text-gray-700">
                        {SECTOR_LABELS[s1] || s1} ↔ {SECTOR_LABELS[s2] || s2}
                      </div>
                      <Badge className="bg-indigo-100 text-indigo-700 text-xs">{count} links</Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-teal-500" />
              Top Sectors by Active Nodes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(sectorData)
                .sort((a, b) => (b[1].activeNodes || 0) - (a[1].activeNodes || 0))
                .slice(0, 6)
                .map(([key, data]) => {
                  const pct = maxValue > 0 ? Math.round((data.activeNodes / maxValue) * 100) : 0;
                  return (
                    <div key={key} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-700 font-medium">{SECTOR_LABELS[key] || key}</span>
                        <span className="text-gray-500">{data.activeNodes.toLocaleString()} nodes</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-teal-500 to-indigo-500 h-2 rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
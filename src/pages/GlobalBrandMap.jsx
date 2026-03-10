import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Circle, Tooltip } from 'react-leaflet';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Globe, TrendingUp, Activity, X, MapPin, Layers } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

const REGIONS = [
  {
    id: 'west_africa',
    name: 'West Africa',
    lat: 7.9465, lng: 1.0232,
    sectors: ['agriculture', 'fsf', 'trade', 'fashion', 'creative', 'ritual'],
    trends: ['Artisan export growth +34%', 'Digital payments surge', 'Agri-tech adoption', 'Creative economy boom'],
    marketSize: '$2.4B', color: '#f59e0b'
  },
  {
    id: 'south_africa',
    name: 'Southern Africa',
    lat: -28.4793, lng: 24.6727,
    sectors: ['mining', 'banking', 'wildlife', 'zerowaste', 'payroll-mining', 'utilities'],
    trends: ['Mining digitalization', 'ESG compliance push', 'Fintech growth +28%', 'Wildlife tech'],
    marketSize: '$4.1B', color: '#10b981'
  },
  {
    id: 'east_africa',
    name: 'East Africa',
    lat: -1.2921, lng: 36.8219,
    sectors: ['agriculture', 'logistics', 'health', 'utilities', 'nutrition', 'micromesh'],
    trends: ['M-Pesa ecosystem expansion', 'AgriFintech surge', 'Health-tech +41%', 'Logistics modernisation'],
    marketSize: '$1.8B', color: '#06b6d4'
  },
  {
    id: 'europe',
    name: 'Europe',
    lat: 51.5074, lng: 10.0,
    sectors: ['saas', 'ai-logic', 'quantum', 'professional', 'knowledge', 'packaging'],
    trends: ['AI regulation tech', 'Green SaaS +19%', 'Quantum computing R&D', 'Professional services growth'],
    marketSize: '$12.7B', color: '#6366f1'
  },
  {
    id: 'mena',
    name: 'Middle East & N. Africa',
    lat: 24.4539, lng: 45.0,
    sectors: ['banking', 'media', 'voice', 'webless', 'ritual', 'housing'],
    trends: ['Islamic fintech expansion', 'Media tech +22%', 'Digital identity rollout', 'Smart city projects'],
    marketSize: '$5.3B', color: '#f97316'
  },
  {
    id: 'south_asia',
    name: 'South Asia',
    lat: 20.5937, lng: 78.9629,
    sectors: ['education-ip', 'education-youth', 'health', 'ai-logic', 'saas', 'micromesh'],
    trends: ['EdTech boom +56%', 'Healthcare AI adoption', 'Digital India stack', 'Micro-finance growth'],
    marketSize: '$8.9B', color: '#8b5cf6'
  },
  {
    id: 'sea',
    name: 'Southeast Asia',
    lat: 4.2105, lng: 113.9758,
    sectors: ['gaming', 'nft', 'media', 'logistics', 'trade', 'fashion'],
    trends: ['Web3 gaming +67%', 'E-commerce explosion', 'Creator economy surge', 'ASEAN trade digital'],
    marketSize: '$6.2B', color: '#ec4899'
  },
  {
    id: 'north_america',
    name: 'North America',
    lat: 45.0, lng: -100.0,
    sectors: ['saas', 'ai-logic', 'quantum', 'professional', 'housing', 'justice'],
    trends: ['AI infrastructure +38%', 'PropTech evolution', 'LegalTech growth', 'HealthTech investment'],
    marketSize: '$18.4B', color: '#3b82f6'
  },
  {
    id: 'latam',
    name: 'Latin America',
    lat: -14.235, lng: -51.9253,
    sectors: ['agriculture', 'fsf', 'trade', 'packaging', 'nutrition', 'zerowaste'],
    trends: ['Agri-fintech expansion', 'Supply chain tech', 'Food security initiatives', 'Green packaging +31%'],
    marketSize: '$3.7B', color: '#14b8a6'
  },
];

export default function GlobalBrandMap() {
  const [activeRegion, setActiveRegion] = useState(null);

  const { data: brands = [] } = useQuery({
    queryKey: ['brands-map'],
    queryFn: () => base44.entities.Brand.list(),
  });

  const regionData = useMemo(() => {
    return REGIONS.map(region => {
      const matchingBrands = brands.filter(b => region.sectors.includes(b.sector));
      const totalSubnodes = matchingBrands.reduce((acc, b) => acc + (b.subnodes?.length || 0), 0);
      const activityLevel = Math.min(100, matchingBrands.length * 8 + totalSubnodes * 2 + 20);
      return { ...region, matchingBrands, totalSubnodes, activityLevel };
    });
  }, [brands]);

  const totalBrands = brands.length;
  const totalRegions = REGIONS.length;
  const totalMarketValue = '$73.5B';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950">
      <header className="bg-gradient-to-r from-slate-800 via-blue-900 to-indigo-900 text-white py-8 shadow-xl border-b border-blue-700/40">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Globe className="w-9 h-9 drop-shadow-lg text-cyan-400" />
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold drop-shadow-lg">Global Brand Map</h1>
                <p className="opacity-80 mt-1 text-sm sm:text-base text-cyan-200">Real-time brand activity across geographic regions & market clusters</p>
              </div>
            </div>
            <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6953a072de46207f94f2b9d2/52acd159d_Chief_02_1753263376705.png" alt="FAA" className="w-10 h-10 object-contain opacity-90" />
          </div>
        </div>
      </header>

      {/* Global Stats */}
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: 'Active Regions', value: totalRegions, icon: <MapPin className="w-4 h-4" />, color: 'text-cyan-400' },
            { label: 'Total Brands', value: totalBrands, icon: <Activity className="w-4 h-4" />, color: 'text-green-400' },
            { label: 'Market Value', value: totalMarketValue, icon: <TrendingUp className="w-4 h-4" />, color: 'text-yellow-400' },
          ].map(s => (
            <div key={s.label} className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-3 text-center">
              <div className={`flex justify-center mb-1 ${s.color}`}>{s.icon}</div>
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-400">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Map + Panel layout */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Map */}
          <div className="flex-1 rounded-2xl overflow-hidden border border-blue-700/40 shadow-2xl" style={{ minHeight: '500px' }}>
            <MapContainer
              center={[20, 20]}
              zoom={2}
              style={{ height: '560px', width: '100%' }}
              scrollWheelZoom={true}
              zoomControl={true}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              />
              {regionData.map(region => (
                <Circle
                  key={region.id}
                  center={[region.lat, region.lng]}
                  radius={600000 + region.activityLevel * 12000}
                  pathOptions={{
                    color: region.color,
                    fillColor: region.color,
                    fillOpacity: activeRegion?.id === region.id ? 0.55 : 0.3,
                    weight: activeRegion?.id === region.id ? 3 : 1.5,
                    opacity: 0.9
                  }}
                  eventHandlers={{ click: () => setActiveRegion(region) }}
                >
                  <Tooltip direction="top" permanent={false}>
                    <div className="text-xs font-semibold">{region.name}</div>
                    <div className="text-xs text-gray-600">{region.matchingBrands?.length || 0} brands · {region.marketSize}</div>
                  </Tooltip>
                </Circle>
              ))}
            </MapContainer>
          </div>

          {/* Region Detail Panel */}
          <div className="lg:w-80 shrink-0">
            {activeRegion ? (
              <Card className="bg-slate-800 border-blue-700/50 text-white h-full">
                <CardHeader className="pb-3" style={{ borderBottom: `2px solid ${activeRegion.color}40` }}>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg" style={{ color: activeRegion.color }}>
                      {activeRegion.name}
                    </CardTitle>
                    <Button size="icon" variant="ghost" onClick={() => setActiveRegion(null)} className="text-gray-400 hover:text-white h-7 w-7">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex gap-2 mt-1">
                    <Badge className="text-xs" style={{ backgroundColor: activeRegion.color + '30', color: activeRegion.color, border: `1px solid ${activeRegion.color}60` }}>
                      {activeRegion.matchingBrands?.length || 0} brands
                    </Badge>
                    <Badge className="text-xs bg-white/10 text-gray-300 border border-white/20">
                      {activeRegion.marketSize}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4 overflow-y-auto" style={{ maxHeight: '460px' }}>
                  {/* Activity Bar */}
                  <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Activity Level</span>
                      <span>{activeRegion.activityLevel}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{ width: `${activeRegion.activityLevel}%`, backgroundColor: activeRegion.color }}
                      />
                    </div>
                  </div>

                  {/* Active Sectors */}
                  <div>
                    <p className="text-xs font-semibold text-gray-300 mb-2 flex items-center gap-1">
                      <Layers className="w-3 h-3" /> Active Sectors
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {activeRegion.sectors.map(s => (
                        <Badge key={s} className="text-xs bg-white/10 text-gray-300 border border-white/20">{s}</Badge>
                      ))}
                    </div>
                  </div>

                  {/* Market Trends */}
                  <div>
                    <p className="text-xs font-semibold text-gray-300 mb-2 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> Local Market Trends
                    </p>
                    <ul className="space-y-1">
                      {activeRegion.trends.map((t, i) => (
                        <li key={i} className="text-xs text-gray-400 flex items-start gap-2">
                          <span style={{ color: activeRegion.color }} className="mt-0.5 shrink-0">▸</span>{t}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Top Brands */}
                  {activeRegion.matchingBrands?.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-300 mb-2 flex items-center gap-1">
                        <Activity className="w-3 h-3" /> Top Performing Brands
                      </p>
                      <div className="space-y-2">
                        {activeRegion.matchingBrands.slice(0, 5).map(b => (
                          <div key={b.id} className="bg-white/5 rounded-lg p-2 border border-white/10">
                            <p className="text-xs font-medium text-white">{b.name}</p>
                            <div className="flex gap-1 mt-1 flex-wrap">
                              <Badge className="text-[10px] bg-white/10 text-gray-400 border border-white/10 py-0">{b.sector}</Badge>
                              {b.subnodes?.length > 0 && (
                                <Badge className="text-[10px] bg-white/10 text-gray-400 border border-white/10 py-0">{b.subnodes.length} subnodes</Badge>
                              )}
                            </div>
                          </div>
                        ))}
                        {activeRegion.matchingBrands.length > 5 && (
                          <p className="text-xs text-gray-500 text-center">+{activeRegion.matchingBrands.length - 5} more brands</p>
                        )}
                      </div>
                    </div>
                  )}

                  {activeRegion.matchingBrands?.length === 0 && (
                    <div className="text-center py-4 text-gray-500 text-sm">
                      No brands currently active in this region
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-slate-800/60 border-blue-700/30 text-white h-full flex items-center justify-center">
                <CardContent className="text-center py-12">
                  <Globe className="w-12 h-12 text-blue-400/50 mx-auto mb-4" />
                  <p className="text-gray-400 text-sm">Click any region on the map to explore local brand activity, trends & subnodes</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Region Legend */}
        <div className="mt-4 bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-400 mb-3">REGION OVERVIEW</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {regionData.map(r => (
              <button
                key={r.id}
                onClick={() => setActiveRegion(r)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/10 transition-colors text-left"
              >
                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: r.color }} />
                <div>
                  <p className="text-xs text-gray-300 font-medium leading-tight">{r.name}</p>
                  <p className="text-[10px] text-gray-500">{r.matchingBrands?.length || 0} brands</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
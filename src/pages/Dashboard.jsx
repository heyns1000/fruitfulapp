import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminPanel from '../components/admin/AdminPanel';
import DataSeeder from '../components/admin/DataSeeder';
import BrandManager from '../components/admin/BrandManager.js';
import MetricsCards from '../components/dashboard/MetricsCards';
import SectorGrid from '../components/sectors/SectorGrid';
import { Loader2 } from 'lucide-react';

const SECTORS = {
  agriculture: '🌱 Agriculture & Biotech',
  fsf: '🥦 Food, Soil & Farming',
  banking: '🏦 Banking & Finance',
  creative: '🖋️ Creative Tech',
  logistics: '📦 Logistics & Packaging',
  'education-ip': '📚 Education & IP',
  fashion: '✂ Fashion & Identity',
  gaming: '🎮 Gaming & Simulation',
  health: '🧠 Health & Hygiene',
  housing: '🏗️ Housing & Infrastructure',
  justice: '⚖ Justice & Ethics',
  knowledge: '📖 Knowledge & Archives',
  micromesh: '☰ Micro-Mesh Logistics',
  media: '🎬 Motion, Media & Sonic',
  nutrition: '✿ Nutrition & Food Chain',
  'ai-logic': '🧠 AI, Logic & Grid',
  packaging: '📦 Packaging & Materials',
  quantum: '✴️ Quantum Protocols',
  ritual: '☯ Ritual & Culture',
  saas: '🔑 SaaS & Licensing',
  trade: '🧺 Trade Systems',
  utilities: '🔋 Utilities & Energy',
  voice: '🎙️ Voice & Audio',
  webless: '📡 Webless Tech & Nodes',
  nft: '🔁 NFT & Ownership',
  'education-youth': '🎓 Education & Youth',
  zerowaste: '♻️ Zero Waste',
  professional: '🧾 Professional Services',
  'payroll-mining': '🪙 Payroll Mining & Accounting',
  mining: '⛏️ Mining & Resources',
  wildlife: '🦁 Wildlife & Habitat'
};

export default function Dashboard() {
  const [selectedSector, setSelectedSector] = useState('admin');
  const queryClient = useQueryClient();

  const { data: brands = [], isLoading } = useQuery({
    queryKey: ['brands'],
    queryFn: () => base44.entities.Brand.list('-updated_date')
  });

  const calculateMetrics = () => {
    const totalBrands = brands.length;
    const totalNodes = brands.reduce((sum, b) => sum + (b.subnodes?.length || 0), 0);
    
    return {
      activeNodes: totalBrands,
      licensesActive: totalBrands * 2,
      vaultDeployments: Math.round(totalBrands * 1.5),
      syncLogs: totalBrands * 5,
      auditsRunning: Math.ceil(totalBrands / 10),
      signalZones: Math.floor(totalBrands / 3),
      scrollGridIndex: totalBrands + totalNodes
    };
  };

  const metrics = calculateMetrics();

  const getBrandsBySector = (sectorKey) => {
    return brands.filter(b => b.sector === sectorKey);
  };

  const handleBrandAdded = () => {
    queryClient.invalidateQueries({ queryKey: ['brands'] });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-700 to-purple-800 text-white py-8 mb-8 shadow-xl">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl font-extrabold drop-shadow-lg">FAA.ZONE™</h1>
          <p className="text-lg opacity-90 mt-2">The Earth's Financial Allocation Architecture</p>
          <p className="text-xs opacity-70 mt-1">Live Omni-View Pulse Grid</p>
        </div>
      </header>

      <div className="container mx-auto px-6 pb-12">
        {/* Sub Header */}
        <header className="bg-indigo-700 text-white py-6 mb-8 shadow rounded-lg">
          <div className="px-6">
            <h1 className="text-3xl font-bold">🦁 Seedwave™ Admin Portal</h1>
            <p className="text-sm opacity-80 mt-2">✿ Corebrands management & AI logic deployment center</p>
          </div>
        </header>

        {/* Metrics Cards */}
        <MetricsCards metrics={metrics} />

        {/* Main Tabs */}
        <Tabs value={selectedSector} onValueChange={setSelectedSector} className="space-y-6">
          <TabsList className="flex flex-wrap gap-2 h-auto bg-white p-4 rounded-lg shadow">
            <TabsTrigger value="admin" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
              ⚙️ Admin Panel
            </TabsTrigger>
            {Object.entries(SECTORS).map(([key, label]) => (
              <TabsTrigger
                key={key}
                value={key}
                className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-sm"
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="admin" className="space-y-6">
            <DataSeeder />
            <AdminPanel onBrandAdded={handleBrandAdded} />
            <BrandManager />
            
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4 text-indigo-700">📊 All Brands Overview</h2>
              {brands.length === 0 ? (
                <p className="text-gray-500">No brands added yet. Use the admin panel above to add your first brand.</p>
              ) : (
                <div className="space-y-4">
                  {Object.entries(SECTORS).map(([sectorKey, sectorName]) => {
                    const sectorBrands = getBrandsBySector(sectorKey);
                    if (sectorBrands.length === 0) return null;
                    
                    return (
                      <div key={sectorKey} className="border-b pb-4 last:border-b-0">
                        <h3 className="font-semibold text-lg text-gray-800 mb-2">{sectorName}</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                          {sectorBrands.map(brand => (
                            <div key={brand.id} className="bg-gray-50 p-2 rounded text-sm">
                              <span className="font-medium">{brand.name}™</span>
                              <div className="text-xs text-gray-500 mt-1">
                                {brand.subnodes?.length || 0} subnodes
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </TabsContent>

          {Object.entries(SECTORS).map(([sectorKey, sectorName]) => (
            <TabsContent key={sectorKey} value={sectorKey}>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-indigo-700">
                    {sectorName} Dashboard
                  </h2>
                  <span className="text-sm text-gray-500">
                    {getBrandsBySector(sectorKey).length} brands
                  </span>
                </div>
                
                {getBrandsBySector(sectorKey).length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No brands in this sector yet. Add some using the Admin Panel.
                  </p>
                ) : (
                  <SectorGrid
                    brands={getBrandsBySector(sectorKey)}
                    sectorKey={sectorKey}
                    sectorName={sectorName}
                  />
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-gray-400 py-8 mt-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-lg font-bold text-white">FAA.ZONE™</div>
            <p className="text-sm">ScrollGrid · PulseTrade Certified · TreatyMesh Validated</p>
          </div>
          <p className="text-xs text-gray-500 mt-6 text-center">
            © 2025 Fruitful Holdings (Pty) Ltd. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
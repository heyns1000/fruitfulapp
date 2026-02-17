import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminPanel from '../components/admin/AdminPanel';
import DataSeeder from '../components/admin/DataSeeder';
import BrandManager from '../components/admin/BrandManager';
import CollaborationManager from '../components/collaboration/CollaborationManager';
import MetricsCards from '../components/dashboard/MetricsCards';
import SectorGrid from '../components/sectors/SectorGrid';
import DataExporter from '../components/data/DataExporter';
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
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-green-50 relative overflow-hidden">
      {/* Artistic background elements */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.07] overflow-hidden">
        <img 
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6953a072de46207f94f2b9d2/de7b64647_Nikon_1753263376703.png" 
          alt="" 
          className="absolute top-10 right-10 w-64 h-64 object-contain"
        />
        <img 
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6953a072de46207f94f2b9d2/80c4597b5_3_1753260859823.png" 
          alt="" 
          className="absolute bottom-10 left-10 w-72 h-72 object-contain rotate-12"
        />
        <img 
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6953a072de46207f94f2b9d2/bdd987cfa_1st_eye_1753263376706.png" 
          alt="" 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 object-contain opacity-50"
        />
      </div>

      {/* Header */}
      <header className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white py-10 mb-8 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="flex items-center justify-center gap-4 mb-3">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6953a072de46207f94f2b9d2/52acd159d_Chief_02_1753263376705.png" 
              alt="FAA" 
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-2xl"
            />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold drop-shadow-lg">FAA.ZONE™</h1>
          </div>
          <p className="text-base sm:text-lg opacity-95 mt-2 font-semibold">The Earth's Financial Allocation Architecture</p>
          <p className="text-xs sm:text-sm opacity-80 mt-1">Live Omni-View Pulse Grid · Seeds of Appreciation</p>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 pb-12 relative z-10">
        {/* Sub Header */}
        <header className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-6 mb-8 shadow-xl rounded-2xl relative overflow-hidden border-4 border-purple-300/30">
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-30">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6953a072de46207f94f2b9d2/4540be9bd_Monster_01_1753263376704.png" 
              alt="" 
              className="w-20 h-20 object-contain"
            />
          </div>
          <div className="px-4 sm:px-6 relative z-10">
            <h1 className="text-2xl sm:text-3xl font-bold">🦁 Seedwave™ Admin Portal</h1>
            <p className="text-xs sm:text-sm opacity-90 mt-2">✿ Corebrands management & AI logic deployment center</p>
          </div>
        </header>

        {/* Metrics Cards */}
        <MetricsCards metrics={metrics} />

        {/* Main Tabs */}
        <Tabs value={selectedSector} onValueChange={setSelectedSector} className="space-y-6">
          <TabsList className="flex flex-wrap gap-2 h-auto bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-xl border-2 border-teal-200">
            <TabsTrigger value="admin" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
              ⚙️ Admin Panel
            </TabsTrigger>
            <TabsTrigger value="collaborations" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
              🤝 Collaborations
            </TabsTrigger>
            <TabsTrigger 
              value="banimal" 
              className="data-[state=active]:bg-orange-600 data-[state=active]:text-white"
              onClick={() => window.location.href = '/Banimal'}
            >
              ⚡ Banimal™
            </TabsTrigger>
            <TabsTrigger 
              value="vaultmesh" 
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
              onClick={() => window.location.href = '/VaultMesh'}
            >
              🔐 VaultMesh™
            </TabsTrigger>
            <TabsTrigger 
              value="payments" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              onClick={() => window.location.href = '/Payments'}
            >
              💳 Payments
            </TabsTrigger>
            <TabsTrigger 
              value="marketplace" 
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              onClick={() => window.location.href = '/Marketplace'}
            >
              🛍️ Marketplace
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
            <DataExporter />
            <DataSeeder />
            <AdminPanel onBrandAdded={handleBrandAdded} />
            <BrandManager />

          <TabsContent value="collaborations" className="space-y-6">
            <CollaborationManager />
          </TabsContent>
            
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
      <footer className="bg-gradient-to-r from-gray-800 via-gray-900 to-black text-gray-300 py-10 mt-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6953a072de46207f94f2b9d2/bdd987cfa_1st_eye_1753263376706.png" 
            alt="" 
            className="absolute right-10 bottom-0 w-40 h-40 object-contain"
          />
        </div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex items-center gap-3">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6953a072de46207f94f2b9d2/de7b64647_Nikon_1753263376703.png" 
                alt="" 
                className="w-12 h-12 object-contain opacity-80"
              />
              <div className="text-lg font-bold text-white">FAA.ZONE™</div>
            </div>
            <p className="text-xs sm:text-sm">ScrollGrid · PulseTrade Certified · TreatyMesh Validated</p>
          </div>
          <p className="text-xs text-gray-500 mt-6 text-center">
            © 2025 Fruitful Holdings (Pty) Ltd. · Seeds of Appreciation · All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
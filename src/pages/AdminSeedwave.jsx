import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import SectorCRUD from '../components/admin/SectorCRUD';
import AdminGlobalIndex from '../components/admin/AdminGlobalIndex';
import AdminRoleManager from '../components/admin/AdminRoleManager';
import AdminPaystackSandbox from '../components/admin/AdminPaystackSandbox';
import SectorAnalyticsChart from '../components/admin/SectorAnalyticsChart';

const SECTORS = {
  agriculture: '🌱 Agriculture',
  fsf: '🥦 Food & Farming',
  banking: '🏦 Banking',
  creative: '🖋️ Creative',
  logistics: '📦 Logistics',
  'education-ip': '📚 Education',
  fashion: '✂ Fashion',
  gaming: '🎮 Gaming',
  health: '🧠 Health',
  housing: '🏗️ Housing',
  justice: '⚖ Justice',
  knowledge: '📖 Knowledge',
  micromesh: '☰ Micro-Mesh',
  media: '🎬 Media',
  nutrition: '✿ Nutrition',
  'ai-logic': '🤖 AI Logic',
  packaging: '📦 Packaging',
  quantum: '✴️ Quantum',
  ritual: '☯ Ritual',
  saas: '🔑 SaaS',
  trade: '🧺 Trade',
  utilities: '🔋 Utilities',
  voice: '🎙️ Voice',
  webless: '📡 Webless',
  nft: '🔁 NFT',
  'education-youth': '🎓 Youth',
  zerowaste: '♻️ Zero Waste',
  professional: '🧾 Professional',
  'payroll-mining': '🪙 Payroll',
  mining: '⛏️ Mining',
  wildlife: '🦁 Wildlife',
};

export default function AdminSeedwave() {
  const [tab, setTab] = useState('index');
  const [selectedSector, setSelectedSector] = useState('agriculture');
  const queryClient = useQueryClient();

  const { data: brands = [], isLoading } = useQuery({
    queryKey: ['brands'],
    queryFn: () => base44.entities.Brand.list('-updated_date'),
  });

  const sectorStats = useMemo(() => {
    return Object.entries(SECTORS).map(([key, label]) => {
      const sectorBrands = brands.filter(b => b.sector === key);
      const totalSubnodes = sectorBrands.reduce((s, b) => s + (b.subnodes?.length || 0), 0);
      return { key, label, brandCount: sectorBrands.length, subnodeCount: totalSubnodes };
    }).filter(s => s.brandCount > 0);
  }, [brands]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-800 text-white py-6 px-6 shadow-xl">
        <h1 className="text-2xl font-black tracking-tight">🛡️ Seedwave Admin Portal</h1>
        <p className="text-indigo-300 text-sm mt-1">Full CRUD · Sector Analytics · Role Management · Payments</p>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="flex flex-wrap gap-2 h-auto bg-white p-3 rounded-xl shadow border mb-6">
            <TabsTrigger value="index" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">🌐 Global Index</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">📊 Sector Analytics</TabsTrigger>
            <TabsTrigger value="crud" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">⚙️ Sector CRUD</TabsTrigger>
            <TabsTrigger value="roles" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">👤 Role Manager</TabsTrigger>
            <TabsTrigger value="payments" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">💳 Paystack Sandbox</TabsTrigger>
          </TabsList>

          <TabsContent value="index">
            <AdminGlobalIndex brands={brands} sectors={SECTORS} />
          </TabsContent>

          <TabsContent value="analytics">
            <SectorAnalyticsChart sectorStats={sectorStats} brands={brands} sectors={SECTORS} />
          </TabsContent>

          <TabsContent value="crud">
            <div className="bg-white rounded-xl shadow p-4 mb-4">
              <label className="text-sm font-semibold text-gray-700 mr-3">Select Sector:</label>
              <select
                value={selectedSector}
                onChange={e => setSelectedSector(e.target.value)}
                className="border rounded-lg px-3 py-1.5 text-sm"
              >
                {Object.entries(SECTORS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <SectorCRUD
              sectorKey={selectedSector}
              sectorName={SECTORS[selectedSector]}
              brands={brands.filter(b => b.sector === selectedSector)}
              onRefresh={() => queryClient.invalidateQueries({ queryKey: ['brands'] })}
            />
          </TabsContent>

          <TabsContent value="roles">
            <AdminRoleManager />
          </TabsContent>

          <TabsContent value="payments">
            <AdminPaystackSandbox brands={brands} sectors={SECTORS} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BrandOrchestrator from '../components/banimal/BrandOrchestrator';
import BrandCreator from '../components/banimal/BrandCreator';
import ResourceManager from '../components/banimal/ResourceManager';
import PerformanceMonitor from '../components/banimal/PerformanceMonitor';
import { Loader2, Zap } from 'lucide-react';

export default function Banimal() {
  const [selectedTab, setSelectedTab] = useState('orchestrator');

  const { data: brands = [], isLoading } = useQuery({
    queryKey: ['brands'],
    queryFn: () => base44.entities.Brand.list('-updated_date')
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-gradient-to-r from-orange-600 to-red-700 text-white py-8 mb-8 shadow-xl">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-3">
            <Zap className="w-10 h-10" />
            <div>
              <h1 className="text-4xl font-extrabold drop-shadow-lg">Banimal™</h1>
              <p className="text-lg opacity-90 mt-1">Brand Orchestration & Management Platform</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 pb-12">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="bg-white p-2 rounded-lg shadow">
            <TabsTrigger value="orchestrator" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white">
              🎯 Brand Orchestrator
            </TabsTrigger>
            <TabsTrigger value="creator" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white">
              ⚡ Quick Brand Creator
            </TabsTrigger>
            <TabsTrigger value="resources" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white">
              📦 Resource Manager
            </TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white">
              📊 Performance Monitor
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orchestrator">
            <BrandOrchestrator brands={brands} />
          </TabsContent>

          <TabsContent value="creator">
            <BrandCreator />
          </TabsContent>

          <TabsContent value="resources">
            <ResourceManager brands={brands} />
          </TabsContent>

          <TabsContent value="performance">
            <PerformanceMonitor brands={brands} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
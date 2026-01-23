import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BrandOrchestrator from '../components/banimal/BrandOrchestrator';
import BrandCreator from '../components/banimal/BrandCreator';
import ResourceManager from '../components/banimal/ResourceManager';
import PerformanceMonitor from '../components/banimal/PerformanceMonitor';
import BackButton from '../components/navigation/BackButton';
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
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 relative overflow-hidden">
      {/* Floating artwork backgrounds */}
      <div className="fixed inset-0 pointer-events-none opacity-10 overflow-hidden">
        <img 
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6953a072de46207f94f2b9d2/4540be9bd_Monster_01_1753263376704.png" 
          alt="" 
          className="absolute -top-20 -left-20 w-64 h-64 object-contain animate-pulse"
        />
        <img 
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6953a072de46207f94f2b9d2/bdd987cfa_1st_eye_1753263376706.png" 
          alt="" 
          className="absolute top-40 right-10 w-48 h-48 object-contain animate-bounce"
          style={{ animationDuration: '3s' }}
        />
        <img 
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6953a072de46207f94f2b9d2/80c4597b5_3_1753260859823.png" 
          alt="" 
          className="absolute bottom-20 left-1/4 w-56 h-56 object-contain"
        />
      </div>

      <header className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 text-white py-12 mb-8 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className="relative">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6953a072de46207f94f2b9d2/52acd159d_Chief_02_1753263376705.png" 
                alt="Banimal" 
                className="w-24 h-24 sm:w-32 sm:h-32 object-contain drop-shadow-2xl animate-pulse"
              />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold drop-shadow-2xl">Banimal™</h1>
              <p className="text-base sm:text-lg md:text-xl opacity-95 mt-2 font-semibold">Brand Orchestration & Management Platform</p>
              <p className="text-xs sm:text-sm opacity-80 mt-1">🌍 Powered by the Ecosystem</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 pb-12 relative z-10">
        <BackButton />
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-xl border-2 border-orange-200 flex-wrap justify-start gap-2">
            <TabsTrigger value="orchestrator" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-lg transition-all">
              🎯 Brand Orchestrator
            </TabsTrigger>
            <TabsTrigger value="creator" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-lg transition-all">
              ⚡ Quick Brand Creator
            </TabsTrigger>
            <TabsTrigger value="resources" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-lg transition-all">
              📦 Resource Manager
            </TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-lg transition-all">
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
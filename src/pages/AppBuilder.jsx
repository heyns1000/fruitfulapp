import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BrandSelector from '../components/appbuilder/BrandSelector';
import AppGenerator from '../components/appbuilder/AppGenerator';
import AppPreview from '../components/appbuilder/AppPreview';
import BackButton from '../components/navigation/BackButton';
import { Loader2, Sparkles } from 'lucide-react';

export default function AppBuilder() {
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [generatedApp, setGeneratedApp] = useState(null);
  const [activeTab, setActiveTab] = useState('select');
  const [autoGenerating, setAutoGenerating] = useState(false);

  const { data: brands = [], isLoading } = useQuery({
    queryKey: ['brands'],
    queryFn: () => base44.entities.Brand.list('-updated_date')
  });

  const handleBrandsSelected = (brands) => {
    setSelectedBrands(brands);
    setActiveTab('generate');
  };

  const handleAppGenerated = (appData) => {
    setGeneratedApp(appData);
    setActiveTab('preview');
    setAutoGenerating(false);
  };

  const handleAutoGenerate = async (brands, appConfig) => {
    setAutoGenerating(true);
    setSelectedBrands(brands);
    setActiveTab('generate');
    // App generation happens automatically in AppGenerator when autoGenerating is true
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Floating artwork backgrounds */}
      <div className="fixed inset-0 pointer-events-none opacity-5 overflow-hidden">
        <img 
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6953a072de46207f94f2b9d2/de7b64647_Nikon_1753263376703.png" 
          alt="" 
          className="absolute top-20 right-20 w-72 h-72 object-contain animate-pulse"
        />
        <img 
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6953a072de46207f94f2b9d2/80c4597b5_3_1753260859823.png" 
          alt="" 
          className="absolute bottom-20 left-20 w-64 h-64 object-contain"
        />
      </div>

      <header className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-12 mb-8 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className="relative">
              <Sparkles className="w-20 h-20 sm:w-28 sm:h-28 drop-shadow-2xl animate-pulse" />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold drop-shadow-2xl">App Builder™</h1>
              <p className="text-base sm:text-lg md:text-xl opacity-95 mt-2 font-semibold">Generate Full-Stack Apps from Your Ecosystem Brands</p>
              <p className="text-xs sm:text-sm opacity-80 mt-1">🚀 AI-Powered Cross-Pollination Engine</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 pb-12 relative z-10">
        <BackButton />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-xl border-2 border-indigo-200 flex-wrap justify-start gap-2">
            <TabsTrigger 
              value="select" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white rounded-lg transition-all"
            >
              1️⃣ Select Brands
              {selectedBrands.length > 0 && (
                <span className="ml-2 bg-white/30 px-2 py-0.5 rounded text-xs">
                  {selectedBrands.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="generate" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white rounded-lg transition-all"
              disabled={selectedBrands.length === 0}
            >
              2️⃣ Generate App
            </TabsTrigger>
            <TabsTrigger 
              value="preview" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white rounded-lg transition-all"
              disabled={!generatedApp}
            >
              3️⃣ Preview & Export
            </TabsTrigger>
          </TabsList>

          <TabsContent value="select">
            <BrandSelector 
              brands={brands} 
              selectedBrands={selectedBrands}
              onBrandsSelected={handleBrandsSelected}
            />
          </TabsContent>

          <TabsContent value="generate">
            <AppGenerator 
              selectedBrands={selectedBrands}
              onAppGenerated={handleAppGenerated}
              autoGenerate={autoGenerating}
            />
          </TabsContent>

          <TabsContent value="preview">
            {generatedApp && (
              <AppPreview 
                appData={generatedApp}
                selectedBrands={selectedBrands}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
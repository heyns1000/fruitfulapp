import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import HotStackHeader from '../components/appbuilder/HotStackHeader';
import HotStackPrompt from '../components/appbuilder/HotStackPrompt';
import HotStackBrandStack from '../components/appbuilder/HotStackBrandStack';
import HotStackCustomize from '../components/appbuilder/HotStackCustomize';
import HotStackGenerator from '../components/appbuilder/HotStackGenerator';
import HotStackPreview from '../components/appbuilder/HotStackPreview';

// Flow: prompt → brands → customize → generate → preview
const STEPS = ['prompt', 'brands', 'customize', 'generate', 'preview'];

export default function AppBuilder() {
  const [step, setStep] = useState('prompt');
  const [vibePrompt, setVibePrompt] = useState('');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [customization, setCustomization] = useState({ logoUrl: '', colors: {}, referenceFiles: [] });
  const [generatedApp, setGeneratedApp] = useState(null);

  const { data: brands = [], isLoading } = useQuery({
    queryKey: ['brands'],
    queryFn: () => base44.entities.Brand.list('-updated_date'),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen relative overflow-hidden" style={{ background: '#08070b' }}>
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full blur-[120px] opacity-[0.06]" style={{ backgroundColor: '#f97316' }} />
        <div className="relative text-center space-y-4">
          <div className="text-5xl animate-pulse">🔥</div>
          <Loader2 className="w-7 h-7 animate-spin text-orange-500 mx-auto" />
          <p className="text-stone-500 text-sm font-mono">Loading HotStack™ ecosystem…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative text-white" style={{ background: '#08070b' }}>
      {/* Ambient gradient mesh */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full blur-[120px] opacity-[0.05]" style={{ backgroundColor: '#f97316' }} />
        <div className="absolute top-1/2 -left-40 w-[400px] h-[400px] rounded-full blur-[120px] opacity-[0.03]" style={{ backgroundColor: '#f59e0b' }} />
      </div>
      <HotStackHeader step={step} setStep={setStep} selectedBrands={selectedBrands} generatedApp={generatedApp} />

      <div className="relative container mx-auto px-4 sm:px-6 pb-16 pt-6">
        {step === 'prompt' && (
          <HotStackPrompt
            vibePrompt={vibePrompt}
            setVibePrompt={setVibePrompt}
            onNext={() => setStep('brands')}
          />
        )}
        {step === 'brands' && (
          <HotStackBrandStack
            brands={brands}
            selectedBrands={selectedBrands}
            setSelectedBrands={setSelectedBrands}
            onNext={() => setStep('customize')}
            onBack={() => setStep('prompt')}
          />
        )}
        {step === 'customize' && (
          <HotStackCustomize
            customization={customization}
            setCustomization={setCustomization}
            selectedBrands={selectedBrands}
            onNext={() => setStep('generate')}
            onBack={() => setStep('brands')}
          />
        )}
        {step === 'generate' && (
          <HotStackGenerator
            selectedBrands={selectedBrands}
            vibePrompt={vibePrompt}
            customization={customization}
            onGenerated={(data) => { setGeneratedApp(data); setStep('preview'); }}
            onBack={() => setStep('customize')}
          />
        )}
        {step === 'preview' && generatedApp && (
          <HotStackPreview
            appData={generatedApp}
            selectedBrands={selectedBrands}
            customization={customization}
            onRebuild={() => setStep('generate')}
          />
        )}
      </div>
    </div>
  );
}
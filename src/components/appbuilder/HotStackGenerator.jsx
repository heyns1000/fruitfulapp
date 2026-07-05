import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, Zap, ArrowLeft, Globe, Smartphone, Shield, X, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const LOADING_STEPS = [
  '🔍 Scanning real brand metadata…',
  '⬡ Mapping ecosystem subnodes…',
  '🧠 Calculating cross-pollination synergies…',
  '🎨 Designing page architecture…',
  '🗄️  Building database schema…',
  '⚡ Compiling feature matrix…',
  '🚀 Finalising HotStack™ output…',
];

export default function HotStackGenerator({ selectedBrands, vibePrompt, onGenerated, onBack }) {
  const [appName, setAppName] = useState('');
  const [appType, setAppType] = useState('webapp');
  const [userRoles, setUserRoles] = useState(['admin', 'user', 'artisan']);
  const [newRole, setNewRole] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  // Derive a default name from the vibe prompt
  useEffect(() => {
    if (vibePrompt && !appName) {
      const words = vibePrompt.trim().split(' ').slice(0, 4);
      setAppName(words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
    }
  }, [vibePrompt]);

  useEffect(() => {
    if (!isGenerating) return;
    const interval = setInterval(() => {
      setLoadingStep(prev => (prev + 1) % LOADING_STEPS.length);
    }, 1600);
    return () => clearInterval(interval);
  }, [isGenerating]);

  const generate = async () => {
    if (!appName.trim()) { toast.error('Give your app a name'); return; }
    setIsGenerating(true);
    setLoadingStep(0);

    // Keep payload lean to avoid 502 timeouts — trim to essentials only
    const brandsSummary = selectedBrands.slice(0, 10).map(b => ({
      name: b.name, sector: b.sector,
      description: (b.description || '').slice(0, 120),
      subnodes: (b.subnodes || []).slice(0, 5),
    }));

    try {
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are HotStack™, a 2026 AI vibe-coding app builder. Build REAL applications from actual ecosystem data.

USER'S VIBE PROMPT:
"${vibePrompt || 'Build a full ecosystem app for the FAA.ZONE brands.'}"

APP CONFIG:
- Name: ${appName}
- Type: ${appType}
- User Roles: ${JSON.stringify(userRoles)}

REAL ECOSYSTEM BRANDS (${selectedBrands.length} brands — use ONLY this real data, no invented brands):
${JSON.stringify(brandsSummary, null, 2)}

REQUIREMENTS:
1. Use ONLY the real brand names, sectors, subnodes, and tags provided above
2. Generate pages, features, and cross-pollination based on the actual brand data
3. Build a coherent app that directly addresses the user's vibe prompt
4. Create a database schema that reflects real entity relationships
5. Design a recommendation engine based on actual sector synergies
6. The app should feel like it was built by Replit/Lovable/Base44 — functional, real, modern
7. Include a loyalty system if the brands span multiple sectors
8. Generate role permissions based on the brand types selected

Return production-grade architecture using ONLY the provided real ecosystem data.`,
      response_json_schema: {
        type: 'object',
        properties: {
          appName: { type: 'string' },
          tagline: { type: 'string' },
          colorScheme: {
            type: 'object',
            properties: {
              primary: { type: 'string' },
              secondary: { type: 'string' },
              accent: { type: 'string' },
            },
          },
          pages: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                route: { type: 'string' },
                description: { type: 'string' },
                sections: { type: 'array', items: { type: 'string' } },
              },
            },
          },
          features: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                description: { type: 'string' },
                relatedBrands: { type: 'array', items: { type: 'string' } },
              },
            },
          },
          crossPollination: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                brand1: { type: 'string' },
                brand2: { type: 'string' },
                connectionType: { type: 'string' },
                feature: { type: 'string' },
                synergyScore: { type: 'number' },
              },
            },
          },
          databaseSchema: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                tableName: { type: 'string' },
                fields: { type: 'array', items: { type: 'string' } },
                relationships: { type: 'array', items: { type: 'string' } },
              },
            },
          },
          techStack: {
            type: 'object',
            properties: {
              frontend: { type: 'array', items: { type: 'string' } },
              backend: { type: 'array', items: { type: 'string' } },
              database: { type: 'string' },
            },
          },
          rolePermissions: {
            type: 'object',
            properties: {
              roles: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    permissions: { type: 'array', items: { type: 'string' } },
                    description: { type: 'string' },
                  },
                },
              },
            },
          },
          loyaltyProgram: {
            type: 'object',
            properties: {
              programName: { type: 'string' },
              earnRate: { type: 'string' },
              tiers: { type: 'array', items: { type: 'string' } },
              crossBrandBenefits: { type: 'array', items: { type: 'string' } },
            },
          },
        },
      },
    });

    setIsGenerating(false);
    onGenerated({
      ...result,
      appName,
      vibePrompt,
      appType,
      userRoles,
      selectedBrands,
      generatedAt: new Date().toISOString(),
    });
    toast.success('🔥 HotStack™ app generated!');
    } catch (err) {
      setIsGenerating(false);
      toast.error('Generation failed — try fewer brands or a shorter prompt.', { duration: 5000 });
    }
  };

  if (isGenerating) {
    return (
      <div className="max-w-2xl mx-auto pt-16 pb-8 text-center space-y-8">
        <div className="text-6xl animate-bounce">🔥</div>
        <h2 className="text-3xl font-black text-white">HotStack™ is building…</h2>
        <div className="bg-stone-900 border border-stone-700 rounded-2xl p-6 font-mono text-sm text-left space-y-2">
          {LOADING_STEPS.map((s, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-2 transition-all duration-500 ${
                idx < loadingStep
                  ? 'text-green-400'
                  : idx === loadingStep
                  ? 'text-orange-300 animate-pulse'
                  : 'text-stone-700'
              }`}
            >
              {idx < loadingStep ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <div className={`w-4 h-4 border rounded-full shrink-0 ${idx === loadingStep ? 'border-orange-500 animate-spin' : 'border-stone-700'}`} />}
              {s}
            </div>
          ))}
        </div>
        <div className="space-y-1">
          <p className="text-stone-400 text-sm">Using {selectedBrands.length} real brands · {selectedBrands.reduce((s, b) => s + (b.subnodes?.length || 0), 0)} subnodes</p>
          <p className="text-stone-600 text-xs">No mock data · Powered by FAA.ZONE ecosystem</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pt-6 space-y-8">
      <div>
        <p className="text-orange-400 text-xs font-bold tracking-widest uppercase mb-1">Step 3 — Configure & Build</p>
        <h2 className="text-3xl font-black text-white flex items-center gap-2">
          <Zap className="w-7 h-7 text-orange-500" />
          Finalise your HotStack™ build
        </h2>
      </div>

      {/* Vibe prompt preview */}
      {vibePrompt && (
        <div className="bg-stone-900 border border-stone-700 rounded-xl p-5">
          <p className="text-orange-400 text-xs font-bold tracking-widest uppercase mb-2">Your Vibe Prompt</p>
          <p className="text-stone-200 text-sm leading-relaxed font-mono">"{vibePrompt}"</p>
        </div>
      )}

      {/* Brand summary */}
      <div className="bg-stone-900 border border-orange-500/20 rounded-xl p-5">
        <p className="text-orange-400 text-xs font-bold tracking-widest uppercase mb-3">
          Stacked Brands ({selectedBrands.length})
        </p>
        <div className="flex flex-wrap gap-2">
          {selectedBrands.map(b => (
            <Badge key={b.id} className="bg-stone-800 border border-stone-700 text-stone-300 text-xs font-bold">
              {b.name}™
              {b.subnodes?.length > 0 && <span className="ml-1 text-orange-500">{b.subnodes.length}n</span>}
            </Badge>
          ))}
        </div>
      </div>

      {/* Config */}
      <div className="space-y-5 bg-stone-900 border border-stone-800 rounded-xl p-6">
        <div>
          <label className="text-stone-400 text-sm font-bold mb-2 block">App Name *</label>
          <Input
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            placeholder="e.g. FAA Artisan Hub"
            className="bg-stone-800 border-stone-700 text-white placeholder:text-stone-600 focus:border-orange-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-stone-400 text-sm font-bold mb-2 block">App Type</label>
            <Select value={appType} onValueChange={setAppType}>
              <SelectTrigger className="bg-stone-800 border-stone-700 text-white focus:border-orange-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-stone-900 border-stone-700">
                <SelectItem value="webapp">⚡ Web App</SelectItem>
                <SelectItem value="website">🌐 Website</SelectItem>
                <SelectItem value="mobile">📱 Mobile (Responsive)</SelectItem>
                <SelectItem value="dashboard">📊 Dashboard</SelectItem>
                <SelectItem value="marketplace">🏪 Marketplace</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-stone-400 text-sm font-bold mb-2 block flex items-center gap-2">
              <Shield className="w-4 h-4" /> User Roles
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {userRoles.map((r, i) => (
                <button
                  key={i}
                  onClick={() => setUserRoles(userRoles.filter((_, idx) => idx !== i))}
                  className="flex items-center gap-1 bg-stone-800 border border-stone-700 text-stone-300 text-xs font-bold px-2 py-1 rounded-full hover:border-red-500/50 hover:text-red-300 transition-all"
                >
                  {r} <X className="w-2.5 h-2.5" />
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add role…"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newRole.trim() && !userRoles.includes(newRole.trim())) {
                    setUserRoles([...userRoles, newRole.trim()]);
                    setNewRole('');
                  }
                }}
                className="bg-stone-800 border-stone-700 text-white placeholder:text-stone-600 text-sm focus:border-orange-500"
              />
              <Button
                onClick={() => {
                  if (newRole.trim() && !userRoles.includes(newRole.trim())) {
                    setUserRoles([...userRoles, newRole.trim()]);
                    setNewRole('');
                  }
                }}
                variant="outline"
                size="sm"
                className="border-stone-700 text-stone-300 hover:bg-stone-700 shrink-0"
              >
                Add
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between pt-2">
        <Button onClick={onBack} variant="outline" className="border-stone-700 text-stone-300 hover:bg-stone-800 gap-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <Button
          onClick={generate}
          disabled={!appName.trim()}
          className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-black px-10 text-base h-12 gap-2 disabled:opacity-30"
        >
          🔥 Generate with HotStack™
        </Button>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Sparkles, Plus } from 'lucide-react';
import { toast } from 'sonner';

const SECTORS = {
  agriculture: '🌱 Agriculture & Biotech',
  fsf: '🥦 Food, Soil & Farming',
  banking: '🏦 Banking & Finance',
  creative: '🖋️ Creative Tech',
  health: '🧠 Health & Hygiene',
  webless: '📡 Webless Tech & Nodes',
  'ai-logic': '🧠 AI, Logic & Grid'
};

export default function BrandCreator() {
  const [brandName, setBrandName] = useState('');
  const [sector, setSector] = useState('agriculture');
  const [description, setDescription] = useState('');
  const [subnodes, setSubnodes] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const queryClient = useQueryClient();

  const createBrandMutation = useMutation({
    mutationFn: (data) => base44.entities.Brand.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      toast.success('Brand created successfully');
      resetForm();
    },
    onError: () => toast.error('Failed to create brand')
  });

  const resetForm = () => {
    setBrandName('');
    setDescription('');
    setSubnodes('');
  };

  const generateBrandData = async () => {
    if (!brandName.trim()) {
      toast.error('Please enter a brand name first');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `For a brand named "${brandName}" in the "${SECTORS[sector]}" sector, generate:
1. A compelling 40-word description
2. 4-6 innovative subnodes
3. 5 searchable tags`,
        response_json_schema: {
          type: "object",
          properties: {
            description: { type: "string" },
            subnodes: { type: "array", items: { type: "string" } },
            tags: { type: "array", items: { type: "string" } }
          }
        }
      });

      setDescription(result.description);
      setSubnodes(result.subnodes.join(', '));
      toast.success('Brand data generated');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to generate brand data');
    } finally {
      setIsGenerating(false);
    }
  };

  const createBrand = async () => {
    if (!brandName.trim() || !subnodes.trim()) {
      toast.error('Please fill in brand name and subnodes');
      return;
    }

    setIsCreating(true);
    try {
      await createBrandMutation.mutateAsync({
        name: brandName,
        description,
        sector,
        subnodes: subnodes.split(',').map(s => s.trim()).filter(Boolean),
        metadata: {
          id: `${brandName.slice(0, 3).toUpperCase()}-${sector.slice(0, 3).toUpperCase()}-${Math.floor(Math.random() * 9000) + 1000}`,
          vault: `VAULT-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
          layer: `Layer ${Math.random() < 0.5 ? 'Alpha' : 'Beta'} v${(Math.random() * 2 + 1).toFixed(1)}`,
          deploymentZone: `Zone ${String.fromCharCode(65 + Math.floor(Math.random() * 5))} ${Math.floor(Math.random() * 10) + 1}`,
          securityRating: `FAA-SEC ${['A+', 'A', 'B+'][Math.floor(Math.random() * 3)]}`,
          activeNodes: Math.floor(Math.random() * 5000) + 100,
          priority: 50,
          resourceAllocation: 50,
          autoSync: true
        },
        isSystemBrand: false,
        aiGenerated: true
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardContent className="p-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-orange-700 mb-2">Quick Brand Creator</h2>
            <p className="text-gray-600">Create and configure new brands with AI assistance</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Brand Name</label>
              <Input
                placeholder="e.g., VaultSync"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Sector</label>
              <Select value={sector} onValueChange={setSector}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(SECTORS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={generateBrandData}
            disabled={isGenerating || !brandName.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Sparkles className="w-4 h-4 mr-2" />
            )}
            Generate Brand Data with AI
          </Button>

          <div>
            <label className="text-sm font-medium mb-2 block">Description</label>
            <Textarea
              placeholder="AI-generated description will appear here..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-24"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Subnodes (comma-separated)</label>
            <Textarea
              placeholder="e.g., NodeSync, VaultDrop, QRClaim"
              value={subnodes}
              onChange={(e) => setSubnodes(e.target.value)}
              className="h-20"
            />
          </div>

          <Button
            onClick={createBrand}
            disabled={isCreating}
            className="w-full bg-orange-600 hover:bg-orange-700"
            size="lg"
          >
            {isCreating ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <Plus className="w-5 h-5 mr-2" />
            )}
            Create Brand
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const GEMINI_API_KEY = 'AIzaSyBGSDZATtITv5iIoB3rgKHBpWx9MrufxXE';

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

export default function AdminPanel({ onBrandAdded }) {
  const [sector, setSector] = useState('agriculture');
  const [brandName, setBrandName] = useState('');
  const [description, setDescription] = useState('');
  const [subnodes, setSubnodes] = useState('');
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
  const [isGeneratingNodes, setIsGeneratingNodes] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const generateDescription = async () => {
    if (!brandName.trim()) {
      toast.error('Please enter a brand name first');
      return;
    }

    setIsGeneratingDesc(true);
    try {
      const sectorName = SECTORS[sector];
      const prompt = `Generate a concise and compelling 50-word description for a brand named "${brandName}" operating in the "${sectorName}" sector for an admin portal. Focus on its core value proposition and innovation.`;
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }]
          })
        }
      );

      const result = await response.json();
      if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
        setDescription(result.candidates[0].content.parts[0].text);
        toast.success('Description generated successfully');
      } else {
        toast.error('Failed to generate description');
      }
    } catch (error) {
      console.error('Error generating description:', error);
      toast.error('Error calling AI API');
    } finally {
      setIsGeneratingDesc(false);
    }
  };

  const suggestSubnodes = async () => {
    if (!brandName.trim()) {
      toast.error('Please enter a brand name first');
      return;
    }

    setIsGeneratingNodes(true);
    try {
      const sectorName = SECTORS[sector];
      const prompt = `Suggest 3-5 innovative subnodes for a brand named "${brandName}" in the "${sectorName}" sector. Provide the response as a JSON array of strings, where each string is a subnode name. Example: ["Subnode A", "Subnode B", "Subnode C"].`;
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: 'application/json',
              responseSchema: {
                type: 'ARRAY',
                items: { type: 'STRING' }
              }
            }
          })
        }
      );

      const result = await response.json();
      if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
        const suggested = JSON.parse(result.candidates[0].content.parts[0].text);
        setSubnodes(suggested.join(', '));
        toast.success('Subnodes suggested successfully');
      } else {
        toast.error('Failed to suggest subnodes');
      }
    } catch (error) {
      console.error('Error suggesting subnodes:', error);
      toast.error('Error calling AI API');
    } finally {
      setIsGeneratingNodes(false);
    }
  };

  const handleAddBrand = async () => {
    if (!brandName.trim() || !subnodes.trim()) {
      toast.error('Please fill in brand name and at least one subnode');
      return;
    }

    setIsAdding(true);
    try {
      const subnodesArray = subnodes.split(',').map(s => s.trim()).filter(Boolean);
      
      const newBrand = await base44.entities.Brand.create({
        name: brandName,
        description: description || '',
        sector: sector,
        subnodes: subnodesArray,
        metadata: {
          id: `${brandName.slice(0, 3).toUpperCase()}-${sector.slice(0, 3).toUpperCase()}-${Math.floor(Math.random() * 9000) + 1000}`,
          vault: `VAULT-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
          layer: `Layer ${Math.random() < 0.5 ? 'Alpha' : 'Beta'} v${(Math.random() * 2 + 1).toFixed(1)}`,
          deploymentZone: `Zone ${String.fromCharCode(65 + Math.floor(Math.random() * 5))} ${Math.floor(Math.random() * 10) + 1}`,
          securityRating: `FAA-SEC ${['A+', 'A', 'B+'][Math.floor(Math.random() * 3)]}`,
          activeNodes: Math.floor(Math.random() * 5000) + 100
        },
        isSystemBrand: false
      });

      toast.success(`Added ${brandName} to ${SECTORS[sector]}`);
      setBrandName('');
      setDescription('');
      setSubnodes('');
      
      if (onBrandAdded) onBrandAdded(newBrand);
    } catch (error) {
      console.error('Error adding brand:', error);
      toast.error('Failed to add brand');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-indigo-700">⚙️ Admin Panel — Add Brand & Subnodes</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="text-sm block font-medium mb-1">📂 Sector</label>
          <Select value={sector} onValueChange={setSector}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {Object.entries(SECTORS).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm block font-medium mb-1">🏷 Brand Name</label>
          <Input
            placeholder="e.g. OmniCastX"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
          />
          <Button
            onClick={generateDescription}
            disabled={isGeneratingDesc || !brandName}
            className="mt-2 w-full bg-purple-600 hover:bg-purple-700 text-white"
            size="sm"
          >
            {isGeneratingDesc ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            ✨ Generate Description
          </Button>
        </div>

        <div className="md:col-span-2">
          <label className="text-sm block font-medium mb-1">📝 Brand Description</label>
          <Textarea
            placeholder="Generated description will appear here..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="h-24 resize-y"
          />
        </div>

        <div>
          <label className="text-sm block font-medium mb-1">📌 Subnodes (comma-separated)</label>
          <Input
            placeholder="e.g. VaultDrop, QRClaim"
            value={subnodes}
            onChange={(e) => setSubnodes(e.target.value)}
          />
          <Button
            onClick={suggestSubnodes}
            disabled={isGeneratingNodes || !brandName}
            className="mt-2 w-full bg-purple-600 hover:bg-purple-700 text-white"
            size="sm"
          >
            {isGeneratingNodes ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            ✨ Suggest Subnodes
          </Button>
        </div>

        <div className="flex items-end">
          <Button
            onClick={handleAddBrand}
            disabled={isAdding}
            className="w-full bg-indigo-600 hover:bg-indigo-700"
          >
            {isAdding ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            ➕ Add Brand
          </Button>
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Check, Plus, X, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

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

export default function BrandSelector({ brands, selectedBrands, onBrandsSelected }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('all');
  const [localSelected, setLocalSelected] = useState(selectedBrands);

  const filteredBrands = brands.filter(brand => {
    const matchesSearch = brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         brand.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = selectedSector === 'all' || brand.sector === selectedSector;
    return matchesSearch && matchesSector;
  });

  const toggleBrand = (brand) => {
    const isSelected = localSelected.find(b => b.id === brand.id);
    if (isSelected) {
      setLocalSelected(localSelected.filter(b => b.id !== brand.id));
    } else {
      if (localSelected.length >= 10) {
        toast.error('Maximum 10 brands can be selected');
        return;
      }
      setLocalSelected([...localSelected, brand]);
    }
  };

  const handleContinue = () => {
    if (localSelected.length === 0) {
      toast.error('Please select at least one brand');
      return;
    }
    onBrandsSelected(localSelected);
    toast.success(`${localSelected.length} brands selected for app generation!`);
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-indigo-200 bg-white">
        <CardHeader>
          <CardTitle className="text-2xl text-indigo-900">🎯 Select Ecosystem Brands</CardTitle>
          <CardDescription>
            Choose up to 10 brands to include in your generated app. Cross-pollination will automatically connect related brands.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search brands..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedSector} onValueChange={setSelectedSector}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by sector" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                <SelectItem value="all">All Sectors</SelectItem>
                {Object.entries(SECTORS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Selected Brands */}
          {localSelected.length > 0 && (
            <div className="p-4 bg-indigo-50 rounded-lg border-2 border-indigo-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-indigo-900">
                  Selected Brands ({localSelected.length}/10)
                </h3>
                <Button
                  onClick={() => setLocalSelected([])}
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:bg-red-50"
                >
                  Clear All
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {localSelected.map(brand => (
                  <Badge 
                    key={brand.id}
                    className="bg-indigo-600 text-white px-3 py-1 cursor-pointer hover:bg-indigo-700"
                    onClick={() => toggleBrand(brand)}
                  >
                    {brand.name}™ <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Brand Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto p-1">
            {filteredBrands.map(brand => {
              const isSelected = localSelected.find(b => b.id === brand.id);
              return (
                <div
                  key={brand.id}
                  onClick={() => toggleBrand(brand)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50 shadow-lg'
                      : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-gray-900">{brand.name}™</h3>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-600'
                        : 'border-gray-300'
                    }`}>
                      {isSelected && <Check className="w-4 h-4 text-white" />}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                    {brand.description || 'No description'}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {SECTORS[brand.sector]?.split(' ')[1] || brand.sector}
                    </Badge>
                    {brand.subnodes?.length > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {brand.subnodes.length} subnodes
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Continue Button */}
          <div className="flex justify-end pt-4 border-t">
            <Button
              onClick={handleContinue}
              disabled={localSelected.length === 0}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-lg px-8 py-6"
            >
              Continue to Generator
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
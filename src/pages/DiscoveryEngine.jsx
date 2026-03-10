import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Search, Zap } from 'lucide-react';
import CompatibilityResults from '../components/discovery/CompatibilityResults';
import ProposalGenerator from '../components/discovery/ProposalGenerator';

export default function DiscoveryEngine() {
  const [selectedBrandId, setSelectedBrandId] = useState('');
  const [results, setResults] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);

  const { data: brands = [] } = useQuery({
    queryKey: ['brands-discovery'],
    queryFn: () => base44.entities.Brand.list(),
  });

  const selectedBrand = brands.find(b => b.id === selectedBrandId);

  const analyzeCompatibility = async () => {
    if (!selectedBrand) return;
    setAnalyzing(true);
    setResults(null);
    setSelectedMatch(null);

    const otherBrands = brands.filter(b => b.id !== selectedBrandId).slice(0, 25);

    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a brand synergy analyst for FAA.ZONE, a multi-sector business ecosystem.

Analyse the compatibility of the SOURCE BRAND with the TARGET BRANDS below for cross-collaboration opportunities.

SOURCE BRAND:
- Name: ${selectedBrand.name}
- Sector: ${selectedBrand.sector}
- Subnodes: ${(selectedBrand.subnodes || []).join(', ')}
- Tags: ${(selectedBrand.tags || []).join(', ')}
- Description: ${selectedBrand.description || 'N/A'}

TARGET BRANDS:
${otherBrands.map((b, i) => `${i + 1}. Name: ${b.name}, Sector: ${b.sector}, Subnodes: ${(b.subnodes || []).slice(0, 3).join(', ')}, Tags: ${(b.tags || []).slice(0, 4).join(', ')}`).join('\n')}

Score each brand 0–100 on: sector synergy, tag overlap, subnode potential, market opportunity, innovation potential.
Return the top 6 most compatible brands.`,
      response_json_schema: {
        type: 'object',
        properties: {
          matches: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                brandName: { type: 'string' },
                compatibilityScore: { type: 'number' },
                synergyReason: { type: 'string' },
                collaborationAngle: { type: 'string' },
                sharedOpportunities: { type: 'array', items: { type: 'string' } },
                riskFactors: { type: 'array', items: { type: 'string' } }
              }
            }
          },
          overallInsight: { type: 'string' }
        }
      }
    });

    const enriched = (response.matches || []).map(match => {
      const brandData = otherBrands.find(b =>
        b.name === match.brandName || b.name.toLowerCase().includes(match.brandName.toLowerCase())
      );
      return { ...match, brandData };
    });

    setResults({ matches: enriched, overallInsight: response.overallInsight });
    setAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50">
      <header className="bg-gradient-to-r from-indigo-700 via-blue-700 to-cyan-700 text-white py-8 shadow-xl">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-9 h-9 drop-shadow-lg" />
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold drop-shadow-lg">Discovery Engine</h1>
                <p className="opacity-90 mt-1 text-sm sm:text-base">AI-powered brand compatibility analysis & joint venture matching</p>
              </div>
            </div>
            <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6953a072de46207f94f2b9d2/52acd159d_Chief_02_1753263376705.png" alt="FAA" className="w-10 h-10 object-contain opacity-90" />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Card className="mb-8 border-indigo-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-t-xl">
            <CardTitle className="flex items-center gap-2 text-indigo-900">
              <Search className="w-5 h-5" />
              Select a Brand to Analyse
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={selectedBrandId} onValueChange={setSelectedBrandId}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Choose a brand..." />
                </SelectTrigger>
                <SelectContent>
                  {brands.map(b => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.name} — {b.sector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={analyzeCompatibility}
                disabled={!selectedBrandId || analyzing}
                className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-8"
              >
                {analyzing
                  ? <><Zap className="w-4 h-4 animate-pulse mr-2" />Analysing...</>
                  : <><Sparkles className="w-4 h-4 mr-2" />Find Compatible Brands</>
                }
              </Button>
            </div>
            {selectedBrand && (
              <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                <p className="text-sm font-semibold text-indigo-900">{selectedBrand.name}</p>
                <p className="text-xs text-indigo-700 mt-1">{selectedBrand.description || 'No description available'}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  <Badge className="bg-indigo-200 text-indigo-900 text-xs">{selectedBrand.sector}</Badge>
                  {(selectedBrand.tags || []).slice(0, 6).map(t => (
                    <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {analyzing && (
          <div className="text-center py-20">
            <div className="inline-flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center animate-pulse">
                <Sparkles className="w-10 h-10 text-indigo-600" />
              </div>
              <p className="text-xl font-semibold text-indigo-900">AI is analysing brand compatibility...</p>
              <p className="text-sm text-gray-500">Scanning subnodes, sector tags & synergy signals across the ecosystem</p>
            </div>
          </div>
        )}

        {results && !selectedMatch && (
          <CompatibilityResults
            results={results}
            sourceBrand={selectedBrand}
            onSelectMatch={setSelectedMatch}
          />
        )}

        {selectedMatch && (
          <ProposalGenerator
            sourceBrand={selectedBrand}
            match={selectedMatch}
            onBack={() => setSelectedMatch(null)}
          />
        )}
      </div>
    </div>
  );
}
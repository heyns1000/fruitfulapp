import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BarChart2, FileDown, Loader2, Sparkles, RefreshCw } from 'lucide-react';
import ReportViewer from '../components/intelligence/ReportViewer';

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

const REGION_SECTORS = {
  'West Africa': ['agriculture','fsf','trade','fashion','creative','ritual'],
  'Southern Africa': ['mining','banking','wildlife','zerowaste','payroll-mining','utilities'],
  'East Africa': ['agriculture','logistics','health','utilities','nutrition','micromesh'],
  'Europe': ['saas','ai-logic','quantum','professional','knowledge','packaging'],
  'Middle East & N. Africa': ['banking','media','voice','webless','ritual','housing'],
  'South Asia': ['education-ip','education-youth','health','ai-logic','saas','micromesh'],
  'Southeast Asia': ['gaming','nft','media','logistics','trade','fashion'],
  'North America': ['saas','ai-logic','quantum','professional','housing','justice'],
  'Latin America': ['agriculture','fsf','trade','packaging','nutrition','zerowaste'],
};

export default function MarketIntelligence() {
  const [selectedBrandId, setSelectedBrandId] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[new Date().getMonth()]);
  const [selectedYear, setSelectedYear] = useState('2026');
  const [report, setReport] = useState(null);
  const [generating, setGenerating] = useState(false);

  const { data: brands = [] } = useQuery({
    queryKey: ['brands-intelligence'],
    queryFn: () => base44.entities.Brand.list(),
  });

  const selectedBrand = brands.find(b => b.id === selectedBrandId);

  const generateReport = async () => {
    if (!selectedBrand) return;
    setGenerating(true);
    setReport(null);

    const sectorPeers = brands.filter(b => b.sector === selectedBrand.sector && b.id !== selectedBrand.id);
    const allSectors = [...new Set(brands.map(b => b.sector))];
    const activeRegions = Object.entries(REGION_SECTORS)
      .filter(([, sectors]) => sectors.includes(selectedBrand.sector))
      .map(([region]) => region);

    const potentialCollaborators = brands
      .filter(b => b.id !== selectedBrand.id && b.sector !== selectedBrand.sector)
      .filter(b => (b.tags || []).some(t => (selectedBrand.tags || []).includes(t)) ||
                   (b.subnodes || []).some(s => (selectedBrand.subnodes || []).includes(s)))
      .slice(0, 10);

    const response = await base44.integrations.Core.InvokeLLM({
      model: 'claude_sonnet_4_6',
      prompt: `You are a senior market intelligence analyst for FAA.ZONE, a multi-sector African & global business ecosystem.

Generate a comprehensive MONTHLY MARKET INTELLIGENCE REPORT for ${selectedMonth} ${selectedYear}.

BRAND PROFILE:
- Name: ${selectedBrand.name}
- Sector: ${selectedBrand.sector}
- Subnodes: ${(selectedBrand.subnodes || []).join(', ')}
- Tags: ${(selectedBrand.tags || []).join(', ')}
- Description: ${selectedBrand.description || 'N/A'}

ECOSYSTEM CONTEXT:
- Total brands in ecosystem: ${brands.length}
- Sector peers: ${sectorPeers.map(b => b.name).join(', ') || 'None'}
- Active geographic regions for this sector: ${activeRegions.join(', ')}
- All active sectors: ${allSectors.join(', ')}
- Potential cross-sector collaborators: ${potentialCollaborators.map(b => `${b.name} (${b.sector})`).join(', ')}

Generate a detailed, realistic, data-rich intelligence report specific to this brand's position in the ecosystem. Use specific numbers, percentages, and insights.`,
      response_json_schema: {
        type: 'object',
        properties: {
          reportTitle: { type: 'string' },
          executiveSummary: { type: 'string' },
          overallMarketScore: { type: 'number' },
          overallMarketSentiment: { type: 'string', enum: ['Bullish','Neutral','Cautious','Bearish'] },
          sectorAnalysis: {
            type: 'object',
            properties: {
              sectorName: { type: 'string' },
              growthRate: { type: 'string' },
              marketSize: { type: 'string' },
              outlook: { type: 'string' },
              keyDrivers: { type: 'array', items: { type: 'string' } },
              headwinds: { type: 'array', items: { type: 'string' } }
            }
          },
          emergingTrends: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                trend: { type: 'string' },
                impact: { type: 'string', enum: ['High','Medium','Low'] },
                timeframe: { type: 'string' },
                description: { type: 'string' }
              }
            }
          },
          geographicOpportunities: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                region: { type: 'string' },
                opportunityScore: { type: 'number' },
                rationale: { type: 'string' },
                recommendedAction: { type: 'string' }
              }
            }
          },
          competitorMovements: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                competitor: { type: 'string' },
                movement: { type: 'string' },
                threatLevel: { type: 'string', enum: ['High','Medium','Low'] },
                recommendation: { type: 'string' }
              }
            }
          },
          collaborationOpportunities: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                partnerBrand: { type: 'string' },
                partnerSector: { type: 'string' },
                compatibilityScore: { type: 'number' },
                proposedVenture: { type: 'string' },
                estimatedValue: { type: 'string' },
                urgency: { type: 'string', enum: ['Immediate','3 months','6 months','12 months'] }
              }
            }
          },
          strategicRecommendations: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                priority: { type: 'string', enum: ['Critical','High','Medium'] },
                recommendation: { type: 'string' },
                rationale: { type: 'string' },
                expectedOutcome: { type: 'string' }
              }
            }
          },
          kpiForecast: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                metric: { type: 'string' },
                current: { type: 'string' },
                forecast: { type: 'string' },
                trend: { type: 'string', enum: ['up','down','stable'] }
              }
            }
          }
        }
      }
    });

    setReport({ ...response, brand: selectedBrand, period: `${selectedMonth} ${selectedYear}`, generatedAt: new Date().toISOString() });
    setGenerating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100">
      <header className="bg-gradient-to-r from-slate-800 via-gray-800 to-zinc-800 text-white py-8 shadow-xl">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <BarChart2 className="w-9 h-9 drop-shadow-lg text-blue-300" />
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold drop-shadow-lg">Market Intelligence</h1>
                <p className="opacity-80 mt-1 text-sm sm:text-base text-blue-200">AI-generated monthly brand intelligence reports & strategic insights</p>
              </div>
            </div>
            <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6953a072de46207f94f2b9d2/52acd159d_Chief_02_1753263376705.png" alt="FAA" className="w-10 h-10 object-contain opacity-90" />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Config Panel */}
        <Card className="mb-8 shadow-lg border-gray-200">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-t-xl border-b">
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Sparkles className="w-5 h-5 text-blue-600" />
              Configure Intelligence Report
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Brand</label>
                <Select value={selectedBrandId} onValueChange={setSelectedBrandId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select brand..." />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map(b => (
                      <SelectItem key={b.id} value={b.id}>{b.name} — {b.sector}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Report Month</label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {MONTHS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Year</label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['2025','2026','2027'].map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {selectedBrand && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100 flex items-start gap-3">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-blue-900">{selectedBrand.name}</p>
                  <p className="text-xs text-blue-700 mt-0.5">{selectedBrand.description || 'No description'}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    <Badge className="bg-blue-200 text-blue-900 text-xs">{selectedBrand.sector}</Badge>
                    {(selectedBrand.subnodes || []).slice(0,4).map(s => (
                      <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={generateReport}
                disabled={!selectedBrandId || generating}
                className="bg-gradient-to-r from-slate-700 to-gray-700 hover:from-slate-800 hover:to-gray-800 text-white px-8"
              >
                {generating
                  ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Generating Report...</>
                  : <><BarChart2 className="w-4 h-4 mr-2" />Generate Intelligence Report</>
                }
              </Button>
              {report && (
                <Button variant="outline" onClick={generateReport} disabled={generating}>
                  <RefreshCw className="w-4 h-4 mr-2" />Regenerate
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {generating && (
          <div className="text-center py-24">
            <div className="inline-flex flex-col items-center gap-5">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center">
                  <BarChart2 className="w-12 h-12 text-slate-500 animate-pulse" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">Generating {selectedMonth} {selectedYear} Report</p>
                <p className="text-sm text-gray-500 mt-2">AI is analysing sector trends, competitor movements & collaboration opportunities...</p>
                <p className="text-xs text-blue-500 mt-1">This uses Claude Sonnet for highest quality analysis</p>
              </div>
            </div>
          </div>
        )}

        {report && !generating && <ReportViewer report={report} />}
      </div>
    </div>
  );
}
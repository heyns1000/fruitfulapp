import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, FileText, Megaphone, Package, Download, Copy } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function AIProposalEngine() {
  const [generating, setGenerating] = useState(false);
  const [proposals, setProposals] = useState([]);
  const [selectedBrand1, setSelectedBrand1] = useState('');
  const [selectedBrand2, setSelectedBrand2] = useState('');

  const { data: brands = [] } = useQuery({
    queryKey: ['brands'],
    queryFn: () => base44.entities.Brand.list(),
  });

  const generateProposals = async () => {
    if (!selectedBrand1 || !selectedBrand2) {
      toast.error('Please select two brands');
      return;
    }

    setGenerating(true);
    try {
      const brand1 = brands.find(b => b.id === selectedBrand1);
      const brand2 = brands.find(b => b.id === selectedBrand2);

      const prompt = `You are an expert cross-pollination strategist for the FAA.ZONE ecosystem.

Perform deep analysis of these two brands and automatically generate specific, actionable collaboration proposals:

BRAND 1 - COMPLETE DATA:
${JSON.stringify({
  name: brand1.name,
  sector: brand1.sector,
  description: brand1.description,
  subnodes: brand1.subnodes || [],
  tags: brand1.tags || [],
  metadata: brand1.metadata || {}
}, null, 2)}

BRAND 2 - COMPLETE DATA:
${JSON.stringify({
  name: brand2.name,
  sector: brand2.sector,
  description: brand2.description,
  subnodes: brand2.subnodes || [],
  tags: brand2.tags || [],
  metadata: brand2.metadata || {}
}, null, 2)}

Based on deep analysis of:
- Sector synergies and complementarity
- Subnode overlap and integration opportunities
- Metadata compatibility (layers, security, deployment zones)
- Tag intersection and market positioning
- Current market trends

Generate THREE complete, ready-to-execute proposals:
1. Collaborative Content Piece (blog, whitepaper, or case study)
2. Joint Marketing Campaign (social media, email, or ad campaign)
3. Co-Branded Product/Service Bundle (specific offering with pricing)

For each proposal, provide:
- Complete draft content (ready to publish/use)
- Target audience definition
- Expected ROI and success metrics
- Timeline and milestones
- Resource requirements`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: prompt,
        response_json_schema: {
          type: "object",
          properties: {
            synergyScore: { type: "number" },
            synergyAnalysis: { type: "string" },
            contentProposal: {
              type: "object",
              properties: {
                title: { type: "string" },
                type: { type: "string" },
                fullDraft: { type: "string" },
                targetAudience: { type: "string" },
                expectedROI: { type: "string" },
                timeline: { type: "string" }
              }
            },
            campaignProposal: {
              type: "object",
              properties: {
                name: { type: "string" },
                type: { type: "string" },
                strategy: { type: "string" },
                channels: { type: "array", items: { type: "string" } },
                budget: { type: "string" },
                targetAudience: { type: "string" },
                kpis: { type: "array", items: { type: "string" } },
                timeline: { type: "string" }
              }
            },
            bundleProposal: {
              type: "object",
              properties: {
                name: { type: "string" },
                description: { type: "string" },
                components: { type: "array", items: { type: "string" } },
                pricing: { type: "string" },
                valueProposition: { type: "string" },
                targetMarket: { type: "string" },
                projectedRevenue: { type: "string" }
              }
            }
          }
        }
      });

      setProposals([result]);
      toast.success('AI proposals generated!');
    } catch (error) {
      toast.error('Proposal generation failed');
      console.error(error);
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <Card className="border-2 border-purple-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-900">
          <Sparkles className="w-6 h-6 text-purple-600" />
          AI Proposal Engine
        </CardTitle>
        <CardDescription>
          Auto-generate collaborative content, campaigns, and bundles using deep brand analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Brand Selection */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Brand 1</label>
            <select 
              className="w-full p-2 border rounded"
              value={selectedBrand1}
              onChange={(e) => setSelectedBrand1(e.target.value)}
            >
              <option value="">Select brand...</option>
              {brands.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Brand 2</label>
            <select 
              className="w-full p-2 border rounded"
              value={selectedBrand2}
              onChange={(e) => setSelectedBrand2(e.target.value)}
            >
              <option value="">Select brand...</option>
              {brands.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
        </div>

        <Button 
          onClick={generateProposals}
          disabled={generating || !selectedBrand1 || !selectedBrand2}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          {generating ? (
            <>
              <Sparkles className="w-4 h-4 mr-2 animate-spin" />
              AI is analyzing and generating proposals...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate AI-Powered Proposals
            </>
          )}
        </Button>

        {/* Generated Proposals */}
        {proposals.length > 0 && proposals[0] && (
          <div className="space-y-4">
            {/* Synergy Score */}
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h3 className="font-bold text-purple-900 mb-2">Synergy Analysis</h3>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl font-bold text-purple-600">{proposals[0].synergyScore}%</span>
                <Badge className="bg-purple-600">High Potential</Badge>
              </div>
              <p className="text-sm text-gray-700">{proposals[0].synergyAnalysis}</p>
            </div>

            <Tabs defaultValue="content">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="content">
                  <FileText className="w-4 h-4 mr-2" />
                  Content
                </TabsTrigger>
                <TabsTrigger value="campaign">
                  <Megaphone className="w-4 h-4 mr-2" />
                  Campaign
                </TabsTrigger>
                <TabsTrigger value="bundle">
                  <Package className="w-4 h-4 mr-2" />
                  Bundle
                </TabsTrigger>
              </TabsList>

              {/* Content Proposal */}
              <TabsContent value="content">
                <Card>
                  <CardHeader>
                    <CardTitle>{proposals[0].contentProposal.title}</CardTitle>
                    <CardDescription>
                      Type: {proposals[0].contentProposal.type}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Full Draft:</h4>
                      <div className="p-3 bg-gray-50 rounded max-h-64 overflow-y-auto">
                        <pre className="whitespace-pre-wrap text-sm">{proposals[0].contentProposal.fullDraft}</pre>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-semibold">Target Audience:</h4>
                        <p className="text-gray-700">{proposals[0].contentProposal.targetAudience}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Expected ROI:</h4>
                        <p className="text-gray-700">{proposals[0].contentProposal.expectedROI}</p>
                      </div>
                      <div className="col-span-2">
                        <h4 className="font-semibold">Timeline:</h4>
                        <p className="text-gray-700">{proposals[0].contentProposal.timeline}</p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => copyToClipboard(proposals[0].contentProposal.fullDraft)}
                      className="w-full"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Draft
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Campaign Proposal */}
              <TabsContent value="campaign">
                <Card>
                  <CardHeader>
                    <CardTitle>{proposals[0].campaignProposal.name}</CardTitle>
                    <CardDescription>
                      Type: {proposals[0].campaignProposal.type}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Strategy:</h4>
                      <p className="text-sm text-gray-700">{proposals[0].campaignProposal.strategy}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Channels:</h4>
                      <div className="flex flex-wrap gap-2">
                        {proposals[0].campaignProposal.channels?.map((channel, idx) => (
                          <Badge key={idx} variant="outline">{channel}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-semibold">Budget:</h4>
                        <p className="text-gray-700">{proposals[0].campaignProposal.budget}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Timeline:</h4>
                        <p className="text-gray-700">{proposals[0].campaignProposal.timeline}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">KPIs:</h4>
                      <ul className="list-disc list-inside text-sm text-gray-700">
                        {proposals[0].campaignProposal.kpis?.map((kpi, idx) => (
                          <li key={idx}>{kpi}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Bundle Proposal */}
              <TabsContent value="bundle">
                <Card>
                  <CardHeader>
                    <CardTitle>{proposals[0].bundleProposal.name}</CardTitle>
                    <CardDescription>
                      {proposals[0].bundleProposal.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Bundle Components:</h4>
                      <ul className="list-disc list-inside text-sm text-gray-700">
                        {proposals[0].bundleProposal.components?.map((comp, idx) => (
                          <li key={idx}>{comp}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-semibold">Pricing:</h4>
                        <p className="text-lg font-bold text-green-600">{proposals[0].bundleProposal.pricing}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Projected Revenue:</h4>
                        <p className="text-lg font-bold text-blue-600">{proposals[0].bundleProposal.projectedRevenue}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Value Proposition:</h4>
                      <p className="text-sm text-gray-700">{proposals[0].bundleProposal.valueProposition}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Target Market:</h4>
                      <p className="text-sm text-gray-700">{proposals[0].bundleProposal.targetMarket}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
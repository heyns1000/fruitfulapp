import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Loader2, CheckCircle, X, TrendingUp, Lightbulb } from 'lucide-react';
import { toast } from 'sonner';

export default function AISuggestions({ brands }) {
  const [suggestions, setSuggestions] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [dismissedIds, setDismissedIds] = useState([]);
  const queryClient = useQueryClient();

  const createCollaborationMutation = useMutation({
    mutationFn: (data) => base44.entities.BrandCollaboration.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collaborations'] });
      toast.success('Collaboration created from AI suggestion!');
    }
  });

  const generateSuggestions = async () => {
    if (brands.length < 2) {
      toast.error('Need at least 2 brands to generate suggestions');
      return;
    }

    setIsGenerating(true);
    try {
      const brandsSummary = brands.map(b => ({
        id: b.id,
        name: b.name,
        sector: b.sector,
        description: b.description,
        subnodes: b.subnodes,
        metadata: b.metadata
      }));

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an expert business strategist analyzing a brand ecosystem. Identify the TOP 5 most promising cross-pollination opportunities between these brands.

Brands:
${JSON.stringify(brandsSummary, null, 2)}

For each suggestion:
1. Identify 2 brands with strong synergy potential
2. Explain the connection type (technology integration, market synergy, resource sharing, etc.)
3. Propose a specific collaboration feature or initiative
4. Explain the rationale and benefits for both brands
5. Rate the synergy score (0-100)

Focus on:
- Complementary capabilities
- Shared target markets
- Technology stack compatibility
- Supply chain efficiencies
- Cross-sector innovation opportunities

Return top 5 suggestions with highest potential ROI.`,
        response_json_schema: {
          type: "object",
          properties: {
            suggestions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  brand1Id: { type: "string" },
                  brand1Name: { type: "string" },
                  brand2Id: { type: "string" },
                  brand2Name: { type: "string" },
                  connectionType: { type: "string" },
                  proposedFeature: { type: "string" },
                  rationale: { type: "string" },
                  benefits: {
                    type: "object",
                    properties: {
                      brand1: { type: "string" },
                      brand2: { type: "string" },
                      ecosystem: { type: "string" }
                    }
                  },
                  synergyScore: { type: "number" },
                  implementationComplexity: { 
                    type: "string",
                    enum: ["low", "medium", "high"]
                  },
                  estimatedTimeframe: { type: "string" }
                }
              }
            }
          }
        }
      });

      setSuggestions(result.suggestions || []);
      toast.success(`Generated ${result.suggestions?.length || 0} AI-powered collaboration suggestions!`);
    } catch (error) {
      console.error('Error generating suggestions:', error);
      toast.error('Failed to generate suggestions');
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (brands.length >= 2 && suggestions.length === 0) {
      generateSuggestions();
    }
  }, [brands]);

  const acceptSuggestion = (suggestion) => {
    createCollaborationMutation.mutate({
      brand1Id: suggestion.brand1Id,
      brand1Name: suggestion.brand1Name,
      brand2Id: suggestion.brand2Id,
      brand2Name: suggestion.brand2Name,
      proposalTitle: suggestion.proposedFeature,
      proposalDescription: `${suggestion.rationale}\n\nBenefits:\n- ${suggestion.brand1Name}: ${suggestion.benefits.brand1}\n- ${suggestion.brand2Name}: ${suggestion.benefits.brand2}\n- Ecosystem: ${suggestion.benefits.ecosystem}`,
      status: 'pending',
      aiSuggested: true,
      synergyScore: suggestion.synergyScore,
      synergyReason: suggestion.connectionType
    });

    setDismissedIds([...dismissedIds, `${suggestion.brand1Id}-${suggestion.brand2Id}`]);
  };

  const dismissSuggestion = (suggestion) => {
    setDismissedIds([...dismissedIds, `${suggestion.brand1Id}-${suggestion.brand2Id}`]);
    toast.info('Suggestion dismissed');
  };

  const activeSuggestions = suggestions.filter(
    s => !dismissedIds.includes(`${s.brand1Id}-${s.brand2Id}`)
  );

  const getComplexityColor = (complexity) => {
    switch(complexity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl text-purple-900 flex items-center gap-2">
                <Sparkles className="w-6 h-6" />
                AI-Powered Collaboration Suggestions
              </CardTitle>
              <CardDescription className="mt-2">
                Proactive cross-pollination opportunities identified by AI based on brand ecosystem analysis
              </CardDescription>
            </div>
            <Button
              onClick={generateSuggestions}
              disabled={isGenerating || brands.length < 2}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              Regenerate
            </Button>
          </div>
        </CardHeader>
      </Card>

      {isGenerating && (
        <Card className="border-2 border-purple-300">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
              <h3 className="font-bold text-purple-900">AI is analyzing your brand ecosystem...</h3>
            </div>
            <div className="space-y-2 text-sm text-purple-800">
              <p>🔍 Mapping brand capabilities and synergies...</p>
              <p>🧠 Identifying complementary technologies...</p>
              <p>📊 Calculating synergy scores...</p>
              <p>💡 Generating collaboration proposals...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {!isGenerating && activeSuggestions.length === 0 && suggestions.length > 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <p className="text-gray-600">All suggestions reviewed! Generate new ones to discover more opportunities.</p>
          </CardContent>
        </Card>
      )}

      {activeSuggestions.map((suggestion, idx) => (
        <Card key={idx} className="border-2 border-indigo-200 hover:shadow-xl transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Badge className="bg-indigo-600 text-white text-sm px-3 py-1">
                    {suggestion.brand1Name}™
                  </Badge>
                  <span className="text-2xl">🤝</span>
                  <Badge className="bg-indigo-600 text-white text-sm px-3 py-1">
                    {suggestion.brand2Name}™
                  </Badge>
                </div>
                <CardTitle className="text-xl text-indigo-900">
                  {suggestion.proposedFeature}
                </CardTitle>
                <div className="flex items-center gap-2 mt-3">
                  <Badge variant="outline" className="text-xs">
                    {suggestion.connectionType}
                  </Badge>
                  <Badge className={getComplexityColor(suggestion.implementationComplexity)}>
                    {suggestion.implementationComplexity} complexity
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    ⏱ {suggestion.estimatedTimeframe}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-purple-600">
                  {suggestion.synergyScore}
                </div>
                <div className="text-xs text-gray-500">synergy score</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Rationale */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-blue-900">Why This Works</h4>
              </div>
              <p className="text-sm text-gray-700">{suggestion.rationale}</p>
            </div>

            {/* Benefits */}
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-green-900">Expected Benefits</h4>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-semibold text-gray-900">{suggestion.brand1Name}:</span>
                  <p className="text-gray-700 mt-1">{suggestion.benefits.brand1}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-900">{suggestion.brand2Name}:</span>
                  <p className="text-gray-700 mt-1">{suggestion.benefits.brand2}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-900">Ecosystem Impact:</span>
                  <p className="text-gray-700 mt-1">{suggestion.benefits.ecosystem}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                onClick={() => acceptSuggestion(suggestion)}
                disabled={createCollaborationMutation.isPending}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                {createCollaborationMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <CheckCircle className="w-4 h-4 mr-2" />
                )}
                Accept & Create Collaboration
              </Button>
              <Button
                onClick={() => dismissSuggestion(suggestion)}
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                <X className="w-4 h-4 mr-2" />
                Dismiss
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Sparkles, CheckCircle, AlertCircle, Lightbulb, ArrowRight, Download } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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

export default function BrandOnboarding() {
  const [step, setStep] = useState(1);
  const [brandData, setBrandData] = useState({
    name: '',
    sector: '',
    description: '',
    subnodes: [],
    tags: [],
    metadata: {}
  });
  const [analyzing, setAnalyzing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [completionScore, setCompletionScore] = useState(0);
  const [newSubnode, setNewSubnode] = useState('');
  const [newTag, setNewTag] = useState('');

  const queryClient = useQueryClient();

  const createBrandMutation = useMutation({
    mutationFn: (data) => base44.entities.Brand.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      toast.success('Brand created successfully!');
      setStep(5);
    }
  });

  const calculateCompletionScore = (data) => {
    let score = 0;
    if (data.name) score += 15;
    if (data.sector) score += 15;
    if (data.description) score += 20;
    if (data.subnodes?.length > 0) score += 20;
    if (data.subnodes?.length >= 5) score += 10;
    if (data.tags?.length > 0) score += 10;
    if (data.metadata?.deploymentZone) score += 5;
    if (data.metadata?.securityRating) score += 5;
    return score;
  };

  const analyzeAndSuggest = async () => {
    setAnalyzing(true);
    try {
      const prompt = `You are an expert brand onboarding assistant for the FAA.ZONE ecosystem.

Analyze this brand data and provide comprehensive suggestions to make it "one-hit wonder" ready:

Current Brand Data:
${JSON.stringify(brandData, null, 2)}

Provide:
1. Missing Critical Data Points (what's needed for complete ecosystem integration)
2. Suggested Subnodes (based on sector and description)
3. Recommended Tags (for searchability and cross-pollination)
4. Metadata Enrichment (deployment zones, security ratings, active nodes)
5. Description Enhancement (if current description is weak)
6. One-Hit Wonder Readiness Assessment

Return structured suggestions that will bring this brand to 100% ecosystem readiness.`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: prompt,
        response_json_schema: {
          type: "object",
          properties: {
            missingDataPoints: {
              type: "array",
              items: { type: "string" }
            },
            suggestedSubnodes: {
              type: "array",
              items: { type: "string" }
            },
            recommendedTags: {
              type: "array",
              items: { type: "string" }
            },
            metadataEnrichment: {
              type: "object",
              properties: {
                deploymentZone: { type: "string" },
                securityRating: { type: "string" },
                layer: { type: "string" },
                activeNodes: { type: "number" }
              }
            },
            enhancedDescription: { type: "string" },
            readinessScore: { type: "number" },
            recommendations: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      });

      setAiSuggestions(result);
      toast.success('AI analysis complete!');
    } catch (error) {
      toast.error('AI analysis failed');
      console.error(error);
    } finally {
      setAnalyzing(false);
    }
  };

  const applyAISuggestions = () => {
    if (!aiSuggestions) return;
    
    setBrandData(prev => ({
      ...prev,
      description: aiSuggestions.enhancedDescription || prev.description,
      subnodes: [...new Set([...prev.subnodes, ...(aiSuggestions.suggestedSubnodes || [])])],
      tags: [...new Set([...prev.tags, ...(aiSuggestions.recommendedTags || [])])],
      metadata: {
        ...prev.metadata,
        ...aiSuggestions.metadataEnrichment
      }
    }));
    
    toast.success('AI suggestions applied!');
    setStep(4);
  };

  const handleSubmit = () => {
    createBrandMutation.mutate({
      ...brandData,
      isSystemBrand: false,
      aiGenerated: true
    });
  };

  const addSubnode = () => {
    if (newSubnode.trim()) {
      setBrandData(prev => ({
        ...prev,
        subnodes: [...prev.subnodes, newSubnode.trim()]
      }));
      setNewSubnode('');
    }
  };

  const addTag = () => {
    if (newTag.trim()) {
      setBrandData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  React.useEffect(() => {
    setCompletionScore(calculateCompletionScore(brandData));
  }, [brandData]);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-teal-900 mb-2 flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-purple-600" />
            AI Brand Onboarding
          </h1>
          <p className="text-gray-600">
            Let AI guide you to create a complete, "one-hit wonder" ready brand
          </p>
        </div>

        {/* Progress Bar */}
        <Card className="mb-6 border-2 border-purple-200">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Onboarding Progress</span>
              <span className="text-sm font-semibold text-purple-600">Step {step} of 5</span>
            </div>
            <Progress value={(step / 5) * 100} className="h-3" />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-600">Ecosystem Readiness</span>
              <span className="text-xs font-semibold text-green-600">{completionScore}%</span>
            </div>
            <Progress value={completionScore} className="h-2 mt-1" />
          </CardContent>
        </Card>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 1: Basic Brand Information</CardTitle>
              <CardDescription>Start with your brand's core details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Brand Name *</label>
                <Input 
                  placeholder="Enter brand name..."
                  value={brandData.name}
                  onChange={(e) => setBrandData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Sector *</label>
                <Select 
                  value={brandData.sector} 
                  onValueChange={(value) => setBrandData(prev => ({ ...prev, sector: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose sector..." />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(SECTORS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Description *</label>
                <Textarea 
                  placeholder="Describe your brand..."
                  value={brandData.description}
                  onChange={(e) => setBrandData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                />
              </div>

              <Button 
                onClick={() => setStep(2)}
                disabled={!brandData.name || !brandData.sector || !brandData.description}
                className="w-full"
              >
                Continue to Subnodes
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Subnodes & Tags */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 2: Subnodes & Tags</CardTitle>
              <CardDescription>Add subnodes and tags for ecosystem integration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Subnodes (capabilities, products, services)</label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="e.g., Mobile App, API Service..."
                    value={newSubnode}
                    onChange={(e) => setNewSubnode(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSubnode()}
                  />
                  <Button onClick={addSubnode}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {brandData.subnodes.map((node, idx) => (
                    <Badge key={idx} className="bg-green-600">
                      {node}
                      <button 
                        onClick={() => setBrandData(prev => ({
                          ...prev,
                          subnodes: prev.subnodes.filter((_, i) => i !== idx)
                        }))}
                        className="ml-2 text-xs"
                      >×</button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Tags (keywords for searchability)</label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="e.g., sustainability, fintech..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  />
                  <Button onClick={addTag}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {brandData.tags.map((tag, idx) => (
                    <Badge key={idx} variant="outline">
                      {tag}
                      <button 
                        onClick={() => setBrandData(prev => ({
                          ...prev,
                          tags: prev.tags.filter((_, i) => i !== idx)
                        }))}
                        className="ml-2 text-xs"
                      >×</button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button onClick={() => setStep(3)} className="flex-1">
                  Continue to AI Analysis
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: AI Analysis */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Step 3: AI-Powered Data Enrichment
              </CardTitle>
              <CardDescription>Let AI analyze and enhance your brand data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!aiSuggestions ? (
                <>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-900 mb-2">Current Data Status:</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        {brandData.name ? <CheckCircle className="w-4 h-4 text-green-600" /> : <AlertCircle className="w-4 h-4 text-orange-600" />}
                        <span>Brand Name: {brandData.name || 'Missing'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {brandData.sector ? <CheckCircle className="w-4 h-4 text-green-600" /> : <AlertCircle className="w-4 h-4 text-orange-600" />}
                        <span>Sector: {brandData.sector || 'Missing'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {brandData.subnodes.length >= 3 ? <CheckCircle className="w-4 h-4 text-green-600" /> : <AlertCircle className="w-4 h-4 text-orange-600" />}
                        <span>Subnodes: {brandData.subnodes.length} (recommended: 5+)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {brandData.tags.length >= 3 ? <CheckCircle className="w-4 h-4 text-green-600" /> : <AlertCircle className="w-4 h-4 text-orange-600" />}
                        <span>Tags: {brandData.tags.length} (recommended: 5+)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {brandData.metadata?.deploymentZone ? <CheckCircle className="w-4 h-4 text-green-600" /> : <AlertCircle className="w-4 h-4 text-orange-600" />}
                        <span>Metadata: {Object.keys(brandData.metadata || {}).length} fields</span>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={analyzeAndSuggest}
                    disabled={analyzing}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    {analyzing ? (
                      <>
                        <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                        AI is analyzing your brand...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Analyze & Get AI Suggestions
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-300">
                    <h3 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5" />
                      AI Analysis Complete
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="font-semibold text-gray-900">Readiness Score: {aiSuggestions.readinessScore}%</p>
                        <Progress value={aiSuggestions.readinessScore} className="h-2 mt-1" />
                      </div>

                      {aiSuggestions.missingDataPoints?.length > 0 && (
                        <div>
                          <p className="font-semibold text-red-900">Missing Critical Data:</p>
                          <ul className="list-disc list-inside text-red-800 ml-2">
                            {aiSuggestions.missingDataPoints.map((point, idx) => (
                              <li key={idx}>{point}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {aiSuggestions.suggestedSubnodes?.length > 0 && (
                        <div>
                          <p className="font-semibold text-green-900">Suggested Subnodes ({aiSuggestions.suggestedSubnodes.length}):</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {aiSuggestions.suggestedSubnodes.map((node, idx) => (
                              <Badge key={idx} className="bg-green-600 text-xs">{node}</Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {aiSuggestions.recommendedTags?.length > 0 && (
                        <div>
                          <p className="font-semibold text-blue-900">Recommended Tags ({aiSuggestions.recommendedTags.length}):</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {aiSuggestions.recommendedTags.map((tag, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">{tag}</Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {aiSuggestions.recommendations?.length > 0 && (
                        <div>
                          <p className="font-semibold text-purple-900">Recommendations:</p>
                          <ul className="list-disc list-inside text-purple-800 ml-2">
                            {aiSuggestions.recommendations.map((rec, idx) => (
                              <li key={idx}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button 
                    onClick={applyAISuggestions}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Apply AI Suggestions
                  </Button>
                </>
              )}

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                  Back
                </Button>
                {aiSuggestions && (
                  <Button variant="outline" onClick={() => setStep(4)} className="flex-1">
                    Skip to Review
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 4: Final Review</CardTitle>
              <CardDescription>Review your complete brand data before submission</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-bold text-gray-900 mb-3">Brand Data Summary:</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-semibold">Name:</span> {brandData.name}
                  </div>
                  <div>
                    <span className="font-semibold">Sector:</span> {SECTORS[brandData.sector]}
                  </div>
                  <div>
                    <span className="font-semibold">Description:</span>
                    <p className="text-gray-700 mt-1">{brandData.description}</p>
                  </div>
                  <div>
                    <span className="font-semibold">Subnodes ({brandData.subnodes.length}):</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {brandData.subnodes.map((node, idx) => (
                        <Badge key={idx} className="bg-green-600 text-xs">{node}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="font-semibold">Tags ({brandData.tags.length}):</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {brandData.tags.map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="font-semibold">Metadata:</span>
                    <pre className="text-xs bg-white p-2 rounded mt-1 overflow-auto">
                      {JSON.stringify(brandData.metadata, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-900 mb-2">✓ One-Hit Wonder Readiness: {completionScore}%</h3>
                <p className="text-sm text-green-800">
                  {completionScore >= 90 ? 'Your brand is fully ready for instant app generation!' :
                   completionScore >= 70 ? 'Your brand is almost ready. Consider adding more metadata.' :
                   'Add more subnodes and tags to improve readiness.'}
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(3)} className="flex-1">
                  Back
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={createBrandMutation.isPending}
                  className="flex-1 bg-teal-600 hover:bg-teal-700"
                >
                  {createBrandMutation.isPending ? 'Creating...' : 'Create Brand'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Success */}
        {step === 5 && (
          <Card className="border-2 border-green-300">
            <CardContent className="pt-6 text-center">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-900 mb-2">Brand Created Successfully!</h2>
              <p className="text-gray-600 mb-6">
                Your brand is now part of the FAA.ZONE ecosystem and ready for app generation.
              </p>
              <div className="flex gap-2 justify-center">
                <Button onClick={() => window.location.href = '/Dashboard'}>
                  Go to Dashboard
                </Button>
                <Button onClick={() => window.location.href = '/AppBuilder'} variant="outline">
                  Generate App Now
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Copy, Download, FileText, Image as ImageIcon, Share2 } from 'lucide-react';
import CrossAppLinks from '../components/common/CrossAppLinks';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function ContentGenerator() {
  const [selectedBrand, setSelectedBrand] = useState('');
  const [contentType, setContentType] = useState('marketing');
  const [tone, setTone] = useState('professional');
  const [targetAudience, setTargetAudience] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [generating, setGenerating] = useState(false);

  const { data: brands = [] } = useQuery({
    queryKey: ['brands'],
    queryFn: () => base44.entities.Brand.list(),
  });

  const handleGenerate = async () => {
    if (!selectedBrand) {
      toast.error('Please select a brand');
      return;
    }

    setGenerating(true);
    try {
      const brand = brands.find(b => b.id === selectedBrand);
      
      // Build comprehensive prompt with COMPLETE brand data
      const brandData = {
        name: brand.name,
        sector: brand.sector,
        description: brand.description,
        subnodes: brand.subnodes || [],
        tags: brand.tags || [],
        metadata: brand.metadata || {}
      };

      const contentTypePrompts = {
        marketing: 'Create compelling marketing copy that highlights the brand\'s unique value proposition',
        product: 'Write detailed product descriptions that emphasize features and benefits',
        social: 'Generate engaging social media posts optimized for virality and engagement',
        blog: 'Create an informative blog post that educates and engages readers',
        email: 'Write a persuasive email campaign that drives conversions'
      };

      const prompt = `You are an expert content creator. Generate ${contentType} content for this brand using ALL the provided data.

COMPLETE BRAND DATA (USE ALL OF THIS):
${JSON.stringify(brandData, null, 2)}

Content Type: ${contentTypePrompts[contentType]}
Tone: ${tone}
Target Audience: ${targetAudience || 'General audience'}
${customPrompt ? `Additional Instructions: ${customPrompt}` : ''}

CRITICAL: Use the brand's real subnodes, metadata, sector information, and tags to create authentic, data-driven content.
Generate content that showcases the brand's complete ecosystem and capabilities.`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: prompt,
        add_context_from_internet: false
      });

      setGeneratedContent(result);
      toast.success('Content generated successfully!');
    } catch (error) {
      toast.error('Failed to generate content');
      console.error(error);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    toast.success('Content copied to clipboard');
  };

  const handleExportBrandData = () => {
    const brand = brands.find(b => b.id === selectedBrand);
    if (!brand) return;

    // Export COMPLETE brand data for "one-hit wonder" app generation
    const completeData = {
      brand: {
        id: brand.id,
        name: brand.name,
        sector: brand.sector,
        description: brand.description,
        subnodes: brand.subnodes || [],
        tags: brand.tags || [],
        metadata: brand.metadata || {},
        isSystemBrand: brand.isSystemBrand,
        aiGenerated: brand.aiGenerated
      },
      exportedFor: 'App Generation',
      exportDate: new Date().toISOString(),
      instructions: 'Copy this complete brand data into any app builder for instant app generation'
    };

    const blob = new Blob([JSON.stringify(completeData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${brand.name}_COMPLETE_DATA.json`;
    a.click();
    toast.success('Complete brand data exported!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 to-purple-50">
      <header className="bg-gradient-to-r from-fuchsia-600 via-purple-600 to-violet-700 text-white py-8 shadow-xl mb-6">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-9 h-9 drop-shadow-lg" />
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold drop-shadow-lg">AI Content Generator</h1>
                <p className="opacity-90 mt-1 text-sm sm:text-base">Generate marketing copy, social media & campaigns using brand data</p>
              </div>
            </div>
            <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6953a072de46207f94f2b9d2/52acd159d_Chief_02_1753263376705.png" alt="FAA" className="w-10 h-10 object-contain opacity-90" />
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">

        <CrossAppLinks
          title="🔗 Navigate FAA.ZONE"
          pages={['Dashboard', 'Analytics', 'CollaborationSuite', 'Marketplace', 'EcosystemExplorer', 'ArtisanDashboard']}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Content Configuration
              </CardTitle>
              <CardDescription>Configure your content generation with complete brand data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Brand Selection */}
              <div>
                <label className="text-sm font-medium mb-2 block">Select Brand (with complete data)</label>
                <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a brand..." />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map(brand => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name} ({brand.sector}) - {brand.subnodes?.length || 0} subnodes
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Show Selected Brand Data */}
              {selectedBrand && brands.find(b => b.id === selectedBrand) && (
                <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                  <h3 className="font-semibold text-purple-900 mb-2">Complete Brand Data Loaded:</h3>
                  {(() => {
                    const brand = brands.find(b => b.id === selectedBrand);
                    return (
                      <div className="space-y-2 text-sm">
                        <div className="flex gap-2 flex-wrap">
                          <Badge className="bg-teal-600">{brand.sector}</Badge>
                          <Badge variant="outline">{brand.subnodes?.length || 0} subnodes</Badge>
                          <Badge variant="outline">{brand.tags?.length || 0} tags</Badge>
                          {brand.metadata?.activeNodes && (
                            <Badge variant="outline">{brand.metadata.activeNodes} nodes</Badge>
                          )}
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={handleExportBrandData}
                          className="w-full mt-2"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Export Complete Brand Data (One-Hit Wonder)
                        </Button>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Content Type */}
              <div>
                <label className="text-sm font-medium mb-2 block">Content Type</label>
                <Select value={contentType} onValueChange={setContentType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="marketing">Marketing Copy</SelectItem>
                    <SelectItem value="product">Product Description</SelectItem>
                    <SelectItem value="social">Social Media Post</SelectItem>
                    <SelectItem value="blog">Blog Post</SelectItem>
                    <SelectItem value="email">Email Campaign</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tone */}
              <div>
                <label className="text-sm font-medium mb-2 block">Tone</label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                    <SelectItem value="informative">Informative</SelectItem>
                    <SelectItem value="persuasive">Persuasive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Target Audience */}
              <div>
                <label className="text-sm font-medium mb-2 block">Target Audience</label>
                <Input 
                  placeholder="e.g., Tech-savvy millennials, Business professionals..."
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                />
              </div>

              {/* Custom Prompt */}
              <div>
                <label className="text-sm font-medium mb-2 block">Additional Instructions (Optional)</label>
                <Textarea 
                  placeholder="Any specific requirements or focus areas..."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Generate Button */}
              <Button 
                onClick={handleGenerate} 
                disabled={generating || !selectedBrand}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {generating ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Generating with Complete Data...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Content
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Output Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-600" />
                Generated Content
              </CardTitle>
              <CardDescription>AI-generated content using complete brand ecosystem data</CardDescription>
            </CardHeader>
            <CardContent>
              {generatedContent ? (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 min-h-[400px] max-h-[500px] overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm text-gray-800">
                      {generatedContent}
                    </pre>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleCopy} className="flex-1">
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button 
                      onClick={() => {
                        const blob = new Blob([generatedContent], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'generated-content.txt';
                        a.click();
                      }}
                      variant="outline"
                      className="flex-1"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-400">
                  <Sparkles className="w-16 h-16 mb-4" />
                  <p className="text-center">
                    Configure your content generation settings and click "Generate Content"
                  </p>
                  <p className="text-xs text-center mt-2">
                    Using complete brand data including sectors, subnodes, and metadata
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Examples Section */}
        <Card className="mt-6 border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900">💡 One-Hit Wonder Export</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-900 mb-3">
              <strong>The complete brand data export includes:</strong>
            </p>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Full sector classification with metadata</li>
              <li>Complete list of subnodes and their relationships</li>
              <li>All tags and categorization data</li>
              <li>Deployment zones, security ratings, and active nodes</li>
              <li>Ready-to-use JSON format for any app builder</li>
            </ul>
            <p className="text-sm text-blue-900 mt-3 font-semibold">
              Copy this data into any coding/app builder tool for instant, working application generation!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
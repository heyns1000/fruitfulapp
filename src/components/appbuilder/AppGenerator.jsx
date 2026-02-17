import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2, Sparkles, Zap, Globe, Smartphone } from 'lucide-react';
import { toast } from 'sonner';

export default function AppGenerator({ selectedBrands, onAppGenerated }) {
  const [appName, setAppName] = useState('');
  const [appDescription, setAppDescription] = useState('');
  const [appType, setAppType] = useState('website');
  const [appStyle, setAppStyle] = useState('modern');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateApp = async () => {
    if (!appName.trim()) {
      toast.error('Please enter an app name');
      return;
    }

    setIsGenerating(true);
    try {
      const brandsSummary = selectedBrands.map(b => ({
        name: b.name,
        sector: b.sector,
        description: b.description,
        subnodes: b.subnodes,
        metadata: b.metadata
      }));

      // Generate app structure using AI
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an expert app/website generator. Generate a comprehensive full-stack ${appType} structure for "${appName}".

Description: ${appDescription || 'No description provided'}
Style: ${appStyle}

Selected Brands (integrate these into the app with cross-pollination):
${JSON.stringify(brandsSummary, null, 2)}

Generate a complete app structure including:
1. Homepage layout and sections
2. Navigation structure
3. Feature pages for each brand
4. Cross-pollination features (how brands connect/collaborate)
5. Color scheme based on sectors
6. Key interactive features
7. Recommended tech stack
8. Database schema suggestions

Return comprehensive JSON structure.`,
        response_json_schema: {
          type: "object",
          properties: {
            appName: { type: "string" },
            tagline: { type: "string" },
            colorScheme: {
              type: "object",
              properties: {
                primary: { type: "string" },
                secondary: { type: "string" },
                accent: { type: "string" }
              }
            },
            pages: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  route: { type: "string" },
                  description: { type: "string" },
                  sections: { type: "array", items: { type: "string" } }
                }
              }
            },
            features: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                  relatedBrands: { type: "array", items: { type: "string" } }
                }
              }
            },
            crossPollination: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  brand1: { type: "string" },
                  brand2: { type: "string" },
                  connectionType: { type: "string" },
                  feature: { type: "string" }
                }
              }
            },
            techStack: {
              type: "object",
              properties: {
                frontend: { type: "array", items: { type: "string" } },
                backend: { type: "array", items: { type: "string" } },
                database: { type: "string" }
              }
            },
            databaseSchema: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  tableName: { type: "string" },
                  fields: { type: "array", items: { type: "string" } }
                }
              }
            }
          }
        }
      });

      const appData = {
        ...result,
        appName: appName,
        description: appDescription,
        type: appType,
        style: appStyle,
        selectedBrands: selectedBrands,
        generatedAt: new Date().toISOString()
      };

      onAppGenerated(appData);
      toast.success('App generated successfully!');
    } catch (error) {
      console.error('Error generating app:', error);
      toast.error('Failed to generate app. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-purple-200 bg-white">
        <CardHeader>
          <CardTitle className="text-2xl text-purple-900 flex items-center gap-2">
            <Sparkles className="w-6 h-6" />
            AI App Generator
          </CardTitle>
          <CardDescription>
            Configure your app and let AI generate a complete structure with cross-pollination features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Selected Brands Summary */}
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h3 className="font-semibold text-purple-900 mb-2">
              Building with {selectedBrands.length} brands:
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedBrands.map(brand => (
                <span key={brand.id} className="text-sm px-2 py-1 bg-purple-200 text-purple-900 rounded">
                  {brand.name}™
                </span>
              ))}
            </div>
          </div>

          {/* Configuration Form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="appName">App Name *</Label>
              <Input
                id="appName"
                placeholder="e.g., EcoSystem Hub"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="appDescription">App Description</Label>
              <Textarea
                id="appDescription"
                placeholder="Describe what your app does and its main purpose..."
                value={appDescription}
                onChange={(e) => setAppDescription(e.target.value)}
                className="mt-2 h-24"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="appType">App Type</Label>
                <Select value={appType} onValueChange={setAppType}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="website">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Website
                      </div>
                    </SelectItem>
                    <SelectItem value="webapp">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        Web App
                      </div>
                    </SelectItem>
                    <SelectItem value="mobile">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4" />
                        Mobile App (Responsive)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="appStyle">Design Style</Label>
                <Select value={appStyle} onValueChange={setAppStyle}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="modern">Modern & Clean</SelectItem>
                    <SelectItem value="vibrant">Vibrant & Colorful</SelectItem>
                    <SelectItem value="minimal">Minimal & Elegant</SelectItem>
                    <SelectItem value="bold">Bold & Dynamic</SelectItem>
                    <SelectItem value="corporate">Corporate & Professional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex justify-end pt-4 border-t">
            <Button
              onClick={generateApp}
              disabled={isGenerating || !appName.trim()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8 py-6"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Generating Your App...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate App with AI
                </>
              )}
            </Button>
          </div>

          {isGenerating && (
            <div className="p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg border-2 border-purple-300">
              <div className="flex items-center gap-3 mb-3">
                <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                <h3 className="font-bold text-purple-900">AI is crafting your app...</h3>
              </div>
              <div className="space-y-2 text-sm text-purple-800">
                <p>✨ Analyzing your brand ecosystem...</p>
                <p>🔗 Identifying cross-pollination opportunities...</p>
                <p>🎨 Designing page layouts and features...</p>
                <p>🏗️ Generating complete app structure...</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
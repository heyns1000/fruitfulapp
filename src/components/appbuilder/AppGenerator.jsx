import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, Zap, Globe, Smartphone, Shield, Code2, X } from 'lucide-react';
import { toast } from 'sonner';

export default function AppGenerator({ selectedBrands, onAppGenerated }) {
  const [appName, setAppName] = useState('');
  const [appDescription, setAppDescription] = useState('');
  const [appType, setAppType] = useState('website');
  const [appStyle, setAppStyle] = useState('modern');
  const [framework, setFramework] = useState('react');
  const [userRoles, setUserRoles] = useState(['admin', 'user']);
  const [newRole, setNewRole] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateApp = async () => {
    if (!appName.trim()) {
      toast.error('Please enter an app name');
      return;
    }

    setIsGenerating(true);
    try {
      const brandsSummary = selectedBrands.map(b => ({
        id: b.id,
        name: b.name,
        sector: b.sector,
        description: b.description,
        subnodes: b.subnodes || [],
        tags: b.tags || [],
        metadata: b.metadata || {},
        isSystemBrand: b.isSystemBrand,
        aiGenerated: b.aiGenerated
      }));

      // Generate app structure using AI with FULL REAL ECOSYSTEM DATA
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an advanced 2026 AI-powered no-code app generator building REAL functional applications from actual ecosystem data.

CRITICAL: Use ONLY the provided REAL brand data below. Do NOT invent fake brands or data.

🎯 APP CONFIGURATION:
Name: "${appName}"
Description: ${appDescription || 'Cross-pollination ecosystem app'}
Type: ${appType}
Style: ${appStyle}
Framework: ${framework}
Target Year: 2026 (use latest web standards)

🏢 REAL ECOSYSTEM BRANDS (${selectedBrands.length} brands with full metadata):
${JSON.stringify(brandsSummary, null, 2)}

📋 GENERATION REQUIREMENTS:

1. **REAL DATA INTEGRATION**: Build using the actual brand names, descriptions, subnodes, and metadata provided
2. **FUNCTIONAL PAGES**: Generate working page structures for each brand with their real subnodes
3. **CROSS-POLLINATION ENGINE**: Identify actual synergies between brands based on:
   - Shared sectors and complementary sectors
   - Technology compatibility (metadata.layer, metadata.securityRating)
   - Supply chain connections (subnodes analysis)
   - Market overlap potential

4. **DATABASE SCHEMA**: Create tables for:
   - Each brand type with their real fields
   - Cross-pollination tracking
   - User interactions
   - Transaction logs

5. **2026 FEATURES**: Include modern capabilities:
   - AI-powered search and recommendations
   - Real-time collaboration tools
   - WebRTC for communication
   - Progressive Web App capabilities
   - Advanced analytics dashboard

6. **USER ROLES**: Define permissions for: ${JSON.stringify(userRoles)}

7. **NAVIGATION**: Create intuitive nav based on actual sectors present

8. **ACTIONABLE FEATURES**: For each brand, generate specific features based on their real subnodes

Return a production-ready app structure using ONLY the real brand data provided.`,
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
                  brandId: { type: "string" },
                  sections: { type: "array", items: { type: "string" } },
                  components: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        componentName: { type: "string" },
                        purpose: { type: "string" },
                        dataSource: { type: "string" }
                      }
                    }
                  }
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
                  feature: { type: "string" },
                  synergyScore: { type: "number" }
                }
              }
            },
            recommendationEngine: {
              type: "object",
              properties: {
                algorithm: { type: "string" },
                recommendationTypes: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      type: { type: "string" },
                      description: { type: "string" },
                      brandPairs: {
                        type: "array",
                        items: { type: "string" }
                      }
                    }
                  }
                },
                implementation: { type: "string" }
              }
            },
            unifiedSupport: {
              type: "object",
              properties: {
                ticketingSystem: { type: "string" },
                chatbotFeatures: {
                  type: "array",
                  items: { type: "string" }
                },
                supportChannels: {
                  type: "array",
                  items: { type: "string" }
                },
                escalationFlow: { type: "string" },
                knowledgeBaseIntegration: { type: "string" }
              }
            },
            loyaltyProgram: {
              type: "object",
              properties: {
                programName: { type: "string" },
                pointsSystem: {
                  type: "object",
                  properties: {
                    earnRate: { type: "string" },
                    redemptionOptions: {
                      type: "array",
                      items: { type: "string" }
                    }
                  }
                },
                membershipTiers: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      tierName: { type: "string" },
                      benefits: {
                        type: "array",
                        items: { type: "string" }
                      },
                      requiredPoints: { type: "number" }
                    }
                  }
                },
                crossBrandBenefits: {
                  type: "array",
                  items: { type: "string" }
                },
                referralProgram: { type: "string" }
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
                  fields: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        type: { type: "string" },
                        required: { type: "boolean" }
                      }
                    }
                  },
                  relationships: {
                    type: "array",
                    items: { type: "string" }
                  }
                }
              }
            },
            apiEndpoints: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  path: { type: "string" },
                  method: { type: "string" },
                  description: { type: "string" },
                  requiredRole: { type: "string" }
                }
              }
            },
            rolePermissions: {
              type: "object",
              properties: {
                roles: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      permissions: { type: "array", items: { type: "string" } },
                      description: { type: "string" }
                    }
                  }
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
        framework: framework,
        userRoles: userRoles,
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
            Configure your app and AI will generate a FUNCTIONAL 2026-ready application using your real brand data, complete metadata, and all subnodes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Selected Brands Summary with REAL DATA */}
          <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-300">
            <h3 className="font-semibold text-purple-900 mb-3">
              Building with {selectedBrands.length} REAL brands:
            </h3>
            <div className="space-y-2">
              {selectedBrands.map(brand => (
                <div key={brand.id} className="flex items-center justify-between p-2 bg-white rounded border">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-purple-900">{brand.name}™</span>
                    <Badge variant="outline" className="text-xs">{brand.sector}</Badge>
                  </div>
                  <div className="flex gap-1">
                    {brand.subnodes?.length > 0 && (
                      <Badge className="bg-green-600 text-white text-xs">
                        {brand.subnodes.length} subnodes
                      </Badge>
                    )}
                    {brand.metadata?.activeNodes && (
                      <Badge className="bg-blue-600 text-white text-xs">
                        {brand.metadata.activeNodes} nodes
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-purple-200 text-sm text-purple-800">
              <strong>Total Ecosystem Data:</strong> {selectedBrands.reduce((sum, b) => sum + (b.subnodes?.length || 0), 0)} subnodes ready for integration
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

              <div>
                <Label htmlFor="framework">Export Framework</Label>
                <Select value={framework} onValueChange={setFramework}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="react">
                      <div className="flex items-center gap-2">
                        <Code2 className="w-4 h-4" />
                        React
                      </div>
                    </SelectItem>
                    <SelectItem value="vue">
                      <div className="flex items-center gap-2">
                        <Code2 className="w-4 h-4" />
                        Vue.js
                      </div>
                    </SelectItem>
                    <SelectItem value="nextjs">
                      <div className="flex items-center gap-2">
                        <Code2 className="w-4 h-4" />
                        Next.js
                      </div>
                    </SelectItem>
                    <SelectItem value="angular">
                      <div className="flex items-center gap-2">
                        <Code2 className="w-4 h-4" />
                        Angular
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* User Roles & Permissions */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-5 h-5 text-indigo-600" />
                <Label className="text-base">User Roles & Permissions</Label>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {userRoles.map((role, idx) => (
                  <Badge 
                    key={idx}
                    className="bg-indigo-600 text-white px-3 py-1 cursor-pointer hover:bg-indigo-700"
                    onClick={() => setUserRoles(userRoles.filter((_, i) => i !== idx))}
                  >
                    {role} <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add custom role (e.g., manager, editor)"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newRole.trim() && !userRoles.includes(newRole.trim())) {
                      setUserRoles([...userRoles, newRole.trim()]);
                      setNewRole('');
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={() => {
                    if (newRole.trim() && !userRoles.includes(newRole.trim())) {
                      setUserRoles([...userRoles, newRole.trim()]);
                      setNewRole('');
                    }
                  }}
                  variant="outline"
                >
                  Add
                </Button>
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
                <p>🔍 Analyzing {selectedBrands.length} real brands with full metadata...</p>
                <p>🧠 Mapping {selectedBrands.reduce((sum, b) => sum + (b.subnodes?.length || 0), 0)} subnodes across ecosystem...</p>
                <p>🔗 Calculating cross-pollination synergies...</p>
                <p>🎨 Designing functional pages with real data integration...</p>
                <p>🗄️ Building database schemas from brand structures...</p>
                <p>⚡ Generating 2026-ready {framework} application...</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Loader2, Sparkles, CheckCircle, Tag } from 'lucide-react';
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

export default function AdminPanel({ onBrandAdded }) {
  const [sector, setSector] = useState('agriculture');
  const [brandName, setBrandName] = useState('');
  const [description, setDescription] = useState('');
  const [subnodes, setSubnodes] = useState('');
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
  const [isGeneratingNodes, setIsGeneratingNodes] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [reviewData, setReviewData] = useState(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const generateAllAIContent = async () => {
    if (!brandName.trim()) {
      toast.error('Please enter a brand name first');
      return;
    }

    setIsGeneratingAI(true);
    try {
      const sectorName = SECTORS[sector];
      
      // Generate all AI content in one call
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `For a brand named "${brandName}" in the "${sectorName}" sector, generate:
1. A concise 50-word description focusing on core value proposition and innovation
2. 3-5 innovative subnodes (product/service names)
3. 5-7 searchable tags for categorization (lowercase, single words like: fintech, ai, sustainable, etc.)
4. Metadata including: deploymentZone (zone name), securityRating (FAA-SEC A+/A/B+), layer (Alpha or Beta with version), activeNodes (100-5000)`,
        response_json_schema: {
          type: "object",
          properties: {
            description: { type: "string" },
            subnodes: { type: "array", items: { type: "string" } },
            tags: { type: "array", items: { type: "string" } },
            metadata: {
              type: "object",
              properties: {
                deploymentZone: { type: "string" },
                securityRating: { type: "string" },
                layer: { type: "string" },
                activeNodes: { type: "number" }
              }
            }
          }
        }
      });

      setReviewData({
        name: brandName,
        sector: sector,
        description: result.description,
        subnodes: result.subnodes,
        tags: result.tags || [],
        metadata: {
          id: `${brandName.slice(0, 3).toUpperCase()}-${sector.slice(0, 3).toUpperCase()}-${Math.floor(Math.random() * 9000) + 1000}`,
          vault: `VAULT-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
          ...result.metadata
        }
      });
      
      setShowReviewDialog(true);
      toast.success('AI content generated - please review');
    } catch (error) {
      console.error('Error generating AI content:', error);
      toast.error('Failed to generate AI content');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleConfirmBrand = async () => {
    if (!reviewData) return;

    setIsAdding(true);
    try {
      const newBrand = await base44.entities.Brand.create({
        ...reviewData,
        aiGenerated: true,
        isSystemBrand: false
      });

      toast.success(`Added ${reviewData.name} to ${SECTORS[reviewData.sector]}`);
      setBrandName('');
      setShowReviewDialog(false);
      setReviewData(null);
      
      if (onBrandAdded) onBrandAdded(newBrand);
    } catch (error) {
      console.error('Error adding brand:', error);
      toast.error('Failed to add brand');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-indigo-700">⚙️ Admin Panel — AI-Powered Brand Creation</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              onKeyDown={(e) => e.key === 'Enter' && generateAllAIContent()}
            />
          </div>

          <div className="flex items-end">
            <Button
              onClick={generateAllAIContent}
              disabled={isGeneratingAI || !brandName.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              {isGeneratingAI ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Generating AI Content...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Auto-Generate with AI
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
          <p className="text-sm text-gray-700 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <strong>AI Workflow:</strong> Enter brand name → AI generates description, subnodes, tags & metadata → Review & confirm
          </p>
        </div>
      </div>

      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              Review AI-Generated Brand: {reviewData?.name}
            </DialogTitle>
          </DialogHeader>

          {reviewData && (
            <div className="space-y-4 py-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-green-900">AI Content Generated Successfully</h3>
                </div>
                <p className="text-sm text-green-700">Review the details below and confirm to add the brand to the database.</p>
              </div>

              <div>
                <label className="text-sm font-semibold mb-2 block">Brand Name</label>
                <Input
                  value={reviewData.name}
                  onChange={(e) => setReviewData({...reviewData, name: e.target.value})}
                />
              </div>

              <div>
                <label className="text-sm font-semibold mb-2 block">Description</label>
                <Textarea
                  value={reviewData.description}
                  onChange={(e) => setReviewData({...reviewData, description: e.target.value})}
                  className="h-24"
                />
              </div>

              <div>
                <label className="text-sm font-semibold mb-2 block">Subnodes</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {reviewData.subnodes.map((node, idx) => (
                    <span key={idx} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                      {node}
                    </span>
                  ))}
                </div>
                <Input
                  placeholder="Add more subnodes (comma-separated)"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      setReviewData({
                        ...reviewData,
                        subnodes: [...reviewData.subnodes, e.target.value.trim()]
                      });
                      e.target.value = '';
                    }
                  }}
                />
              </div>

              <div>
                <label className="text-sm font-semibold mb-2 block flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  AI-Generated Tags (for searchability)
                </label>
                <div className="flex flex-wrap gap-2">
                  {reviewData.tags?.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="text-xs font-medium text-gray-600">Product ID</label>
                  <p className="text-sm font-mono">{reviewData.metadata?.id}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Vault ID</label>
                  <p className="text-sm font-mono">{reviewData.metadata?.vault}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Layer</label>
                  <p className="text-sm">{reviewData.metadata?.layer}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Security Rating</label>
                  <p className="text-sm">{reviewData.metadata?.securityRating}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Deployment Zone</label>
                  <p className="text-sm">{reviewData.metadata?.deploymentZone}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Active Nodes</label>
                  <p className="text-sm">{reviewData.metadata?.activeNodes?.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowReviewDialog(false);
                setReviewData(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmBrand}
              disabled={isAdding}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              {isAdding ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Adding...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirm & Add Brand
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
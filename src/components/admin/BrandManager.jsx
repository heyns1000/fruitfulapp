import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Pencil, Trash2, Search, Sparkles, AlertTriangle } from 'lucide-react';
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

export default function BrandManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('all');
  const [editingBrand, setEditingBrand] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
  const [isGeneratingMeta, setIsGeneratingMeta] = useState(false);
  const [isDuplicateChecking, setIsDuplicateChecking] = useState(false);
  const [duplicates, setDuplicates] = useState([]);
  
  const queryClient = useQueryClient();

  const { data: brands = [], isLoading } = useQuery({
    queryKey: ['brands'],
    queryFn: () => base44.entities.Brand.list('-updated_date')
  });

  const updateBrandMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Brand.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      toast.success('Brand updated successfully');
      setIsEditDialogOpen(false);
      setEditingBrand(null);
    },
    onError: () => {
      toast.error('Failed to update brand');
    }
  });

  const deleteBrandMutation = useMutation({
    mutationFn: (id) => base44.entities.Brand.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      toast.success('Brand deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete brand');
    }
  });

  const handleEdit = (brand) => {
    setEditingBrand({
      ...brand,
      subnodes: Array.isArray(brand.subnodes) ? brand.subnodes.join(', ') : '',
      tags: brand.tags || []
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingBrand) return;

    const subnodesArray = editingBrand.subnodes
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    updateBrandMutation.mutate({
      id: editingBrand.id,
      data: {
        name: editingBrand.name,
        description: editingBrand.description,
        sector: editingBrand.sector,
        subnodes: subnodesArray,
        tags: editingBrand.tags || [],
        metadata: editingBrand.metadata
      }
    });
  };

  const handleDelete = (brand) => {
    if (window.confirm(`Are you sure you want to delete ${brand.name}? This cannot be undone.`)) {
      deleteBrandMutation.mutate(brand.id);
    }
  };

  const generateDescription = async () => {
    if (!editingBrand) return;
    
    setIsGeneratingDesc(true);
    try {
      const sectorName = SECTORS[editingBrand.sector];
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate a concise and compelling 50-word description for a brand named "${editingBrand.name}" operating in the "${sectorName}" sector. Focus on its core value proposition and innovation.`,
      });
      
      setEditingBrand({...editingBrand, description: result});
      toast.success('Description generated successfully');
    } catch (error) {
      console.error('Error generating description:', error);
      toast.error('Failed to generate description');
    } finally {
      setIsGeneratingDesc(false);
    }
  };

  const generateMetadata = async () => {
    if (!editingBrand) return;
    
    setIsGeneratingMeta(true);
    try {
      const sectorName = SECTORS[editingBrand.sector];
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `For a brand named "${editingBrand.name}" in the "${sectorName}" sector, suggest relevant metadata. Return JSON with: deploymentZone (a zone name), securityRating (FAA-SEC A+/A/B+), layer (Alpha or Beta with version), and activeNodes (number between 100-5000).`,
        response_json_schema: {
          type: "object",
          properties: {
            deploymentZone: { type: "string" },
            securityRating: { type: "string" },
            layer: { type: "string" },
            activeNodes: { type: "number" }
          }
        }
      });
      
      setEditingBrand({
        ...editingBrand,
        metadata: {
          ...editingBrand.metadata,
          deploymentZone: result.deploymentZone,
          securityRating: result.securityRating,
          layer: result.layer,
          activeNodes: result.activeNodes
        }
      });
      toast.success('Metadata generated successfully');
    } catch (error) {
      console.error('Error generating metadata:', error);
      toast.error('Failed to generate metadata');
    } finally {
      setIsGeneratingMeta(false);
    }
  };

  const checkDuplicates = async () => {
    setIsDuplicateChecking(true);
    setDuplicates([]);
    
    try {
      const brandsList = brands.map(b => ({
        id: b.id,
        name: b.name,
        description: b.description || '',
        sector: b.sector
      }));
      
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze these brands and identify potential duplicates or very similar brands based on name and description. Return an array of duplicate groups, where each group contains the IDs of similar brands. Only include groups with 2 or more brands: ${JSON.stringify(brandsList)}`,
        response_json_schema: {
          type: "object",
          properties: {
            duplicateGroups: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  brandIds: { type: "array", items: { type: "string" } },
                  reason: { type: "string" }
                }
              }
            }
          }
        }
      });
      
      if (result.duplicateGroups?.length > 0) {
        setDuplicates(result.duplicateGroups);
        toast.warning(`Found ${result.duplicateGroups.length} potential duplicate groups`);
      } else {
        toast.success('No duplicates detected');
      }
    } catch (error) {
      console.error('Error checking duplicates:', error);
      toast.error('Failed to check duplicates');
    } finally {
      setIsDuplicateChecking(false);
    }
  };

  const filteredBrands = brands.filter(brand => {
    const matchesSearch = brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         brand.subnodes?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSector = selectedSector === 'all' || brand.sector === selectedSector;
    return matchesSearch && matchesSector;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-indigo-700">🔧 Brand Management Console</h2>
        <div className="flex gap-3 items-center">
          <Button
            onClick={checkDuplicates}
            disabled={isDuplicateChecking}
            variant="outline"
            size="sm"
            className="text-orange-600 border-orange-300 hover:bg-orange-50"
          >
            {isDuplicateChecking ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <AlertTriangle className="w-4 h-4 mr-2" />
            )}
            Check Duplicates
          </Button>
          <span className="text-sm text-gray-500">{filteredBrands.length} brands</span>
        </div>
      </div>

      {duplicates.length > 0 && (
        <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <h3 className="font-semibold text-orange-900">Potential Duplicates Detected</h3>
          </div>
          <div className="space-y-3">
            {duplicates.map((group, idx) => (
              <div key={idx} className="bg-white p-3 rounded border border-orange-200">
                <p className="text-sm text-orange-800 mb-2"><strong>Reason:</strong> {group.reason}</p>
                <div className="flex flex-wrap gap-2">
                  {group.brandIds.map(id => {
                    const brand = brands.find(b => b.id === id);
                    return brand ? (
                      <span key={id} className="text-xs px-2 py-1 bg-orange-100 text-orange-900 rounded">
                        {brand.name} ({SECTORS[brand.sector]?.split(' ')[0]})
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search brands or subnodes..."
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

      <div className="border rounded-lg overflow-hidden">
        <div className="max-h-[500px] overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-gray-50 z-10">
              <TableRow>
                <TableHead className="w-[180px]">Brand Name</TableHead>
                <TableHead className="w-[140px]">Sector</TableHead>
                <TableHead>Subnodes</TableHead>
                <TableHead className="w-[200px]">Tags</TableHead>
                <TableHead className="w-[100px]">Source</TableHead>
                <TableHead className="w-[120px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBrands.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                    No brands found matching your criteria
                  </TableCell>
                </TableRow>
              ) : (
                filteredBrands.map(brand => (
                  <TableRow key={brand.id} className="hover:bg-gray-50">
                    <TableCell className="font-semibold">
                      {brand.name}™
                    </TableCell>
                    <TableCell>
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                        {SECTORS[brand.sector]?.replace(/[🌱🥦🏦🖋️📦📚✂🎮🧠🏗️⚖📖☰🎬✿📦✴️☯🔑🧺🔋🎙️📡🔁🎓♻️🧾🪙⛏️🦁]/g, '').trim()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {(brand.subnodes || []).slice(0, 3).map((subnode, idx) => (
                          <span key={idx} className="text-xs px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded">
                            {subnode}
                          </span>
                        ))}
                        {brand.subnodes?.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{brand.subnodes.length - 3} more
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {brand.tags?.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {brand.tags.slice(0, 3).map((tag, idx) => (
                            <span key={idx} className="text-xs px-2 py-0.5 bg-purple-50 text-purple-700 rounded">
                              #{tag}
                            </span>
                          ))}
                          {brand.tags.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{brand.tags.length - 3}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">No tags</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-1 rounded ${
                        brand.isSystemBrand 
                          ? 'bg-blue-100 text-blue-700' 
                          : brand.aiGenerated
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {brand.isSystemBrand ? 'System' : brand.aiGenerated ? 'AI' : 'Manual'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(brand)}
                          className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(brand)}
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Brand: {editingBrand?.name}</DialogTitle>
          </DialogHeader>
          
          {editingBrand && (
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Brand Name</label>
                <Input
                  value={editingBrand.name}
                  onChange={(e) => setEditingBrand({...editingBrand, name: e.target.value})}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Textarea
                  value={editingBrand.description || ''}
                  onChange={(e) => setEditingBrand({...editingBrand, description: e.target.value})}
                  className="h-24"
                />
                <Button
                  type="button"
                  onClick={generateDescription}
                  disabled={isGeneratingDesc}
                  className="mt-2 w-full bg-purple-600 hover:bg-purple-700"
                  size="sm"
                >
                  {isGeneratingDesc ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Sparkles className="w-4 h-4 mr-2" />
                  )}
                  Generate AI Description
                </Button>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Sector</label>
                <Select
                  value={editingBrand.sector}
                  onValueChange={(value) => setEditingBrand({...editingBrand, sector: value})}
                >
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
                <label className="text-sm font-medium mb-2 block">
                  Subnodes (comma-separated)
                </label>
                <Textarea
                  value={editingBrand.subnodes}
                  onChange={(e) => setEditingBrand({...editingBrand, subnodes: e.target.value})}
                  placeholder="VaultDrop, QRClaim, NodeSync"
                  className="h-20"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Tags (for searchability)
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {editingBrand.tags?.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm flex items-center gap-1 cursor-pointer hover:bg-purple-200"
                      onClick={() => {
                        setEditingBrand({
                          ...editingBrand,
                          tags: editingBrand.tags.filter((_, i) => i !== idx)
                        });
                      }}
                    >
                      #{tag} ×
                    </span>
                  ))}
                </div>
                <Input
                  placeholder="Add tag and press Enter"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      const newTag = e.target.value.trim().toLowerCase();
                      if (!editingBrand.tags?.includes(newTag)) {
                        setEditingBrand({
                          ...editingBrand,
                          tags: [...(editingBrand.tags || []), newTag]
                        });
                      }
                      e.target.value = '';
                    }
                  }}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-medium">Metadata</label>
                  <Button
                    type="button"
                    onClick={generateMetadata}
                    disabled={isGeneratingMeta}
                    className="bg-purple-600 hover:bg-purple-700"
                    size="sm"
                  >
                    {isGeneratingMeta ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Sparkles className="w-4 h-4 mr-2" />
                    )}
                    AI Generate
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Product ID</label>
                    <Input
                      value={editingBrand.metadata?.id || ''}
                      onChange={(e) => setEditingBrand({
                        ...editingBrand,
                        metadata: {...editingBrand.metadata, id: e.target.value}
                      })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Vault ID</label>
                    <Input
                      value={editingBrand.metadata?.vault || ''}
                      onChange={(e) => setEditingBrand({
                        ...editingBrand,
                        metadata: {...editingBrand.metadata, vault: e.target.value}
                      })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Layer</label>
                    <Input
                      value={editingBrand.metadata?.layer || ''}
                      onChange={(e) => setEditingBrand({
                        ...editingBrand,
                        metadata: {...editingBrand.metadata, layer: e.target.value}
                      })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Security Rating</label>
                    <Input
                      value={editingBrand.metadata?.securityRating || ''}
                      onChange={(e) => setEditingBrand({
                        ...editingBrand,
                        metadata: {...editingBrand.metadata, securityRating: e.target.value}
                      })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Deployment Zone</label>
                    <Input
                      value={editingBrand.metadata?.deploymentZone || ''}
                      onChange={(e) => setEditingBrand({
                        ...editingBrand,
                        metadata: {...editingBrand.metadata, deploymentZone: e.target.value}
                      })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Active Nodes</label>
                    <Input
                      type="number"
                      value={editingBrand.metadata?.activeNodes || ''}
                      onChange={(e) => setEditingBrand({
                        ...editingBrand,
                        metadata: {...editingBrand.metadata, activeNodes: parseInt(e.target.value) || 0}
                      })}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setEditingBrand(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={updateBrandMutation.isPending}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {updateBrandMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
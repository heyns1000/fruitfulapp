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
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Pencil, Trash2, Search } from 'lucide-react';
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
      subnodes: Array.isArray(brand.subnodes) ? brand.subnodes.join(', ') : ''
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
        metadata: editingBrand.metadata
      }
    });
  };

  const handleDelete = (brand) => {
    if (window.confirm(`Are you sure you want to delete ${brand.name}? This cannot be undone.`)) {
      deleteBrandMutation.mutate(brand.id);
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
        <span className="text-sm text-gray-500">{filteredBrands.length} brands</span>
      </div>

      {/* Filters */}
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

      {/* Brands Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="max-h-[500px] overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-gray-50 z-10">
              <TableRow>
                <TableHead className="w-[200px]">Brand Name</TableHead>
                <TableHead className="w-[150px]">Sector</TableHead>
                <TableHead>Subnodes</TableHead>
                <TableHead className="w-[100px]">Source</TableHead>
                <TableHead className="w-[120px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBrands.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500 py-8">
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
                      <span className={`text-xs px-2 py-1 rounded ${
                        brand.isSystemBrand 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {brand.isSystemBrand ? 'System' : 'Custom'}
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

      {/* Edit Dialog */}
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
import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, Users, TrendingUp, MessageSquare, Search } from 'lucide-react';
import { toast } from 'sonner';
import AISuggestions from './AISuggestions';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-purple-100 text-purple-800'
};

export default function CollaborationManager() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSuggestionDialogOpen, setIsSuggestionDialogOpen] = useState(false);
  const [selectedBrand1, setSelectedBrand1] = useState('');
  const [selectedBrand2, setSelectedBrand2] = useState('');
  const [proposalTitle, setProposalTitle] = useState('');
  const [proposalDescription, setProposalDescription] = useState('');
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const queryClient = useQueryClient();

  const { data: brands = [] } = useQuery({
    queryKey: ['brands'],
    queryFn: () => base44.entities.Brand.list('-updated_date')
  });

  const { data: collaborations = [], isLoading } = useQuery({
    queryKey: ['collaborations'],
    queryFn: () => base44.entities.BrandCollaboration.list('-created_date')
  });

  const createCollaborationMutation = useMutation({
    mutationFn: (data) => base44.entities.BrandCollaboration.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collaborations'] });
      toast.success('Collaboration proposal created');
      resetForm();
    },
    onError: () => toast.error('Failed to create collaboration')
  });

  const updateCollaborationMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.BrandCollaboration.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collaborations'] });
      toast.success('Collaboration updated');
    }
  });

  const resetForm = () => {
    setIsDialogOpen(false);
    setSelectedBrand1('');
    setSelectedBrand2('');
    setProposalTitle('');
    setProposalDescription('');
  };

  const generateAISuggestions = async () => {
    setIsGeneratingSuggestions(true);
    try {
      const brandData = brands.map(b => ({
        id: b.id,
        name: b.name,
        sector: b.sector,
        subnodes: b.subnodes || [],
        tags: b.tags || []
      }));

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze these brands and suggest 5 highly synergistic collaboration pairings. For each pairing, calculate a synergy score (0-100) and explain the collaboration potential: ${JSON.stringify(brandData)}`,
        response_json_schema: {
          type: "object",
          properties: {
            suggestions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  brand1Id: { type: "string" },
                  brand2Id: { type: "string" },
                  synergyScore: { type: "number" },
                  reason: { type: "string" },
                  proposalIdea: { type: "string" }
                }
              }
            }
          }
        }
      });

      setAiSuggestions(result.suggestions || []);
      setIsSuggestionDialogOpen(true);
      toast.success('AI suggestions generated');
    } catch (error) {
      console.error('Error generating suggestions:', error);
      toast.error('Failed to generate suggestions');
    } finally {
      setIsGeneratingSuggestions(false);
    }
  };

  const createFromSuggestion = async (suggestion) => {
    const brand1 = brands.find(b => b.id === suggestion.brand1Id);
    const brand2 = brands.find(b => b.id === suggestion.brand2Id);

    if (!brand1 || !brand2) return;

    await createCollaborationMutation.mutateAsync({
      brand1Id: brand1.id,
      brand1Name: brand1.name,
      brand2Id: brand2.id,
      brand2Name: brand2.name,
      proposalTitle: `${brand1.name} × ${brand2.name} Partnership`,
      proposalDescription: suggestion.proposalIdea,
      status: 'pending',
      aiSuggested: true,
      synergyScore: suggestion.synergyScore,
      synergyReason: suggestion.reason,
      communications: []
    });

    setIsSuggestionDialogOpen(false);
  };

  const handleCreateCollaboration = async () => {
    if (!selectedBrand1 || !selectedBrand2 || !proposalTitle) {
      toast.error('Please fill in all required fields');
      return;
    }

    const brand1 = brands.find(b => b.id === selectedBrand1);
    const brand2 = brands.find(b => b.id === selectedBrand2);

    await createCollaborationMutation.mutateAsync({
      brand1Id: brand1.id,
      brand1Name: brand1.name,
      brand2Id: brand2.id,
      brand2Name: brand2.name,
      proposalTitle,
      proposalDescription,
      status: 'pending',
      aiSuggested: false,
      communications: []
    });
  };

  const updateStatus = (id, newStatus) => {
    updateCollaborationMutation.mutate({
      id,
      data: { status: newStatus }
    });
  };

  const filteredCollaborations = collaborations.filter(collab => {
    const matchesStatus = filterStatus === 'all' || collab.status === filterStatus;
    const matchesSearch = 
      collab.brand1Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collab.brand2Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collab.proposalTitle.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <Tabs defaultValue="suggestions" className="space-y-6">
      <TabsList className="bg-white/90 p-2 rounded-xl shadow-lg border-2 border-purple-200">
        <TabsTrigger value="suggestions" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
          ✨ AI Suggestions
        </TabsTrigger>
        <TabsTrigger value="active" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
          🤝 Active Collaborations
        </TabsTrigger>
        <TabsTrigger value="create" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
          ➕ Create New
        </TabsTrigger>
      </TabsList>

      <TabsContent value="suggestions">
        <AISuggestions brands={brands} />
      </TabsContent>

      <TabsContent value="active">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search collaborations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCollaborations.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            No collaborations found. Create one or generate AI suggestions!
          </div>
        ) : (
          filteredCollaborations.map((collab) => (
            <Card key={collab.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <span className="truncate">{collab.proposalTitle}</span>
                  {collab.aiSuggested && (
                    <Sparkles className="w-4 h-4 text-purple-600 flex-shrink-0" />
                  )}
                </CardTitle>
                <div className="flex gap-2 text-sm text-gray-600">
                  <span className="font-semibold">{collab.brand1Name}</span>
                  <span>×</span>
                  <span className="font-semibold">{collab.brand2Name}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {collab.synergyScore && (
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="font-semibold">Synergy: {collab.synergyScore}%</span>
                  </div>
                )}
                
                {collab.proposalDescription && (
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {collab.proposalDescription}
                  </p>
                )}

                {collab.synergyReason && (
                  <p className="text-xs text-purple-600 italic">
                    {collab.synergyReason}
                  </p>
                )}

                <div className="flex items-center justify-between pt-2">
                  <Badge className={STATUS_COLORS[collab.status]}>
                    {collab.status.replace('_', ' ')}
                  </Badge>
                  
                  <Select
                    value={collab.status}
                    onValueChange={(value) => updateStatus(collab.id, value)}
                  >
                    <SelectTrigger className="w-32 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      </TabsContent>

      <TabsContent value="create">
        <Card className="border-2 border-indigo-200">
          <CardHeader>
            <CardTitle className="text-2xl text-indigo-900">Create New Collaboration</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-lg py-6"
            >
              <Users className="w-5 h-5 mr-2" />
              Create Manual Collaboration Proposal
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Create Collaboration Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Collaboration Proposal</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Brand 1</label>
                <Select value={selectedBrand1} onValueChange={setSelectedBrand1}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select first brand" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {brands.map(brand => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}™
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Brand 2</label>
                <Select value={selectedBrand2} onValueChange={setSelectedBrand2}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select second brand" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {brands.filter(b => b.id !== selectedBrand1).map(brand => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}™
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Proposal Title</label>
              <Input
                value={proposalTitle}
                onChange={(e) => setProposalTitle(e.target.value)}
                placeholder="e.g., Joint Market Expansion Initiative"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Proposal Description</label>
              <Textarea
                value={proposalDescription}
                onChange={(e) => setProposalDescription(e.target.value)}
                placeholder="Describe the collaboration opportunity..."
                className="h-32"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={resetForm}>Cancel</Button>
            <Button
              onClick={handleCreateCollaboration}
              disabled={createCollaborationMutation.isPending}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {createCollaborationMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Create Proposal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AI Suggestions Dialog */}
      <Dialog open={isSuggestionDialogOpen} onOpenChange={setIsSuggestionDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              AI-Suggested Brand Collaborations
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {aiSuggestions.map((suggestion, idx) => {
              const brand1 = brands.find(b => b.id === suggestion.brand1Id);
              const brand2 = brands.find(b => b.id === suggestion.brand2Id);

              return (
                <Card key={idx} className="border-purple-200">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {brand1?.name} × {brand2?.name}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-semibold text-green-700">
                            Synergy Score: {suggestion.synergyScore}%
                          </span>
                        </div>
                      </div>
                      <Button
                        onClick={() => createFromSuggestion(suggestion)}
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        Create Proposal
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Why This Works:</p>
                      <p className="text-sm text-gray-600">{suggestion.reason}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Proposal Idea:</p>
                      <p className="text-sm text-gray-600">{suggestion.proposalIdea}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </Tabs>
  );
}
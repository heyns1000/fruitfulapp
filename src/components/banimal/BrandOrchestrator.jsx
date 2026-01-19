import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter 
} from '@/components/ui/dialog';
import { Search, Settings, Zap, TrendingUp, Activity } from 'lucide-react';
import { toast } from 'sonner';

const SECTORS = {
  agriculture: '🌱 Agriculture',
  banking: '🏦 Banking',
  health: '🧠 Health',
  creative: '🖋️ Creative',
  webless: '📡 Webless',
  'ai-logic': '🧠 AI Logic'
};

export default function BrandOrchestrator({ brands }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [config, setConfig] = useState({
    autoSync: true,
    priority: 50,
    resourceAllocation: 50
  });

  const queryClient = useQueryClient();

  const updateBrandMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Brand.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      toast.success('Brand configuration updated');
      setIsConfigOpen(false);
    }
  });

  const openConfig = (brand) => {
    setSelectedBrand(brand);
    setConfig({
      autoSync: brand.metadata?.autoSync ?? true,
      priority: brand.metadata?.priority ?? 50,
      resourceAllocation: brand.metadata?.resourceAllocation ?? 50
    });
    setIsConfigOpen(true);
  };

  const saveConfig = () => {
    if (!selectedBrand) return;

    updateBrandMutation.mutate({
      id: selectedBrand.id,
      data: {
        metadata: {
          ...selectedBrand.metadata,
          autoSync: config.autoSync,
          priority: config.priority,
          resourceAllocation: config.resourceAllocation
        }
      }
    });
  };

  const filteredBrands = brands.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: brands.length,
    active: brands.filter(b => b.metadata?.activeNodes > 0).length,
    avgNodes: Math.round(brands.reduce((sum, b) => sum + (b.metadata?.activeNodes || 0), 0) / brands.length || 0)
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Brands</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-700">{stats.total}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Active Brands</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-700">{stats.active}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Nodes/Brand</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-700">{stats.avgNodes}</p>
          </CardContent>
        </Card>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search brands to orchestrate..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBrands.map((brand) => (
          <Card key={brand.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{brand.name}™</CardTitle>
                  <Badge variant="outline" className="mt-2">
                    {SECTORS[brand.sector] || brand.sector}
                  </Badge>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => openConfig(brand)}
                  className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-green-600" />
                  <span className="text-gray-600">Active Nodes</span>
                </div>
                <span className="font-semibold">{brand.metadata?.activeNodes || 0}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-orange-600" />
                  <span className="text-gray-600">Priority</span>
                </div>
                <span className="font-semibold">{brand.metadata?.priority || 50}%</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-600">Subnodes</span>
                </div>
                <span className="font-semibold">{brand.subnodes?.length || 0}</span>
              </div>

              {brand.metadata?.autoSync && (
                <Badge className="bg-green-100 text-green-800">Auto-Sync Enabled</Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Configure {selectedBrand?.name}™</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Auto-Sync</p>
                <p className="text-sm text-gray-500">Automatically sync brand data</p>
              </div>
              <Switch
                checked={config.autoSync}
                onCheckedChange={(checked) => setConfig({...config, autoSync: checked})}
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="font-medium">Priority Level</label>
                <span className="text-sm font-semibold text-orange-600">{config.priority}%</span>
              </div>
              <Slider
                value={[config.priority]}
                onValueChange={([value]) => setConfig({...config, priority: value})}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="font-medium">Resource Allocation</label>
                <span className="text-sm font-semibold text-blue-600">{config.resourceAllocation}%</span>
              </div>
              <Slider
                value={[config.resourceAllocation]}
                onValueChange={([value]) => setConfig({...config, resourceAllocation: value})}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfigOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={saveConfig}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Save Configuration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function ServiceListing({ brands }) {
  const [selectedBrand, setSelectedBrand] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('digital_service');
  const [pricing, setPricing] = useState({
    USD: '',
    ZAR: '',
    EUR: '',
    GBP: '',
    NGN: '',
    KES: ''
  });
  const [unlimitedInventory, setUnlimitedInventory] = useState(true);
  const [availableInventory, setAvailableInventory] = useState('');
  const [deliveryType, setDeliveryType] = useState('instant');
  const [productCode, setProductCode] = useState('');

  const queryClient = useQueryClient();

  const createServiceMutation = useMutation({
    mutationFn: (data) => base44.entities.MarketplaceService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketplace-services'] });
      toast.success('Service listed successfully!');
      resetForm();
    }
  });

  const resetForm = () => {
    setServiceName('');
    setDescription('');
    setProductCode('');
    setPricing({ USD: '', ZAR: '', EUR: '', GBP: '', NGN: '', KES: '' });
    setAvailableInventory('');
  };

  const handleSubmit = async () => {
    if (!selectedBrand || !serviceName || !pricing.USD) {
      toast.error('Please fill in required fields');
      return;
    }

    const brand = brands.find(b => b.id === selectedBrand);
    
    const pricingObj = {};
    Object.keys(pricing).forEach(curr => {
      if (pricing[curr]) pricingObj[curr] = parseFloat(pricing[curr]);
    });

    const generatedProductCode = productCode || `PROD-${brand.name.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-6)}`;

    await createServiceMutation.mutateAsync({
      brandId: brand.id,
      brandName: brand.name,
      serviceName,
      description,
      productCode: generatedProductCode,
      category,
      pricing: pricingObj,
      currency: 'USD',
      status: 'active',
      inventory: {
        unlimited: unlimitedInventory,
        available: unlimitedInventory ? 999999 : parseInt(availableInventory) || 0
      },
      delivery: {
        type: deliveryType,
        estimatedDays: deliveryType === 'instant' ? 0 : deliveryType === 'digital' ? 1 : 7,
        regions: ['Global']
      },
      tags: []
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>List New Service</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="text-sm font-medium mb-2 block">Select Your Brand</label>
          <Select value={selectedBrand} onValueChange={setSelectedBrand}>
            <SelectTrigger>
              <SelectValue placeholder="Choose brand" />
            </SelectTrigger>
            <SelectContent>
              {brands.map(brand => (
                <SelectItem key={brand.id} value={brand.id}>
                  {brand.name}™ - {brand.sector}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Service/Product Name *</label>
          <Input
            placeholder="e.g., Premium API Access"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Description</label>
          <Textarea
            placeholder="Describe your service..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="h-24"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Product Code (Paystack)</label>
          <Input
            placeholder="Auto-generated if left blank"
            value={productCode}
            onChange={(e) => setProductCode(e.target.value)}
          />
          <p className="text-xs text-gray-500 mt-1">
            Unique code for Paystack integration. Leave blank to auto-generate.
          </p>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Category</label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="digital_service">Digital Service</SelectItem>
              <SelectItem value="physical_product">Physical Product</SelectItem>
              <SelectItem value="subscription">Subscription</SelectItem>
              <SelectItem value="consulting">Consulting</SelectItem>
              <SelectItem value="license">License</SelectItem>
              <SelectItem value="data_access">Data Access</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Multi-Currency Pricing</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.keys(pricing).map(curr => (
              <div key={curr}>
                <label className="text-xs text-gray-500 mb-1 block">{curr} {curr === 'USD' && '*'}</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={pricing[curr]}
                  onChange={(e) => setPricing({...pricing, [curr]: e.target.value})}
                  min="0"
                  step="0.01"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Inventory</label>
          <div className="flex items-center gap-3 mb-3">
            <Switch
              checked={unlimitedInventory}
              onCheckedChange={setUnlimitedInventory}
            />
            <span className="text-sm">Unlimited Availability</span>
          </div>
          {!unlimitedInventory && (
            <Input
              type="number"
              placeholder="Available quantity"
              value={availableInventory}
              onChange={(e) => setAvailableInventory(e.target.value)}
              min="0"
            />
          )}
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Delivery Type</label>
          <Select value={deliveryType} onValueChange={setDeliveryType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="instant">Instant (Automated)</SelectItem>
              <SelectItem value="digital">Digital (1 day)</SelectItem>
              <SelectItem value="physical">Physical Shipping (7 days)</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={createServiceMutation.isPending}
          className="w-full bg-purple-600 hover:bg-purple-700"
          size="lg"
        >
          {createServiceMutation.isPending ? (
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
          ) : (
            <Plus className="w-5 h-5 mr-2" />
          )}
          List Service
        </Button>
      </CardContent>
    </Card>
  );
}
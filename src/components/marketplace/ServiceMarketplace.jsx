import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Search, ShoppingCart, Star, Globe, Package, Zap, Loader2, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';
import { useCart } from '../cart/CartContext';

const CURRENCY_SYMBOLS = {
  USD: '$', EUR: '€', GBP: '£', ZAR: 'R', NGN: '₦', KES: 'KSh',
  GHS: '₵', TZS: 'TSh', UGX: 'USh', ZMW: 'ZK', MWK: 'MK',
  BRL: 'R$', INR: '₹', CNY: '¥', JPY: '¥'
};

const CATEGORY_ICONS = {
  digital_service: Zap,
  physical_product: Package,
  subscription: Star,
  consulting: Globe,
  license: Star,
  data_access: Globe
};

export default function ServiceMarketplace({ services }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCurrency, setSelectedCurrency] = useState('NGN');
  const [selectedService, setSelectedService] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [buyerEmail, setBuyerEmail] = useState('');

  const { addToCart } = useCart();
  const queryClient = useQueryClient();

  const createOrderMutation = useMutation({
    mutationFn: (data) => base44.entities.Order.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Order placed successfully!');
      setIsCheckoutOpen(false);
      setSelectedService(null);
      setBuyerEmail('');
      setQuantity(1);
    }
  });

  const activeServices = services.filter(s => s.status === 'active');

  const filteredServices = activeServices.filter(service => {
    const matchesSearch = service.serviceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.brandName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handlePurchase = (service) => {
    setSelectedService(service);
    setIsCheckoutOpen(true);
  };

  const processOrder = async () => {
    if (!buyerEmail || !selectedService) {
      toast.error('Please provide your email');
      return;
    }

    const price = selectedService.pricing?.[selectedCurrency] || selectedService.pricing?.USD || 0;
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    await createOrderMutation.mutateAsync({
      orderNumber,
      serviceId: selectedService.id,
      serviceName: selectedService.serviceName,
      sellerId: selectedService.brandId,
      sellerName: selectedService.brandName,
      buyerEmail,
      amount: price * quantity,
      currency: selectedCurrency,
      quantity,
      status: 'confirmed',
      paymentStatus: 'paid',
      fulfillment: {
        type: selectedService.delivery?.type || 'digital',
        estimatedDelivery: new Date(Date.now() + (selectedService.delivery?.estimatedDays || 1) * 86400000).toISOString()
      },
      metadata: {
        commission: (price * quantity) * 0.05,
        platformFee: (price * quantity) * 0.03
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="digital_service">Digital Service</SelectItem>
                <SelectItem value="physical_product">Physical Product</SelectItem>
                <SelectItem value="subscription">Subscription</SelectItem>
                <SelectItem value="consulting">Consulting</SelectItem>
                <SelectItem value="license">License</SelectItem>
                <SelectItem value="data_access">Data Access</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(CURRENCY_SYMBOLS).map(curr => (
                  <SelectItem key={curr} value={curr}>
                    {CURRENCY_SYMBOLS[curr]} {curr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No services found</p>
          </div>
        ) : (
          filteredServices.map(service => {
            const Icon = CATEGORY_ICONS[service.category] || Package;
            const price = service.pricing?.[selectedCurrency] || service.pricing?.USD || 0;

            return (
              <Card key={service.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Icon className="w-8 h-8 text-purple-600" />
                    <Badge>{service.category.replace('_', ' ')}</Badge>
                  </div>
                  <CardTitle className="text-lg">{service.serviceName}</CardTitle>
                  <Link to={createPageUrl(`ArtisanProfile?brandName=${encodeURIComponent(service.brandName)}`)} className="text-sm text-purple-600 hover:underline font-medium">
                    {service.brandName}™ · View Artisan
                  </Link>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600 line-clamp-3">{service.description}</p>
                  
                  <div className="flex items-center gap-2">
                    {service.rating > 0 && (
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span>{service.rating.toFixed(1)}</span>
                        <span className="text-gray-400">({service.reviewCount})</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {service.tags?.slice(0, 3).map((tag, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="pt-3 border-t">
                    <p className="text-2xl font-bold text-purple-700">
                      {CURRENCY_SYMBOLS[selectedCurrency]}{price.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">{selectedCurrency}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => addToCart({
                        id: service.id,
                        name: service.serviceName,
                        price: price,
                        productCode: service.productCode,
                        imageUrl: service.imageUrl,
                        brandName: service.brandName
                      })}
                      variant="outline"
                      className="border-purple-300 text-purple-700 hover:bg-purple-50"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add to Cart
                    </Button>
                    <Button
                      onClick={() => handlePurchase(service)}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Buy Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Purchase</DialogTitle>
          </DialogHeader>
          {selectedService && (
            <div className="space-y-4 py-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-semibold">{selectedService.serviceName}</p>
                <p className="text-sm text-gray-500">{selectedService.brandName}™</p>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Your Email</label>
                <Input
                  type="email"
                  placeholder="buyer@example.com"
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Quantity</label>
                <Input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                />
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span>Subtotal:</span>
                  <span className="font-semibold">
                    {CURRENCY_SYMBOLS[selectedCurrency]}
                    {((selectedService.pricing?.[selectedCurrency] || 0) * quantity).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Platform Fee (3%):</span>
                  <span>
                    {CURRENCY_SYMBOLS[selectedCurrency]}
                    {(((selectedService.pricing?.[selectedCurrency] || 0) * quantity) * 0.03).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCheckoutOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={processOrder}
              disabled={createOrderMutation.isPending}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {createOrderMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <ShoppingCart className="w-4 h-4 mr-2" />
              )}
              Confirm Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ServiceMarketplace from '../components/marketplace/ServiceMarketplace';
import ServiceListing from '../components/marketplace/ServiceListing';
import OrderManagement from '../components/marketplace/OrderManagement';
import FeaturedArtisans from '../components/marketplace/FeaturedArtisans';
import MarketplaceAIAssistant from '../components/marketplace/MarketplaceAIAssistant';
import BackButton from '../components/navigation/BackButton';
import { Loader2, Store } from 'lucide-react';

export default function Marketplace() {
  const [selectedTab, setSelectedTab] = useState('browse');

  const { data: services = [], isLoading: servicesLoading } = useQuery({
    queryKey: ['marketplace-services'],
    queryFn: () => base44.entities.MarketplaceService.list('-created_date')
  });

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => base44.entities.Order.list('-created_date')
  });

  const { data: brands = [] } = useQuery({
    queryKey: ['brands'],
    queryFn: () => base44.entities.Brand.list()
  });

  if (servicesLoading || ordersLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-8 mb-8 shadow-xl">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-3">
            <Store className="w-10 h-10" />
            <div>
              <h1 className="text-4xl font-extrabold drop-shadow-lg">Global Marketplace</h1>
              <p className="text-lg opacity-90 mt-1">Multi-Currency Service Exchange Across All Brands</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 pb-12">
        <BackButton />
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="bg-white p-2 rounded-lg shadow">
            <TabsTrigger value="browse" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              🛍️ Browse Services
            </TabsTrigger>
            <TabsTrigger value="list" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              ➕ List Service
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              📦 Orders
            </TabsTrigger>
          </TabsList>

          <TabsContent value="browse">
            <FeaturedArtisans services={services} />
            <ServiceMarketplace services={services} />
          </TabsContent>

          <TabsContent value="list">
            <ServiceListing brands={brands} />
          </TabsContent>

          <TabsContent value="orders">
            <OrderManagement orders={orders} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
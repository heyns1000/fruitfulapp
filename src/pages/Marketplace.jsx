import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ServiceMarketplace from '../components/marketplace/ServiceMarketplace';
import HomemartListing from './HomemartListing';
import ServiceListing from '../components/marketplace/ServiceListing';
import OrderManagement from '../components/marketplace/OrderManagement';
import FeaturedArtisans from '../components/marketplace/FeaturedArtisans';
import MarketplaceAIAssistant from '../components/marketplace/MarketplaceAIAssistant';
import ProductCSVImporter from '../components/marketplace/ProductCSVImporter';
import { Loader2, Store, ShoppingBag, Plus, Package, Upload } from 'lucide-react';

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

  const { data: artisans = [] } = useQuery({
    queryKey: ['artisans'],
    queryFn: () => base44.entities.ArtisanProfile.list()
  });

  if (servicesLoading || ordersLoading) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
      </div>
    );
  }

  const TABS = [
    { val: 'browse', label: 'Browse', icon: Store },
    { val: 'homemart', label: '🛍️ Homemart Bibs', icon: Package },
    { val: 'list', label: 'List a Service', icon: Plus },
    { val: 'orders', label: 'Orders', icon: Package },
    { val: 'import', label: 'Import CSV', icon: Upload },
  ];

  return (
    <div className="min-h-screen bg-stone-950 text-white">

      {/* ── HERO HEADER ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-stone-900 via-orange-950/30 to-stone-900 border-b border-stone-800 px-8 md:px-16 py-16">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #e85d26 1px, transparent 0)', backgroundSize: '36px 36px' }} />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-600/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-6xl mx-auto relative">
          <p className="text-orange-400 text-xs font-bold tracking-[0.3em] uppercase mb-4">✦ @Fruitful@ Platform</p>
          <div className="flex items-start gap-5">
            <div className="w-14 h-14 rounded-2xl bg-orange-600/20 border border-orange-600/40 flex items-center justify-center shrink-0 mt-1">
              <Store className="w-7 h-7 text-orange-400" />
            </div>
            <div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                Global<br /><span className="text-orange-500">Marketplace</span>
              </h1>
              <p className="text-stone-300 text-lg max-w-xl leading-relaxed">
                Multi-currency service exchange across Africa's finest artisan brands.
              </p>
              <div className="flex items-center gap-6 mt-5 text-sm text-stone-500">
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />{services.length} active listings</span>
                <span>{artisans.length} artisans</span>
                <span>{orders.length} orders placed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="max-w-6xl mx-auto px-4 md:px-10 py-8">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-8">
          <TabsList className="bg-stone-900 border border-stone-700 p-1 rounded-xl gap-1 w-full sm:w-auto inline-flex">
            {TABS.map(t => {
              const Icon = t.icon;
              return (
                <TabsTrigger key={t.val} value={t.val}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-stone-400 data-[state=active]:bg-orange-600 data-[state=active]:text-white font-semibold transition-all whitespace-nowrap">
                  <Icon className="w-4 h-4" /> {t.label}
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value="browse" className="space-y-10">
            <MarketplaceAIAssistant services={services} artisans={artisans} />
            <FeaturedArtisans services={services} />
            <ServiceMarketplace services={services} />
          </TabsContent>

          <TabsContent value="homemart">
            <HomemartListing embedded />
          </TabsContent>

          <TabsContent value="list">
            <OrderManagement orders={orders} />
          </TabsContent>

          <TabsContent value="import">
            <ProductCSVImporter />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
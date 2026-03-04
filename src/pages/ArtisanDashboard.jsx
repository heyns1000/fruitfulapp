import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Eye, ShoppingBag, Star, TrendingUp, Plus, Edit, Trash2, Package, MessageSquare, Settings, LayoutDashboard, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-stone-900 border border-stone-700 rounded-2xl p-6 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-stone-400 text-sm">{label}</p>
        <p className="text-white text-2xl font-black">{value}</p>
      </div>
    </div>
  );
}

export default function ArtisanDashboard() {
  const qc = useQueryClient();
  const params = new URLSearchParams(window.location.search);
  const brandId = params.get('brandId');
  const brandName = params.get('brandName');

  const [editingService, setEditingService] = useState(null);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [serviceForm, setServiceForm] = useState({ serviceName: '', description: '', category: 'physical_product', pricing: { USD: 0 }, status: 'active', productCode: '' });

  const { data: services = [], isLoading: loadingServices } = useQuery({
    queryKey: ['artisan-dash-services', brandId],
    queryFn: () => brandId
      ? base44.entities.MarketplaceService.filter({ brandId })
      : base44.entities.MarketplaceService.list(),
  });

  const { data: orders = [] } = useQuery({
    queryKey: ['artisan-dash-orders'],
    queryFn: () => base44.entities.Order.list('-created_date', 50),
  });

  const { data: artisans = [] } = useQuery({
    queryKey: ['artisan-dash-profile', brandId],
    queryFn: () => brandId
      ? base44.entities.ArtisanProfile.filter({ brandId })
      : base44.entities.ArtisanProfile.list(),
  });

  const artisan = artisans[0];
  const allTestimonials = artisan?.testimonials || [];
  const avgRating = allTestimonials.length
    ? (allTestimonials.reduce((s, t) => s + (t.rating || 0), 0) / allTestimonials.length).toFixed(1)
    : '—';

  const myOrders = brandId
    ? orders.filter(o => o.items?.some(i => services.find(s => s.id === i.serviceId)))
    : orders;

  const revenue = myOrders.filter(o => o.paymentStatus === 'paid').reduce((s, o) => s + (o.totalAmount || 0), 0);

  const saveMutation = useMutation({
    mutationFn: (data) => editingService
      ? base44.entities.MarketplaceService.update(editingService.id, data)
      : base44.entities.MarketplaceService.create({ ...data, brandId, brandName }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['artisan-dash-services'] });
      setShowServiceForm(false);
      setEditingService(null);
      setServiceForm({ serviceName: '', description: '', category: 'physical_product', pricing: { USD: 0 }, status: 'active', productCode: '' });
      toast.success(editingService ? 'Product updated!' : 'Product listed!');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.MarketplaceService.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['artisan-dash-services'] }); toast.success('Product removed'); }
  });

  const openEdit = (svc) => {
    setEditingService(svc);
    setServiceForm({ serviceName: svc.serviceName, description: svc.description, category: svc.category, pricing: svc.pricing || { USD: 0 }, status: svc.status, productCode: svc.productCode || '' });
    setShowServiceForm(true);
  };

  const openNew = () => {
    setEditingService(null);
    setServiceForm({ serviceName: '', description: '', category: 'physical_product', pricing: { USD: 0 }, status: 'active', productCode: `PROD-${Date.now()}` });
    setShowServiceForm(true);
  };

  const STATUS_COLORS = { pending: 'bg-yellow-900 text-yellow-300', confirmed: 'bg-blue-900 text-blue-300', shipped: 'bg-purple-900 text-purple-300', delivered: 'bg-green-900 text-green-300', cancelled: 'bg-red-900 text-red-300' };

  return (
    <div className="min-h-screen bg-stone-950 text-white">
      {/* Header */}
      <div className="bg-stone-900 border-b border-stone-700 px-6 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to={createPageUrl('Marketplace')}>
              <Button size="sm" variant="ghost" className="text-stone-400 hover:text-white"><ArrowLeft className="w-4 h-4 mr-1" /> Marketplace</Button>
            </Link>
            <div>
              <p className="text-xs text-orange-400 font-bold uppercase tracking-widest">Artisan Studio</p>
              <h1 className="text-2xl font-black text-white">{brandName || artisan?.artisanName || 'My Dashboard'}</h1>
            </div>
          </div>
          <Button onClick={openNew} className="bg-orange-600 hover:bg-orange-500 text-white font-bold">
            <Plus className="w-4 h-4 mr-2" /> Add Product
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Package} label="Total Products" value={services.length} color="bg-orange-600" />
          <StatCard icon={ShoppingBag} label="Total Orders" value={myOrders.length} color="bg-blue-600" />
          <StatCard icon={TrendingUp} label="Revenue (USD)" value={`$${revenue.toLocaleString()}`} color="bg-green-600" />
          <StatCard icon={Star} label="Avg Rating" value={avgRating} color="bg-purple-600" />
        </div>

        <Tabs defaultValue="products">
          <TabsList className="bg-stone-800 border border-stone-700">
            <TabsTrigger value="products" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white text-stone-400">
              <Package className="w-4 h-4 mr-2" /> Products
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white text-stone-400">
              <ShoppingBag className="w-4 h-4 mr-2" /> Orders
            </TabsTrigger>
            <TabsTrigger value="feedback" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white text-stone-400">
              <MessageSquare className="w-4 h-4 mr-2" /> Feedback
            </TabsTrigger>
          </TabsList>

          {/* PRODUCTS TAB */}
          <TabsContent value="products" className="mt-6">
            {loadingServices ? (
              <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {services.map(svc => (
                  <div key={svc.id} className="bg-stone-900 border border-stone-700 rounded-2xl overflow-hidden hover:border-orange-600 transition-colors">
                    <div className="aspect-video overflow-hidden bg-stone-800">
                      {svc.imageUrl
                        ? <img src={svc.imageUrl} alt={svc.serviceName} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center"><Package className="w-12 h-12 text-stone-600" /></div>
                      }
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-white text-sm leading-tight">{svc.serviceName}</h3>
                        <Badge className={svc.status === 'active' ? 'bg-green-900 text-green-300 border-0 text-xs' : 'bg-stone-700 text-stone-400 border-0 text-xs'}>
                          {svc.status}
                        </Badge>
                      </div>
                      <p className="text-orange-400 font-black text-xl">${svc.pricing?.USD || 0}</p>
                      <div className="flex gap-2 pt-1">
                        <Button size="sm" variant="outline" onClick={() => openEdit(svc)} className="flex-1 border-stone-600 text-stone-300 hover:bg-stone-700 hover:text-white">
                          <Edit className="w-3 h-3 mr-1" /> Edit
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => deleteMutation.mutate(svc.id)} className="text-red-400 hover:text-red-300 hover:bg-red-900/20 px-3">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={openNew} className="border-2 border-dashed border-stone-700 rounded-2xl aspect-auto min-h-[200px] flex flex-col items-center justify-center gap-2 text-stone-500 hover:border-orange-600 hover:text-orange-400 transition-colors">
                  <Plus className="w-8 h-8" />
                  <span className="text-sm font-medium">Add New Product</span>
                </button>
              </div>
            )}
          </TabsContent>

          {/* ORDERS TAB */}
          <TabsContent value="orders" className="mt-6">
            <div className="space-y-3">
              {myOrders.length === 0 ? (
                <div className="text-center py-12 text-stone-500">No orders yet</div>
              ) : (
                myOrders.map(order => (
                  <div key={order.id} className="bg-stone-900 border border-stone-700 rounded-xl p-5 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <p className="font-bold text-white text-sm">{order.orderNumber}</p>
                      <p className="text-stone-400 text-xs">{order.buyerEmail} · {order.items?.length} item(s)</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-orange-400 font-black">${order.totalAmount?.toLocaleString()}</p>
                      <Badge className={`${STATUS_COLORS[order.status] || 'bg-stone-700 text-stone-300'} border-0 text-xs`}>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          {/* FEEDBACK TAB */}
          <TabsContent value="feedback" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allTestimonials.length === 0 ? (
                <div className="col-span-2 text-center py-12 text-stone-500">No feedback yet</div>
              ) : (
                allTestimonials.map((t, i) => (
                  <div key={i} className="bg-stone-900 border border-stone-700 rounded-xl p-5 space-y-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, s) => (
                        <Star key={s} className={`w-4 h-4 ${s < t.rating ? 'fill-orange-400 text-orange-400' : 'text-stone-700'}`} />
                      ))}
                    </div>
                    <p className="text-stone-300 italic text-sm">"{t.comment}"</p>
                    <div className="flex justify-between text-xs text-stone-500 pt-1">
                      <span className="font-bold text-stone-300">— {t.customerName}</span>
                      <span className="text-orange-400">{t.productPurchased}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Service Form Dialog */}
      <Dialog open={showServiceForm} onOpenChange={setShowServiceForm}>
        <DialogContent className="bg-stone-900 border-stone-700 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">{editingService ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-xs text-stone-400 uppercase font-bold mb-1 block">Product Name</label>
              <Input value={serviceForm.serviceName} onChange={e => setServiceForm(f => ({ ...f, serviceName: e.target.value }))}
                placeholder="e.g. uNtshontsho Fedora" className="bg-stone-800 border-stone-600 text-white" />
            </div>
            <div>
              <label className="text-xs text-stone-400 uppercase font-bold mb-1 block">Description</label>
              <textarea value={serviceForm.description} onChange={e => setServiceForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Describe your product..." rows={3}
                className="w-full bg-stone-800 border border-stone-600 text-white rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-stone-400 uppercase font-bold mb-1 block">Price (USD)</label>
                <Input type="number" value={serviceForm.pricing?.USD || ''} onChange={e => setServiceForm(f => ({ ...f, pricing: { ...f.pricing, USD: parseFloat(e.target.value) || 0 } }))}
                  className="bg-stone-800 border-stone-600 text-white" />
              </div>
              <div>
                <label className="text-xs text-stone-400 uppercase font-bold mb-1 block">Product Code</label>
                <Input value={serviceForm.productCode} onChange={e => setServiceForm(f => ({ ...f, productCode: e.target.value }))}
                  className="bg-stone-800 border-stone-600 text-white" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-xs text-stone-400 uppercase font-bold">Status:</label>
              {['active', 'draft', 'paused'].map(s => (
                <button key={s} onClick={() => setServiceForm(f => ({ ...f, status: s }))}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${serviceForm.status === s ? 'bg-orange-600 text-white' : 'bg-stone-700 text-stone-300 hover:bg-stone-600'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowServiceForm(false)} className="text-stone-400">Cancel</Button>
            <Button onClick={() => saveMutation.mutate(serviceForm)} disabled={saveMutation.isPending} className="bg-orange-600 hover:bg-orange-500">
              {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : (editingService ? 'Save Changes' : 'List Product')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
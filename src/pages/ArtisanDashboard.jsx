import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, BarChart2, Package, ShoppingCart, MessageSquare, Settings, Plus, Pencil, Trash2, Star, Eye, TrendingUp, Users, DollarSign, AlertCircle, CheckCircle2, Clock, Truck, Bell, Hammer } from 'lucide-react';
import { toast } from 'sonner';

const STATUS_COLORS = {
  pending:    'bg-yellow-900/40 text-yellow-300 border-yellow-700',
  confirmed:  'bg-blue-900/40 text-blue-300 border-blue-700',
  processing: 'bg-purple-900/40 text-purple-300 border-purple-700',
  crafted:    'bg-amber-900/40 text-amber-300 border-amber-700',
  shipped:    'bg-cyan-900/40 text-cyan-300 border-cyan-700',
  delivered:  'bg-green-900/40 text-green-300 border-green-700',
  cancelled:  'bg-red-900/40 text-red-300 border-red-700',
};

const STATUS_ICONS = {
  pending: <Clock className="w-3 h-3" />,
  confirmed: <CheckCircle2 className="w-3 h-3" />,
  processing: <AlertCircle className="w-3 h-3" />,
  shipped: <Truck className="w-3 h-3" />,
  delivered: <CheckCircle2 className="w-3 h-3" />,
  cancelled: <AlertCircle className="w-3 h-3" />,
};

export default function ArtisanDashboard() {
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState('analytics');
  const [editingProduct, setEditingProduct] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [productForm, setProductForm] = useState({
    serviceName: '', description: '', category: 'physical_product',
    pricing: { USD: 0 }, imageUrl: '', status: 'active', tags: []
  });

  const { data: artisan } = useQuery({
    queryKey: ['my-artisan'],
    queryFn: () => base44.entities.ArtisanProfile.list().then(r => r[0])
  });

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['my-products', artisan?.brandId],
    queryFn: () => artisan?.brandId
      ? base44.entities.MarketplaceService.filter({ brandId: artisan.brandId })
      : base44.entities.MarketplaceService.list('-created_date', 50),
    enabled: !!artisan
  });

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['artisan-orders'],
    queryFn: () => base44.entities.Order.list('-created_date', 100)
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ['artisan-notifications', artisan?.id],
    queryFn: () => base44.entities.ArtisanNotification.list('-created_date', 50),
    enabled: !!artisan,
  });

  const markReadMutation = useMutation({
    mutationFn: (id) => base44.entities.ArtisanNotification.update(id, { read: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['artisan-notifications'] }),
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const saveMutation = useMutation({
    mutationFn: (data) => editingProduct
      ? base44.entities.MarketplaceService.update(editingProduct.id, data)
      : base44.entities.MarketplaceService.create({ ...data, brandId: artisan?.brandId, brandName: artisan?.brandName }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-products'] });
      setShowProductForm(false);
      setEditingProduct(null);
      toast.success(editingProduct ? 'Product updated!' : 'Product created!');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.MarketplaceService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-products'] });
      toast.success('Product deleted');
    }
  });

  const updateOrderMutation = useMutation({
    mutationFn: ({ id, status }) => base44.entities.Order.update(id, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['artisan-orders'] })
  });

  const openNew = () => {
    setEditingProduct(null);
    setProductForm({ serviceName: '', description: '', category: 'physical_product', pricing: { USD: 0 }, imageUrl: '', status: 'active', tags: [] });
    setShowProductForm(true);
  };

  const openEdit = (p) => {
    setEditingProduct(p);
    setProductForm({ ...p });
    setShowProductForm(true);
  };

  // Derived stats
  const totalRevenue = orders.filter(o => o.paymentStatus === 'paid').reduce((s, o) => s + (o.totalAmount || 0), 0);
  const totalOrders = orders.length;
  const avgRating = artisan?.testimonials?.length
    ? (artisan.testimonials.reduce((s, t) => s + (t.rating || 0), 0) / artisan.testimonials.length).toFixed(1) : '—';

  return (
    <div className="min-h-screen bg-stone-950 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-stone-900 to-stone-800 border-b border-stone-700 px-6 md:px-10 py-8">
        <div className="max-w-7xl mx-auto flex items-center gap-5">
          {artisan?.profileImageUrl && (
            <img src={artisan.profileImageUrl} className="w-16 h-16 rounded-full object-cover border-2 border-orange-500" alt="" />
          )}
          <div>
            <p className="text-orange-400 text-xs font-bold uppercase tracking-widest mb-0.5">Artisan Dashboard</p>
            <h1 className="text-3xl font-black">{artisan?.artisanName || 'My Dashboard'}</h1>
            <p className="text-stone-400 text-sm">{artisan?.title} · {artisan?.brandName}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-10 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-stone-900 border border-stone-700 mb-8 w-full overflow-x-auto flex gap-1 h-auto p-1">
            {[
              { val: 'analytics', label: 'Analytics', icon: <BarChart2 className="w-4 h-4" /> },
              { val: 'products', label: 'Products', icon: <Package className="w-4 h-4" /> },
              { val: 'orders', label: 'Orders', icon: <ShoppingCart className="w-4 h-4" /> },
              { val: 'feedback', label: 'Feedback', icon: <MessageSquare className="w-4 h-4" /> },
              { val: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
            ].map(t => (
              <TabsTrigger key={t.val} value={t.val}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-stone-400 data-[state=active]:bg-orange-600 data-[state=active]:text-white whitespace-nowrap">
                {t.icon} {t.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* ANALYTICS */}
          <TabsContent value="analytics" className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: <DollarSign className="w-6 h-6" />, color: 'text-green-400' },
                { label: 'Total Orders', value: totalOrders, icon: <ShoppingCart className="w-6 h-6" />, color: 'text-blue-400' },
                { label: 'Products Listed', value: products.length, icon: <Package className="w-6 h-6" />, color: 'text-purple-400' },
                { label: 'Avg. Rating', value: avgRating, icon: <Star className="w-6 h-6" />, color: 'text-orange-400' },
              ].map(s => (
                <div key={s.label} className="bg-stone-900 border border-stone-700 rounded-2xl p-5">
                  <div className={`${s.color} mb-2`}>{s.icon}</div>
                  <p className="text-3xl font-black text-white">{s.value}</p>
                  <p className="text-stone-400 text-sm mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-stone-900 border border-stone-700 rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-orange-500" /> Order Status Breakdown</h3>
                {['pending','confirmed','shipped','delivered','cancelled'].map(s => {
                  const count = orders.filter(o => o.status === s).length;
                  const pct = totalOrders ? Math.round((count / totalOrders) * 100) : 0;
                  return (
                    <div key={s} className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize text-stone-300">{s}</span>
                        <span className="text-stone-400">{count} orders</span>
                      </div>
                      <div className="h-2 bg-stone-800 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-stone-900 border border-stone-700 rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-orange-500" /> Recent Customers</h3>
                {orders.slice(0, 5).map((o, i) => (
                  <div key={o.id} className="flex items-center justify-between py-2 border-b border-stone-800 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-white">{o.buyerEmail}</p>
                      <p className="text-xs text-stone-500">{o.orderNumber}</p>
                    </div>
                    <span className="text-orange-400 font-bold text-sm">${o.totalAmount}</span>
                  </div>
                ))}
                {orders.length === 0 && <p className="text-stone-500 text-sm">No orders yet</p>}
              </div>
            </div>
          </TabsContent>

          {/* PRODUCTS */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black">My Products</h2>
              <Button onClick={openNew} className="bg-orange-600 hover:bg-orange-500 text-white gap-2">
                <Plus className="w-4 h-4" /> Add Product
              </Button>
            </div>
            {productsLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {products.map(p => (
                  <div key={p.id} className="bg-stone-900 border border-stone-700 rounded-2xl overflow-hidden hover:border-orange-600 transition-all group">
                    <div className="aspect-video bg-stone-800 overflow-hidden">
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt={p.serviceName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-12 h-12 text-stone-600" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-white leading-tight">{p.serviceName}</h3>
                        <Badge className={`text-xs border ${p.status === 'active' ? 'bg-green-900/40 text-green-300 border-green-700' : 'bg-stone-700 text-stone-400 border-stone-600'}`}>
                          {p.status}
                        </Badge>
                      </div>
                      <p className="text-stone-400 text-sm line-clamp-2 mb-3">{p.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-orange-400 font-black text-xl">${p.pricing?.USD || 0}</span>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => openEdit(p)} className="border-stone-600 text-stone-300 hover:border-orange-500 hover:text-white">
                            <Pencil className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => { if(confirm('Delete this product?')) deleteMutation.mutate(p.id); }} className="border-stone-600 text-red-400 hover:border-red-600 hover:text-red-300">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ORDERS */}
          <TabsContent value="orders" className="space-y-4">
            <h2 className="text-2xl font-black">Order Management</h2>
            {ordersLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>
            ) : orders.length === 0 ? (
              <div className="text-center py-20 text-stone-500">No orders yet</div>
            ) : (
              <div className="space-y-3">
                {orders.map(order => (
                  <div key={order.id} className="bg-stone-900 border border-stone-700 rounded-2xl p-5 hover:border-stone-500 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-bold text-white">{order.orderNumber || order.id.slice(-8)}</span>
                          <Badge className={`text-xs border flex items-center gap-1 ${STATUS_COLORS[order.status] || 'bg-stone-700 text-stone-400 border-stone-600'}`}>
                            {STATUS_ICONS[order.status]} {order.status}
                          </Badge>
                        </div>
                        <p className="text-stone-400 text-sm">{order.buyerEmail} · {order.items?.length} item(s)</p>
                        <p className="text-stone-500 text-xs mt-1">
                          {new Date(order.created_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-orange-400 font-black text-xl">${order.totalAmount}</span>
                        <Select
                          value={order.status}
                          onValueChange={(val) => updateOrderMutation.mutate({ id: order.id, status: val })}
                        >
                          <SelectTrigger className="w-36 bg-stone-800 border-stone-600 text-white text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-stone-800 border-stone-600">
                            {['pending','confirmed','processing','shipped','delivered','cancelled'].map(s => (
                              <SelectItem key={s} value={s} className="text-white capitalize">{s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* FEEDBACK */}
          <TabsContent value="feedback" className="space-y-6">
            <h2 className="text-2xl font-black">Customer Feedback</h2>
            {artisan?.testimonials?.length > 0 ? (
              <>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-stone-900 border border-stone-700 rounded-2xl p-5 text-center">
                    <p className="text-4xl font-black text-orange-400">{avgRating}</p>
                    <p className="text-stone-400 text-sm mt-1">Avg Rating</p>
                    <div className="flex justify-center gap-1 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < Math.round(parseFloat(avgRating)) ? 'fill-orange-400 text-orange-400' : 'text-stone-700'}`} />
                      ))}
                    </div>
                  </div>
                  <div className="bg-stone-900 border border-stone-700 rounded-2xl p-5 text-center">
                    <p className="text-4xl font-black text-white">{artisan.testimonials.length}</p>
                    <p className="text-stone-400 text-sm mt-1">Total Reviews</p>
                  </div>
                  <div className="bg-stone-900 border border-stone-700 rounded-2xl p-5 text-center">
                    <p className="text-4xl font-black text-green-400">
                      {artisan.testimonials.filter(t => t.rating >= 4).length}
                    </p>
                    <p className="text-stone-400 text-sm mt-1">5★ Reviews</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {artisan.testimonials.map((t, i) => (
                    <div key={i} className="bg-stone-900 border border-stone-700 rounded-2xl p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, s) => (
                            <Star key={s} className={`w-4 h-4 ${s < t.rating ? 'fill-orange-400 text-orange-400' : 'text-stone-700'}`} />
                          ))}
                        </div>
                        <span className="text-stone-500 text-xs">{t.date}</span>
                      </div>
                      <p className="text-stone-300 italic mb-3">"{t.comment}"</p>
                      <div className="flex justify-between text-sm">
                        <span className="font-bold text-white">{t.customerName}</span>
                        {t.productPurchased && <span className="text-orange-400 text-xs">{t.productPurchased}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-20 text-stone-500">No customer feedback yet</div>
            )}
          </TabsContent>

          {/* SETTINGS */}
          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-black">Shop Settings</h2>
            {artisan && <ArtisanSettingsForm artisan={artisan} onSave={() => qc.invalidateQueries({ queryKey: ['my-artisan'] })} />}
          </TabsContent>
        </Tabs>
      </div>

      {/* Product Form Dialog */}
      <Dialog open={showProductForm} onOpenChange={setShowProductForm}>
        <DialogContent className="bg-stone-900 border-stone-700 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-stone-400 uppercase tracking-wider mb-1 block">Product Name</label>
              <Input value={productForm.serviceName} onChange={e => setProductForm(f => ({...f, serviceName: e.target.value}))}
                className="bg-stone-800 border-stone-600 text-white" placeholder="e.g. uNtshontsho Fedora" />
            </div>
            <div>
              <label className="text-xs text-stone-400 uppercase tracking-wider mb-1 block">Description</label>
              <Textarea value={productForm.description} onChange={e => setProductForm(f => ({...f, description: e.target.value}))}
                className="bg-stone-800 border-stone-600 text-white" rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-stone-400 uppercase tracking-wider mb-1 block">Price (USD)</label>
                <Input type="number" value={productForm.pricing?.USD || 0}
                  onChange={e => setProductForm(f => ({...f, pricing: {...f.pricing, USD: parseFloat(e.target.value)}}))}
                  className="bg-stone-800 border-stone-600 text-white" />
              </div>
              <div>
                <label className="text-xs text-stone-400 uppercase tracking-wider mb-1 block">Status</label>
                <Select value={productForm.status} onValueChange={v => setProductForm(f => ({...f, status: v}))}>
                  <SelectTrigger className="bg-stone-800 border-stone-600 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-stone-800 border-stone-600">
                    <SelectItem value="active" className="text-white">Active</SelectItem>
                    <SelectItem value="draft" className="text-white">Draft</SelectItem>
                    <SelectItem value="paused" className="text-white">Paused</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-xs text-stone-400 uppercase tracking-wider mb-1 block">Image URL</label>
              <Input value={productForm.imageUrl} onChange={e => setProductForm(f => ({...f, imageUrl: e.target.value}))}
                className="bg-stone-800 border-stone-600 text-white" placeholder="https://..." />
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => setShowProductForm(false)} className="flex-1 border-stone-600 text-stone-300">Cancel</Button>
              <Button onClick={() => saveMutation.mutate(productForm)} disabled={saveMutation.isPending}
                className="flex-1 bg-orange-600 hover:bg-orange-500 text-white">
                {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {editingProduct ? 'Save Changes' : 'Create Product'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ArtisanSettingsForm({ artisan, onSave }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    artisanName: artisan.artisanName || '',
    title: artisan.title || '',
    location: artisan.location || '',
    soulMessage: artisan.soulMessage || '',
    biography: artisan.biography || '',
  });

  const mut = useMutation({
    mutationFn: () => base44.entities.ArtisanProfile.update(artisan.id, form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['my-artisan'] }); toast.success('Profile updated!'); onSave(); }
  });

  return (
    <div className="bg-stone-900 border border-stone-700 rounded-2xl p-6 space-y-5 max-w-2xl">
      {[
        { key: 'artisanName', label: 'Artisan Name' },
        { key: 'title', label: 'Title / Role' },
        { key: 'location', label: 'Location' },
      ].map(f => (
        <div key={f.key}>
          <label className="text-xs text-orange-400 uppercase tracking-wider mb-1 block">{f.label}</label>
          <Input value={form[f.key]} onChange={e => setForm(p => ({...p, [f.key]: e.target.value}))}
            className="bg-stone-800 border-stone-600 text-white" />
        </div>
      ))}
      <div>
        <label className="text-xs text-orange-400 uppercase tracking-wider mb-1 block">Soul Message</label>
        <Textarea value={form.soulMessage} onChange={e => setForm(p => ({...p, soulMessage: e.target.value}))}
          className="bg-stone-800 border-stone-600 text-white" rows={2} />
      </div>
      <div>
        <label className="text-xs text-orange-400 uppercase tracking-wider mb-1 block">Biography</label>
        <Textarea value={form.biography} onChange={e => setForm(p => ({...p, biography: e.target.value}))}
          className="bg-stone-800 border-stone-600 text-white" rows={5} />
      </div>
      <Button onClick={() => mut.mutate()} disabled={mut.isPending} className="bg-orange-600 hover:bg-orange-500 text-white px-8">
        {mut.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} Save Settings
      </Button>
    </div>
  );
}
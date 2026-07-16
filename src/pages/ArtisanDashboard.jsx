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
import FileUploadButton from '../components/common/FileUploadButton';

const STATUS_COLORS = {
  pending:    'bg-yellow-900/40 text-yellow-300 border-yellow-700',
  confirmed:  'bg-blue-900/40 text-blue-300 border-blue-700',
  processing: 'bg-purple-900/40 text-purple-300 border-purple-700',
  crafted:    'bg-fruitful-green/10 text-fruitful-green border-fruitful-green/40',
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
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-gradient-to-r from-card to-card border-b border-border px-6 md:px-10 py-8">
        <div className="max-w-7xl mx-auto flex items-center gap-5">
          {artisan?.profileImageUrl && (
            <img src={artisan.profileImageUrl} className="w-16 h-16 rounded-full object-cover border-2 border-primary" alt="" />
          )}
          <div>
            <p className="text-primary text-xs font-bold uppercase tracking-widest mb-0.5">Artisan Dashboard</p>
            <h1 className="text-3xl font-black">{artisan?.artisanName || 'My Dashboard'}</h1>
            <p className="text-muted-foreground text-sm">{artisan?.title} · {artisan?.brandName}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-10 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-card border border-border mb-8 w-full overflow-x-auto flex gap-1 h-auto p-1">
            {[
              { val: 'analytics', label: 'Analytics', icon: <BarChart2 className="w-4 h-4" /> },
              { val: 'products', label: 'Products', icon: <Package className="w-4 h-4" /> },
              { val: 'orders', label: 'Orders', icon: <ShoppingCart className="w-4 h-4" /> },
              { val: 'feedback', label: 'Feedback', icon: <MessageSquare className="w-4 h-4" /> },
              { val: 'notifications', label: unreadCount > 0 ? `Notifications (${unreadCount})` : 'Notifications', icon: <Bell className="w-4 h-4" /> },
              { val: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
            ].map(t => (
              <TabsTrigger key={t.val} value={t.val}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground whitespace-nowrap">
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
                { label: 'Avg. Rating', value: avgRating, icon: <Star className="w-6 h-6" />, color: 'text-primary' },
              ].map(s => (
                <div key={s.label} className="bg-card border border-border rounded-2xl p-5">
                  <div className={`${s.color} mb-2`}>{s.icon}</div>
                  <p className="text-3xl font-black text-foreground">{s.value}</p>
                  <p className="text-muted-foreground text-sm mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-primary" /> Order Status Breakdown</h3>
                {['pending','confirmed','shipped','delivered','cancelled'].map(s => {
                  const count = orders.filter(o => o.status === s).length;
                  const pct = totalOrders ? Math.round((count / totalOrders) * 100) : 0;
                  return (
                    <div key={s} className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize text-muted-foreground">{s}</span>
                        <span className="text-muted-foreground">{count} orders</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-primary" /> Recent Customers</h3>
                {orders.slice(0, 5).map((o, i) => (
                  <div key={o.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm font-medium text-foreground">{o.buyerEmail}</p>
                      <p className="text-xs text-muted-foreground">{o.orderNumber}</p>
                    </div>
                    <span className="text-primary font-bold text-sm">${o.totalAmount}</span>
                  </div>
                ))}
                {orders.length === 0 && <p className="text-muted-foreground text-sm">No orders yet</p>}
              </div>
            </div>
          </TabsContent>

          {/* PRODUCTS */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black">My Products</h2>
              <Button onClick={openNew} className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                <Plus className="w-4 h-4" /> Add Product
              </Button>
            </div>
            {productsLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {products.map(p => (
                  <div key={p.id} className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary transition-all group">
                    <div className="aspect-video bg-muted overflow-hidden">
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt={p.serviceName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-12 h-12 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-foreground leading-tight">{p.serviceName}</h3>
                        <Badge className={`text-xs border ${p.status === 'active' ? 'bg-green-900/40 text-green-300 border-green-700' : 'bg-muted text-muted-foreground border-border'}`}>
                          {p.status}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{p.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-primary font-black text-xl">${p.pricing?.USD || 0}</span>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => openEdit(p)} className="border-border text-muted-foreground hover:border-primary hover:text-foreground">
                            <Pencil className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => { if(confirm('Delete this product?')) deleteMutation.mutate(p.id); }} className="border-border text-red-400 hover:border-red-600 hover:text-red-300">
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
              <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : orders.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">No orders yet</div>
            ) : (
              <div className="space-y-3">
                {orders.map(order => (
                  <div key={order.id} className="bg-card border border-border rounded-2xl p-5 hover:border-primary/40 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-bold text-foreground">{order.orderNumber || order.id.slice(-8)}</span>
                          <Badge className={`text-xs border flex items-center gap-1 ${STATUS_COLORS[order.status] || 'bg-muted text-muted-foreground border-border'}`}>
                            {STATUS_ICONS[order.status]} {order.status}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm">{order.buyerEmail} · {order.items?.length} item(s)</p>
                        <p className="text-muted-foreground text-xs mt-1">
                          {new Date(order.created_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-primary font-black text-xl">${order.totalAmount}</span>
                        <Select
                          value={order.status}
                          onValueChange={(val) => updateOrderMutation.mutate({ id: order.id, status: val })}
                        >
                          <SelectTrigger className="w-36 bg-muted border-border text-foreground text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-muted border-border">
                            {['pending','confirmed','processing','crafted','shipped','delivered','cancelled'].map(s => (
                              <SelectItem key={s} value={s} className="text-foreground capitalize">{s}</SelectItem>
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
                  <div className="bg-card border border-border rounded-2xl p-5 text-center">
                    <p className="text-4xl font-black text-primary">{avgRating}</p>
                    <p className="text-muted-foreground text-sm mt-1">Avg Rating</p>
                    <div className="flex justify-center gap-1 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < Math.round(parseFloat(avgRating)) ? 'fill-orange-400 text-primary' : 'text-foreground'}`} />
                      ))}
                    </div>
                  </div>
                  <div className="bg-card border border-border rounded-2xl p-5 text-center">
                    <p className="text-4xl font-black text-foreground">{artisan.testimonials.length}</p>
                    <p className="text-muted-foreground text-sm mt-1">Total Reviews</p>
                  </div>
                  <div className="bg-card border border-border rounded-2xl p-5 text-center">
                    <p className="text-4xl font-black text-green-400">
                      {artisan.testimonials.filter(t => t.rating >= 4).length}
                    </p>
                    <p className="text-muted-foreground text-sm mt-1">5★ Reviews</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {artisan.testimonials.map((t, i) => (
                    <div key={i} className="bg-card border border-border rounded-2xl p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, s) => (
                            <Star key={s} className={`w-4 h-4 ${s < t.rating ? 'fill-orange-400 text-primary' : 'text-foreground'}`} />
                          ))}
                        </div>
                        <span className="text-muted-foreground text-xs">{t.date}</span>
                      </div>
                      <p className="text-muted-foreground italic mb-3">"{t.comment}"</p>
                      <div className="flex justify-between text-sm">
                        <span className="font-bold text-foreground">{t.customerName}</span>
                        {t.productPurchased && <span className="text-primary text-xs">{t.productPurchased}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-20 text-muted-foreground">No customer feedback yet</div>
            )}
          </TabsContent>

          {/* NOTIFICATIONS */}
          <TabsContent value="notifications" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black flex items-center gap-2">
                <Bell className="w-6 h-6 text-primary" /> Notifications
                {unreadCount > 0 && <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">{unreadCount} new</span>}
              </h2>
            </div>
            {notifications.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Bell className="w-10 h-10 mx-auto mb-3 opacity-20" />
                <p>No notifications yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map(n => (
                  <div key={n.id} onClick={() => !n.read && markReadMutation.mutate(n.id)}
                    className={`flex items-start gap-4 rounded-2xl p-5 border cursor-pointer transition-all ${
                      n.read ? 'bg-card border-border opacity-70' : 'bg-primary/10 border-primary/30 hover:border-primary'
                    }`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      n.type === 'package_received' ? 'bg-green-500/20 border border-green-600' : 'bg-primary/15 border border-primary'
                    }`}>
                      {n.type === 'package_received' ? <Truck className="w-5 h-5 text-green-400" /> : <Bell className="w-5 h-5 text-primary" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-bold text-foreground text-sm">{n.title}</p>
                        {!n.read && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                      </div>
                      <p className="text-muted-foreground text-sm mt-0.5">{n.message}</p>
                      <p className="text-muted-foreground text-xs mt-1">
                        {new Date(n.created_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        {!n.read && <span className="text-primary ml-2">· Click to mark read</span>}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
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
        <DialogContent className="bg-card border-border text-foreground max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-foreground">{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Product Name</label>
              <Input value={productForm.serviceName} onChange={e => setProductForm(f => ({...f, serviceName: e.target.value}))}
                className="bg-muted border-border text-foreground" placeholder="e.g. uNtshontsho Fedora" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Description</label>
              <Textarea value={productForm.description} onChange={e => setProductForm(f => ({...f, description: e.target.value}))}
                className="bg-muted border-border text-foreground" rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Price (USD)</label>
                <Input type="number" value={productForm.pricing?.USD || 0}
                  onChange={e => setProductForm(f => ({...f, pricing: {...f.pricing, USD: parseFloat(e.target.value)}}))}
                  className="bg-muted border-border text-foreground" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Status</label>
                <Select value={productForm.status} onValueChange={v => setProductForm(f => ({...f, status: v}))}>
                  <SelectTrigger className="bg-muted border-border text-foreground"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-muted border-border">
                    <SelectItem value="active" className="text-foreground">Active</SelectItem>
                    <SelectItem value="draft" className="text-foreground">Draft</SelectItem>
                    <SelectItem value="paused" className="text-foreground">Paused</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Product Image</label>
              <FileUploadButton
                label="Upload Image"
                currentUrl={productForm.imageUrl}
                onUploaded={url => setProductForm(f => ({ ...f, imageUrl: url }))}
                variant="dropzone"
                className="mb-2"
              />
              <Input value={productForm.imageUrl} onChange={e => setProductForm(f => ({...f, imageUrl: e.target.value}))}
                className="bg-muted border-border text-foreground text-xs" placeholder="or paste URL…" />
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => setShowProductForm(false)} className="flex-1 border-border text-muted-foreground">Cancel</Button>
              <Button onClick={() => saveMutation.mutate(productForm)} disabled={saveMutation.isPending}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
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
    profileImageUrl: artisan.profileImageUrl || '',
    workshopImageUrl: artisan.workshopImageUrl || '',
  });

  const mut = useMutation({
    mutationFn: () => base44.entities.ArtisanProfile.update(artisan.id, form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['my-artisan'] }); toast.success('Profile updated!'); onSave(); }
  });

  return (
    <div className="bg-card border border-border rounded-2xl p-6 space-y-5 max-w-2xl">
      {[
        { key: 'artisanName', label: 'Artisan Name' },
        { key: 'title', label: 'Title / Role' },
        { key: 'location', label: 'Location' },
      ].map(f => (
        <div key={f.key}>
          <label className="text-xs text-primary uppercase tracking-wider mb-1 block">{f.label}</label>
          <Input value={form[f.key]} onChange={e => setForm(p => ({...p, [f.key]: e.target.value}))}
            className="bg-muted border-border text-foreground" />
        </div>
      ))}
      <div>
        <label className="text-xs text-primary uppercase tracking-wider mb-1 block">Soul Message</label>
        <Textarea value={form.soulMessage} onChange={e => setForm(p => ({...p, soulMessage: e.target.value}))}
          className="bg-muted border-border text-foreground" rows={2} />
      </div>
      <div>
        <label className="text-xs text-primary uppercase tracking-wider mb-1 block">Biography</label>
        <Textarea value={form.biography} onChange={e => setForm(p => ({...p, biography: e.target.value}))}
          className="bg-muted border-border text-foreground" rows={5} />
      </div>
      {/* Profile Image */}
      <div>
        <label className="text-xs text-primary uppercase tracking-wider mb-2 block">Profile Photo</label>
        <FileUploadButton
          label="Upload Profile Photo"
          currentUrl={form.profileImageUrl}
          onUploaded={url => setForm(p => ({ ...p, profileImageUrl: url }))}
          variant="dropzone"
        />
        <Input value={form.profileImageUrl} onChange={e => setForm(p => ({...p, profileImageUrl: e.target.value}))}
          className="bg-muted border-border text-foreground mt-2 text-xs" placeholder="or paste URL…" />
      </div>

      {/* Workshop Image */}
      <div>
        <label className="text-xs text-primary uppercase tracking-wider mb-2 block">Workshop / Hero Image</label>
        <FileUploadButton
          label="Upload Workshop Image"
          currentUrl={form.workshopImageUrl}
          onUploaded={url => setForm(p => ({ ...p, workshopImageUrl: url }))}
          variant="dropzone"
        />
        <Input value={form.workshopImageUrl} onChange={e => setForm(p => ({...p, workshopImageUrl: e.target.value}))}
          className="bg-muted border-border text-foreground mt-2 text-xs" placeholder="or paste URL…" />
      </div>

      <Button onClick={() => mut.mutate()} disabled={mut.isPending} className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
        {mut.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} Save Settings
      </Button>
    </div>
  );
}
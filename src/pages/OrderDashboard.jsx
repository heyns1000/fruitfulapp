import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  Loader2, Package, Search, RefreshCw, RotateCcw, ChevronDown, ChevronUp,
  Truck, CheckCircle2, Clock, XCircle, Filter, Bell, Star, Hammer,
  MapPin, ShieldCheck, PartyPopper, Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';
import { useCart } from '../components/cart/CartContext';
import OrderTimeline from '../components/orders/OrderTimeline';
import DeliveryCountdown from '../components/orders/DeliveryCountdown';
import ShipmentTracker from '../components/orders/ShipmentTracker';

const STATUS_CONFIG = {
  pending:    { color: 'bg-yellow-900/40 text-yellow-300 border-yellow-700',  icon: Clock,         label: 'Pending' },
  confirmed:  { color: 'bg-blue-900/40 text-blue-300 border-blue-700',        icon: CheckCircle2,  label: 'Confirmed' },
  processing: { color: 'bg-purple-900/40 text-purple-300 border-purple-700',  icon: Package,       label: 'Processing' },
  crafted:    { color: 'bg-fruitful-green/10 text-fruitful-green border-fruitful-green/40',     icon: Hammer,        label: 'Crafted' },
  shipped:    { color: 'bg-cyan-900/40 text-cyan-300 border-cyan-700',        icon: Truck,         label: 'Shipped' },
  delivered:  { color: 'bg-green-900/40 text-green-300 border-green-700',     icon: CheckCircle2,  label: 'Delivered' },
  cancelled:  { color: 'bg-red-900/40 text-red-300 border-red-700',           icon: XCircle,       label: 'Cancelled' },
  refunded:   { color: 'bg-muted text-muted-foreground border-border',        icon: RotateCcw,     label: 'Refunded' },
};

const ACTIVE_STATUSES = ['pending', 'confirmed', 'processing', 'crafted', 'shipped'];

export default function OrderDashboard() {
  const qc = useQueryClient();
  const { addToCart } = useCart();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [returnDialog, setReturnDialog] = useState(null);
  const [returnReason, setReturnReason] = useState('');
  const [receivedDialog, setReceivedDialog] = useState(null);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['order-dashboard'],
    queryFn: () => base44.entities.Order.list('-created_date', 100),
  });

  // Real-time updates
  useEffect(() => {
    const unsub = base44.entities.Order.subscribe((event) => {
      qc.invalidateQueries({ queryKey: ['order-dashboard'] });
      if (event.type === 'update') {
        const newStatus = event.data?.status;
        if (newStatus && STATUS_CONFIG[newStatus]) {
          toast.success(`Order updated: ${STATUS_CONFIG[newStatus].label}`, {
            description: event.data?.orderNumber || '',
          });
        }
      }
    });
    return unsub;
  }, [qc]);

  const cancelMutation = useMutation({
    mutationFn: (id) => base44.entities.Order.update(id, {
      status: 'cancelled',
      statusHistory: [{ status: 'cancelled', timestamp: new Date().toISOString(), note: 'Cancelled by buyer' }]
    }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['order-dashboard'] }); toast.success('Order cancelled'); }
  });

  const returnMutation = useMutation({
    mutationFn: ({ id, reason }) => base44.entities.Order.update(id, {
      status: 'refunded',
      notes: reason,
      statusHistory: [{ status: 'refunded', timestamp: new Date().toISOString(), note: reason }]
    }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['order-dashboard'] }); setReturnDialog(null); toast.success('Return request submitted'); }
  });

  const markReceivedMutation = useMutation({
    mutationFn: async (order) => {
      // Update order status
      await base44.entities.Order.update(order.id, {
        status: 'delivered',
        statusHistory: [
          ...(order.statusHistory || []),
          { status: 'delivered', timestamp: new Date().toISOString(), note: 'Marked as received by buyer' }
        ]
      });
      // Ping artisan notification
      if (order.artisanId) {
        await base44.entities.ArtisanNotification.create({
          artisanId: order.artisanId,
          artisanName: order.artisanName || 'Artisan',
          artisanEmail: order.artisanEmail || '',
          type: 'package_received',
          title: '📦 Package Received!',
          message: `Your order ${order.orderNumber || '#' + order.id.slice(-8).toUpperCase()} has been received and confirmed by the buyer. Great work!`,
          orderId: order.id,
          orderNumber: order.orderNumber || '#' + order.id.slice(-8).toUpperCase(),
          buyerName: order.buyerEmail || 'Buyer',
          read: false,
        });
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['order-dashboard'] });
      setReceivedDialog(null);
      toast.success('🎉 Package confirmed! Artisan has been notified.', { duration: 4000 });
    },
  });

  const handleReorder = (order) => {
    order.items?.forEach(item => addToCart({
      id: item.serviceId, name: item.serviceName, price: item.unitPrice,
      productCode: item.productCode, imageUrl: item.imageUrl,
    }));
    toast.success('Items added to cart!');
  };

  const filtered = orders.filter(o => {
    const matchSearch = !search || o.orderNumber?.toLowerCase().includes(search.toLowerCase()) || o.buyerEmail?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const activeOrders = orders.filter(o => ACTIVE_STATUSES.includes(o.status));
  const deliveredOrders = orders.filter(o => o.status === 'delivered');
  const totalSpend = orders.filter(o => o.paymentStatus === 'paid').reduce((s, o) => s + (o.totalAmount || 0), 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-fruitful-mint/50 via-card to-card border-b border-border px-6 md:px-10 py-10">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #f97316 0%, transparent 60%)' }} />
        <div className="max-w-6xl mx-auto relative">
          <p className="text-primary text-xs font-bold uppercase tracking-[0.3em] mb-2">Fruitful™ Marketplace</p>
          <h1 className="text-5xl font-black mb-2">Order Dashboard</h1>
          <p className="text-muted-foreground">Real-time tracking for all your artisan purchases</p>

          {/* Live indicator */}
          {activeOrders.length > 0 && (
            <div className="flex items-center gap-2 mt-4">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 text-sm font-medium">{activeOrders.length} active order{activeOrders.length !== 1 ? 's' : ''} in progress</span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-10 py-8 space-y-8">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Orders', val: orders.length, color: 'text-foreground', sub: 'all time' },
            { label: 'In Transit', val: activeOrders.length, color: 'text-primary', sub: 'being crafted / shipped' },
            { label: 'Delivered', val: deliveredOrders.length, color: 'text-green-400', sub: 'successfully received' },
            { label: 'Total Spent', val: `$${totalSpend.toLocaleString()}`, color: 'text-fruitful-green', sub: 'confirmed payments' },
          ].map(s => (
            <div key={s.label} className="bg-card border border-border rounded-2xl p-5 hover:border-primary/40 transition-colors">
              <p className={`text-3xl font-black ${s.color}`}>{s.val}</p>
              <p className="text-foreground text-sm font-semibold mt-1">{s.label}</p>
              <p className="text-muted-foreground text-xs mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Active orders spotlight */}
        {activeOrders.length > 0 && (
          <div>
            <h2 className="text-xs font-bold tracking-[0.25em] uppercase text-primary mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Active Orders
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {activeOrders.slice(0, 4).map(order => {
                const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                const Icon = cfg.icon;
                return (
                  <button key={order.id} onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                    className="text-left bg-gradient-to-br from-fruitful-mint/50 to-card border border-primary/30 hover:border-primary rounded-2xl p-5 transition-all">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <p className="font-bold text-foreground">{order.orderNumber || '#' + order.id.slice(-8).toUpperCase()}</p>
                        <p className="text-muted-foreground text-xs">{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</p>
                      </div>
                      <Badge className={`text-xs border flex items-center gap-1 ${cfg.color}`}>
                        <Icon className="w-3 h-3" /> {cfg.label}
                      </Badge>
                    </div>
                    {order.estimatedDelivery && (
                      <DeliveryCountdown estimatedDelivery={order.estimatedDelivery} status={order.status} />
                    )}
                    {order.artisanName && (
                      <p className="text-muted-foreground text-xs mt-2 flex items-center gap-1">
                        <Hammer className="w-3 h-3" /> Crafted by {order.artisanName}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search orders..."
              className="pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['all', 'processing', 'crafted', 'shipped', 'delivered'].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all capitalize ${
                  statusFilter === s
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'bg-card border-border text-muted-foreground hover:border-primary/40'
                }`}>
                {s === 'all' ? 'All' : STATUS_CONFIG[s]?.label || s}
              </button>
            ))}
          </div>
        </div>

        {/* Orders list */}
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <Package className="w-16 h-16 text-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">No orders found</p>
            <Link to={createPageUrl('Marketplace')}>
              <Button className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground">Browse Marketplace</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(order => {
              const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
              const Icon = cfg.icon;
              const isExpanded = expandedOrder === order.id;
              const canCancel = ['pending', 'confirmed'].includes(order.status);
              const canReturn = order.status === 'delivered';
              const canMarkReceived = order.status === 'shipped';

              return (
                <div key={order.id} className={`bg-card border rounded-2xl overflow-hidden transition-all ${isExpanded ? 'border-primary' : 'border-border hover:border-primary/40'}`}>
                  {/* Row header */}
                  <button className="w-full text-left p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}>
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${cfg.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-bold text-foreground">{order.orderNumber || '#' + order.id.slice(-8).toUpperCase()}</span>
                          <Badge className={`text-xs border ${cfg.color}`}>{cfg.label}</Badge>
                        </div>
                        <p className="text-muted-foreground text-sm">
                          {new Date(order.created_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                          {order.items?.length ? ` · ${order.items.length} item${order.items.length !== 1 ? 's' : ''}` : ''}
                          {order.artisanName ? ` · by ${order.artisanName}` : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {order.estimatedDelivery && !['delivered','cancelled','refunded'].includes(order.status) && (
                        <DeliveryCountdown estimatedDelivery={order.estimatedDelivery} status={order.status} />
                      )}
                      <span className="text-primary font-black text-xl">${order.totalAmount?.toLocaleString()}</span>
                      {isExpanded ? <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0" /> : <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />}
                    </div>
                  </button>

                  {/* Expanded */}
                  {isExpanded && (
                    <div className="border-t border-border p-6 space-y-8">
                      <div className="grid md:grid-cols-2 gap-8">
                        {/* Timeline */}
                        <div>
                          <h4 className="text-xs text-primary uppercase tracking-wider font-bold mb-5">Order Timeline</h4>
                          <OrderTimeline order={order} />
                        </div>

                        {/* Details */}
                        <div className="space-y-5">
                          {/* Items */}
                          {order.items?.length > 0 && (
                            <div>
                              <h4 className="text-xs text-primary uppercase tracking-wider font-bold mb-3">Items</h4>
                              <div className="space-y-2">
                                {order.items.map((item, i) => (
                                  <div key={i} className="flex items-center gap-3 bg-muted rounded-xl p-3">
                                    {item.imageUrl && <img src={item.imageUrl} alt={item.serviceName} className="w-12 h-12 rounded-lg object-cover" />}
                                    <div className="flex-1 min-w-0">
                                      <p className="font-semibold text-foreground text-sm truncate">{item.serviceName}</p>
                                      <p className="text-muted-foreground text-xs">Qty {item.quantity} · ${item.unitPrice}</p>
                                    </div>
                                    <p className="font-bold text-primary text-sm shrink-0">${(item.quantity * item.unitPrice).toFixed(2)}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Shipment Tracker */}
                          {order.trackingNumber && (
                            <div>
                              <h4 className="text-xs text-primary uppercase tracking-wider font-bold mb-3">Live Shipment Tracking</h4>
                              <ShipmentTracker order={order} />
                            </div>
                          )}

                          {/* Address */}
                          {order.shippingAddress?.name && (
                            <div>
                              <h4 className="text-xs text-primary uppercase tracking-wider font-bold mb-2">Delivery Address</h4>
                              <p className="text-muted-foreground text-sm bg-muted rounded-xl p-3 flex gap-2">
                                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                <span>
                                  {order.shippingAddress.name}, {order.shippingAddress.addressLine1},&nbsp;
                                  {order.shippingAddress.city}, {order.shippingAddress.country}
                                </span>
                              </p>
                            </div>
                          )}

                          {/* Notes */}
                          {order.notes && (
                            <div className="bg-muted rounded-xl p-3">
                              <p className="text-xs text-primary font-bold uppercase tracking-wider mb-1">Notes</p>
                              <p className="text-muted-foreground text-sm">{order.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-3 pt-2 border-t border-border">
                        <Button onClick={() => handleReorder(order)} size="sm"
                          className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                          <RefreshCw className="w-3 h-3" /> Reorder
                        </Button>
                        {canMarkReceived && (
                          <Button size="sm" onClick={() => setReceivedDialog(order)}
                            className="bg-green-700 hover:bg-green-600 text-foreground gap-2">
                            <ShieldCheck className="w-3 h-3" /> Mark as Received
                          </Button>
                        )}
                        {canCancel && (
                          <Button variant="outline" size="sm" onClick={() => cancelMutation.mutate(order.id)}
                            className="border-red-700 text-red-400 hover:bg-red-900/30 gap-2">
                            <XCircle className="w-3 h-3" /> Cancel Order
                          </Button>
                        )}
                        {canReturn && (
                          <Button variant="outline" size="sm" onClick={() => setReturnDialog(order)}
                            className="border-border text-muted-foreground hover:border-primary/40 gap-2">
                            <RotateCcw className="w-3 h-3" /> Return / Exchange
                          </Button>
                        )}
                        {order.status === 'delivered' && (
                          <Link to={createPageUrl('Marketplace')}>
                            <Button variant="outline" size="sm"
                              className="border-primary text-primary hover:bg-primary/10 gap-2">
                              <Star className="w-3 h-3" /> Leave a Review
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Mark Received Dialog */}
      <Dialog open={!!receivedDialog} onOpenChange={() => setReceivedDialog(null)}>
        <DialogContent className="bg-card border-border text-foreground">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              <PartyPopper className="w-5 h-5 text-primary" />
              Confirm Package Received
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm">
              By confirming, you're letting your artisan know their work arrived safely.
              They'll receive a notification celebrating the delivery!
            </p>
            <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 flex items-center gap-3">
              <Bell className="w-5 h-5 text-primary shrink-0" />
              <p className="text-muted-foreground text-sm">
                <span className="text-primary font-semibold">{receivedDialog?.artisanName || 'The artisan'}</span> will be automatically pinged.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setReceivedDialog(null)} className="flex-1 border-border text-muted-foreground">Not Yet</Button>
              <Button onClick={() => markReceivedMutation.mutate(receivedDialog)}
                disabled={markReceivedMutation.isPending}
                className="flex-1 bg-green-700 hover:bg-green-600 text-foreground gap-2">
                {markReceivedMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                Yes, I Received It!
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Return Dialog */}
      <Dialog open={!!returnDialog} onOpenChange={() => setReturnDialog(null)}>
        <DialogContent className="bg-card border-border text-foreground">
          <DialogHeader>
            <DialogTitle className="text-foreground">Return / Exchange Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm">Order: <span className="text-foreground font-semibold">{returnDialog?.orderNumber}</span></p>
            <div>
              <label className="text-xs text-primary uppercase tracking-wider mb-1 block">Reason for Return</label>
              <Textarea value={returnReason} onChange={e => setReturnReason(e.target.value)} rows={4}
                placeholder="Please describe your reason..."
                className="bg-muted border-border text-foreground placeholder:text-muted-foreground resize-none" />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setReturnDialog(null)} className="flex-1 border-border text-muted-foreground">Cancel</Button>
              <Button onClick={() => returnMutation.mutate({ id: returnDialog.id, reason: returnReason })}
                disabled={!returnReason || returnMutation.isPending}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                {returnMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Submit Request
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
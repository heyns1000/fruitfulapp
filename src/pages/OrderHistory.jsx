import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Package, Search, RefreshCw, RotateCcw, ChevronDown, ChevronUp, Truck, CheckCircle2, Clock, AlertCircle, XCircle, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';
import { useCart } from '../components/cart/CartContext';

const STATUS_CONFIG = {
  pending: { color: 'bg-yellow-900/40 text-yellow-300 border-yellow-700', icon: <Clock className="w-3 h-3" />, label: 'Pending' },
  confirmed: { color: 'bg-blue-900/40 text-blue-300 border-blue-700', icon: <CheckCircle2 className="w-3 h-3" />, label: 'Confirmed' },
  processing: { color: 'bg-purple-900/40 text-purple-300 border-purple-700', icon: <AlertCircle className="w-3 h-3" />, label: 'Processing' },
  shipped: { color: 'bg-cyan-900/40 text-cyan-300 border-cyan-700', icon: <Truck className="w-3 h-3" />, label: 'Shipped' },
  delivered: { color: 'bg-green-900/40 text-green-300 border-green-700', icon: <CheckCircle2 className="w-3 h-3" />, label: 'Delivered' },
  cancelled: { color: 'bg-red-900/40 text-red-300 border-red-700', icon: <XCircle className="w-3 h-3" />, label: 'Cancelled' },
  refunded: { color: 'bg-muted text-muted-foreground border-border', icon: <RotateCcw className="w-3 h-3" />, label: 'Refunded' },
};

export default function OrderHistory() {
  const qc = useQueryClient();
  const { addToCart } = useCart();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [returnDialog, setReturnDialog] = useState(null);
  const [returnReason, setReturnReason] = useState('');

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['order-history'],
    queryFn: () => base44.entities.Order.list('-created_date', 100)
  });

  const cancelMutation = useMutation({
    mutationFn: (id) => base44.entities.Order.update(id, { status: 'cancelled' }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['order-history'] }); toast.success('Order cancelled'); }
  });

  const returnMutation = useMutation({
    mutationFn: (id) => base44.entities.Order.update(id, { status: 'refunded', notes: returnReason }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['order-history'] }); setReturnDialog(null); toast.success('Return/exchange request submitted'); }
  });

  const handleReorder = (order) => {
    order.items?.forEach(item => {
      addToCart({
        id: item.serviceId,
        name: item.serviceName,
        price: item.unitPrice,
        productCode: item.productCode,
        imageUrl: item.imageUrl,
      });
    });
    toast.success('Items added to cart!');
  };

  const filtered = orders.filter(o => {
    const matchSearch = !search || o.orderNumber?.toLowerCase().includes(search.toLowerCase()) || o.buyerEmail?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-gradient-to-r from-card to-card border-b border-border px-6 md:px-10 py-8">
        <div className="max-w-5xl mx-auto">
          <p className="text-primary text-xs font-bold uppercase tracking-widest mb-1">My Account</p>
          <h1 className="text-4xl font-black">Order History</h1>
          <p className="text-muted-foreground mt-1">Track, manage and reorder your past purchases</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-10 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by order number or email..."
              className="pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-44 bg-card border-border text-foreground">
              <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="all" className="text-foreground">All Statuses</SelectItem>
              {Object.keys(STATUS_CONFIG).map(s => (
                <SelectItem key={s} value={s} className="text-foreground capitalize">{STATUS_CONFIG[s].label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Orders', val: orders.length, color: 'text-foreground' },
            { label: 'Delivered', val: orders.filter(o => o.status === 'delivered').length, color: 'text-green-400' },
            { label: 'In Progress', val: orders.filter(o => ['pending','confirmed','processing','shipped'].includes(o.status)).length, color: 'text-primary' },
          ].map(s => (
            <div key={s.label} className="bg-card border border-border rounded-xl p-4 text-center">
              <p className={`text-2xl font-black ${s.color}`}>{s.val}</p>
              <p className="text-muted-foreground text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

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
              const isExpanded = expandedOrder === order.id;
              const canCancel = ['pending', 'confirmed'].includes(order.status);
              const canReturn = order.status === 'delivered';

              return (
                <div key={order.id} className={`bg-card border rounded-2xl overflow-hidden transition-all ${isExpanded ? 'border-primary' : 'border-border hover:border-primary/40'}`}>
                  {/* Order header */}
                  <button
                    className="w-full text-left p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                  >
                    <div className="flex items-start gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-foreground text-lg">{order.orderNumber || `#${order.id.slice(-8).toUpperCase()}`}</span>
                          <Badge className={`text-xs border flex items-center gap-1 ${cfg.color}`}>
                            {cfg.icon} {cfg.label}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm">
                          {new Date(order.created_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                          {order.items?.length ? ` · ${order.items.length} item(s)` : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-primary font-black text-xl">${order.totalAmount?.toLocaleString()}</span>
                      {isExpanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                    </div>
                  </button>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="border-t border-border p-5 space-y-5">
                      {/* Items */}
                      {order.items?.length > 0 && (
                        <div>
                          <h4 className="text-xs text-primary uppercase tracking-wider font-bold mb-3">Items</h4>
                          <div className="space-y-3">
                            {order.items.map((item, i) => (
                              <div key={i} className="flex items-center gap-4 bg-muted rounded-xl p-3">
                                {item.imageUrl && (
                                  <img src={item.imageUrl} alt={item.serviceName} className="w-14 h-14 rounded-lg object-cover" />
                                )}
                                <div className="flex-1">
                                  <p className="font-semibold text-foreground">{item.serviceName}</p>
                                  <p className="text-muted-foreground text-sm">Qty: {item.quantity} · ${item.unitPrice} each</p>
                                </div>
                                <p className="font-bold text-primary">${(item.quantity * item.unitPrice).toFixed(2)}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Shipping */}
                      {order.shippingAddress?.name && (
                        <div>
                          <h4 className="text-xs text-primary uppercase tracking-wider font-bold mb-2">Shipping Address</h4>
                          <p className="text-muted-foreground text-sm">
                            {order.shippingAddress.name}<br />
                            {order.shippingAddress.addressLine1}{order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ''}<br />
                            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />
                            {order.shippingAddress.country}
                          </p>
                        </div>
                      )}

                      {/* Tracking */}
                      {order.paystackReference && (
                        <div>
                          <h4 className="text-xs text-primary uppercase tracking-wider font-bold mb-2">Reference</h4>
                          <code className="text-muted-foreground text-sm bg-muted px-3 py-1 rounded-lg">{order.paystackReference}</code>
                        </div>
                      )}

                      {/* Notes */}
                      {order.notes && (
                        <div className="bg-muted rounded-xl p-3">
                          <p className="text-xs text-primary font-bold uppercase tracking-wider mb-1">Notes</p>
                          <p className="text-muted-foreground text-sm">{order.notes}</p>
                        </div>
                      )}

                      {/* Progress bar */}
                      <div>
                        <h4 className="text-xs text-primary uppercase tracking-wider font-bold mb-3">Order Progress</h4>
                        <div className="flex items-center gap-1">
                          {['pending','confirmed','processing','shipped','delivered'].map((s, i, arr) => {
                            const statuses = ['pending','confirmed','processing','shipped','delivered','cancelled'];
                            const orderIdx = statuses.indexOf(order.status);
                            const stepIdx = statuses.indexOf(s);
                            const done = order.status !== 'cancelled' && orderIdx >= stepIdx;
                            return (
                              <React.Fragment key={s}>
                                <div className={`flex flex-col items-center`}>
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${done ? 'bg-primary border-primary text-primary-foreground' : 'bg-muted border-border text-muted-foreground'}`}>
                                    {i + 1}
                                  </div>
                                  <span className="text-xs text-muted-foreground mt-1 capitalize hidden sm:block">{s}</span>
                                </div>
                                {i < arr.length - 1 && (
                                  <div className={`flex-1 h-0.5 transition-colors ${done && orderIdx > stepIdx ? 'bg-primary' : 'bg-muted'}`} />
                                )}
                              </React.Fragment>
                            );
                          })}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-3 pt-2">
                        <Button onClick={() => handleReorder(order)} size="sm"
                          className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                          <RefreshCw className="w-3 h-3" /> Reorder
                        </Button>
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
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

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
              <textarea
                value={returnReason}
                onChange={e => setReturnReason(e.target.value)}
                rows={4}
                placeholder="Please describe the reason for your return or exchange..."
                className="w-full bg-muted border border-border rounded-lg p-3 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:border-primary"
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setReturnDialog(null)} className="flex-1 border-border text-muted-foreground">Cancel</Button>
              <Button onClick={() => returnMutation.mutate(returnDialog.id)} disabled={!returnReason || returnMutation.isPending}
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
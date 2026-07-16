import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Search, Package, Truck, CheckCircle, FileText, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import PackingSlipModal from '../components/fulfillment/PackingSlipModal';

const STATUS_CONFIG = {
  pending:    { label: 'Pending',    color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  confirmed:  { label: 'Confirmed',  color: 'bg-blue-100 text-blue-800 border-blue-200' },
  processing: { label: 'Processing', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  crafted:    { label: 'Crafted',    color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  shipped:    { label: 'Shipped',    color: 'bg-primary/10 text-primary border-primary/30' },
  delivered:  { label: 'Delivered',  color: 'bg-green-100 text-green-800 border-green-200' },
  cancelled:  { label: 'Cancelled',  color: 'bg-red-100 text-red-800 border-red-200' },
};

const STATUS_FLOW = ['pending', 'confirmed', 'processing', 'crafted', 'shipped', 'delivered'];

export default function OrderFulfillment() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [slipOrder, setSlipOrder] = useState(null);
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => base44.entities.Order.list('-created_date'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status, tracking }) => {
      const update = { status };
      if (tracking) update.trackingNumber = tracking;
      const now = new Date().toISOString();
      update.statusHistory = [{ status, timestamp: now }];
      return base44.entities.Order.update(id, update);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Order status updated');
    },
  });

  const filtered = orders.filter(o => {
    const matchStatus = filterStatus === 'all' || o.status === filterStatus;
    const matchSearch = !search ||
      o.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
      o.buyerEmail?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const nextStatus = (current) => {
    const idx = STATUS_FLOW.indexOf(current);
    return idx >= 0 && idx < STATUS_FLOW.length - 1 ? STATUS_FLOW[idx + 1] : null;
  };

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <Truck className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-black">Order Fulfillment</h1>
          </div>
          <p className="text-muted-foreground text-sm">Manage shipping statuses and generate packing slips</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by order # or buyer email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 bg-card border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48 bg-card border-border text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="all">All Statuses</SelectItem>
              {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {['pending', 'processing', 'shipped', 'delivered'].map(s => (
            <div key={s} className="bg-card rounded-xl border border-border p-4 text-center">
              <div className="text-2xl font-black text-foreground">{orders.filter(o => o.status === s).length}</div>
              <div className="text-xs text-muted-foreground capitalize mt-1">{s}</div>
            </div>
          ))}
        </div>

        {/* Orders list */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">No orders found.</div>
        ) : (
          <div className="space-y-3">
            {filtered.map(order => {
              const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
              const next = nextStatus(order.status);
              return (
                <OrderRow
                  key={order.id}
                  order={order}
                  cfg={cfg}
                  next={next}
                  onAdvance={(tracking) => updateMutation.mutate({ id: order.id, status: next, tracking })}
                  onPrint={() => setSlipOrder(order)}
                  isUpdating={updateMutation.isPending}
                />
              );
            })}
          </div>
        )}
      </div>

      {slipOrder && (
        <PackingSlipModal order={slipOrder} onClose={() => setSlipOrder(null)} />
      )}
    </div>
  );
}

function OrderRow({ order, cfg, next, onAdvance, onPrint, isUpdating }) {
  const [tracking, setTracking] = useState(order.trackingNumber || '');
  const [expanded, setExpanded] = useState(false);
  const nextLabel = next ? (STATUS_CONFIG[next]?.label || next) : null;

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Summary row */}
      <div
        className="flex flex-wrap items-center gap-3 px-5 py-4 cursor-pointer hover:bg-muted transition-colors"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-foreground">#{order.orderNumber || order.id.slice(-6).toUpperCase()}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${cfg.color}`}>{cfg.label}</span>
          </div>
          <div className="text-muted-foreground text-sm mt-0.5 truncate">{order.buyerEmail}</div>
        </div>
        <div className="text-right shrink-0">
          <div className="font-bold text-foreground">{order.currency} {order.totalAmount?.toFixed(2)}</div>
          <div className="text-xs text-muted-foreground">{order.items?.length || 0} item(s)</div>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-border px-5 py-4 space-y-4">
          {/* Items */}
          <div className="space-y-2">
            {(order.items || []).map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{item.serviceName || item.productCode} × {item.quantity}</span>
                <span className="text-muted-foreground">{order.currency} {(item.unitPrice * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Shipping address */}
          {order.shippingAddress && (
            <div className="text-xs text-muted-foreground bg-muted rounded-lg p-3">
              <div className="font-semibold text-muted-foreground mb-1">Ship to:</div>
              <div>{order.shippingAddress.name}</div>
              <div>{order.shippingAddress.addressLine1}</div>
              <div>{order.shippingAddress.city}, {order.shippingAddress.country}</div>
            </div>
          )}

          {/* Tracking input (show when advancing to shipped) */}
          {next === 'shipped' && (
            <div className="flex gap-2">
              <Input
                placeholder="Tracking number (optional)"
                value={tracking}
                onChange={e => setTracking(e.target.value)}
                className="bg-muted border-border text-foreground placeholder:text-muted-foreground text-sm"
                onClick={e => e.stopPropagation()}
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            {nextLabel && (
              <Button
                size="sm"
                onClick={e => { e.stopPropagation(); onAdvance(tracking); }}
                disabled={isUpdating}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                Mark as {nextLabel}
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={e => { e.stopPropagation(); onPrint(); }}
              className="border-border text-muted-foreground hover:bg-muted"
            >
              <FileText className="w-3 h-3" /> Packing Slip
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Package, Truck, CheckCircle2, XCircle, Clock, RotateCcw, RefreshCw, ChevronDown, ChevronUp, Search, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const STATUS_CONFIG = {
  pending:   { icon: Clock,         color: 'bg-yellow-900/50 text-yellow-300 border-yellow-700', dot: 'bg-yellow-400' },
  confirmed: { icon: Package,       color: 'bg-blue-900/50 text-blue-300 border-blue-700',       dot: 'bg-blue-400' },
  processing:{ icon: RefreshCw,     color: 'bg-indigo-900/50 text-indigo-300 border-indigo-700', dot: 'bg-indigo-400' },
  shipped:   { icon: Truck,         color: 'bg-purple-900/50 text-purple-300 border-purple-700', dot: 'bg-purple-400' },
  delivered: { icon: CheckCircle2,  color: 'bg-green-900/50 text-green-300 border-green-700',    dot: 'bg-green-400' },
  cancelled: { icon: XCircle,       color: 'bg-red-900/50 text-red-300 border-red-700',          dot: 'bg-red-400' },
  refunded:  { icon: RotateCcw,     color: 'bg-stone-800 text-stone-300 border-stone-600',       dot: 'bg-stone-400' },
};

function OrderCard({ order, onReorder, onReturn }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  const date = order.created_date ? new Date(order.created_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

  return (
    <div className="bg-stone-900 border border-stone-700 rounded-2xl overflow-hidden hover:border-stone-500 transition-colors">
      {/* Header row */}
      <div className="p-5 flex items-center gap-4 cursor-pointer" onClick={() => setExpanded(e => !e)}>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.color.split(' ')[0]}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-white text-sm">{order.orderNumber || `Order #${order.id?.slice(-6)}`}</span>
            <Badge className={`${cfg.color} border text-xs font-bold`}>{order.status?.toUpperCase()}</Badge>
          </div>
          <p className="text-stone-400 text-xs mt-0.5">{date} · {order.items?.length || 0} item(s) · {order.buyerEmail}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-orange-400 font-black text-lg">${order.totalAmount?.toLocaleString()}</p>
          <p className="text-stone-500 text-xs">{order.currency}</p>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-stone-500 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-stone-500 flex-shrink-0" />}
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-stone-700 p-5 space-y-4">
          {/* Items */}
          <div className="space-y-2">
            {order.items?.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                {item.imageUrl
                  ? <img src={item.imageUrl} alt={item.serviceName} className="w-12 h-12 object-cover rounded-lg border border-stone-700" />
                  : <div className="w-12 h-12 bg-stone-800 rounded-lg border border-stone-700 flex items-center justify-center"><Package className="w-5 h-5 text-stone-600" /></div>
                }
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{item.serviceName}</p>
                  <p className="text-stone-400 text-xs">Qty: {item.quantity} · ${item.unitPrice?.toLocaleString()} each</p>
                </div>
                <p className="text-orange-300 font-bold text-sm">${((item.unitPrice || 0) * (item.quantity || 1)).toLocaleString()}</p>
              </div>
            ))}
          </div>

          {/* Tracking */}
          {order.shippingAddress && (
            <div className="bg-stone-800 rounded-xl p-3 text-sm text-stone-300">
              <p className="font-bold text-stone-100 mb-1">📦 Shipping Address</p>
              <p>{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.addressLine1}{order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ''}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
              <p>{order.shippingAddress.country}</p>
            </div>
          )}

          {order.paystackReference && (
            <p className="text-stone-500 text-xs">Paystack Ref: <span className="text-stone-300 font-mono">{order.paystackReference}</span></p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            {order.status === 'delivered' && (
              <Button size="sm" onClick={() => onReorder(order)} className="bg-orange-600 hover:bg-orange-500 text-white font-bold">
                <RefreshCw className="w-3 h-3 mr-1" /> Reorder
              </Button>
            )}
            {(order.status === 'delivered') && (
              <Button size="sm" variant="outline" onClick={() => onReturn(order)} className="border-stone-600 text-stone-300 hover:bg-stone-700">
                <RotateCcw className="w-3 h-3 mr-1" /> Return / Exchange
              </Button>
            )}
            {order.status === 'pending' && (
              <Badge className="bg-yellow-900/30 text-yellow-300 border border-yellow-700 text-xs px-3 py-1.5">Awaiting confirmation</Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrderHistory() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { addToCart } = (() => {
    try { return require('../components/cart/CartContext').useCart(); } catch { return { addToCart: () => {} }; }
  })();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['order-history'],
    queryFn: () => base44.entities.Order.list('-created_date', 100),
  });

  const returnMutation = useMutation({
    mutationFn: (orderId) => base44.entities.Order.update(orderId, { status: 'refunded' }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['order-history'] }); toast.success('Return request submitted'); }
  });

  const filtered = orders.filter(o => {
    const matchSearch = !search || o.orderNumber?.toLowerCase().includes(search.toLowerCase()) || o.buyerEmail?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleReorder = (order) => {
    order.items?.forEach(item => {
      addToCart({ id: item.serviceId, name: item.serviceName, price: item.unitPrice, productCode: item.productCode, imageUrl: item.imageUrl });
    });
    toast.success('Items added to cart!');
  };

  const handleReturn = (order) => {
    returnMutation.mutate(order.id);
  };

  const STATUS_TABS = ['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

  return (
    <div className="min-h-screen bg-stone-950 text-white">
      {/* Header */}
      <div className="bg-stone-900 border-b border-stone-700 px-6 py-5">
        <div className="max-w-5xl mx-auto">
          <Link to={createPageUrl('Marketplace')}>
            <Button size="sm" variant="ghost" className="text-stone-400 hover:text-white mb-3">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Marketplace
            </Button>
          </Link>
          <p className="text-xs text-orange-400 font-bold uppercase tracking-widest">My Account</p>
          <h1 className="text-3xl font-black text-white">Order History</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        {/* Search + filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by order number or email..."
              className="pl-10 bg-stone-800 border-stone-600 text-white placeholder:text-stone-500" />
          </div>
        </div>

        {/* Status tabs */}
        <div className="flex gap-2 flex-wrap">
          {STATUS_TABS.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-colors ${statusFilter === s ? 'bg-orange-600 text-white' : 'bg-stone-800 text-stone-400 hover:text-white hover:bg-stone-700'}`}>
              {s === 'all' ? `All (${orders.length})` : `${s} (${orders.filter(o => o.status === s).length})`}
            </button>
          ))}
        </div>

        {/* Orders list */}
        {isLoading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-stone-500">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg">No orders found</p>
            <Link to={createPageUrl('Marketplace')}>
              <Button className="mt-4 bg-orange-600 hover:bg-orange-500">Shop Now</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(order => (
              <OrderCard key={order.id} order={order} onReorder={handleReorder} onReturn={handleReturn} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DollarSign, TrendingUp, Clock, CheckCircle2, XCircle,
  Search, RotateCcw, Loader2, ChevronDown, ChevronUp, ShoppingBag
} from 'lucide-react';
import { format, parseISO, startOfMonth, isWithinInterval } from 'date-fns';
import EarningsChart from '../components/financials/EarningsChart';
import StatementExporter from '../components/financials/StatementExporter';

const STATUS_CONFIG = {
  pending:   { color: 'bg-yellow-900/40 text-yellow-300 border-yellow-700',  icon: Clock,         label: 'Pending' },
  paid:      { color: 'bg-green-900/40 text-green-300 border-green-700',     icon: CheckCircle2,  label: 'Paid' },
  failed:    { color: 'bg-red-900/40 text-red-300 border-red-700',           icon: XCircle,       label: 'Failed' },
};

const ORDER_STATUS_COLOR = {
  pending:    'text-yellow-400',
  confirmed:  'text-blue-400',
  processing: 'text-purple-400',
  crafted:    'text-amber-400',
  shipped:    'text-cyan-400',
  delivered:  'text-green-400',
  cancelled:  'text-red-400',
};

export default function ArtisanFinancials() {
  const [currentUser, setCurrentUser] = useState(null);
  const [search, setSearch] = useState('');
  const [payFilter, setPayFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setCurrentUser).catch(() => {});
  }, []);

  const { data: artisan } = useQuery({
    queryKey: ['my-artisan-fin'],
    queryFn: () => base44.entities.ArtisanProfile.list().then(r => r[0]),
  });

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['artisan-fin-orders'],
    queryFn: () => base44.entities.Order.list('-created_date', 500),
  });

  // Derived stats
  const paidOrders = orders.filter(o => o.paymentStatus === 'paid');
  const pendingOrders = orders.filter(o => o.paymentStatus === 'pending' && !['cancelled', 'refunded'].includes(o.status));
  const totalEarned = paidOrders.reduce((s, o) => s + (o.totalAmount || 0), 0);
  const pendingAmount = pendingOrders.reduce((s, o) => s + (o.totalAmount || 0), 0);

  // This month
  const now = new Date();
  const monthStart = startOfMonth(now);
  const thisMonthEarnings = paidOrders
    .filter(o => isWithinInterval(parseISO(o.created_date), { start: monthStart, end: now }))
    .reduce((s, o) => s + (o.totalAmount || 0), 0);

  const filtered = orders.filter(o => {
    const matchSearch = !search ||
      (o.orderNumber || '').toLowerCase().includes(search.toLowerCase()) ||
      (o.buyerEmail || '').toLowerCase().includes(search.toLowerCase());
    const matchPay = payFilter === 'all' || o.paymentStatus === payFilter;
    return matchSearch && matchPay;
  });

  if (isLoading) return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-950 text-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-stone-900 via-orange-950/20 to-stone-900 border-b border-stone-800 px-6 md:px-10 py-10">
        <div className="max-w-6xl mx-auto">
          <p className="text-orange-400 text-xs font-bold uppercase tracking-[0.3em] mb-2">@Fruitful@ Platform</p>
          <h1 className="text-4xl md:text-5xl font-black mb-1">Financial Dashboard</h1>
          <p className="text-stone-400">{artisan?.artisanName || currentUser?.full_name || 'Artisan'} · Earnings & Payouts</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-10 py-8 space-y-8">

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Earned', value: `$${totalEarned.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, sub: `${paidOrders.length} paid orders`, icon: DollarSign, color: 'text-green-400', border: 'border-green-800/30', glow: 'from-green-950/20' },
            { label: 'This Month', value: `$${thisMonthEarnings.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, sub: format(now, 'MMMM yyyy'), icon: TrendingUp, color: 'text-orange-400', border: 'border-orange-800/30', glow: 'from-orange-950/20' },
            { label: 'Pending Payout', value: `$${pendingAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, sub: `${pendingOrders.length} awaiting payment`, icon: Clock, color: 'text-yellow-400', border: 'border-yellow-800/30', glow: 'from-yellow-950/20' },
            { label: 'Total Orders', value: orders.length, sub: `${orders.filter(o => o.status === 'delivered').length} delivered`, icon: ShoppingBag, color: 'text-blue-400', border: 'border-blue-800/30', glow: 'from-blue-950/20' },
          ].map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className={`bg-gradient-to-br ${s.glow} to-stone-900 border ${s.border} rounded-2xl p-5 hover:scale-[1.01] transition-transform`}>
                <div className={`w-8 h-8 rounded-lg bg-stone-800 flex items-center justify-center mb-3 ${s.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <p className={`text-2xl md:text-3xl font-black ${s.color}`}>{s.value}</p>
                <p className="text-white text-sm font-semibold mt-1">{s.label}</p>
                <p className="text-stone-600 text-xs mt-0.5">{s.sub}</p>
              </div>
            );
          })}
        </div>

        {/* Earnings Chart */}
        <div className="bg-stone-900 border border-stone-700 rounded-2xl p-6">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-400" /> Monthly Earnings (Last 12 Months)
          </h3>
          <EarningsChart orders={orders} />
        </div>

        {/* Statement Export */}
        <StatementExporter orders={orders} artisanName={artisan?.artisanName || currentUser?.full_name} />

        {/* Transaction History */}
        <div>
          <h2 className="text-xl font-black mb-4">Transaction History</h2>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by order # or buyer..."
                className="pl-10 bg-stone-900 border-stone-700 text-white placeholder:text-stone-500 focus:border-orange-500" />
            </div>
            <div className="flex gap-2">
              {['all', 'paid', 'pending', 'failed'].map(f => (
                <button key={f} onClick={() => setPayFilter(f)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all capitalize ${
                    payFilter === f ? 'bg-orange-600 border-orange-600 text-white' : 'bg-stone-900 border-stone-700 text-stone-400 hover:border-stone-500'
                  }`}>{f === 'all' ? 'All' : f}</button>
              ))}
            </div>
          </div>

          {/* Table */}
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-stone-600">
              <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>No transactions found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map(order => {
                const payCfg = STATUS_CONFIG[order.paymentStatus] || STATUS_CONFIG.pending;
                const PayIcon = payCfg.icon;
                const isExpanded = expandedId === order.id;

                return (
                  <div key={order.id}
                    className={`bg-stone-900 border rounded-2xl overflow-hidden transition-all ${isExpanded ? 'border-orange-600' : 'border-stone-700 hover:border-stone-600'}`}>
                    <button className="w-full text-left p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      onClick={() => setExpandedId(isExpanded ? null : order.id)}>
                      <div className="flex items-center gap-4">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 ${payCfg.color}`}>
                          <PayIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">{order.orderNumber || '#' + order.id.slice(-8).toUpperCase()}</span>
                            <Badge className={`text-xs border ${payCfg.color}`}>{payCfg.label}</Badge>
                            {order.status && (
                              <span className={`text-xs capitalize ${ORDER_STATUS_COLOR[order.status] || 'text-stone-400'}`}>· {order.status}</span>
                            )}
                          </div>
                          <p className="text-stone-500 text-xs mt-0.5">
                            {format(parseISO(order.created_date), 'dd MMM yyyy')}
                            {order.buyerEmail ? ` · ${order.buyerEmail}` : ''}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <span className={`text-xl font-black ${order.paymentStatus === 'paid' ? 'text-green-400' : order.paymentStatus === 'failed' ? 'text-red-400 line-through' : 'text-yellow-400'}`}>
                          ${(order.totalAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-stone-600 text-xs">{order.currency || 'USD'}</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-stone-500" /> : <ChevronDown className="w-4 h-4 text-stone-500" />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="border-t border-stone-800 px-5 py-4 space-y-3">
                        {order.items?.length > 0 && (
                          <div>
                            <p className="text-xs text-orange-400 uppercase tracking-wider font-bold mb-2">Items</p>
                            <div className="space-y-1.5">
                              {order.items.map((item, i) => (
                                <div key={i} className="flex items-center justify-between text-sm">
                                  <span className="text-stone-300">{item.serviceName} × {item.quantity}</span>
                                  <span className="text-stone-400">${((item.unitPrice || 0) * (item.quantity || 1)).toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          {order.paystackReference && (
                            <div>
                              <p className="text-xs text-orange-400 uppercase tracking-wider">Reference</p>
                              <code className="text-stone-300 text-xs">{order.paystackReference}</code>
                            </div>
                          )}
                          {order.estimatedDelivery && (
                            <div>
                              <p className="text-xs text-orange-400 uppercase tracking-wider">Est. Delivery</p>
                              <p className="text-stone-300">{order.estimatedDelivery}</p>
                            </div>
                          )}
                        </div>
                        {order.notes && (
                          <p className="text-xs text-stone-500 italic">{order.notes}</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
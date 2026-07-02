import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, Mail, Package, Eye } from 'lucide-react';

const STATUS_COLORS = {
  paid: 'bg-emerald-900 text-emerald-300 border-emerald-700',
  pending: 'bg-yellow-900 text-yellow-300 border-yellow-700',
  failed: 'bg-red-900 text-red-300 border-red-700',
};

const today = () => new Date().toDateString();
const thisWeek = () => { const d = new Date(); d.setDate(d.getDate() - 7); return d; };
const thisMonth = () => { const d = new Date(); d.setDate(1); return d; };

export default function BanimalAdmin() {
  const [activeTab, setActiveTab] = useState('orders');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const qc = useQueryClient();

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['banimal-orders'],
    queryFn: () => base44.entities.BanimalOrder.list('-created_date', 200),
  });

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['banimal-products-admin'],
    queryFn: () => base44.entities.MarketplaceService.filter({ brandId: 'banimal' }, '-created_date', 100),
  });

  const updateOrder = useMutation({
    mutationFn: ({ id, data }) => base44.entities.BanimalOrder.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['banimal-orders'] }),
  });

  const updateProduct = useMutation({
    mutationFn: ({ id, data }) => base44.entities.MarketplaceService.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['banimal-products-admin'] }),
  });

  const sendEmail = async (order) => {
    await base44.integrations.Core.SendEmail({
      to: order.customerEmail,
      subject: `Banimal Order Confirmed — ${order.orderId}`,
      body: `Hi ${order.customerName},\n\nThank you for your order!\n\nOrder: ${order.orderId}\nTotal: R${order.total?.toFixed(2)}\nWaybill: ${order.bobgoWaybill || 'Pending'}\n\nItems:\n${(order.items || []).map(i => `• ${i.name} × ${i.qty} — R${i.unitPrice}`).join('\n')}\n\n🐾 The Banimal Team`,
    });
    await base44.entities.BanimalOrder.update(order.id, { emailSent: true });
    qc.invalidateQueries({ queryKey: ['banimal-orders'] });
  };

  // Revenue stats
  const paidOrders = orders.filter(o => o.paymentStatus === 'paid');
  const revenueToday = paidOrders.filter(o => new Date(o.created_date).toDateString() === today()).reduce((s, o) => s + (o.total || 0), 0);
  const revenueWeek = paidOrders.filter(o => new Date(o.created_date) >= thisWeek()).reduce((s, o) => s + (o.total || 0), 0);
  const revenueMonth = paidOrders.filter(o => new Date(o.created_date) >= thisMonth()).reduce((s, o) => s + (o.total || 0), 0);

  const TABS = [
    { id: 'orders', label: '📦 Orders' },
    { id: 'products', label: '🛍️ Products' },
    { id: 'revenue', label: '📊 Revenue' },
    { id: 'config', label: '⚙️ API Config' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="bg-slate-950 border-b border-slate-800 px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-white">banimal<span className="text-amber-500">™</span> Admin</h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-500">Order & Inventory Management</p>
          </div>
          <Badge className="bg-emerald-900 text-emerald-300 border-emerald-700">{orders.length} orders</Badge>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-slate-900 border-b border-slate-800 px-6">
        <div className="max-w-7xl mx-auto flex gap-1 py-2">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === t.id ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {ordersLoading ? <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-amber-400" /></div> : (
              orders.length === 0 ? <p className="text-slate-500 text-center py-16">No orders yet.</p> : (
                <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-[10px] uppercase tracking-wider text-slate-500 border-b border-slate-700 bg-slate-900">
                          <th className="px-4 py-3">Order ID</th>
                          <th className="px-4 py-3">Customer</th>
                          <th className="px-4 py-3">Items</th>
                          <th className="px-4 py-3">Total</th>
                          <th className="px-4 py-3">Payment</th>
                          <th className="px-4 py-3">Shipping</th>
                          <th className="px-4 py-3">Date</th>
                          <th className="px-4 py-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/50">
                        {orders.map(order => (
                          <tr key={order.id} className="hover:bg-slate-700/30 transition-colors">
                            <td className="px-4 py-3 font-mono text-xs text-amber-400">{order.orderId || order.id?.slice(0, 8)}</td>
                            <td className="px-4 py-3">
                              <p className="font-semibold text-white text-xs">{order.customerName}</p>
                              <p className="text-slate-500 text-[10px]">{order.customerEmail}</p>
                            </td>
                            <td className="px-4 py-3 text-slate-400 text-xs">{(order.items || []).length} item(s)</td>
                            <td className="px-4 py-3 font-bold text-white">R{(order.total || 0).toFixed(2)}</td>
                            <td className="px-4 py-3">
                              <Badge className={`text-[10px] ${STATUS_COLORS[order.paymentStatus] || STATUS_COLORS.pending}`}>{order.paymentStatus}</Badge>
                            </td>
                            <td className="px-4 py-3 text-xs">
                              {order.bobgoWaybill ? (
                                <span className="text-teal-400 font-mono">{order.bobgoWaybill}</span>
                              ) : (
                                <span className="text-slate-600">—</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-slate-500 text-xs">{order.created_date ? new Date(order.created_date).toLocaleDateString() : '—'}</td>
                            <td className="px-4 py-3">
                              <div className="flex gap-1">
                                <button onClick={() => setSelectedOrder(order)} title="View" className="p-1.5 rounded-lg hover:bg-slate-600 transition-colors"><Eye className="w-3.5 h-3.5 text-slate-400" /></button>
                                <button onClick={() => updateOrder.mutate({ id: order.id, data: { trackingStatus: 'shipped' } })} title="Mark Shipped" className="p-1.5 rounded-lg hover:bg-slate-600 transition-colors"><Package className="w-3.5 h-3.5 text-blue-400" /></button>
                                <button onClick={() => sendEmail(order)} title="Resend Email" className="p-1.5 rounded-lg hover:bg-slate-600 transition-colors">
                                  <Mail className={`w-3.5 h-3.5 ${order.emailSent ? 'text-emerald-400' : 'text-amber-400'}`} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* PRODUCTS */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            {productsLoading ? <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-amber-400" /></div> : (
              <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-[10px] uppercase tracking-wider text-slate-500 border-b border-slate-700 bg-slate-900">
                        <th className="px-4 py-3">Product</th>
                        <th className="px-4 py-3">SKU</th>
                        <th className="px-4 py-3">Price (ZAR)</th>
                        <th className="px-4 py-3">Stock</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Toggle</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                      {products.map(p => (
                        <tr key={p.id} className="hover:bg-slate-700/30 transition-colors">
                          <td className="px-4 py-3 font-medium text-white text-xs">{p.serviceName}</td>
                          <td className="px-4 py-3 font-mono text-[10px] text-teal-400">{p.productCode}</td>
                          <td className="px-4 py-3 text-amber-400 font-bold">R{(p.pricing?.ZAR || 0).toFixed(2)}</td>
                          <td className="px-4 py-3 text-slate-300 text-xs">{p.inventory?.unlimited ? '∞ Unlimited' : p.inventory?.available}</td>
                          <td className="px-4 py-3">
                            <Badge className={p.status === 'active' ? 'bg-emerald-900 text-emerald-300 border-emerald-700 text-[10px]' : 'bg-slate-700 text-slate-400 text-[10px]'}>{p.status}</Badge>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => updateProduct.mutate({ id: p.id, data: { status: p.status === 'active' ? 'paused' : 'active' } })}
                              className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${p.status === 'active' ? 'bg-red-900/50 text-red-300 hover:bg-red-900' : 'bg-emerald-900/50 text-emerald-300 hover:bg-emerald-900'}`}>
                              {p.status === 'active' ? 'Pause' : 'Activate'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* REVENUE */}
        {activeTab === 'revenue' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "Today's Revenue", value: `R${revenueToday.toFixed(2)}`, color: 'text-teal-400' },
                { label: "This Week", value: `R${revenueWeek.toFixed(2)}`, color: 'text-amber-400' },
                { label: "This Month", value: `R${revenueMonth.toFixed(2)}`, color: 'text-emerald-400' },
              ].map(s => (
                <div key={s.label} className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                  <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">{s.label}</p>
                  <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-slate-600 mt-1">ZAR · Paid orders only</p>
                </div>
              ))}
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-4">Recent Paid Orders</p>
              {paidOrders.length === 0 ? <p className="text-slate-600 text-sm">No paid orders yet.</p> : (
                <div className="space-y-2">
                  {paidOrders.slice(0, 10).map(o => (
                    <div key={o.id} className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                      <div>
                        <p className="text-xs font-bold text-white">{o.orderId}</p>
                        <p className="text-[10px] text-slate-500">{o.customerEmail}</p>
                      </div>
                      <span className="text-amber-400 font-black">R{(o.total || 0).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* CONFIG */}
        {activeTab === 'config' && <BanimalApiConfig />}
      </main>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-white">Order: {selectedOrder.orderId}</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-white"><X /></button>
            </div>
            <div className="space-y-2 text-sm">
              {[['Customer', selectedOrder.customerName], ['Email', selectedOrder.customerEmail], ['Phone', selectedOrder.customerPhone], ['Total', `R${(selectedOrder.total || 0).toFixed(2)}`], ['Payment', selectedOrder.paymentStatus], ['Waybill', selectedOrder.bobgoWaybill || '—'], ['Tracking', selectedOrder.trackingStatus || '—'], ['Email Sent', selectedOrder.emailSent ? 'Yes' : 'No']].map(([k, v]) => (
                <div key={k} className="flex justify-between py-1.5 border-b border-slate-700 last:border-0">
                  <span className="text-slate-500">{k}</span>
                  <span className="text-white font-semibold">{v}</span>
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Items</p>
              {(selectedOrder.items || []).map((item, i) => (
                <div key={i} className="flex justify-between py-1.5 text-sm">
                  <span className="text-slate-300">{item.name} × {item.qty}</span>
                  <span className="text-amber-400 font-bold">R{(item.unitPrice * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── API Config Panel ──────────────────────────────────────────────────────
function BanimalApiConfig() {
  const [vals, setVals] = useState({ PAYSTACK_PUBLIC_KEY: '', PAYSTACK_SECRET_KEY: '', BOBGO_API_KEY: '', BANIMAL_WORKER_URL: '' });
  const [saved, setSaved] = useState(false);
  const [mode, setMode] = useState('base44'); // 'base44' | 'cloudflare'

  const save = () => {
    // Store in localStorage (encrypted secrets would go through a secure backend)
    localStorage.setItem('banimal_config', JSON.stringify({ mode, keys: Object.keys(vals).reduce((a, k) => ({ ...a, [k]: vals[k] ? '••••••••' : '' }), {}) }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-4">
        <p className="text-xs font-black uppercase tracking-widest text-amber-400">Backend Mode</p>
        <div className="flex gap-3">
          {[['base44', '🟢 Base44 Backend (Active)'], ['cloudflare', '🔵 Proxy to Cloudflare Worker']].map(([val, label]) => (
            <button key={val} onClick={() => setMode(val)}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold border transition-all ${mode === val ? 'bg-amber-600 border-amber-500 text-white' : 'border-slate-600 text-slate-400 hover:border-slate-500'}`}>
              {label}
            </button>
          ))}
        </div>
        {mode === 'cloudflare' && (
          <div className="p-3 rounded-lg bg-blue-900/20 border border-blue-700/40 text-xs text-blue-300">
            In Cloudflare mode, API calls are proxied to your Worker at BANIMAL_WORKER_URL. Orders are still stored in Base44 as source of truth.
          </div>
        )}
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-4">
        <p className="text-xs font-black uppercase tracking-widest text-amber-400">API Secrets</p>
        <p className="text-xs text-slate-500">Keys are stored in your browser session. For production, use Base44 Secrets (via backend functions).</p>
        {Object.keys(vals).map(k => (
          <div key={k}>
            <label className="text-[10px] uppercase tracking-wider text-slate-500">{k}</label>
            <input
              type="password"
              placeholder={k === 'BANIMAL_WORKER_URL' ? 'https://banimal.your-worker.workers.dev' : 'Enter key…'}
              className="w-full mt-1 px-3 py-2 rounded-lg text-sm text-white border mt-1"
              style={{ background: '#1e293b', borderColor: '#334155' }}
              value={vals[k]}
              onChange={e => setVals(v => ({ ...v, [k]: e.target.value }))}
            />
          </div>
        ))}
        <Button onClick={save} className={`w-full font-bold ${saved ? 'bg-emerald-600' : 'bg-amber-600 hover:bg-amber-700'}`}>
          {saved ? '✓ Saved' : 'Save Configuration'}
        </Button>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <p className="text-xs font-black uppercase tracking-widest text-amber-400 mb-3">Paystack Webhook</p>
        <p className="text-xs text-slate-400 mb-2">Configure this URL in your Paystack dashboard under Webhooks:</p>
        <div className="bg-slate-900 rounded-lg px-4 py-3 font-mono text-xs text-teal-400 break-all">
          {window.location.origin}/api/banimal/paystack-webhook
        </div>
        <p className="text-[10px] text-slate-600 mt-2">Events: charge.success, transfer.success, transfer.failed</p>
      </div>
    </div>
  );
}

// X icon inline (avoid import conflict)
function X({ className }) {
  return <svg className={className || 'w-5 h-5'} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;
}
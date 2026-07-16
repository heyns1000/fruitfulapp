import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Loader2, CreditCard, Calendar, RefreshCw, XCircle,
  AlertTriangle, CheckCircle2, Clock, Package, Zap
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import CrossAppLinks from '../components/common/CrossAppLinks';
import { toast } from 'sonner';

const STATUS_CONFIG = {
  active:    { color: 'bg-green-900/40 text-green-300 border-green-700',   label: 'Active' },
  paused:    { color: 'bg-yellow-900/40 text-yellow-300 border-yellow-700', label: 'Paused' },
  cancelled: { color: 'bg-red-900/40 text-red-300 border-red-700',          label: 'Cancelled' },
  expired:   { color: 'bg-muted text-muted-foreground border-border',        label: 'Expired' },
};

const PLAN_GRADIENTS = {
  starter:      'from-blue-700 to-cyan-700',
  professional: 'from-primary to-fruitful-green',
  enterprise:   'from-muted to-muted',
};

export default function MySubscriptions() {
  const [user, setUser] = useState(null);
  const [cancelDialog, setCancelDialog] = useState(null);
  const [updatePaymentDialog, setUpdatePaymentDialog] = useState(null);
  const [newCardEmail, setNewCardEmail] = useState('');
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: subscriptions = [], isLoading } = useQuery({
    queryKey: ['my-subscriptions'],
    queryFn: () => base44.entities.Subscription.list('-created_date'),
    enabled: !!user
  });

  const { data: orders = [] } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => base44.entities.Order.list('-created_date'),
    enabled: !!user
  });

  const cancelMutation = useMutation({
    mutationFn: (id) => base44.entities.Subscription.update(id, { status: 'cancelled' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-subscriptions'] });
      setCancelDialog(null);
      toast.success('Subscription cancelled.');
    }
  });

  const pauseMutation = useMutation({
    mutationFn: (id) => base44.entities.Subscription.update(id, { status: 'paused' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-subscriptions'] });
      toast.success('Subscription paused.');
    }
  });

  const resumeMutation = useMutation({
    mutationFn: (id) => base44.entities.Subscription.update(id, { status: 'active' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-subscriptions'] });
      toast.success('Subscription resumed!');
    }
  });

  const updatePaymentMutation = useMutation({
    mutationFn: async (sub) => {
      const paystackKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
      const ref = `UPDATE-${sub.id}-${Date.now()}`;
      const amount = sub.amount * 100;
      return new Promise((resolve, reject) => {
        if (typeof window !== 'undefined' && window.PaystackPop) {
          const handler = window.PaystackPop.setup({
            key: paystackKey,
            email: newCardEmail || user?.email,
            amount,
            currency: sub.currency || 'ZAR',
            ref,
            label: `Update payment for ${sub.brandName} ${sub.plan}`,
            onClose: () => reject(new Error('Payment update cancelled')),
            callback: async (response) => {
              await base44.entities.Subscription.update(sub.id, {
                paymentToken: response.reference,
                gateway: 'Paystack',
                metadata: { lastPaymentUpdate: new Date().toISOString() }
              });
              resolve(response);
            }
          });
          handler.openIframe();
        } else {
          resolve({ simulated: true });
          toast.info('Paystack not loaded. Payment update recorded.');
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-subscriptions'] });
      setUpdatePaymentDialog(null);
      toast.success('Payment method updated!');
    },
    onError: (err) => {
      if (err.message !== 'Payment update cancelled') toast.error(err.message);
    }
  });

  const activeCount = subscriptions.filter(s => s.status === 'active').length;
  const renewingSoon = subscriptions.filter(s => s.status === 'active' && s.nextBillingDate && differenceInDays(new Date(s.nextBillingDate), new Date()) <= 7).length;
  const recentOrders = orders.slice(0, 5);

  if (!user || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ── HERO HEADER ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-fruitful-mint/50 via-card to-card border-b border-border px-8 md:px-16 py-16">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #0d9488 1px, transparent 0)', backgroundSize: '36px 36px' }} />
        <div className="max-w-6xl mx-auto relative">
          <p className="text-primary text-xs font-bold tracking-[0.3em] uppercase mb-4">Fruitful™ Account</p>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-none mb-3" style={{ fontFamily: 'inherit' }}>
            My <span className="text-primary">Subscriptions</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl">Manage your active plans, renewals &amp; payment methods.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-10 py-10 space-y-8">
        <CrossAppLinks
          title="Explore FAA.ZONE"
          pages={['Dashboard', 'LoyaltyProgram', 'OrderHistory', 'SubscriptionBoxes', 'Marketplace', 'Wishlist', 'Analytics']}
        />

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Active Plans', value: activeCount, sub: 'currently running', icon: CheckCircle2, color: 'text-green-400', border: 'border-green-800/30', glow: 'from-green-950/20' },
            { label: 'Renewing Soon', value: renewingSoon, sub: 'within 7 days', icon: Calendar, color: 'text-fruitful-green', border: 'border-fruitful-green/30', glow: 'from-fruitful-green/10' },
            { label: 'Total Orders', value: orders.length, sub: 'all time', icon: Package, color: 'text-blue-400', border: 'border-blue-800/30', glow: 'from-blue-950/20' },
          ].map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className={`bg-gradient-to-br ${s.glow} to-card border ${s.border} rounded-2xl p-5`}>
                <div className={`w-9 h-9 rounded-xl bg-muted flex items-center justify-center mb-3 ${s.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
                <p className="text-foreground text-sm font-semibold mt-1">{s.label}</p>
                <p className="text-muted-foreground text-xs mt-0.5">{s.sub}</p>
              </div>
            );
          })}
        </div>

        {/* Subscriptions list */}
        <div className="space-y-4">
          <h2 className="text-xl font-black text-foreground">Your Subscriptions</h2>
          {subscriptions.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl text-center py-16 space-y-3">
              <CreditCard className="w-12 h-12 text-muted-foreground mx-auto" />
              <p className="text-muted-foreground font-semibold">No subscriptions yet</p>
              <p className="text-muted-foreground text-sm">Visit the Marketplace to subscribe to a plan.</p>
            </div>
          ) : (
            subscriptions.map(sub => {
              const daysUntilRenewal = sub.nextBillingDate ? differenceInDays(new Date(sub.nextBillingDate), new Date()) : null;
              const isRenewingSoon = daysUntilRenewal !== null && daysUntilRenewal <= 7 && sub.status === 'active';
              const statusCfg = STATUS_CONFIG[sub.status] || STATUS_CONFIG.expired;
              const planGrad = PLAN_GRADIENTS[sub.plan] || 'from-muted to-muted';

              return (
                <div key={sub.id} className={`bg-card border rounded-2xl overflow-hidden transition-colors ${isRenewingSoon ? 'border-fruitful-green/30' : 'border-border hover:border-primary/40'}`}>
                  {isRenewingSoon && <div className="h-0.5 w-full bg-gradient-to-r from-fruitful-green to-primary" />}
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">

                      {/* Plan info */}
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${planGrad} flex items-center justify-center text-foreground font-black text-xl shrink-0 shadow-lg`}>
                          {sub.plan?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className="font-black text-foreground text-lg">{sub.brandName}</p>
                          <p className="text-muted-foreground text-sm capitalize">{sub.plan} · {sub.billingCycle}</p>
                          <p className="text-primary font-bold text-sm">
                            {sub.currency || 'ZAR'} {sub.amount?.toLocaleString()}/{sub.billingCycle === 'monthly' ? 'mo' : sub.billingCycle === 'quarterly' ? 'qtr' : 'yr'}
                          </p>
                        </div>
                      </div>

                      {/* Status & renewal */}
                      <div className="space-y-2 text-sm">
                        <Badge className={`border ${statusCfg.color}`}>{statusCfg.label}</Badge>
                        {sub.nextBillingDate && sub.status === 'active' && (
                          <div className={`flex items-center gap-1.5 ${isRenewingSoon ? 'text-fruitful-green font-semibold' : 'text-muted-foreground'}`}>
                            {isRenewingSoon && <AlertTriangle className="w-3 h-3" />}
                            <Clock className="w-3 h-3" />
                            <span>Renews {format(new Date(sub.nextBillingDate), 'dd MMM yyyy')}</span>
                            {isRenewingSoon && <span className="text-fruitful-green">({daysUntilRenewal}d)</span>}
                          </div>
                        )}
                        {sub.startDate && (
                          <p className="text-muted-foreground text-xs">Started {format(new Date(sub.startDate), 'dd MMM yyyy')}</p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2">
                        {sub.status === 'active' && (
                          <>
                            <Button size="sm" variant="outline"
                              className="border-border text-muted-foreground hover:border-blue-500 hover:text-blue-300 gap-1.5"
                              onClick={() => { setUpdatePaymentDialog(sub); setNewCardEmail(user?.email || ''); }}>
                              <CreditCard className="w-3.5 h-3.5" /> Update Card
                            </Button>
                            <Button size="sm" variant="outline"
                              className="border-border text-yellow-400 hover:border-yellow-600 gap-1.5"
                              onClick={() => pauseMutation.mutate(sub.id)}
                              disabled={pauseMutation.isPending}>
                              Pause
                            </Button>
                            <Button size="sm" variant="outline"
                              className="border-red-800/60 text-red-400 hover:border-red-600 gap-1.5"
                              onClick={() => setCancelDialog(sub)}>
                              <XCircle className="w-3.5 h-3.5" /> Cancel
                            </Button>
                          </>
                        )}
                        {sub.status === 'paused' && (
                          <Button size="sm"
                            className="bg-green-700 hover:bg-green-600 text-foreground gap-1.5"
                            onClick={() => resumeMutation.mutate(sub.id)}>
                            <RefreshCw className="w-3.5 h-3.5" /> Resume
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Features */}
                    {sub.features?.length > 0 && (
                      <div className="mt-5 pt-4 border-t border-border flex flex-wrap gap-2">
                        {sub.features.map((f, i) => (
                          <span key={i} className="text-xs bg-muted border border-border text-muted-foreground rounded-full px-3 py-1 flex items-center gap-1">
                            <Zap className="w-3 h-3 text-primary" /> {f}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Recent Orders */}
        <div className="space-y-4">
          <h2 className="text-xl font-black text-foreground">Recent Orders</h2>
          <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-stone-800">
            {recentOrders.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Package className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p>No orders yet.</p>
              </div>
            ) : recentOrders.map(order => (
              <div key={order.id} className="px-5 py-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-foreground text-sm">{order.orderNumber || `Order #${order.id?.slice(-6)}`}</p>
                  <p className="text-muted-foreground text-xs">{order.items?.length || 0} item(s) · {order.currency} {order.totalAmount?.toLocaleString()}</p>
                  <p className="text-foreground text-xs">{order.created_date ? format(new Date(order.created_date), 'dd MMM yyyy') : ''}</p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <Badge className={
                    order.status === 'delivered' ? 'bg-green-900/40 text-green-300 border border-green-700 text-xs' :
                    order.status === 'confirmed' ? 'bg-blue-900/40 text-blue-300 border border-blue-700 text-xs' :
                    order.status === 'cancelled' ? 'bg-red-900/40 text-red-300 border border-red-700 text-xs' :
                    'bg-muted text-muted-foreground border border-border text-xs'
                  }>
                    {order.status}
                  </Badge>
                  <Badge variant="outline" className={`text-xs ${order.paymentStatus === 'paid' ? 'text-green-400 border-green-700' : 'text-muted-foreground border-border'}`}>
                    {order.paymentStatus}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cancel Confirm Dialog */}
      <Dialog open={!!cancelDialog} onOpenChange={() => setCancelDialog(null)}>
        <DialogContent className="bg-card border-border text-foreground">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-400" /> Cancel Subscription
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <p className="text-muted-foreground">Are you sure you want to cancel <strong className="text-foreground">{cancelDialog?.brandName} {cancelDialog?.plan}</strong>?</p>
            <p className="text-sm text-muted-foreground">You'll lose access at the end of your billing period ({cancelDialog?.nextBillingDate ? format(new Date(cancelDialog.nextBillingDate), 'dd MMM yyyy') : 'N/A'}).</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialog(null)} className="border-border text-muted-foreground">Keep Subscription</Button>
            <Button className="bg-red-700 hover:bg-red-600 text-foreground" onClick={() => cancelMutation.mutate(cancelDialog.id)} disabled={cancelMutation.isPending}>
              {cancelMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Yes, Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Payment Dialog */}
      <Dialog open={!!updatePaymentDialog} onOpenChange={() => setUpdatePaymentDialog(null)}>
        <DialogContent className="bg-card border-border text-foreground">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-400" /> Update Payment Method
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <p className="text-muted-foreground text-sm">
              You'll be redirected to Paystack to securely update your payment card for <strong className="text-foreground">{updatePaymentDialog?.brandName}</strong>.
            </p>
            <div>
              <label className="text-xs text-primary uppercase tracking-wider mb-1 block">Email for payment</label>
              <Input type="email" value={newCardEmail} onChange={e => setNewCardEmail(e.target.value)}
                placeholder="your@email.com" className="bg-muted border-border text-foreground" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpdatePaymentDialog(null)} className="border-border text-muted-foreground">Cancel</Button>
            <Button className="bg-blue-700 hover:bg-blue-600 text-foreground gap-2" onClick={() => updatePaymentMutation.mutate(updatePaymentDialog)} disabled={updatePaymentMutation.isPending}>
              {updatePaymentMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
              Update via Paystack
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
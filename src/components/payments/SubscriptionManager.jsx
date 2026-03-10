import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Check, Zap, Rocket, Building2, ExternalLink, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

// Paystack plan codes must be created in Paystack Dashboard first
// Format: PLN_xxxxxxxxxxxxxxx
const PLANS = {
  starter: {
    name: 'Starter',
    icon: Zap,
    price: { monthly: 4999, quarterly: 13497, annual: 47988 }, // in NGN kobo
    displayPrice: { monthly: '₦49.99', quarterly: '₦134.97', annual: '₦479.88' },
    features: ['Up to 10 brands', 'Basic analytics', 'Email support', '5GB storage'],
    paystackPlanCodes: {
      monthly: '',   // set in Paystack Dashboard → Subscriptions → Plans
      quarterly: '',
      annual: '',
    }
  },
  professional: {
    name: 'Professional',
    icon: Rocket,
    price: { monthly: 14999, quarterly: 40497, annual: 143988 },
    displayPrice: { monthly: '₦149.99', quarterly: '₦404.97', annual: '₦1,439.88' },
    features: ['Unlimited brands', 'Advanced analytics', 'Priority support', '50GB storage', 'API access'],
    paystackPlanCodes: {
      monthly: '',
      quarterly: '',
      annual: '',
    }
  },
  enterprise: {
    name: 'Enterprise',
    icon: Building2,
    price: { monthly: 49999, quarterly: 134997, annual: 479988 },
    displayPrice: { monthly: '₦499.99', quarterly: '₦1,349.97', annual: '₦4,799.88' },
    features: ['Everything in Pro', 'Dedicated support', 'Custom integrations', 'Unlimited storage', 'SLA guarantee'],
    paystackPlanCodes: {
      monthly: '',
      quarterly: '',
      annual: '',
    }
  }
};

const BILLING_DISCOUNTS = { monthly: 0, quarterly: 10, annual: 20 };

export default function SubscriptionManager({ subscriptions, brands }) {
  const [selectedPlan, setSelectedPlan] = useState('professional');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const queryClient = useQueryClient();

  const createSubscriptionMutation = useMutation({
    mutationFn: (data) => base44.entities.Subscription.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      toast.success('Subscription created! Paystack will handle recurring billing.');
    }
  });

  const updateSubscriptionMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Subscription.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      toast.success('Subscription updated');
    }
  });

  const createSubscription = () => {
    if (!selectedBrand || !customerEmail) {
      toast.error('Please select a brand and enter customer email');
      return;
    }

    const brand = brands.find(b => b.id === selectedBrand);
    const plan = PLANS[selectedPlan];
    const amountKobo = plan.price[billingCycle];
    const paystackPlanCode = plan.paystackPlanCodes[billingCycle];

    const now = new Date();
    const nextBilling = new Date(now);
    if (billingCycle === 'monthly') nextBilling.setMonth(now.getMonth() + 1);
    if (billingCycle === 'quarterly') nextBilling.setMonth(now.getMonth() + 3);
    if (billingCycle === 'annual') nextBilling.setFullYear(now.getFullYear() + 1);

    // If Paystack public key is available, open PaystackPop to initialise subscription
    const paystackKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
    if (paystackKey && paystackKey !== 'undefined' && typeof window.PaystackPop !== 'undefined' && paystackPlanCode) {
      window.PaystackPop.setup({
        key: paystackKey,
        email: customerEmail,
        plan: paystackPlanCode,   // Paystack Plan code — enables recurring billing
        ref: `SUB-${Date.now()}`,
        metadata: {
          custom_fields: [
            { display_name: 'Brand', variable_name: 'brand_id', value: brand?.id || '' },
            { display_name: 'Plan', variable_name: 'plan_name', value: plan.name },
          ]
        },
        callback: async (response) => {
          await createSubscriptionMutation.mutateAsync({
            brandId: brand.id,
            brandName: brand.name,
            plan: selectedPlan,
            status: 'active',
            billingCycle,
            amount: amountKobo / 100,
            currency: 'NGN',
            startDate: now.toISOString().split('T')[0],
            nextBillingDate: nextBilling.toISOString().split('T')[0],
            gateway: 'Paystack',
            paymentToken: response.reference,
            features: plan.features,
            metadata: { autoRenew: true, paystackRef: response.reference, planCode: paystackPlanCode },
          });
        },
        onClose: () => toast.info('Subscription window closed'),
      }).openIframe();
    } else {
      // Demo / no plan code configured
      toast.info('Demo mode — creating subscription record without Paystack plan code');
      createSubscriptionMutation.mutate({
        brandId: brand.id,
        brandName: brand.name,
        plan: selectedPlan,
        status: 'active',
        billingCycle,
        amount: amountKobo / 100,
        currency: 'NGN',
        startDate: now.toISOString().split('T')[0],
        nextBillingDate: nextBilling.toISOString().split('T')[0],
        gateway: 'Paystack',
        features: plan.features,
        metadata: { autoRenew: true, planCode: paystackPlanCode || 'NOT_CONFIGURED' },
      });
    }
  };

  const cancelSubscription = (sub) => {
    // In production, also call Paystack Disable Subscription endpoint via backend
    updateSubscriptionMutation.mutate({ id: sub.id, data: { status: 'cancelled' } });
  };

  return (
    <div className="space-y-6">
      {/* Plan code notice */}
      <div className="flex gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
        <div>
          <p className="font-semibold mb-1">Paystack Subscription Plans</p>
          <p>Create Plans in your <strong>Paystack Dashboard → Subscriptions → Plans</strong>, then add the Plan Codes (<code>PLN_xxx</code>) to this app's environment variables to enable real recurring billing.</p>
          <a href="https://dashboard.paystack.com/#/plans" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-1.5 text-amber-700 font-medium hover:underline">
            Manage Plans on Paystack <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Billing cycle toggle */}
      <div className="flex gap-2 flex-wrap">
        {Object.entries(BILLING_DISCOUNTS).map(([cycle, disc]) => (
          <button key={cycle} onClick={() => setBillingCycle(cycle)}
            className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-all capitalize ${
              billingCycle === cycle ? 'bg-teal-600 border-teal-600 text-white' : 'border-gray-300 text-gray-600 hover:border-gray-400'
            }`}>
            {cycle} {disc > 0 && <span className="ml-1 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">-{disc}%</span>}
          </button>
        ))}
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(PLANS).map(([key, plan]) => {
          const Icon = plan.icon;
          const isSelected = selectedPlan === key;
          return (
            <Card key={key} onClick={() => setSelectedPlan(key)}
              className={`cursor-pointer transition-all ${isSelected ? 'border-teal-500 border-2 shadow-lg' : 'hover:shadow-md'}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <Icon className="w-8 h-8 text-teal-600 mb-2" />
                    <CardTitle>{plan.name}</CardTitle>
                  </div>
                  {isSelected && <Badge className="bg-teal-600 text-white">Selected</Badge>}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-2xl font-bold">{plan.displayPrice[billingCycle]}</p>
                  <p className="text-sm text-gray-500">per {billingCycle.replace('ly','')} · billed via Paystack</p>
                  {BILLING_DISCOUNTS[billingCycle] > 0 && (
                    <Badge className="bg-green-100 text-green-800 mt-1">Save {BILLING_DISCOUNTS[billingCycle]}%</Badge>
                  )}
                </div>
                <ul className="space-y-2">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Subscribe form */}
      <Card>
        <CardHeader><CardTitle>Start Subscription via Paystack</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Select Brand</label>
              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger><SelectValue placeholder="Choose brand" /></SelectTrigger>
                <SelectContent>
                  {brands.map(b => <SelectItem key={b.id} value={b.id}>{b.name}™</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Customer Email</label>
              <Input type="email" placeholder="customer@example.com" value={customerEmail}
                onChange={e => setCustomerEmail(e.target.value)} />
            </div>
          </div>
          <Button onClick={createSubscription} disabled={createSubscriptionMutation.isPending}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white" size="lg">
            {createSubscriptionMutation.isPending
              ? <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Processing…</>
              : `Subscribe — ${PLANS[selectedPlan].displayPrice[billingCycle]}/${billingCycle.replace('ly','')}`}
          </Button>
        </CardContent>
      </Card>

      {/* Active subscriptions */}
      <Card>
        <CardHeader><CardTitle>Active Subscriptions</CardTitle></CardHeader>
        <CardContent>
          {subscriptions.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No active subscriptions</p>
          ) : (
            <div className="space-y-3">
              {subscriptions.map(sub => (
                <div key={sub.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-semibold">{sub.brandName}</p>
                    <p className="text-sm text-gray-500">
                      {sub.plan} · ₦{sub.amount?.toLocaleString()} / {sub.billingCycle}
                    </p>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                      Paystack · Next: {sub.nextBillingDate ? new Date(sub.nextBillingDate).toLocaleDateString() : '—'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={
                      sub.status === 'active' ? 'bg-green-100 text-green-800' :
                      sub.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }>{sub.status}</Badge>
                    {sub.status === 'active' && (
                      <Button onClick={() => cancelSubscription(sub)} variant="outline" size="sm">
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
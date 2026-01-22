import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Loader2, Check, Zap, Rocket, Building2 } from 'lucide-react';
import { toast } from 'sonner';

const PLANS = {
  starter: {
    name: 'Starter',
    icon: Zap,
    price: { monthly: 499, quarterly: 1347, annual: 4788 },
    features: ['Up to 10 brands', 'Basic analytics', 'Email support', '5GB storage']
  },
  professional: {
    name: 'Professional',
    icon: Rocket,
    price: { monthly: 1499, quarterly: 4047, annual: 14388 },
    features: ['Unlimited brands', 'Advanced analytics', 'Priority support', '50GB storage', 'API access']
  },
  enterprise: {
    name: 'Enterprise',
    icon: Building2,
    price: { monthly: 4999, quarterly: 13497, annual: 47988 },
    features: ['Everything in Pro', 'Dedicated support', 'Custom integrations', 'Unlimited storage', 'SLA guarantee']
  }
};

const BILLING_DISCOUNTS = {
  monthly: 0,
  quarterly: 10,
  annual: 20
};

export default function SubscriptionManager({ subscriptions, brands }) {
  const [selectedPlan, setSelectedPlan] = useState('professional');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  const queryClient = useQueryClient();

  const createSubscriptionMutation = useMutation({
    mutationFn: (data) => base44.entities.Subscription.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      toast.success('Subscription activated successfully');
      setIsDialogOpen(false);
    }
  });

  const updateSubscriptionMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Subscription.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      toast.success('Subscription updated');
    }
  });

  const createSubscription = async () => {
    if (!selectedBrand) {
      toast.error('Please select a brand');
      return;
    }

    const brand = brands.find(b => b.id === selectedBrand);
    const plan = PLANS[selectedPlan];
    const amount = plan.price[billingCycle];

    const startDate = new Date();
    const nextBillingDate = new Date();
    
    if (billingCycle === 'monthly') nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
    if (billingCycle === 'quarterly') nextBillingDate.setMonth(nextBillingDate.getMonth() + 3);
    if (billingCycle === 'annual') nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);

    await createSubscriptionMutation.mutateAsync({
      brandId: brand.id,
      brandName: brand.name,
      plan: selectedPlan,
      status: 'active',
      billingCycle,
      amount,
      currency: 'ZAR',
      startDate: startDate.toISOString(),
      nextBillingDate: nextBillingDate.toISOString(),
      gateway: 'PayFast',
      features: plan.features,
      metadata: {
        autoRenew: true
      }
    });
  };

  const cancelSubscription = async (subscription) => {
    await updateSubscriptionMutation.mutateAsync({
      id: subscription.id,
      data: { status: 'cancelled' }
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(PLANS).map(([key, plan]) => {
          const Icon = plan.icon;
          const isSelected = selectedPlan === key;
          const price = plan.price[billingCycle];
          const discount = BILLING_DISCOUNTS[billingCycle];

          return (
            <Card
              key={key}
              className={`cursor-pointer transition-all ${
                isSelected ? 'border-blue-500 border-2 shadow-lg' : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedPlan(key)}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <Icon className="w-8 h-8 text-blue-600 mb-2" />
                    <CardTitle>{plan.name}</CardTitle>
                  </div>
                  {isSelected && (
                    <Badge className="bg-blue-600">Selected</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-3xl font-bold">R{price}</p>
                  <p className="text-sm text-gray-500">per {billingCycle.replace('ly', '')}</p>
                  {discount > 0 && (
                    <Badge className="bg-green-100 text-green-800 mt-2">
                      Save {discount}%
                    </Badge>
                  )}
                </div>
                <ul className="space-y-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-600 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Start Subscription</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Select Brand</label>
              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose brand" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map(brand => (
                    <SelectItem key={brand.id} value={brand.id}>
                      {brand.name}™
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Billing Cycle</label>
              <Select value={billingCycle} onValueChange={setBillingCycle}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly (Save 10%)</SelectItem>
                  <SelectItem value="annual">Annual (Save 20%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={createSubscription}
            disabled={createSubscriptionMutation.isPending}
            className="w-full bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            {createSubscriptionMutation.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              'Subscribe Now'
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {subscriptions.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No active subscriptions</p>
            ) : (
              subscriptions.map(sub => (
                <div key={sub.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold">{sub.brandName}</p>
                    <p className="text-sm text-gray-500">
                      {sub.plan} • R{sub.amount}/{sub.billingCycle}
                    </p>
                    <p className="text-xs text-gray-400">
                      Next billing: {new Date(sub.nextBillingDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={
                      sub.status === 'active' ? 'bg-green-100 text-green-800' :
                      sub.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }>
                      {sub.status}
                    </Badge>
                    {sub.status === 'active' && (
                      <Button
                        onClick={() => cancelSubscription(sub)}
                        variant="outline"
                        size="sm"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
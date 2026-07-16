/**
 * SubscriptionShop — Tier-linked subscription shopping experience.
 * 1. User picks a subscription plan (Starter / Professional / Enterprise)
 * 2. Products from the linked sector subnodes are aggregated & priced via the cost-price formula
 * 3. User adds items to cart with subscriber discount applied
 * 4. On checkout, subscription record is created alongside the order
 */
import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCart } from '../components/cart/CartContext';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, ShoppingCart, CreditCard, ArrowRight, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import { addDays, addMonths, addYears, format } from 'date-fns';
import SubscriptionTierSelector from '../components/subscription/SubscriptionTierSelector';
import SubscriptionProductAggregator from '../components/subscription/SubscriptionProductAggregator';
import { PLAN_CONFIG } from '@/lib/pricingFormula';

// Sectors available to link to a subscription
const SECTOR_OPTIONS = [
  { key: '', label: 'All Sectors' },
  { key: 'creative', label: '🎨 Creative' },
  { key: 'fashion', label: '👗 Fashion' },
  { key: 'agriculture', label: '🌾 Agriculture' },
  { key: 'health', label: '💊 Health' },
  { key: 'education-youth', label: '📚 Youth Education' },
  { key: 'zerowaste', label: '♻️ Zero Waste' },
  { key: 'nutrition', label: '🥑 Nutrition' },
  { key: 'housing', label: '🏡 Housing' },
];

function nextBillingDate(cycle) {
  const now = new Date();
  if (cycle === 'quarterly') return format(addMonths(now, 3), 'yyyy-MM-dd');
  if (cycle === 'annual')    return format(addYears(now, 1), 'yyyy-MM-dd');
  return format(addMonths(now, 1), 'yyyy-MM-dd');
}

export default function SubscriptionShop() {
  const [user, setUser] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState('professional');
  const [selectedCycle, setSelectedCycle] = useState('monthly');
  const [selectedSector, setSelectedSector] = useState('');
  const [subnodesInput, setSubnodesInput] = useState('');
  const [showProducts, setShowProducts] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const { addToCart, cartItems } = useCart();
  const queryClient = useQueryClient();

  useEffect(() => { base44.auth.me().then(setUser).catch(() => {}); }, []);

  const { data: mySubscriptions = [] } = useQuery({
    queryKey: ['my-subscriptions'],
    queryFn: () => base44.entities.Subscription.list('-created_date'),
    enabled: !!user,
  });

  const activeSub = mySubscriptions.find(s => s.status === 'active');
  const tierConfig = PLAN_CONFIG[selectedPlan] || PLAN_CONFIG.starter;
  const price = tierConfig[`${selectedCycle}ZAR`] || tierConfig.monthlyZAR;
  const subnodes = subnodesInput.split(',').map(s => s.trim()).filter(Boolean);

  const subscribeMutation = useMutation({
    mutationFn: async () => {
      const paystackKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
      const subAmount = price;

      // Paystack flow (if available)
      if (paystackKey && paystackKey !== 'undefined' && typeof window.PaystackPop !== 'undefined') {
        return new Promise((resolve, reject) => {
          const ref = `SUB-${Date.now()}`;
          window.PaystackPop.setup({
            key: paystackKey,
            email: user?.email,
            amount: Math.round(subAmount * 100),
            currency: 'ZAR',
            ref,
            label: `${tierConfig.label} Subscription — FAA.ZONE`,
            callback: async (response) => {
              await base44.entities.Subscription.create({
                brandName: 'FAA.ZONE™',
                plan: selectedPlan,
                billingCycle: selectedCycle,
                amount: subAmount,
                currency: 'ZAR',
                status: 'active',
                gateway: 'Paystack',
                startDate: format(new Date(), 'yyyy-MM-dd'),
                nextBillingDate: nextBillingDate(selectedCycle),
                sector: selectedSector,
                subnodes,
                features: tierConfig.features,
                tierLimits: {
                  maxProducts: tierConfig.maxProducts,
                  maxOrdersPerMonth: tierConfig.maxOrdersPerMonth,
                  discountPct: tierConfig.discountPct,
                  freeShipping: tierConfig.freeShipping,
                },
                paymentToken: response.reference,
              });
              resolve(response);
            },
            onClose: () => reject(new Error('Payment cancelled')),
          }).openIframe();
        });
      } else {
        // Demo mode
        await base44.entities.Subscription.create({
          brandName: 'FAA.ZONE™',
          plan: selectedPlan,
          billingCycle: selectedCycle,
          amount: subAmount,
          currency: 'ZAR',
          status: 'active',
          gateway: 'Paystack',
          startDate: format(new Date(), 'yyyy-MM-dd'),
          nextBillingDate: nextBillingDate(selectedCycle),
          sector: selectedSector,
          subnodes,
          features: tierConfig.features,
          tierLimits: {
            maxProducts: tierConfig.maxProducts,
            maxOrdersPerMonth: tierConfig.maxOrdersPerMonth,
            discountPct: tierConfig.discountPct,
            freeShipping: tierConfig.freeShipping,
          },
          paymentToken: `DEMO-${Date.now()}`,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-subscriptions'] });
      toast.success(`✅ ${tierConfig.label} subscription activated!`);
      setShowProducts(true);
      setSubscribing(false);
    },
    onError: (err) => {
      if (err.message !== 'Payment cancelled') toast.error(err.message);
      setSubscribing(false);
    },
  });

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart with ${tierConfig.discountPct}% subscriber discount`);
  };

  const cartItemCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-fruitful-mint/50 via-card to-card border-b border-border px-6 md:px-16 py-16">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #0d9488 1px, transparent 0)', backgroundSize: '36px 36px' }} />
        <div className="max-w-5xl mx-auto relative">
          <Badge className="bg-primary/10 text-primary border-primary mb-4">Fruitful™ Subscription Shop</Badge>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-none mb-3" style={{ fontFamily: 'inherit' }}>
            Subscribe & <span className="text-primary">Shop</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mb-6">
            Choose your tier — unlock sector-linked products at cost-price-derived subscriber rates. Wholesale, retail &amp; online prices are calculated from ex-works ZAR.
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            {activeSub && (
              <Badge className="bg-green-900/40 text-green-300 border-green-700 text-sm px-3 py-1.5">
                ✅ Active: {PLAN_CONFIG[activeSub.plan]?.label} ({activeSub.billingCycle})
              </Badge>
            )}
            {cartItemCount > 0 && (
              <Link to={createPageUrl('Checkout')}>
                <Button className="bg-primary hover:bg-primary/90 gap-2">
                  <ShoppingCart className="w-4 h-4" /> Cart ({cartItemCount}) · Checkout
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-10 py-10 space-y-10">

        {/* Step 1: Pick tier */}
        <section>
          <h2 className="text-xl font-black text-foreground mb-6 flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-black">1</span>
            Choose Your Subscription Tier
          </h2>
          <SubscriptionTierSelector
            selected={selectedPlan}
            cycle={selectedCycle}
            onSelectPlan={setSelectedPlan}
            onSelectCycle={setSelectedCycle}
          />
        </section>

        {/* Step 2: Sector + subnode filter */}
        <section>
          <h2 className="text-xl font-black text-foreground mb-4 flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-black">2</span>
            Link Sector &amp; Subnodes
          </h2>
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <div>
              <label className="text-xs text-primary uppercase tracking-wider font-bold mb-2 block">Sector</label>
              <div className="flex flex-wrap gap-2">
                {SECTOR_OPTIONS.map(s => (
                  <button
                    key={s.key}
                    onClick={() => setSelectedSector(s.key)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                      selectedSector === s.key
                        ? 'bg-primary border-primary text-primary-foreground'
                        : 'border-border text-muted-foreground hover:border-primary'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-primary uppercase tracking-wider font-bold mb-2 block">
                Subnodes <span className="text-muted-foreground font-normal normal-case">(comma-separated, e.g. pottery, pots, aprons)</span>
              </label>
              <input
                value={subnodesInput}
                onChange={e => setSubnodesInput(e.target.value)}
                placeholder="pottery, pots, aprons, hats, paintings..."
                className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-foreground text-sm focus:border-primary outline-none"
              />
            </div>
          </div>
        </section>

        {/* Step 3: Activate / Browse */}
        <section>
          <h2 className="text-xl font-black text-foreground mb-4 flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-black">3</span>
            Activate &amp; Browse Products
          </h2>

          {/* Pricing summary */}
          <div className="bg-card border border-border rounded-2xl p-5 mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-foreground font-black text-lg">{tierConfig.label} — {selectedCycle}</p>
              <p className="text-primary font-bold text-2xl">R{price.toLocaleString()}<span className="text-sm text-muted-foreground font-normal">/{selectedCycle === 'monthly' ? 'mo' : selectedCycle === 'quarterly' ? 'qtr' : 'yr'}</span></p>
              <p className="text-muted-foreground text-xs mt-1">
                {tierConfig.discountPct}% off all products · {tierConfig.freeShipping ? 'Free shipping' : 'Standard shipping'} · Up to {tierConfig.maxProducts === 999 ? 'unlimited' : tierConfig.maxProducts} products
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {!activeSub || activeSub.plan !== selectedPlan ? (
                <Button
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold gap-2"
                  onClick={() => { setSubscribing(true); subscribeMutation.mutate(); }}
                  disabled={subscribeMutation.isPending}
                >
                  {subscribeMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                  Subscribe · R{price.toLocaleString()}
                </Button>
              ) : (
                <Badge className="bg-green-900/40 text-green-300 border-green-700 px-4 py-2 text-sm">✅ Current Plan</Badge>
              )}
              <Button
                variant="outline"
                className="border-border text-muted-foreground hover:border-primary gap-2"
                onClick={() => setShowProducts(v => !v)}
              >
                {showProducts ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                {showProducts ? 'Hide Products' : 'Browse Products'}
              </Button>
            </div>
          </div>

          {/* Product aggregator */}
          {showProducts && (
            <div className="bg-card border border-border rounded-2xl p-6">
              <SubscriptionProductAggregator
                plan={selectedPlan}
                sector={selectedSector}
                subnodes={subnodes}
                onAddToCart={handleAddToCart}
              />
            </div>
          )}
        </section>

        {/* CTA to checkout */}
        {cartItemCount > 0 && (
          <div className="bg-gradient-to-r from-fruitful-mint/60 to-card border border-primary/30 rounded-2xl p-6 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-foreground font-black text-lg">{cartItemCount} item(s) in cart</p>
              <p className="text-muted-foreground text-sm">Subscriber prices &amp; discounts applied</p>
            </div>
            <Link to={createPageUrl('Checkout')}>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg px-8 py-3 gap-2">
                Proceed to Checkout <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        )}

        {/* Links */}
        <div className="flex flex-wrap gap-3 text-sm">
          {['MySubscriptions', 'Marketplace', 'Checkout', 'OrderHistory'].map(p => (
            <Link key={p} to={createPageUrl(p)}>
              <Button variant="outline" size="sm" className="border-border text-muted-foreground hover:border-primary/40">{p}</Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
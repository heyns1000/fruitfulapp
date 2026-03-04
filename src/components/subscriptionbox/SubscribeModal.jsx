import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Package, CheckCircle2, Sparkles, ChevronRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const CYCLES = [
  { key: 'monthly', label: 'Monthly', discount: null },
  { key: 'quarterly', label: 'Quarterly', discount: 'Save 10%' },
  { key: 'annual', label: 'Annual', discount: 'Save 20%' },
];

export default function SubscribeModal({ box, open, onClose }) {
  const [step, setStep] = useState(1); // 1=plan, 2=customize, 3=shipping, 4=success
  const [cycle, setCycle] = useState('monthly');
  const [customizations, setCustomizations] = useState({});
  const [isGift, setIsGift] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');
  const [shipping, setShipping] = useState({ name: '', addressLine1: '', city: '', state: '', postalCode: '', country: 'South Africa' });
  const [email, setEmail] = useState('');
  const queryClient = useQueryClient();

  const currency = box?.currency === 'ZAR' ? 'R' : '$';
  const price = box?.pricing?.[cycle] || box?.pricing?.monthly || 0;

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.BoxSubscription.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-box-subscriptions'] });
      setStep(4);
    },
    onError: () => toast.error('Failed to create subscription. Please try again.')
  });

  const handleConfirm = () => {
    if (!email) { toast.error('Please enter your email'); return; }
    const nextBilling = new Date();
    nextBilling.setMonth(nextBilling.getMonth() + (cycle === 'annual' ? 12 : cycle === 'quarterly' ? 3 : 1));
    createMutation.mutate({
      boxId: box.id,
      boxName: box.name,
      subscriberEmail: email,
      subscriberName: shipping.name,
      billingCycle: cycle,
      amount: price,
      currency: box.currency || 'USD',
      status: 'active',
      customizations,
      shippingAddress: shipping,
      nextBillingDate: nextBilling.toISOString().split('T')[0],
      startDate: new Date().toISOString().split('T')[0],
      isGift,
      giftMessage,
    });
  };

  const hasCustomizations = box?.customizationOptions?.length > 0;

  const reset = () => { setStep(1); setCycle('monthly'); setCustomizations({}); setShipping({ name: '', addressLine1: '', city: '', state: '', postalCode: '', country: 'South Africa' }); setEmail(''); onClose(); };

  if (!box) return null;

  return (
    <Dialog open={open} onOpenChange={reset}>
      <DialogContent className="bg-stone-950 border border-stone-700 text-white max-w-lg rounded-3xl p-0 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-700 to-amber-600 p-6">
          <p className="text-orange-200 text-xs font-bold tracking-widest uppercase mb-1">Subscribe to</p>
          <DialogTitle className="text-2xl font-black text-white">{box.name}</DialogTitle>
          <p className="text-orange-100 text-sm mt-1 italic">{box.tagline}</p>
        </div>

        <div className="p-6 space-y-6">

          {/* Step 4 — Success */}
          {step === 4 && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9 text-green-400" />
              </div>
              <h3 className="text-2xl font-black text-white">You're Subscribed!</h3>
              <p className="text-stone-400">Your first box is on its way. You'll receive email updates on each shipment.</p>
              <div className="bg-stone-900 border border-stone-700 rounded-2xl p-4 text-left space-y-2">
                <p className="text-sm text-stone-400">Box: <span className="text-white font-bold">{box.name}</span></p>
                <p className="text-sm text-stone-400">Plan: <span className="text-white font-bold capitalize">{cycle}</span></p>
                <p className="text-sm text-stone-400">Amount: <span className="text-orange-400 font-bold">{currency}{price}/{cycle === 'annual' ? 'yr' : cycle === 'quarterly' ? 'qtr' : 'mo'}</span></p>
              </div>
              <Button onClick={reset} className="w-full bg-orange-600 hover:bg-orange-500 font-bold rounded-xl">Done</Button>
            </div>
          )}

          {/* Step 1 — Choose Plan */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-stone-300 font-semibold">Choose your billing cycle</p>
              <div className="space-y-3">
                {CYCLES.filter(c => box.pricing?.[c.key]).map(c => (
                  <button
                    key={c.key}
                    onClick={() => setCycle(c.key)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${cycle === c.key ? 'border-orange-500 bg-orange-950/40' : 'border-stone-700 bg-stone-900 hover:border-stone-500'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${cycle === c.key ? 'border-orange-500' : 'border-stone-600'}`}>
                        {cycle === c.key && <div className="w-2 h-2 bg-orange-500 rounded-full" />}
                      </div>
                      <span className="font-bold text-white capitalize">{c.label}</span>
                      {c.discount && <Badge className="bg-green-700 text-white border-0 text-xs">{c.discount}</Badge>}
                    </div>
                    <span className="text-orange-400 font-black text-lg">{currency}{box.pricing[c.key]}<span className="text-stone-500 text-sm font-normal">/{c.key === 'annual' ? 'yr' : c.key === 'quarterly' ? 'qtr' : 'mo'}</span></span>
                  </button>
                ))}
              </div>
              <label className="flex items-center gap-3 p-4 bg-stone-900 border border-stone-700 rounded-2xl cursor-pointer hover:border-stone-500 transition-colors">
                <input type="checkbox" checked={isGift} onChange={e => setIsGift(e.target.checked)} className="accent-orange-500 w-4 h-4" />
                <span className="text-stone-300 text-sm">🎁 This is a gift</span>
              </label>
              <Button onClick={() => setStep(hasCustomizations ? 2 : 3)} className="w-full bg-orange-600 hover:bg-orange-500 font-bold rounded-xl">
                Continue <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Step 2 — Customize */}
          {step === 2 && hasCustomizations && (
            <div className="space-y-5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orange-500" />
                <p className="text-stone-200 font-bold">Personalize your box</p>
              </div>
              {box.customizationOptions.map(opt => (
                <div key={opt.key} className="space-y-2">
                  <p className="text-stone-400 text-sm font-medium">{opt.label}</p>
                  <div className="flex flex-wrap gap-2">
                    {opt.options.map(o => (
                      <button
                        key={o}
                        onClick={() => setCustomizations(prev => ({ ...prev, [opt.key]: o }))}
                        className={`px-4 py-2 rounded-full text-sm border transition-all ${customizations[opt.key] === o ? 'bg-orange-600 border-orange-600 text-white' : 'border-stone-600 text-stone-300 hover:border-orange-500 hover:text-orange-300'}`}
                      >
                        {o}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              {isGift && (
                <div>
                  <p className="text-stone-400 text-sm font-medium mb-2">Gift message (optional)</p>
                  <textarea
                    value={giftMessage}
                    onChange={e => setGiftMessage(e.target.value)}
                    placeholder="Write a personal message..."
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl p-3 text-white text-sm resize-none h-20 focus:outline-none focus:border-orange-500"
                  />
                </div>
              )}
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1 border-stone-600 text-stone-300">Back</Button>
                <Button onClick={() => setStep(3)} className="flex-1 bg-orange-600 hover:bg-orange-500 font-bold rounded-xl">Continue</Button>
              </div>
            </div>
          )}

          {/* Step 3 — Shipping */}
          {step === 3 && (
            <div className="space-y-4">
              <p className="text-stone-300 font-semibold">Delivery details</p>
              <Input
                placeholder="Your email *"
                value={email}
                onChange={e => setEmail(e.target.value)}
                type="email"
                className="bg-stone-900 border-stone-700 text-white placeholder:text-stone-500 focus:border-orange-500"
              />
              <Input
                placeholder="Full name"
                value={shipping.name}
                onChange={e => setShipping(p => ({ ...p, name: e.target.value }))}
                className="bg-stone-900 border-stone-700 text-white placeholder:text-stone-500 focus:border-orange-500"
              />
              <Input
                placeholder="Street address"
                value={shipping.addressLine1}
                onChange={e => setShipping(p => ({ ...p, addressLine1: e.target.value }))}
                className="bg-stone-900 border-stone-700 text-white placeholder:text-stone-500 focus:border-orange-500"
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="City"
                  value={shipping.city}
                  onChange={e => setShipping(p => ({ ...p, city: e.target.value }))}
                  className="bg-stone-900 border-stone-700 text-white placeholder:text-stone-500 focus:border-orange-500"
                />
                <Input
                  placeholder="Postal code"
                  value={shipping.postalCode}
                  onChange={e => setShipping(p => ({ ...p, postalCode: e.target.value }))}
                  className="bg-stone-900 border-stone-700 text-white placeholder:text-stone-500 focus:border-orange-500"
                />
              </div>
              {/* Summary */}
              <div className="bg-stone-900 border border-stone-700 rounded-xl p-4 space-y-1.5">
                <p className="text-stone-400 text-xs font-bold uppercase tracking-wider mb-2">Order Summary</p>
                <div className="flex justify-between text-sm"><span className="text-stone-400">{box.name}</span><span className="text-white">{currency}{price}</span></div>
                <div className="flex justify-between text-sm"><span className="text-stone-400">Billing</span><span className="text-white capitalize">{cycle}</span></div>
                {Object.keys(customizations).length > 0 && (
                  <div className="flex justify-between text-sm"><span className="text-stone-400">Customized</span><span className="text-orange-400">✓ Yes</span></div>
                )}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(hasCustomizations ? 2 : 1)} className="flex-1 border-stone-600 text-stone-300">Back</Button>
                <Button onClick={handleConfirm} disabled={createMutation.isPending} className="flex-1 bg-orange-600 hover:bg-orange-500 font-bold rounded-xl">
                  {createMutation.isPending ? 'Confirming...' : `Subscribe · ${currency}${price}`}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
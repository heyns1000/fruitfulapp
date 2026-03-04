import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Package, CheckCircle2, Sparkles, ChevronRight, Gift, Ribbon } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const CYCLES = [
  { key: 'monthly', label: 'Monthly', discount: null },
  { key: 'quarterly', label: 'Quarterly', discount: 'Save 10%' },
  { key: 'annual', label: 'Annual', discount: 'Save 20%' },
];

const WRAPPING_OPTIONS = [
  { key: 'none', label: 'No wrapping', icon: '📦' },
  { key: 'standard', label: 'Standard gift wrap', icon: '🎁' },
  { key: 'premium', label: 'Premium ribbon & box', icon: '🎀' },
  { key: 'eco', label: 'Eco-friendly wrap', icon: '🌿' },
];

export default function SubscribeModal({ box, open, onClose }) {
  const [step, setStep] = useState(1); // 1=plan, 2=gift, 3=customize, 4=shipping, 5=success
  const [cycle, setCycle] = useState('monthly');
  const [isGift, setIsGift] = useState(false);
  const [giftDetails, setGiftDetails] = useState({
    recipientName: '',
    recipientEmail: '',
    message: '',
    wrapping: 'none',
    deliveryDate: '',
  });
  const [customizations, setCustomizations] = useState({});
  const [shipping, setShipping] = useState({ name: '', addressLine1: '', city: '', state: '', postalCode: '', country: 'South Africa' });
  const [email, setEmail] = useState('');
  const queryClient = useQueryClient();

  const currency = box?.currency === 'ZAR' ? 'R' : '$';
  const price = box?.pricing?.[cycle] || box?.pricing?.monthly || 0;
  const hasCustomizations = box?.customizationOptions?.length > 0;

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.BoxSubscription.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-box-subscriptions'] });
      setStep(5);
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
      startDate: giftDetails.deliveryDate || new Date().toISOString().split('T')[0],
      isGift,
      giftMessage: giftDetails.message,
      giftDetails: isGift ? giftDetails : null,
    });
  };

  const reset = () => {
    setStep(1); setCycle('monthly'); setCustomizations({}); setIsGift(false);
    setGiftDetails({ recipientName: '', recipientEmail: '', message: '', wrapping: 'none', deliveryDate: '' });
    setShipping({ name: '', addressLine1: '', city: '', state: '', postalCode: '', country: 'South Africa' });
    setEmail('');
    onClose();
  };

  const nextFromStep1 = () => setStep(isGift ? 2 : hasCustomizations ? 3 : 4);
  const backFromStep3 = () => setStep(isGift ? 2 : 1);
  const backFromStep4 = () => setStep(hasCustomizations ? 3 : isGift ? 2 : 1);

  if (!box) return null;

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 3);
  const minDateStr = minDate.toISOString().split('T')[0];

  return (
    <Dialog open={open} onOpenChange={reset}>
      <DialogContent className="bg-stone-950 border border-stone-700 text-white max-w-lg rounded-3xl p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-700 to-amber-600 p-6 sticky top-0 z-10">
          <div className="flex items-center justify-between mb-1">
            <p className="text-orange-200 text-xs font-bold tracking-widest uppercase">Subscribe to</p>
            {isGift && <span className="bg-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-full">🎁 Gift Mode</span>}
          </div>
          <DialogTitle className="text-2xl font-black text-white">{box.name}</DialogTitle>
          <p className="text-orange-100 text-sm mt-1 italic">{box.tagline}</p>
          {/* Step dots */}
          <div className="flex gap-1.5 mt-3">
            {[1,2,3,4].filter(s => s !== 2 || isGift).map((s, idx) => (
              <div key={s} className={`h-1 rounded-full transition-all ${step >= s ? 'bg-white w-6' : 'bg-white/30 w-3'}`} />
            ))}
          </div>
        </div>

        <div className="p-6 space-y-6">

          {/* ── Step 5: Success ── */}
          {step === 5 && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9 text-green-400" />
              </div>
              <h3 className="text-2xl font-black text-white">{isGift ? 'Gift Sent! 🎁' : "You're Subscribed!"}</h3>
              <p className="text-stone-400">
                {isGift
                  ? `A subscription gift has been arranged for ${giftDetails.recipientName || 'your recipient'}. They'll be thrilled!`
                  : "Your first box is on its way. You'll receive email updates on each shipment."}
              </p>
              <div className="bg-stone-900 border border-stone-700 rounded-2xl p-4 text-left space-y-2">
                <div className="flex justify-between text-sm"><span className="text-stone-400">Box</span><span className="text-white font-bold">{box.name}</span></div>
                <div className="flex justify-between text-sm"><span className="text-stone-400">Plan</span><span className="text-white font-bold capitalize">{cycle}</span></div>
                <div className="flex justify-between text-sm"><span className="text-stone-400">Amount</span><span className="text-orange-400 font-bold">{currency}{price}/{cycle === 'annual' ? 'yr' : cycle === 'quarterly' ? 'qtr' : 'mo'}</span></div>
                {isGift && giftDetails.deliveryDate && (
                  <div className="flex justify-between text-sm"><span className="text-stone-400">First delivery</span><span className="text-white">{giftDetails.deliveryDate}</span></div>
                )}
                {isGift && giftDetails.wrapping !== 'none' && (
                  <div className="flex justify-between text-sm"><span className="text-stone-400">Wrapping</span><span className="text-white capitalize">{giftDetails.wrapping}</span></div>
                )}
              </div>
              <Button onClick={reset} className="w-full bg-orange-600 hover:bg-orange-500 font-bold rounded-xl">Done</Button>
            </div>
          )}

          {/* ── Step 1: Plan + Gift Toggle ── */}
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

              {/* Gift toggle */}
              <button
                onClick={() => setIsGift(!isGift)}
                className={`w-full flex items-center gap-3 p-4 rounded-2xl border transition-all ${isGift ? 'border-pink-500 bg-pink-950/30' : 'border-stone-700 bg-stone-900 hover:border-stone-500'}`}
              >
                <Gift className={`w-5 h-5 ${isGift ? 'text-pink-400' : 'text-stone-500'}`} />
                <div className="text-left flex-1">
                  <p className={`font-semibold text-sm ${isGift ? 'text-pink-300' : 'text-stone-300'}`}>🎁 Send as a gift</p>
                  <p className="text-stone-500 text-xs">Add a personal message, gift wrapping & delivery date</p>
                </div>
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${isGift ? 'bg-pink-500 border-pink-500' : 'border-stone-600'}`}>
                  {isGift && <span className="text-white text-xs">✓</span>}
                </div>
              </button>

              <Button onClick={nextFromStep1} className="w-full bg-orange-600 hover:bg-orange-500 font-bold rounded-xl">
                Continue <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* ── Step 2: Gift Details ── */}
          {step === 2 && isGift && (
            <div className="space-y-5">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-pink-400" />
                <p className="text-stone-200 font-bold">Gift Details</p>
              </div>

              <div className="space-y-3">
                <Input
                  placeholder="Recipient's name *"
                  value={giftDetails.recipientName}
                  onChange={e => setGiftDetails(p => ({ ...p, recipientName: e.target.value }))}
                  className="bg-stone-900 border-stone-700 text-white placeholder:text-stone-500 focus:border-pink-500"
                />
                <Input
                  placeholder="Recipient's email (optional)"
                  type="email"
                  value={giftDetails.recipientEmail}
                  onChange={e => setGiftDetails(p => ({ ...p, recipientEmail: e.target.value }))}
                  className="bg-stone-900 border-stone-700 text-white placeholder:text-stone-500 focus:border-pink-500"
                />
              </div>

              {/* Gift message */}
              <div>
                <p className="text-stone-400 text-sm font-medium mb-2">Personal message</p>
                <textarea
                  value={giftDetails.message}
                  onChange={e => setGiftDetails(p => ({ ...p, message: e.target.value }))}
                  placeholder="Write a heartfelt message... it will be included in the first box."
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl p-3 text-white text-sm resize-none h-24 focus:outline-none focus:border-pink-500 placeholder:text-stone-600"
                />
              </div>

              {/* Wrapping */}
              <div>
                <p className="text-stone-400 text-sm font-medium mb-2">Gift wrapping</p>
                <div className="grid grid-cols-2 gap-2">
                  {WRAPPING_OPTIONS.map(w => (
                    <button
                      key={w.key}
                      onClick={() => setGiftDetails(p => ({ ...p, wrapping: w.key }))}
                      className={`p-3 rounded-xl border text-left transition-all ${giftDetails.wrapping === w.key ? 'border-pink-500 bg-pink-950/30' : 'border-stone-700 bg-stone-900 hover:border-stone-500'}`}
                    >
                      <span className="text-xl">{w.icon}</span>
                      <p className={`text-xs mt-1 font-medium ${giftDetails.wrapping === w.key ? 'text-pink-300' : 'text-stone-400'}`}>{w.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* First delivery date */}
              <div>
                <p className="text-stone-400 text-sm font-medium mb-2">Preferred first delivery date</p>
                <Input
                  type="date"
                  min={minDateStr}
                  value={giftDetails.deliveryDate}
                  onChange={e => setGiftDetails(p => ({ ...p, deliveryDate: e.target.value }))}
                  className="bg-stone-900 border-stone-700 text-white focus:border-pink-500"
                />
                <p className="text-stone-600 text-xs mt-1">Earliest available: {minDateStr}</p>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1 border-stone-600 text-stone-300">Back</Button>
                <Button onClick={() => setStep(hasCustomizations ? 3 : 4)} className="flex-1 bg-pink-600 hover:bg-pink-500 font-bold rounded-xl">Continue</Button>
              </div>
            </div>
          )}

          {/* ── Step 3: Customise ── */}
          {step === 3 && hasCustomizations && (
            <div className="space-y-5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orange-500" />
                <p className="text-stone-200 font-bold">Personalize {isGift ? "the gift box" : "your box"}</p>
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
              <div className="flex gap-3">
                <Button variant="outline" onClick={backFromStep3} className="flex-1 border-stone-600 text-stone-300">Back</Button>
                <Button onClick={() => setStep(4)} className="flex-1 bg-orange-600 hover:bg-orange-500 font-bold rounded-xl">Continue</Button>
              </div>
            </div>
          )}

          {/* ── Step 4: Shipping + Confirm ── */}
          {step === 4 && (
            <div className="space-y-4">
              <p className="text-stone-300 font-semibold">{isGift ? "Your details & delivery address" : "Delivery details"}</p>
              <Input
                placeholder="Your email *"
                value={email}
                onChange={e => setEmail(e.target.value)}
                type="email"
                className="bg-stone-900 border-stone-700 text-white placeholder:text-stone-500 focus:border-orange-500"
              />
              <Input
                placeholder={isGift ? "Recipient's full name" : "Full name"}
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
                <Input placeholder="City" value={shipping.city} onChange={e => setShipping(p => ({ ...p, city: e.target.value }))} className="bg-stone-900 border-stone-700 text-white placeholder:text-stone-500 focus:border-orange-500" />
                <Input placeholder="Postal code" value={shipping.postalCode} onChange={e => setShipping(p => ({ ...p, postalCode: e.target.value }))} className="bg-stone-900 border-stone-700 text-white placeholder:text-stone-500 focus:border-orange-500" />
              </div>

              {/* Summary */}
              <div className="bg-stone-900 border border-stone-700 rounded-xl p-4 space-y-1.5">
                <p className="text-stone-400 text-xs font-bold uppercase tracking-wider mb-2">Order Summary</p>
                <div className="flex justify-between text-sm"><span className="text-stone-400">{box.name}</span><span className="text-white">{currency}{price}</span></div>
                <div className="flex justify-between text-sm"><span className="text-stone-400">Billing</span><span className="text-white capitalize">{cycle}</span></div>
                {isGift && <div className="flex justify-between text-sm"><span className="text-stone-400">Gift for</span><span className="text-pink-300">{giftDetails.recipientName || '—'}</span></div>}
                {isGift && giftDetails.wrapping !== 'none' && (
                  <div className="flex justify-between text-sm"><span className="text-stone-400">Wrapping</span><span className="text-white capitalize">{giftDetails.wrapping}</span></div>
                )}
                {isGift && giftDetails.deliveryDate && (
                  <div className="flex justify-between text-sm"><span className="text-stone-400">First delivery</span><span className="text-white">{giftDetails.deliveryDate}</span></div>
                )}
                {Object.keys(customizations).length > 0 && (
                  <div className="flex justify-between text-sm"><span className="text-stone-400">Customized</span><span className="text-orange-400">✓ Yes</span></div>
                )}
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={backFromStep4} className="flex-1 border-stone-600 text-stone-300">Back</Button>
                <Button onClick={handleConfirm} disabled={createMutation.isPending} className={`flex-1 font-bold rounded-xl ${isGift ? 'bg-pink-600 hover:bg-pink-500' : 'bg-orange-600 hover:bg-orange-500'}`}>
                  {createMutation.isPending ? 'Confirming...' : isGift ? `🎁 Send Gift · ${currency}${price}` : `Subscribe · ${currency}${price}`}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
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
      <DialogContent className="bg-background border border-border text-foreground max-w-lg rounded-3xl p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-amber-600 p-6 sticky top-0 z-10">
          <div className="flex items-center justify-between mb-1">
            <p className="text-primary text-xs font-bold tracking-widest uppercase">Subscribe to</p>
            {isGift && <span className="bg-white/20 text-foreground text-xs font-bold px-2.5 py-1 rounded-full">🎁 Gift Mode</span>}
          </div>
          <DialogTitle className="text-2xl font-black text-foreground">{box.name}</DialogTitle>
          <p className="text-primary text-sm mt-1 italic">{box.tagline}</p>
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
              <h3 className="text-2xl font-black text-foreground">{isGift ? 'Gift Sent! 🎁' : "You're Subscribed!"}</h3>
              <p className="text-muted-foreground">
                {isGift
                  ? `A subscription gift has been arranged for ${giftDetails.recipientName || 'your recipient'}. They'll be thrilled!`
                  : "Your first box is on its way. You'll receive email updates on each shipment."}
              </p>
              <div className="bg-card border border-border rounded-2xl p-4 text-left space-y-2">
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Box</span><span className="text-foreground font-bold">{box.name}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Plan</span><span className="text-foreground font-bold capitalize">{cycle}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Amount</span><span className="text-primary font-bold">{currency}{price}/{cycle === 'annual' ? 'yr' : cycle === 'quarterly' ? 'qtr' : 'mo'}</span></div>
                {isGift && giftDetails.deliveryDate && (
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">First delivery</span><span className="text-foreground">{giftDetails.deliveryDate}</span></div>
                )}
                {isGift && giftDetails.wrapping !== 'none' && (
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Wrapping</span><span className="text-foreground capitalize">{giftDetails.wrapping}</span></div>
                )}
              </div>
              <Button onClick={reset} className="w-full bg-primary hover:bg-primary/90 font-bold rounded-xl">Done</Button>
            </div>
          )}

          {/* ── Step 1: Plan + Gift Toggle ── */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-muted-foreground font-semibold">Choose your billing cycle</p>
              <div className="space-y-3">
                {CYCLES.filter(c => box.pricing?.[c.key]).map(c => (
                  <button
                    key={c.key}
                    onClick={() => setCycle(c.key)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${cycle === c.key ? 'border-primary bg-primary/10' : 'border-border bg-card hover:border-primary/40'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${cycle === c.key ? 'border-primary' : 'border-border'}`}>
                        {cycle === c.key && <div className="w-2 h-2 bg-primary rounded-full" />}
                      </div>
                      <span className="font-bold text-foreground capitalize">{c.label}</span>
                      {c.discount && <Badge className="bg-green-700 text-foreground border-0 text-xs">{c.discount}</Badge>}
                    </div>
                    <span className="text-primary font-black text-lg">{currency}{box.pricing[c.key]}<span className="text-muted-foreground text-sm font-normal">/{c.key === 'annual' ? 'yr' : c.key === 'quarterly' ? 'qtr' : 'mo'}</span></span>
                  </button>
                ))}
              </div>

              {/* Gift toggle */}
              <button
                onClick={() => setIsGift(!isGift)}
                className={`w-full flex items-center gap-3 p-4 rounded-2xl border transition-all ${isGift ? 'border-pink-500 bg-pink-950/30' : 'border-border bg-card hover:border-primary/40'}`}
              >
                <Gift className={`w-5 h-5 ${isGift ? 'text-pink-400' : 'text-muted-foreground'}`} />
                <div className="text-left flex-1">
                  <p className={`font-semibold text-sm ${isGift ? 'text-pink-300' : 'text-muted-foreground'}`}>🎁 Send as a gift</p>
                  <p className="text-muted-foreground text-xs">Add a personal message, gift wrapping & delivery date</p>
                </div>
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${isGift ? 'bg-pink-500 border-pink-500' : 'border-border'}`}>
                  {isGift && <span className="text-foreground text-xs">✓</span>}
                </div>
              </button>

              <Button onClick={nextFromStep1} className="w-full bg-primary hover:bg-primary/90 font-bold rounded-xl">
                Continue <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* ── Step 2: Gift Details ── */}
          {step === 2 && isGift && (
            <div className="space-y-5">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-pink-400" />
                <p className="text-foreground font-bold">Gift Details</p>
              </div>

              <div className="space-y-3">
                <Input
                  placeholder="Recipient's name *"
                  value={giftDetails.recipientName}
                  onChange={e => setGiftDetails(p => ({ ...p, recipientName: e.target.value }))}
                  className="bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-pink-500"
                />
                <Input
                  placeholder="Recipient's email (optional)"
                  type="email"
                  value={giftDetails.recipientEmail}
                  onChange={e => setGiftDetails(p => ({ ...p, recipientEmail: e.target.value }))}
                  className="bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-pink-500"
                />
              </div>

              {/* Gift message */}
              <div>
                <p className="text-muted-foreground text-sm font-medium mb-2">Personal message</p>
                <textarea
                  value={giftDetails.message}
                  onChange={e => setGiftDetails(p => ({ ...p, message: e.target.value }))}
                  placeholder="Write a heartfelt message... it will be included in the first box."
                  className="w-full bg-card border border-border rounded-xl p-3 text-foreground text-sm resize-none h-24 focus:outline-none focus:border-pink-500 placeholder:text-muted-foreground"
                />
              </div>

              {/* Wrapping */}
              <div>
                <p className="text-muted-foreground text-sm font-medium mb-2">Gift wrapping</p>
                <div className="grid grid-cols-2 gap-2">
                  {WRAPPING_OPTIONS.map(w => (
                    <button
                      key={w.key}
                      onClick={() => setGiftDetails(p => ({ ...p, wrapping: w.key }))}
                      className={`p-3 rounded-xl border text-left transition-all ${giftDetails.wrapping === w.key ? 'border-pink-500 bg-pink-950/30' : 'border-border bg-card hover:border-primary/40'}`}
                    >
                      <span className="text-xl">{w.icon}</span>
                      <p className={`text-xs mt-1 font-medium ${giftDetails.wrapping === w.key ? 'text-pink-300' : 'text-muted-foreground'}`}>{w.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* First delivery date */}
              <div>
                <p className="text-muted-foreground text-sm font-medium mb-2">Preferred first delivery date</p>
                <Input
                  type="date"
                  min={minDateStr}
                  value={giftDetails.deliveryDate}
                  onChange={e => setGiftDetails(p => ({ ...p, deliveryDate: e.target.value }))}
                  className="bg-card border-border text-foreground focus:border-pink-500"
                />
                <p className="text-muted-foreground text-xs mt-1">Earliest available: {minDateStr}</p>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1 border-border text-muted-foreground">Back</Button>
                <Button onClick={() => setStep(hasCustomizations ? 3 : 4)} className="flex-1 bg-pink-600 hover:bg-pink-500 font-bold rounded-xl">Continue</Button>
              </div>
            </div>
          )}

          {/* ── Step 3: Customise ── */}
          {step === 3 && hasCustomizations && (
            <div className="space-y-5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <p className="text-foreground font-bold">Personalize {isGift ? "the gift box" : "your box"}</p>
              </div>
              {box.customizationOptions.map(opt => (
                <div key={opt.key} className="space-y-2">
                  <p className="text-muted-foreground text-sm font-medium">{opt.label}</p>
                  <div className="flex flex-wrap gap-2">
                    {opt.options.map(o => (
                      <button
                        key={o}
                        onClick={() => setCustomizations(prev => ({ ...prev, [opt.key]: o }))}
                        className={`px-4 py-2 rounded-full text-sm border transition-all ${customizations[opt.key] === o ? 'bg-primary border-primary text-primary-foreground' : 'border-border text-muted-foreground hover:border-primary hover:text-primary'}`}
                      >
                        {o}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <div className="flex gap-3">
                <Button variant="outline" onClick={backFromStep3} className="flex-1 border-border text-muted-foreground">Back</Button>
                <Button onClick={() => setStep(4)} className="flex-1 bg-primary hover:bg-primary/90 font-bold rounded-xl">Continue</Button>
              </div>
            </div>
          )}

          {/* ── Step 4: Shipping + Confirm ── */}
          {step === 4 && (
            <div className="space-y-4">
              <p className="text-muted-foreground font-semibold">{isGift ? "Your details & delivery address" : "Delivery details"}</p>
              <Input
                placeholder="Your email *"
                value={email}
                onChange={e => setEmail(e.target.value)}
                type="email"
                className="bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
              />
              <Input
                placeholder={isGift ? "Recipient's full name" : "Full name"}
                value={shipping.name}
                onChange={e => setShipping(p => ({ ...p, name: e.target.value }))}
                className="bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
              />
              <Input
                placeholder="Street address"
                value={shipping.addressLine1}
                onChange={e => setShipping(p => ({ ...p, addressLine1: e.target.value }))}
                className="bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
              />
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="City" value={shipping.city} onChange={e => setShipping(p => ({ ...p, city: e.target.value }))} className="bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary" />
                <Input placeholder="Postal code" value={shipping.postalCode} onChange={e => setShipping(p => ({ ...p, postalCode: e.target.value }))} className="bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary" />
              </div>

              {/* Summary */}
              <div className="bg-card border border-border rounded-xl p-4 space-y-1.5">
                <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-2">Order Summary</p>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">{box.name}</span><span className="text-foreground">{currency}{price}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Billing</span><span className="text-foreground capitalize">{cycle}</span></div>
                {isGift && <div className="flex justify-between text-sm"><span className="text-muted-foreground">Gift for</span><span className="text-pink-300">{giftDetails.recipientName || '—'}</span></div>}
                {isGift && giftDetails.wrapping !== 'none' && (
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Wrapping</span><span className="text-foreground capitalize">{giftDetails.wrapping}</span></div>
                )}
                {isGift && giftDetails.deliveryDate && (
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">First delivery</span><span className="text-foreground">{giftDetails.deliveryDate}</span></div>
                )}
                {Object.keys(customizations).length > 0 && (
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Customized</span><span className="text-primary">✓ Yes</span></div>
                )}
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={backFromStep4} className="flex-1 border-border text-muted-foreground">Back</Button>
                <Button onClick={handleConfirm} disabled={createMutation.isPending} className={`flex-1 font-bold rounded-xl ${isGift ? 'bg-pink-600 hover:bg-pink-500' : 'bg-primary hover:bg-primary/90'}`}>
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
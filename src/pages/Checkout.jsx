import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useCart } from '../components/cart/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, ShoppingBag, Trash2, CreditCard, Package, ChevronRight, ChevronLeft, MapPin, CheckCircle2, User } from 'lucide-react';
import { toast } from 'sonner';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';

const STEPS = [
  { id: 1, label: 'Summary', icon: <ShoppingBag className="w-4 h-4" /> },
  { id: 2, label: 'Shipping', icon: <MapPin className="w-4 h-4" /> },
  { id: 3, label: 'Payment', icon: <CreditCard className="w-4 h-4" /> },
  { id: 4, label: 'Confirm', icon: <CheckCircle2 className="w-4 h-4" /> },
];

export default function Checkout() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getTotal } = useCart();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGuest, setIsGuest] = useState(true);
  const [email, setEmail] = useState('');
  const [shipping, setShipping] = useState({
    name: '', addressLine1: '', addressLine2: '', city: '', state: '', postalCode: '', country: 'South Africa'
  });
  const [paymentMethod, setPaymentMethod] = useState('paystack');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrderRef, setPlacedOrderRef] = useState('');

  const shf = (key, val) => setShipping(s => ({ ...s, [key]: val }));

  const canProceed = {
    1: cartItems.length > 0,
    2: email && shipping.name && shipping.addressLine1 && shipping.city,
    3: true,
    4: true,
  };

  const handlePay = async () => {
    if (!email) { toast.error('Please enter your email'); return; }
    setIsProcessing(true);
    const orderNumber = `ORD-${Date.now()}`;
    try {
      const handler = window.PaystackPop.setup({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        email,
        amount: getTotal() * 100,
        currency: 'NGN',
        ref: orderNumber,
        callback: async (response) => {
          await base44.entities.Order.create({
            orderNumber,
            items: cartItems.map(i => ({
              serviceId: i.id, serviceName: i.name, productCode: i.productCode || `PROD-${i.id}`,
              quantity: i.quantity, unitPrice: i.price, imageUrl: i.imageUrl
            })),
            buyerEmail: email, totalAmount: getTotal(), currency: 'NGN',
            status: 'confirmed', paystackReference: response.reference,
            paymentStatus: 'paid', shippingAddress: shipping
          });
          await base44.entities.Payment.create({
            transactionId: response.reference, amount: getTotal(), currency: 'NGN',
            gateway: 'Paystack', paymentMethod: 'card', status: 'completed',
            type: 'marketplace', customerEmail: email
          });
          clearCart();
          setPlacedOrderRef(response.reference);
          setOrderPlaced(true);
          setIsProcessing(false);
        },
        onClose: () => { toast.info('Payment cancelled'); setIsProcessing(false); }
      });
      handler.openIframe();
    } catch (e) {
      toast.error('Failed to initialize payment'); setIsProcessing(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center p-6">
        <div className="bg-stone-900 border border-green-700 rounded-3xl p-10 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-green-500">
            <CheckCircle2 className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Order Confirmed!</h1>
          <p className="text-stone-400 mb-2">Thank you for supporting local artisans</p>
          <code className="text-orange-400 text-sm bg-stone-800 px-3 py-1 rounded-lg">{placedOrderRef}</code>
          <div className="flex gap-3 mt-8">
            <Link to={createPageUrl('OrderHistory')} className="flex-1">
              <Button className="w-full bg-orange-600 hover:bg-orange-500 text-white">View Orders</Button>
            </Link>
            <Link to={createPageUrl('Marketplace')} className="flex-1">
              <Button variant="outline" className="w-full border-stone-600 text-stone-300 hover:border-stone-400">Shop More</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0 && step === 1) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center p-6">
        <div className="bg-stone-900 border border-stone-700 rounded-3xl p-10 text-center max-w-md w-full">
          <ShoppingBag className="w-16 h-16 text-stone-600 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-white mb-2">Your cart is empty</h2>
          <p className="text-stone-400 mb-6">Add some handcrafted items to get started</p>
          <Link to={createPageUrl('Marketplace')}>
            <Button className="bg-orange-600 hover:bg-orange-500 text-white px-8">Browse Marketplace</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-white">
      {/* Header */}
      <div className="bg-stone-900 border-b border-stone-700 px-6 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-black">Checkout</h1>
          <Link to={createPageUrl('Marketplace')} className="text-stone-400 text-sm hover:text-white transition-colors">← Back to Marketplace</Link>
        </div>
      </div>

      {/* Step indicator */}
      <div className="bg-stone-900 border-b border-stone-800 px-6 py-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2">
            {STEPS.map((s, i) => (
              <React.Fragment key={s.id}>
                <button
                  onClick={() => step > s.id && setStep(s.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    step === s.id ? 'bg-orange-600 text-white' :
                    step > s.id ? 'text-green-400 hover:bg-stone-800 cursor-pointer' : 'text-stone-600'
                  }`}
                >
                  {step > s.id ? <CheckCircle2 className="w-4 h-4" /> : s.icon}
                  <span className="hidden sm:block">{s.label}</span>
                </button>
                {i < STEPS.length - 1 && <ChevronRight className="w-4 h-4 text-stone-600 flex-shrink-0" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">

            {/* Step 1: Summary */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-xl font-black mb-4">Order Summary</h2>
                {cartItems.map(item => (
                  <div key={item.id} className="bg-stone-900 border border-stone-700 rounded-2xl p-4 flex items-center gap-4">
                    <div className="w-20 h-20 bg-stone-800 rounded-xl overflow-hidden flex-shrink-0">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      ) : <Package className="w-8 h-8 text-stone-600 m-auto mt-5" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-white">{item.name}</h3>
                      {item.productCode && <p className="text-xs text-stone-500">SKU: {item.productCode}</p>}
                      <p className="text-orange-400 font-bold mt-1">${item.price}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 bg-stone-800 rounded-lg flex items-center justify-center hover:bg-stone-700 text-white">-</button>
                      <span className="w-6 text-center font-bold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 bg-stone-800 rounded-lg flex items-center justify-center hover:bg-stone-700 text-white">+</button>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-white text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                      <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-400 mt-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Step 2: Shipping */}
            {step === 2 && (
              <div className="space-y-5">
                <h2 className="text-xl font-black mb-4">Shipping Details</h2>

                {/* Guest vs Account */}
                <div className="flex gap-3">
                  {[{v: true, label: 'Guest Checkout', icon: <User className="w-4 h-4" />},
                    {v: false, label: 'Saved Details', icon: <CheckCircle2 className="w-4 h-4" />}].map(opt => (
                    <button key={String(opt.v)} onClick={() => setIsGuest(opt.v)}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-medium transition-all ${isGuest === opt.v ? 'border-orange-600 bg-orange-600/20 text-orange-300' : 'border-stone-700 text-stone-400 hover:border-stone-500'}`}>
                      {opt.icon} {opt.label}
                    </button>
                  ))}
                </div>

                <div className="bg-stone-900 border border-stone-700 rounded-2xl p-6 space-y-4">
                  <div>
                    <label className="text-xs text-orange-400 uppercase tracking-wider mb-1 block">Email *</label>
                    <Input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="your@email.com"
                      className="bg-stone-800 border-stone-600 text-white placeholder:text-stone-500" />
                  </div>
                  <div>
                    <label className="text-xs text-orange-400 uppercase tracking-wider mb-1 block">Full Name *</label>
                    <Input value={shipping.name} onChange={e => shf('name', e.target.value)} placeholder="Your full name"
                      className="bg-stone-800 border-stone-600 text-white placeholder:text-stone-500" />
                  </div>
                  <div>
                    <label className="text-xs text-orange-400 uppercase tracking-wider mb-1 block">Address Line 1 *</label>
                    <Input value={shipping.addressLine1} onChange={e => shf('addressLine1', e.target.value)} placeholder="123 Main Street"
                      className="bg-stone-800 border-stone-600 text-white placeholder:text-stone-500" />
                  </div>
                  <div>
                    <label className="text-xs text-orange-400 uppercase tracking-wider mb-1 block">Address Line 2</label>
                    <Input value={shipping.addressLine2} onChange={e => shf('addressLine2', e.target.value)} placeholder="Apt, Suite, etc. (optional)"
                      className="bg-stone-800 border-stone-600 text-white placeholder:text-stone-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-orange-400 uppercase tracking-wider mb-1 block">City *</label>
                      <Input value={shipping.city} onChange={e => shf('city', e.target.value)} placeholder="Pretoria"
                        className="bg-stone-800 border-stone-600 text-white placeholder:text-stone-500" />
                    </div>
                    <div>
                      <label className="text-xs text-orange-400 uppercase tracking-wider mb-1 block">Province</label>
                      <Input value={shipping.state} onChange={e => shf('state', e.target.value)} placeholder="Gauteng"
                        className="bg-stone-800 border-stone-600 text-white placeholder:text-stone-500" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-orange-400 uppercase tracking-wider mb-1 block">Postal Code</label>
                      <Input value={shipping.postalCode} onChange={e => shf('postalCode', e.target.value)} placeholder="0001"
                        className="bg-stone-800 border-stone-600 text-white placeholder:text-stone-500" />
                    </div>
                    <div>
                      <label className="text-xs text-orange-400 uppercase tracking-wider mb-1 block">Country</label>
                      <Input value={shipping.country} onChange={e => shf('country', e.target.value)}
                        className="bg-stone-800 border-stone-600 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <div className="space-y-5">
                <h2 className="text-xl font-black mb-4">Payment Method</h2>
                {[
                  { val: 'paystack', label: 'Paystack', desc: 'Card, EFT, Mobile Money', icon: '💳' },
                  { val: 'bank', label: 'Bank Transfer', desc: 'Direct bank transfer (manual confirmation)', icon: '🏦' },
                ].map(m => (
                  <button key={m.val} onClick={() => setPaymentMethod(m.val)}
                    className={`w-full flex items-center gap-4 p-5 rounded-2xl border text-left transition-all ${paymentMethod === m.val ? 'border-orange-600 bg-orange-600/10' : 'border-stone-700 bg-stone-900 hover:border-stone-500'}`}>
                    <span className="text-2xl">{m.icon}</span>
                    <div>
                      <p className="font-bold text-white">{m.label}</p>
                      <p className="text-stone-400 text-sm">{m.desc}</p>
                    </div>
                    <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === m.val ? 'border-orange-500' : 'border-stone-600'}`}>
                      {paymentMethod === m.val && <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />}
                    </div>
                  </button>
                ))}
                <div className="bg-stone-900 border border-stone-700 rounded-2xl p-5 text-sm text-stone-400 flex items-start gap-3">
                  <span className="text-green-400 mt-0.5">🔒</span>
                  <p>Your payment information is encrypted and secure. We never store card details.</p>
                </div>
              </div>
            )}

            {/* Step 4: Confirm */}
            {step === 4 && (
              <div className="space-y-5">
                <h2 className="text-xl font-black mb-4">Review & Confirm</h2>
                <div className="bg-stone-900 border border-stone-700 rounded-2xl p-5 space-y-3">
                  <div>
                    <p className="text-xs text-orange-400 uppercase tracking-wider font-bold mb-1">Contact</p>
                    <p className="text-white">{email}</p>
                  </div>
                  <div className="border-t border-stone-700 pt-3">
                    <p className="text-xs text-orange-400 uppercase tracking-wider font-bold mb-1">Shipping To</p>
                    <p className="text-stone-300 text-sm">{shipping.name}, {shipping.addressLine1}, {shipping.city}, {shipping.country}</p>
                  </div>
                  <div className="border-t border-stone-700 pt-3">
                    <p className="text-xs text-orange-400 uppercase tracking-wider font-bold mb-1">Payment</p>
                    <p className="text-stone-300 text-sm capitalize">{paymentMethod}</p>
                  </div>
                  <div className="border-t border-stone-700 pt-3">
                    <p className="text-xs text-orange-400 uppercase tracking-wider font-bold mb-2">Items ({cartItems.length})</p>
                    {cartItems.map(i => (
                      <div key={i.id} className="flex justify-between text-sm text-stone-300">
                        <span>{i.name} × {i.quantity}</span>
                        <span>${(i.price * i.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex gap-3 mt-6">
              {step > 1 && (
                <Button variant="outline" onClick={() => setStep(s => s - 1)} className="border-stone-600 text-stone-300 hover:border-stone-400 gap-2">
                  <ChevronLeft className="w-4 h-4" /> Back
                </Button>
              )}
              {step < 4 ? (
                <Button onClick={() => setStep(s => s + 1)} disabled={!canProceed[step]}
                  className="flex-1 bg-orange-600 hover:bg-orange-500 text-white font-bold gap-2">
                  Continue <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button onClick={handlePay} disabled={isProcessing}
                  className="flex-1 bg-orange-600 hover:bg-orange-500 text-white font-bold text-lg py-6 gap-2">
                  {isProcessing ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</> : <><CreditCard className="w-5 h-5" /> Place Order · ${getTotal().toFixed(2)}</>}
                </Button>
              )}
            </div>
          </div>

          {/* Order summary sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-stone-900 border border-stone-700 rounded-2xl p-5 sticky top-6">
              <h3 className="font-bold text-white mb-4">Order Total</h3>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between text-stone-400">
                  <span>Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span>${getTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>Shipping</span>
                  <span className="text-green-400">FREE</span>
                </div>
              </div>
              <div className="border-t border-stone-700 pt-3 flex justify-between font-black text-lg">
                <span>Total</span>
                <span className="text-orange-400">${getTotal().toFixed(2)}</span>
              </div>
              <div className="mt-4 text-xs text-stone-500 text-center">
                🌍 Proudly supporting South African artisans
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
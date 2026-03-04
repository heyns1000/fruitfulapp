import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useCart } from '../components/cart/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, ShoppingBag, Trash2, CreditCard, Package, ChevronRight, ChevronLeft, CheckCircle2, Truck, User } from 'lucide-react';
import { toast } from 'sonner';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';

const STEPS = ['Cart', 'Shipping', 'Payment', 'Confirm'];

const StepIndicator = ({ current }) => (
  <div className="flex items-center justify-center gap-2 mb-10">
    {STEPS.map((step, i) => (
      <React.Fragment key={step}>
        <div className={`flex items-center gap-2 ${i <= current ? 'text-orange-400' : 'text-stone-600'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black border-2 transition-colors ${i < current ? 'bg-orange-600 border-orange-600 text-white' : i === current ? 'border-orange-500 text-orange-400' : 'border-stone-700 text-stone-600'}`}>
            {i < current ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
          </div>
          <span className="text-xs font-bold hidden sm:block">{step}</span>
        </div>
        {i < STEPS.length - 1 && <div className={`h-0.5 w-8 sm:w-16 transition-colors ${i < current ? 'bg-orange-600' : 'bg-stone-700'}`} />}
      </React.Fragment>
    ))}
  </div>
);

export default function Checkout() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getTotal } = useCart();
  const [step, setStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGuest, setIsGuest] = useState(true);
  const [savedInfo, setSavedInfo] = useState(null);

  const [email, setEmail] = useState('');
  const [shipping, setShipping] = useState({ name: '', addressLine1: '', addressLine2: '', city: '', state: '', postalCode: '', country: 'South Africa' });
  const [paymentMethod, setPaymentMethod] = useState('paystack');
  const [completedOrder, setCompletedOrder] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('faa_customer_info');
    if (saved) { try { const d = JSON.parse(saved); setSavedInfo(d); } catch {} }
  }, []);

  const useSavedInfo = () => {
    if (savedInfo) { setEmail(savedInfo.email || ''); setShipping(savedInfo.shipping || shipping); }
  };

  const saveCustomerInfo = () => {
    localStorage.setItem('faa_customer_info', JSON.stringify({ email, shipping }));
    toast.success('Details saved for next time!');
  };

  const handlePayWithPaystack = async () => {
    setIsProcessing(true);
    const totalAmount = getTotal() * 100;
    const orderNumber = `ORD-${Date.now()}`;

    try {
      const handler = window.PaystackPop.setup({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        email,
        amount: totalAmount,
        currency: 'ZAR',
        ref: orderNumber,
        callback: async (response) => {
          const order = await base44.entities.Order.create({
            orderNumber, items: cartItems.map(item => ({ serviceId: item.id, serviceName: item.name, productCode: item.productCode || `PROD-${item.id}`, quantity: item.quantity, unitPrice: item.price, imageUrl: item.imageUrl })),
            buyerEmail: email, totalAmount: getTotal(), currency: 'ZAR', status: 'confirmed', paystackReference: response.reference, paymentStatus: 'paid', shippingAddress: shipping,
          });
          await base44.entities.Payment.create({ transactionId: response.reference, amount: getTotal(), currency: 'ZAR', gateway: 'Paystack', paymentMethod: 'card', status: 'completed', type: 'marketplace', customerEmail: email });
          clearCart();
          setCompletedOrder({ ...order, orderNumber });
          setStep(4);
          setIsProcessing(false);
          if (!isGuest) saveCustomerInfo();
        },
        onClose: () => { toast.info('Payment cancelled'); setIsProcessing(false); }
      });
      handler.openIframe();
    } catch (e) {
      toast.error('Failed to initialize payment'); setIsProcessing(false);
    }
  };

  const handleSimulatedPay = async () => {
    setIsProcessing(true);
    const orderNumber = `ORD-${Date.now()}`;
    const order = await base44.entities.Order.create({
      orderNumber, items: cartItems.map(item => ({ serviceId: item.id, serviceName: item.name, productCode: item.productCode || `PROD-${item.id}`, quantity: item.quantity, unitPrice: item.price, imageUrl: item.imageUrl })),
      buyerEmail: email, totalAmount: getTotal(), currency: 'USD', status: 'confirmed', paymentStatus: 'paid', shippingAddress: shipping,
    });
    clearCart();
    setCompletedOrder({ ...order, orderNumber });
    setStep(4);
    setIsProcessing(false);
    if (!isGuest) saveCustomerInfo();
  };

  if (cartItems.length === 0 && step < 4) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <ShoppingBag className="w-16 h-16 mx-auto text-stone-600" />
          <h2 className="text-2xl font-black text-white">Your cart is empty</h2>
          <Link to={createPageUrl('Marketplace')}>
            <Button className="bg-orange-600 hover:bg-orange-500">Browse Marketplace</Button>
          </Link>
        </div>
      </div>
    );
  }

  // SUCCESS SCREEN
  if (step === 4) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-black text-white">Order Placed!</h1>
          <div className="bg-stone-900 border border-stone-700 rounded-2xl p-6 text-left space-y-2">
            <p className="text-stone-400 text-sm">Order Number</p>
            <p className="text-orange-400 font-mono font-bold text-lg">{completedOrder?.orderNumber}</p>
            <p className="text-stone-400 text-sm mt-3">Confirmation sent to</p>
            <p className="text-white font-medium">{email}</p>
          </div>
          <p className="text-stone-400 text-sm">Thank you for supporting local artisans. <span className="text-orange-400 font-bold">Proudly Fruitful 🌿</span></p>
          <div className="flex gap-3 justify-center">
            <Link to={createPageUrl('OrderHistory')}>
              <Button variant="outline" className="border-stone-600 text-stone-300 hover:bg-stone-800">View Orders</Button>
            </Link>
            <Link to={createPageUrl('Marketplace')}>
              <Button className="bg-orange-600 hover:bg-orange-500">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-white">
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Back */}
        <Link to={createPageUrl('Marketplace')} className="inline-flex items-center gap-1 text-stone-400 hover:text-white text-sm mb-6">
          <ChevronLeft className="w-4 h-4" /> Back to Marketplace
        </Link>

        <h1 className="text-4xl font-black mb-2">Checkout</h1>
        <StepIndicator current={step} />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main panel */}
          <div className="lg:col-span-2">

            {/* STEP 0: CART */}
            {step === 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-black text-white flex items-center gap-2"><Package className="w-5 h-5 text-orange-400" /> Your Cart</h2>
                {cartItems.map(item => (
                  <div key={item.id} className="bg-stone-900 border border-stone-700 rounded-xl p-4 flex items-center gap-4">
                    {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-lg border border-stone-700" /> : <div className="w-16 h-16 bg-stone-800 rounded-lg border border-stone-700 flex items-center justify-center"><Package className="w-6 h-6 text-stone-600" /></div>}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white text-sm">{item.name}</p>
                      <p className="text-stone-400 text-xs">{item.brandName}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 bg-stone-700 hover:bg-stone-600 rounded-full font-bold text-sm flex items-center justify-center">-</button>
                      <span className="w-6 text-center font-bold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 bg-stone-700 hover:bg-stone-600 rounded-full font-bold text-sm flex items-center justify-center">+</button>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-orange-400">${(item.price * item.quantity).toLocaleString()}</p>
                      <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-300 mt-1"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
                <Button onClick={() => setStep(1)} className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-6 text-lg mt-4">
                  Continue to Shipping <ChevronRight className="w-5 h-5 ml-1" />
                </Button>
              </div>
            )}

            {/* STEP 1: SHIPPING */}
            {step === 1 && (
              <div className="space-y-5">
                <h2 className="text-xl font-black flex items-center gap-2"><Truck className="w-5 h-5 text-orange-400" /> Shipping Details</h2>

                {/* Guest / Returning */}
                <div className="flex gap-3">
                  <button onClick={() => setIsGuest(true)} className={`flex-1 py-3 rounded-xl border font-bold text-sm transition-colors ${isGuest ? 'border-orange-500 bg-orange-900/20 text-orange-300' : 'border-stone-700 text-stone-400 hover:border-stone-500'}`}>
                    <User className="w-4 h-4 inline mr-1" /> Guest Checkout
                  </button>
                  <button onClick={() => { setIsGuest(false); useSavedInfo(); }} className={`flex-1 py-3 rounded-xl border font-bold text-sm transition-colors ${!isGuest ? 'border-orange-500 bg-orange-900/20 text-orange-300' : 'border-stone-700 text-stone-400 hover:border-stone-500'}`}>
                    ⚡ Use Saved Details {savedInfo && '✓'}
                  </button>
                </div>

                <div className="grid gap-4">
                  <div><label className="text-xs text-stone-400 uppercase font-bold mb-1 block">Email</label>
                    <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="bg-stone-800 border-stone-600 text-white placeholder:text-stone-500" /></div>
                  <div><label className="text-xs text-stone-400 uppercase font-bold mb-1 block">Full Name</label>
                    <Input value={shipping.name} onChange={e => setShipping(s => ({ ...s, name: e.target.value }))} placeholder="John Doe" className="bg-stone-800 border-stone-600 text-white placeholder:text-stone-500" /></div>
                  <div><label className="text-xs text-stone-400 uppercase font-bold mb-1 block">Address</label>
                    <Input value={shipping.addressLine1} onChange={e => setShipping(s => ({ ...s, addressLine1: e.target.value }))} placeholder="123 Main Street" className="bg-stone-800 border-stone-600 text-white placeholder:text-stone-500" /></div>
                  <div><label className="text-xs text-stone-400 uppercase font-bold mb-1 block">Apt / Suite (Optional)</label>
                    <Input value={shipping.addressLine2} onChange={e => setShipping(s => ({ ...s, addressLine2: e.target.value }))} placeholder="Apt 4B" className="bg-stone-800 border-stone-600 text-white placeholder:text-stone-500" /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="text-xs text-stone-400 uppercase font-bold mb-1 block">City</label>
                      <Input value={shipping.city} onChange={e => setShipping(s => ({ ...s, city: e.target.value }))} placeholder="Pretoria" className="bg-stone-800 border-stone-600 text-white placeholder:text-stone-500" /></div>
                    <div><label className="text-xs text-stone-400 uppercase font-bold mb-1 block">Province</label>
                      <Input value={shipping.state} onChange={e => setShipping(s => ({ ...s, state: e.target.value }))} placeholder="Gauteng" className="bg-stone-800 border-stone-600 text-white placeholder:text-stone-500" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="text-xs text-stone-400 uppercase font-bold mb-1 block">Postal Code</label>
                      <Input value={shipping.postalCode} onChange={e => setShipping(s => ({ ...s, postalCode: e.target.value }))} placeholder="0001" className="bg-stone-800 border-stone-600 text-white placeholder:text-stone-500" /></div>
                    <div><label className="text-xs text-stone-400 uppercase font-bold mb-1 block">Country</label>
                      <Input value={shipping.country} onChange={e => setShipping(s => ({ ...s, country: e.target.value }))} className="bg-stone-800 border-stone-600 text-white" /></div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button onClick={() => setStep(0)} variant="ghost" className="text-stone-400 hover:text-white"><ChevronLeft className="w-4 h-4 mr-1" /> Back</Button>
                  <Button onClick={() => { if (!email || !shipping.name || !shipping.city) { toast.error('Please fill required fields'); return; } setStep(2); }}
                    className="flex-1 bg-orange-600 hover:bg-orange-500 font-bold py-6">
                    Continue to Payment <ChevronRight className="w-5 h-5 ml-1" />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 2: PAYMENT */}
            {step === 2 && (
              <div className="space-y-5">
                <h2 className="text-xl font-black flex items-center gap-2"><CreditCard className="w-5 h-5 text-orange-400" /> Payment Method</h2>
                <div className="space-y-3">
                  {[
                    { id: 'paystack', label: 'Paystack', desc: 'Card, EFT, Mobile Money', icon: '🔐' },
                    { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when you receive', icon: '💵' },
                  ].map(method => (
                    <button key={method.id} onClick={() => setPaymentMethod(method.id)}
                      className={`w-full text-left p-4 rounded-xl border transition-colors flex items-center gap-4 ${paymentMethod === method.id ? 'border-orange-500 bg-orange-900/20' : 'border-stone-700 bg-stone-900 hover:border-stone-500'}`}>
                      <span className="text-2xl">{method.icon}</span>
                      <div>
                        <p className="font-bold text-white">{method.label}</p>
                        <p className="text-stone-400 text-xs">{method.desc}</p>
                      </div>
                      <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === method.id ? 'border-orange-500' : 'border-stone-600'}`}>
                        {paymentMethod === method.id && <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />}
                      </div>
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <Button onClick={() => setStep(1)} variant="ghost" className="text-stone-400 hover:text-white"><ChevronLeft className="w-4 h-4 mr-1" /> Back</Button>
                  <Button onClick={() => setStep(3)} className="flex-1 bg-orange-600 hover:bg-orange-500 font-bold py-6">
                    Review Order <ChevronRight className="w-5 h-5 ml-1" />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 3: CONFIRM */}
            {step === 3 && (
              <div className="space-y-5">
                <h2 className="text-xl font-black flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-orange-400" /> Confirm Order</h2>

                <div className="bg-stone-900 border border-stone-700 rounded-xl p-4 space-y-3">
                  <p className="text-xs text-orange-400 font-bold uppercase tracking-wider">Delivering to</p>
                  <p className="text-white font-medium">{shipping.name}</p>
                  <p className="text-stone-400 text-sm">{shipping.addressLine1}, {shipping.city}, {shipping.country}</p>
                  <p className="text-stone-400 text-sm">{email}</p>
                </div>

                <div className="bg-stone-900 border border-stone-700 rounded-xl p-4 space-y-2">
                  <p className="text-xs text-orange-400 font-bold uppercase tracking-wider mb-2">Payment</p>
                  <p className="text-white font-medium">{paymentMethod === 'paystack' ? '🔐 Paystack' : '💵 Cash on Delivery'}</p>
                </div>

                {!isGuest && (
                  <button onClick={saveCustomerInfo} className="text-xs text-orange-400 hover:underline">💾 Save my details for next time</button>
                )}

                <div className="flex gap-3">
                  <Button onClick={() => setStep(2)} variant="ghost" className="text-stone-400 hover:text-white"><ChevronLeft className="w-4 h-4 mr-1" /> Back</Button>
                  <Button
                    onClick={paymentMethod === 'paystack' ? handlePayWithPaystack : handleSimulatedPay}
                    disabled={isProcessing}
                    className="flex-1 bg-orange-600 hover:bg-orange-500 font-bold py-6 text-lg">
                    {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : `Place Order · $${getTotal().toLocaleString()}`}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Order summary sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-stone-900 border border-stone-700 rounded-2xl p-5 space-y-4 sticky top-6">
              <h3 className="font-black text-white border-b border-stone-700 pb-3">Order Summary</h3>
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center gap-2 text-sm">
                  <span className="text-stone-400 flex-1 truncate">{item.name} <span className="text-stone-500">×{item.quantity}</span></span>
                  <span className="text-white font-bold">${(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div className="border-t border-stone-700 pt-3 space-y-1 text-sm">
                <div className="flex justify-between text-stone-400"><span>Subtotal</span><span>${getTotal().toLocaleString()}</span></div>
                <div className="flex justify-between text-green-400"><span>Shipping</span><span>FREE</span></div>
                <div className="flex justify-between text-white font-black text-lg pt-1 border-t border-stone-700"><span>Total</span><span className="text-orange-400">${getTotal().toLocaleString()}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
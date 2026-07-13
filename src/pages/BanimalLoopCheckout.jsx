import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { ShoppingBag, Truck, CreditCard, Sparkles, CheckCircle, Loader2, MessageCircle, ChevronRight, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const BANIMAL_PRODUCTS = [
  { id: 'ban-001', name: 'Banimal Starter Bundle', price: 299, currency: 'ZAR', description: '3 premium foam sealant units + installation kit', image: '🐾' },
  { id: 'ban-002', name: 'Block Box Pro Kit', price: 599, currency: 'ZAR', description: 'Universal foam sealant pro set — 6 units + accessories', image: '📦' },
  { id: 'ban-003', name: 'VaultMesh™ API License', price: 4999, currency: 'ZAR', description: 'Annual API access license — multi-provider gateway', image: '🔐' },
];

const STEPS = ['Cart', 'Shipping', 'Payment', 'Confirm'];

export default function BanimalLoopCheckout() {
  const [step, setStep] = useState(0);
  const [cart, setCart] = useState([BANIMAL_PRODUCTS[0]]);
  const [shipping, setShipping] = useState({ name: '', address: '', city: '', province: '', postalCode: '', email: '', phone: '' });
  const [paymentMethod, setPaymentMethod] = useState('paystack');
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [processing, setProcessing] = useState(false);

  const subtotal = cart.reduce((s, p) => s + p.price, 0);
  const deliveryFee = subtotal > 500 ? 0 : 99;
  const total = subtotal + deliveryFee;

  const addToCart = (p) => {
    if (!cart.find(c => c.id === p.id)) setCart(prev => [...prev, p]);
  };
  const removeFromCart = (id) => setCart(prev => prev.filter(c => c.id !== id));

  const askAI = async () => {
    if (!aiQuestion.trim()) return;
    setAiLoading(true);
    setAiAnswer('');
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `You are the Banimal Loop™ checkout assistant for FAA.ZONE. Answer this customer question concisely and helpfully: "${aiQuestion}". Context: We ship across South Africa. Payment via Paystack (EFT, card, Ozow). Delivery 3-5 business days. Products include foam sealants and API licenses.`,
    });
    setAiAnswer(res);
    setAiLoading(false);
  };

  const placeOrder = async () => {
    setProcessing(true);
    await new Promise(r => setTimeout(r, 1800));
    setProcessing(false);
    setOrderComplete(true);
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-[#1a1a1c] flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-400" />
          </div>
          <h2 className="text-3xl font-black text-white mb-2">Order Confirmed!</h2>
          <p className="text-slate-400 mb-1">Banimal Loop™ Order Reference: <span className="text-green-400 font-mono">BAN-{Date.now().toString().slice(-8)}</span></p>
          <p className="text-slate-500 text-sm mb-8">A confirmation will be sent to {shipping.email || 'your email'}. Delivery: 3–5 business days.</p>
          <div className="bg-[#2a2a2e] border border-[#3a3a3e] rounded-2xl p-5 mb-6 text-left">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Order Summary</p>
            {cart.map(p => (
              <div key={p.id} className="flex justify-between text-sm mb-2">
                <span className="text-slate-300">{p.name}</span>
                <span className="text-white font-semibold">R{p.price.toLocaleString()}</span>
              </div>
            ))}
            <div className="border-t border-[#3a3a3e] mt-3 pt-3 flex justify-between font-bold">
              <span className="text-white">Total Paid</span>
              <span className="text-green-400">R{total.toLocaleString()}</span>
            </div>
          </div>
          <Link to="/Dashboard" className="inline-block px-6 py-3 bg-[#4CAF50] text-white font-bold rounded-full hover:bg-green-500 transition-colors">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1c] text-white" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Header */}
      <header className="bg-[#4CAF50] sticky top-0 z-40 px-6 py-5 text-center shadow-lg">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">🌐 Banimal Loop™</h1>
        <p className="text-green-100 text-sm mt-0.5">VaultMesh™ Powered Checkout</p>
      </header>

      {/* Step Progress */}
      <div className="bg-[#2a2a2e] border-b border-[#3a3a3e] px-6 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                i < step ? 'bg-green-500 text-white' :
                i === step ? 'bg-[#8A2BE2] text-white' :
                'bg-[#3a3a3e] text-slate-500'
              }`}>
                {i < step ? <CheckCircle className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${i === step ? 'text-white' : 'text-slate-500'}`}>{s}</span>
              {i < STEPS.length - 1 && <ChevronRight className="w-4 h-4 text-slate-600 ml-1" />}
            </div>
          ))}
        </div>
      </div>

      <main className="max-w-2xl mx-auto p-5 space-y-5">

        {/* STEP 0: Cart */}
        {step === 0 && (
          <div>
            <div className="bg-[#2a2a2e] border border-[#3a3a3e] rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-5">🛒 Your Cart</h2>
              {cart.length === 0 ? (
                <p className="text-slate-500 text-center py-8">Your cart is empty</p>
              ) : (
                <div className="space-y-3">
                  {cart.map(p => (
                    <div key={p.id} className="flex items-center justify-between bg-[#1a1a1c] rounded-xl p-4 border border-[#3a3a3e]">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{p.image}</span>
                        <div>
                          <p className="font-semibold text-sm text-white">{p.name}</p>
                          <p className="text-xs text-slate-500">{p.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-white">R{p.price.toLocaleString()}</span>
                        <button onClick={() => removeFromCart(p.id)} className="text-red-400 hover:text-red-300 text-xs px-2 py-1 rounded bg-red-900/20">Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add Products */}
            <div className="bg-[#2a2a2e] border border-[#3a3a3e] rounded-2xl p-6">
              <h3 className="text-base font-bold mb-4 text-slate-300">Available Products</h3>
              <div className="space-y-2">
                {BANIMAL_PRODUCTS.filter(p => !cart.find(c => c.id === p.id)).map(p => (
                  <div key={p.id} className="flex items-center justify-between bg-[#1a1a1c] rounded-xl p-4 border border-[#3a3a3e]">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{p.image}</span>
                      <div>
                        <p className="font-semibold text-sm text-white">{p.name}</p>
                        <p className="text-xs text-slate-500">R{p.price.toLocaleString()} {p.currency}</p>
                      </div>
                    </div>
                    <button onClick={() => addToCart(p)} className="text-xs px-3 py-1.5 bg-[#8A2BE2] hover:bg-purple-600 text-white rounded-full font-semibold transition-colors">+ Add</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="bg-[#2a2a2e] border border-[#3a3a3e] rounded-2xl p-5">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-400"><span>Subtotal</span><span>R{subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between text-slate-400"><span>Delivery</span><span>{deliveryFee === 0 ? <span className="text-green-400">Free</span> : `R${deliveryFee}`}</span></div>
                <div className="flex justify-between font-bold text-lg border-t border-[#3a3a3e] pt-3 mt-2"><span>Total</span><span className="text-green-400">R{total.toLocaleString()}</span></div>
              </div>
            </div>

            <button disabled={cart.length === 0} onClick={() => setStep(1)} className="w-full h-14 rounded-full bg-[#8A2BE2] hover:bg-purple-600 disabled:opacity-40 text-white font-bold text-lg transition-colors">
              Proceed to Shipping →
            </button>
          </div>
        )}

        {/* STEP 1: Shipping */}
        {step === 1 && (
          <div>
            <div className="bg-[#2a2a2e] border border-[#3a3a3e] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <Truck className="w-5 h-5 text-purple-400" />
                <h2 className="text-xl font-bold">Shipping Details</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  ['Full Name', 'name', 'text', 'John Smith'],
                  ['Email Address', 'email', 'email', 'john@example.com'],
                  ['Phone Number', 'phone', 'tel', '+27 82 000 0000'],
                  ['Street Address', 'address', 'text', '123 Main Road'],
                  ['City', 'city', 'text', 'Johannesburg'],
                  ['Province', 'province', 'text', 'Gauteng'],
                  ['Postal Code', 'postalCode', 'text', '2000'],
                ].map(([label, key, type, placeholder]) => (
                  <div key={key} className={key === 'address' ? 'sm:col-span-2' : ''}>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">{label}</label>
                    <input
                      type={type}
                      placeholder={placeholder}
                      value={shipping[key]}
                      onChange={e => setShipping(prev => ({ ...prev, [key]: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-[#3a3a3e] border border-[#4a4a4e] text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 text-sm"
                    />
                  </div>
                ))}
              </div>
              {deliveryFee === 0 && (
                <div className="mt-4 bg-green-900/20 border border-green-700/40 rounded-xl px-4 py-3 text-green-400 text-sm">
                  🎉 Free delivery on orders over R500!
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(0)} className="flex-1 h-12 rounded-full border border-[#3a3a3e] text-slate-400 hover:bg-[#2a2a2e] font-semibold transition-colors">← Back</button>
              <button
                onClick={() => setStep(2)}
                disabled={!shipping.name || !shipping.email || !shipping.address}
                className="flex-[2] h-12 rounded-full bg-[#8A2BE2] hover:bg-purple-600 disabled:opacity-40 text-white font-bold transition-colors"
              >
                Continue to Payment →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Payment */}
        {step === 2 && (
          <div>
            <div className="bg-[#2a2a2e] border border-[#3a3a3e] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <CreditCard className="w-5 h-5 text-purple-400" />
                <h2 className="text-xl font-bold">Payment Method</h2>
              </div>

              <div className="space-y-3">
                {[
                  { id: 'paystack', label: 'Paystack', desc: 'Card, EFT, Ozow — South Africa', icon: '💳', badge: 'Recommended' },
                  { id: 'ozow', label: 'Ozow Instant EFT', desc: 'All major South African banks', icon: '🏦', badge: null },
                  { id: 'yoco', label: 'Yoco', desc: 'Card payments via Yoco', icon: '📱', badge: null },
                ].map(pm => (
                  <button
                    key={pm.id}
                    onClick={() => setPaymentMethod(pm.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                      paymentMethod === pm.id
                        ? 'border-[#8A2BE2] bg-purple-900/20'
                        : 'border-[#3a3a3e] bg-[#1a1a1c] hover:border-slate-600'
                    }`}
                  >
                    <span className="text-2xl">{pm.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm text-white">{pm.label}</p>
                        {pm.badge && <span className="text-xs px-2 py-0.5 bg-green-900/50 text-green-400 rounded-full font-medium">{pm.badge}</span>}
                      </div>
                      <p className="text-xs text-slate-500">{pm.desc}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === pm.id ? 'border-[#8A2BE2]' : 'border-slate-600'}`}>
                      {paymentMethod === pm.id && <div className="w-2.5 h-2.5 rounded-full bg-[#8A2BE2]" />}
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-5 bg-[#1a1a1c] rounded-xl p-4 border border-[#3a3a3e]">
                <div className="flex items-center gap-2 mb-2 text-slate-400">
                  <Lock className="w-4 h-4" />
                  <span className="text-xs font-semibold">VaultMesh™ Secured — PCI Compliant</span>
                </div>
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-slate-300">Amount to Pay:</span>
                  <span className="text-green-400 text-lg">R{total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* AI Assistant */}
            <div className="bg-[#2a2a2e] border border-[#3a3a3e] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h3 className="font-bold">AI Checkout Assistant</h3>
              </div>
              <textarea
                rows={2}
                value={aiQuestion}
                onChange={e => setAiQuestion(e.target.value)}
                placeholder="Ask about shipping, returns, payment, product details..."
                className="w-full px-4 py-3 rounded-xl bg-[#3a3a3e] border border-[#4a4a4e] text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 text-sm resize-none"
              />
              <button
                onClick={askAI}
                disabled={aiLoading || !aiQuestion.trim()}
                className="mt-2 w-full h-11 rounded-full bg-[#8A2BE2] hover:bg-purple-600 disabled:opacity-40 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
              >
                {aiLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Thinking...</> : <><MessageCircle className="w-4 h-4" /> Ask AI</>}
              </button>
              {aiAnswer && (
                <div className="mt-3 p-4 bg-purple-900/20 border border-purple-700/40 rounded-xl text-sm text-purple-200 leading-relaxed">
                  {aiAnswer}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 h-12 rounded-full border border-[#3a3a3e] text-slate-400 hover:bg-[#2a2a2e] font-semibold transition-colors">← Back</button>
              <button onClick={() => setStep(3)} className="flex-[2] h-12 rounded-full bg-[#8A2BE2] hover:bg-purple-600 text-white font-bold transition-colors">Review Order →</button>
            </div>
          </div>
        )}

        {/* STEP 3: Confirm */}
        {step === 3 && (
          <div>
            <div className="bg-[#2a2a2e] border border-[#3a3a3e] rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-5">✅ Order Review</h2>

              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Items</p>
                  {cart.map(p => (
                    <div key={p.id} className="flex justify-between py-2 border-b border-[#3a3a3e]">
                      <span className="text-slate-300">{p.image} {p.name}</span>
                      <span className="text-white font-semibold">R{p.price.toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Shipping To</p>
                  <div className="text-slate-300 space-y-0.5">
                    <p>{shipping.name}</p>
                    <p>{shipping.address}, {shipping.city}, {shipping.province} {shipping.postalCode}</p>
                    <p>{shipping.email}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Payment</p>
                  <p className="text-slate-300 capitalize">{paymentMethod}</p>
                </div>

                <div className="bg-[#1a1a1c] rounded-xl p-4 border border-[#3a3a3e]">
                  <div className="flex justify-between text-slate-400 text-sm mb-1"><span>Subtotal</span><span>R{subtotal.toLocaleString()}</span></div>
                  <div className="flex justify-between text-slate-400 text-sm mb-3"><span>Delivery</span><span>{deliveryFee === 0 ? 'Free' : `R${deliveryFee}`}</span></div>
                  <div className="flex justify-between font-black text-lg"><span>Total</span><span className="text-green-400">R{total.toLocaleString()}</span></div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="flex-1 h-12 rounded-full border border-[#3a3a3e] text-slate-400 hover:bg-[#2a2a2e] font-semibold transition-colors">← Back</button>
              <button
                onClick={placeOrder}
                disabled={processing}
                className="flex-[2] h-14 rounded-full bg-[#4CAF50] hover:bg-green-500 disabled:opacity-70 text-white font-black text-lg transition-colors flex items-center justify-center gap-2"
              >
                {processing ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</> : <>Place Order — R{total.toLocaleString()}</>}
              </button>
            </div>

            <p className="text-center text-xs text-slate-600 mt-3 flex items-center justify-center gap-1">
              <Lock className="w-3 h-3" /> Secured by VaultMesh™ | PCI DSS Compliant
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
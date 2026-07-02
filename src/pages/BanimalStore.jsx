import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, X, Plus, Minus, Loader2 } from 'lucide-react';

const CATEGORIES = ['All', 'Babygrow', 'Bib', 'Print'];

const categoryOf = (code = '') => {
  if (code.startsWith('babygrow')) return 'Babygrow';
  if (code.startsWith('bib')) return 'Bib';
  if (code.startsWith('print')) return 'Print';
  return 'Other';
};

export default function BanimalStore() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(null); // null | 'form'
  const [form, setForm] = useState({ name: '', email: '', phone: '', line1: '', city: '', province: '', postalCode: '' });
  const [placing, setPlacing] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['banimal-products'],
    queryFn: () => base44.entities.MarketplaceService.filter({ brandId: 'banimal', status: 'active' }, '-created_date', 100),
  });

  const filtered = useMemo(() =>
    activeCategory === 'All' ? products : products.filter(p => categoryOf(p.productCode) === activeCategory),
    [products, activeCategory]
  );

  const addToCart = (product) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === product.id);
      if (ex) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { id: product.id, name: product.serviceName, price: product.pricing?.ZAR || 0, productCode: product.productCode, qty: 1 }];
    });
    setCartOpen(true);
  };

  const updateQty = (id, delta) => setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter(i => i.qty > 0));
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const placeOrder = async () => {
    setPlacing(true);
    const orderId = `BAN-${Date.now().toString().slice(-8)}`;
    const order = await base44.entities.BanimalOrder.create({
      orderId,
      customerName: form.name,
      customerEmail: form.email,
      customerPhone: form.phone,
      items: cart.map(i => ({ productCode: i.productCode, name: i.name, qty: i.qty, unitPrice: i.price })),
      subtotal: cartTotal,
      deliveryFee: 0,
      total: cartTotal,
      currency: 'ZAR',
      paymentStatus: 'pending',
      shippingAddress: { name: form.name, line1: form.line1, city: form.city, province: form.province, postalCode: form.postalCode, country: 'ZA' },
      emailSent: false,
    });
    setPlacedOrder(order);
    setCart([]);
    setCartOpen(false);
    setCheckoutStep(null);
    setPlacing(false);
  };

  if (placedOrder) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#1a0a00' }}>
        <div className="text-center max-w-md p-8 rounded-2xl border" style={{ background: '#2a1200', borderColor: '#c25f1a' }}>
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-black text-white mb-2">Order Placed!</h2>
          <p className="text-amber-400 font-bold text-lg mb-1">{placedOrder.orderId}</p>
          <p className="text-stone-400 text-sm mb-6">We'll confirm your order and send tracking once payment is received. Check your email at <strong>{placedOrder.customerEmail}</strong>.</p>
          <Button onClick={() => setPlacedOrder(null)} className="bg-amber-600 hover:bg-amber-700 text-white">Continue Shopping</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#1a0a00' }}>
      {/* Header */}
      <header style={{ background: '#2a1200', borderBottom: '1px solid #c25f1a33' }} className="sticky top-0 z-40 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black italic text-white tracking-tight">banimal<span className="text-amber-500">™</span></h1>
            <p className="text-[10px] uppercase tracking-[0.4em] text-amber-700">Premium Cotton Baby Essentials · Made in SA</p>
          </div>
          <button onClick={() => setCartOpen(true)} className="relative flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-white transition-all" style={{ background: '#c25f1a' }}>
            <ShoppingCart className="w-4 h-4" />
            Shop Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center" style={{ background: '#ff3300', color: '#fff' }}>{cartCount}</span>
            )}
          </button>
        </div>
      </header>

      {/* Hero */}
      <div className="text-center py-14 px-6" style={{ background: 'linear-gradient(180deg, #2a1200 0%, #1a0a00 100%)' }}>
        <p className="text-amber-500 text-xs font-bold uppercase tracking-[0.4em] mb-3">banimal.co.za</p>
        <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Creatures Worth Wearing</h2>
        <p className="text-stone-400 max-w-lg mx-auto text-sm">Ethically made, 100% cotton baby essentials. Babygrows, bibs, and framed nursery prints — designed with love in South Africa.</p>
      </div>

      {/* Category Filter */}
      <div className="max-w-6xl mx-auto px-6 mb-8 flex gap-2 flex-wrap">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full text-sm font-bold border transition-all ${activeCategory === cat ? 'text-black border-amber-500' : 'text-stone-400 border-stone-700 hover:border-stone-500'}`}
            style={activeCategory === cat ? { background: '#f59e0b' } : { background: 'transparent' }}>
            {cat}
          </button>
        ))}
        <span className="ml-auto text-xs text-stone-600 self-center">{filtered.length} products</span>
      </div>

      {/* Product Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        {isLoading ? (
          <div className="flex items-center justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-amber-500" /></div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {filtered.map(p => (
              <div key={p.id} className="rounded-2xl overflow-hidden flex flex-col border transition-all hover:border-amber-700/60" style={{ background: '#2a1200', borderColor: '#3a1800' }}>
                <div className="aspect-square flex items-center justify-center text-5xl" style={{ background: '#3a1800' }}>
                  {categoryOf(p.productCode) === 'Babygrow' ? '👶' : categoryOf(p.productCode) === 'Bib' ? '🧷' : '🖼️'}
                </div>
                <div className="p-4 flex flex-col flex-1 gap-2">
                  <Badge className="self-start text-[10px] px-2" style={{ background: '#c25f1a22', color: '#f59e0b', border: '1px solid #c25f1a44' }}>{categoryOf(p.productCode)}</Badge>
                  <p className="text-white font-bold text-sm leading-snug line-clamp-2">{p.serviceName}</p>
                  <p className="text-amber-400 font-black text-xl mt-auto">R{(p.pricing?.ZAR || 0).toFixed(2)}</p>
                  <Button onClick={() => addToCart(p)} className="w-full mt-2 font-bold" style={{ background: '#c25f1a' }}>
                    Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cart Sidebar */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/60" onClick={() => setCartOpen(false)} />
          <div className="w-full max-w-sm flex flex-col h-full shadow-2xl" style={{ background: '#1e0d00' }}>
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#c25f1a33' }}>
              <h3 className="font-black text-white text-lg">Your Cart</h3>
              <button onClick={() => setCartOpen(false)} className="text-stone-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            {checkoutStep === 'form' ? (
              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                <p className="text-amber-400 font-bold text-sm mb-4">Shipping Details</p>
                {[['name','Full Name'],['email','Email'],['phone','Phone'],['line1','Address'],['city','City'],['province','Province'],['postalCode','Postal Code']].map(([k,label]) => (
                  <div key={k}>
                    <label className="text-[10px] uppercase tracking-wider text-stone-500">{label}</label>
                    <input
                      className="w-full mt-1 px-3 py-2 rounded-lg text-sm text-white border"
                      style={{ background: '#2a1200', borderColor: '#c25f1a44' }}
                      value={form[k]}
                      onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                {cart.length === 0 ? (
                  <p className="text-stone-500 text-sm text-center pt-12">Your cart is empty</p>
                ) : cart.map(item => (
                  <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#2a1200' }}>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-bold line-clamp-2">{item.name}</p>
                      <p className="text-amber-400 text-sm font-black">R{item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: '#3a1800' }}><Minus className="w-3 h-3 text-stone-300" /></button>
                      <span className="text-white font-bold text-sm w-6 text-center">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: '#3a1800' }}><Plus className="w-3 h-3 text-stone-300" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="p-5 border-t space-y-3" style={{ borderColor: '#c25f1a33' }}>
              <div className="flex justify-between text-white font-black">
                <span>Total</span>
                <span className="text-amber-400">R{cartTotal.toFixed(2)}</span>
              </div>
              {checkoutStep === 'form' ? (
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 border-stone-700 text-stone-300" onClick={() => setCheckoutStep(null)}>Back</Button>
                  <Button disabled={placing || !form.name || !form.email} onClick={placeOrder} className="flex-1 font-bold" style={{ background: '#c25f1a' }}>
                    {placing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Place Order'}
                  </Button>
                </div>
              ) : (
                <Button disabled={cart.length === 0} onClick={() => setCheckoutStep('form')} className="w-full font-bold" style={{ background: '#c25f1a' }}>
                  Checkout →
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
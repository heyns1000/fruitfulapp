import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, X, Plus, Minus, Loader2, Clock } from 'lucide-react';
import {
  BANIMAL_LOGO,
  BANIMAL_BANNER_BABYGROW,
  BANIMAL_BANNER_ROLEPLAY,
  ALL_PRODUCTS,
  COMING_SOON,
  PRODUCT_IMAGE_MAP,
} from '@/components/banimal/banimalProducts';

const CATEGORIES = ['All', 'Babygrow', 'Bib'];

const categoryOf = (code = '') => {
  if (code.startsWith('BT') || code.startsWith('bib')) return 'Bib';
  return 'Babygrow';
};

// Enrich a DB product with its local image + category
const enrich = (p) => ({
  ...p,
  image: PRODUCT_IMAGE_MAP[p.productCode] || null,
  category: categoryOf(p.productCode),
});

export default function BanimalStore() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', line1: '', city: '', province: '', postalCode: '' });
  const [placing, setPlacing] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  // Try fetching from DB; fall back to static catalogue
  const { data: dbProducts = [], isLoading } = useQuery({
    queryKey: ['banimal-store-products'],
    queryFn: () => base44.entities.MarketplaceService.filter({ brandId: 'banimal', status: 'active' }, '-created_date', 100),
  });

  // Prefer DB products (enriched with images), otherwise use static catalogue
  const products = useMemo(() => {
    if (dbProducts.length > 0) return dbProducts.map(enrich);
    return ALL_PRODUCTS.map(p => ({
      id: p.productCode,
      serviceName: p.name,
      productCode: p.productCode,
      pricing: { ZAR: p.priceZAR },
      status: 'active',
      image: p.image,
      category: p.category,
    }));
  }, [dbProducts]);

  const filtered = useMemo(() =>
    activeCategory === 'All' ? products : products.filter(p => p.category === activeCategory),
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

  const updateQty = (id, delta) =>
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter(i => i.qty > 0));

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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-md p-10 rounded-3xl border border-gray-200 shadow-xl">
          <img src={BANIMAL_LOGO} alt="Banimal" className="h-16 mx-auto mb-6 object-contain" />
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Order Placed!</h2>
          <p className="text-orange-600 font-bold text-lg mb-1">{placedOrder.orderId}</p>
          <p className="text-gray-500 text-sm mb-6">We'll confirm your order and send tracking once payment is received. Check your email at <strong>{placedOrder.customerEmail}</strong>.</p>
          <Button onClick={() => setPlacedOrder(null)} className="bg-black text-white hover:bg-gray-800">Continue Shopping</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <img src={BANIMAL_LOGO} alt="Banimal — Kind Creatures" className="h-12 object-contain" />
          <button onClick={() => setCartOpen(true)} className="relative flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-white bg-black hover:bg-gray-800 transition-all">
            <ShoppingCart className="w-4 h-4" />
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center bg-orange-500 text-white">{cartCount}</span>
            )}
          </button>
        </div>
      </header>

      {/* Banner 1 — Babygrows */}
      <div className="w-full">
        <img src={BANIMAL_BANNER_BABYGROW} alt="Banimal Babygrows — Shop Now" className="w-full object-cover max-h-56" />
      </div>

      {/* Banner 2 — Roleplay */}
      <div className="w-full">
        <img src={BANIMAL_BANNER_ROLEPLAY} alt="Roleplay — Shop Now" className="w-full object-cover max-h-48" />
      </div>

      {/* Category Filter */}
      <div className="max-w-6xl mx-auto px-6 pt-10 pb-4 flex gap-2 flex-wrap items-center">
        <p className="text-xs uppercase tracking-widest text-gray-400 mr-2 font-bold">Shop by</p>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full text-sm font-bold border transition-all ${activeCategory === cat ? 'bg-black text-white border-black' : 'text-gray-600 border-gray-300 hover:border-gray-600'}`}>
            {cat}
          </button>
        ))}
        <span className="ml-auto text-xs text-gray-400">{filtered.length} products</span>
      </div>

      {/* Product Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-12">
        {isLoading ? (
          <div className="flex items-center justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {filtered.map(p => (
              <div key={p.id} className="rounded-2xl overflow-hidden flex flex-col border border-gray-100 hover:border-gray-300 transition-all shadow-sm hover:shadow-md group">
                <div className="aspect-square bg-gray-50 overflow-hidden">
                  {p.image ? (
                    <img src={p.image} alt={p.serviceName} className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                      {p.category === 'Bib' ? '🧷' : '👶'}
                    </div>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-1 gap-1">
                  <Badge className="self-start text-[10px] px-2 bg-gray-100 text-gray-600 border-gray-200">{p.category}</Badge>
                  <p className="text-gray-900 font-bold text-sm leading-snug mt-1 line-clamp-2">{p.serviceName}</p>
                  <p className="text-black font-black text-xl mt-auto">R{(p.pricing?.ZAR || 0).toFixed(2)}</p>
                  <Button onClick={() => addToCart(p)} className="w-full mt-2 font-bold bg-black hover:bg-gray-800 text-white">
                    Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Coming Soon Section */}
      <div className="bg-gray-50 border-t border-gray-100 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-5 h-5 text-orange-500" />
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-700">Coming Soon</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {COMING_SOON.map(p => (
              <div key={p.productCode} className="rounded-xl border-2 border-dashed border-gray-200 p-5 text-center">
                <p className="text-2xl mb-2">{p.category === 'Print' ? '🖼️' : '👕'}</p>
                <p className="text-gray-700 font-bold text-xs leading-snug">{p.name}</p>
                <p className="text-gray-400 text-xs mt-1">R{p.priceZAR}</p>
                <Badge className="mt-2 bg-orange-50 text-orange-500 border-orange-200 text-[10px]">Coming Soon</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black py-8 px-6 text-center">
        <img src={BANIMAL_LOGO} alt="Banimal" className="h-10 mx-auto mb-3 object-contain brightness-0 invert opacity-70" />
        <p className="text-xs text-gray-500 uppercase tracking-widest">© 2025 Banimal · Kind Creatures · Made in South Africa</p>
      </footer>

      {/* Cart Sidebar */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40" onClick={() => setCartOpen(false)} />
          <div className="w-full max-w-sm flex flex-col h-full shadow-2xl bg-white">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <img src={BANIMAL_LOGO} alt="Banimal" className="h-7 object-contain" />
                <span className="text-gray-500 text-xs">/ Cart</span>
              </div>
              <button onClick={() => setCartOpen(false)} className="text-gray-400 hover:text-gray-900"><X className="w-5 h-5" /></button>
            </div>

            {checkoutStep === 'form' ? (
              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                <p className="text-gray-700 font-bold text-sm mb-2">Shipping Details</p>
                {[['name','Full Name'],['email','Email'],['phone','Phone'],['line1','Address'],['city','City'],['province','Province'],['postalCode','Postal Code']].map(([k, label]) => (
                  <div key={k}>
                    <label className="text-[10px] uppercase tracking-wider text-gray-400">{label}</label>
                    <input
                      className="w-full mt-1 px-3 py-2 rounded-lg text-sm border border-gray-200 focus:outline-none focus:border-black"
                      value={form[k]}
                      onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                {cart.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center pt-12">Your cart is empty</p>
                ) : cart.map(item => (
                  <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100">
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 text-sm font-bold line-clamp-2">{item.name}</p>
                      <p className="text-black text-sm font-black">R{item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200"><Minus className="w-3 h-3 text-gray-600" /></button>
                      <span className="text-gray-900 font-bold text-sm w-6 text-center">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200"><Plus className="w-3 h-3 text-gray-600" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="p-5 border-t border-gray-100 space-y-3">
              <div className="flex justify-between text-gray-900 font-black">
                <span>Total</span>
                <span>R{cartTotal.toFixed(2)}</span>
              </div>
              {checkoutStep === 'form' ? (
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 border-gray-300" onClick={() => setCheckoutStep(null)}>Back</Button>
                  <Button disabled={placing || !form.name || !form.email} onClick={placeOrder} className="flex-1 bg-black hover:bg-gray-800 text-white font-bold">
                    {placing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Place Order'}
                  </Button>
                </div>
              ) : (
                <Button disabled={cart.length === 0} onClick={() => setCheckoutStep('form')} className="w-full bg-black hover:bg-gray-800 text-white font-bold">
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
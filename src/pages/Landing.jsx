import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowRight, MapPin, Star, Shield, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';

const POTS_IMG = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6953a072de46207f94f2b9d2/6d8890710_Elim_handmade_venda_pots.jpg';
const BE_FRUITFUL_IMG = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6953a072de46207f94f2b9d2/83a4a8138_Be_fruitful.png';
const STORE_IMG = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6953a072de46207f94f2b9d2/be3b0c2ec_Untitled2.jpg';
const GRAND_IMG = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6953a072de46207f94f2b9d2/52acd159d_Chief_02_1753263376705.png';

const HATS = [
  {
    name: 'uNtshontsho',
    sub: 'Cape Buffalo',
    img: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6953a072de46207f94f2b9d2/b5b62ca52_Screenshot2026-02-28at213705.png',
    price: '$295',
  },
  {
    name: 'isAmpokwe',
    sub: 'Impala',
    img: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6953a072de46207f94f2b9d2/e609b4210_Hat_4_artisanhatco.png',
    price: '$295',
  },
  {
    name: 'Be Fruitful',
    sub: 'Fedora',
    img: BE_FRUITFUL_IMG,
    price: '$295',
  },
];

export default function Landing() {
  return (
    <div className="bg-[#1a1008] text-white min-h-screen overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* background split */}
        <div className="absolute inset-0 grid grid-cols-2">
          <div className="bg-[#1a1008]" />
          <div className="bg-[#111]" />
        </div>
        {/* large pot image fills right half */}
        <div className="absolute right-0 top-0 w-1/2 h-full hidden md:block">
          <img src={POTS_IMG} alt="Handmade Venda Pots" className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a1008] via-[#1a1008]/30 to-transparent" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center w-full">
          <div className="space-y-8">
            {/* logo badge */}
            <div className="inline-flex items-center gap-2 bg-orange-600/20 border border-orange-600/40 rounded-full px-4 py-2">
              <Leaf className="w-4 h-4 text-orange-400" />
              <span className="text-orange-300 text-xs font-bold uppercase tracking-widest">Proudly Fruitful · Made in South Africa</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-none tracking-tight">
              <span className="text-white">We Support</span><br />
              <span className="text-orange-500">Lekker</span><br />
              <span className="text-white">Locals.</span>
            </h1>

            <p className="text-stone-300 text-lg leading-relaxed max-w-md">
              Handcrafted hats, pots and artisan goods — straight from the hands of South African masters to your door. Every purchase funds a real artisan.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to={createPageUrl('Marketplace')}>
                <Button className="bg-orange-600 hover:bg-orange-500 text-white font-black text-base px-8 py-6 rounded-2xl gap-2">
                  Shop the Collection <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to={createPageUrl('Gallery')}>
                <Button variant="outline" className="border-stone-600 text-stone-300 hover:bg-stone-800 font-bold text-base px-8 py-6 rounded-2xl">
                  View Artisans
                </Button>
              </Link>
            </div>

            <div className="flex gap-8 pt-4">
              {[['500+', 'Artisans'], ['12K+', 'Orders'], ['5★', 'Rating']].map(([val, lbl]) => (
                <div key={lbl}>
                  <p className="text-3xl font-black text-orange-400">{val}</p>
                  <p className="text-stone-400 text-sm">{lbl}</p>
                </div>
              ))}
            </div>
          </div>

          {/* mobile: show pots inline */}
          <div className="md:hidden rounded-3xl overflow-hidden aspect-video">
            <img src={POTS_IMG} alt="Handmade Pots" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* ── MARQUEE STRIP ── */}
      <div className="bg-orange-600 py-3 overflow-hidden">
        <div className="flex gap-12 animate-none whitespace-nowrap">
          {Array(8).fill('🌿 Handcrafted in South Africa · Authentic Beadwork · Zulu & Xhosa Heritage · Proudly Fruitful').map((t, i) => (
            <span key={i} className="text-white font-bold text-sm shrink-0">{t}</span>
          ))}
        </div>
      </div>

      {/* ── HATS SHOWCASE ── */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-14 space-y-3">
          <p className="text-orange-400 text-xs font-bold uppercase tracking-widest">Artisan Hat Collection</p>
          <h2 className="text-4xl sm:text-5xl font-black">Each Hat Has a Name.<br /><span className="text-orange-500">Each Name Has a Story.</span></h2>
          <p className="text-stone-400 max-w-xl mx-auto">Traditional Xhosa and Zulu beadwork on natural straw. Hand-crafted by Grand Sibangilizwe Maghandela from Mamelodi, Pretoria.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {HATS.map(hat => (
            <Link to={createPageUrl('Marketplace')} key={hat.name}
              className="group bg-stone-900 border border-stone-700 rounded-3xl overflow-hidden hover:border-orange-500 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-orange-900/30">
              <div className="aspect-square overflow-hidden bg-stone-800">
                <img src={hat.img} alt={hat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5">
                <p className="text-orange-400 text-xs font-bold uppercase tracking-wider">{hat.sub}</p>
                <h3 className="text-white font-black text-xl mt-1">{hat.name}</h3>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-orange-400 font-black text-2xl">{hat.price}</p>
                  <span className="text-stone-400 text-xs group-hover:text-white transition-colors flex items-center gap-1">Shop <ArrowRight className="w-3 h-3" /></span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── POTS BANNER ── */}
      <section className="relative overflow-hidden mx-6 rounded-3xl mb-24">
        <img src={POTS_IMG} alt="Elim Venda Pots" className="w-full h-72 sm:h-96 object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent flex items-center px-10 sm:px-16">
          <div className="space-y-4 max-w-lg">
            <p className="text-orange-400 text-xs font-bold uppercase tracking-widest">🫙 Elim · Limpopo</p>
            <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">Handmade Pots<br />from Rural SA</h2>
            <p className="text-stone-300 text-sm sm:text-base">Authentic Venda & Ndebele clay pots — hand-shaped and fired using ancestral techniques.</p>
            <Link to={createPageUrl('Marketplace')}>
              <Button className="bg-orange-600 hover:bg-orange-500 text-white font-bold mt-2 gap-2">
                Shop Pots <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── BE FRUITFUL HAT FEATURE ── */}
      <section className="py-24 px-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div className="space-y-6">
          <p className="text-orange-400 text-xs font-bold uppercase tracking-widest">Pro Subscription Hat</p>
          <h2 className="text-4xl sm:text-5xl font-black leading-tight">
            Be Fruitful.<br />
            <span className="text-orange-500">Wear the Mission.</span>
          </h2>
          <p className="text-stone-300 text-lg leading-relaxed">
            Your Pro Subscription ($295/month) is renewed by purchasing a handcrafted Fruitful hat from Grand. Each hat is one-of-a-kind, signed by the artisan, and ships worldwide.
          </p>
          <div className="space-y-3">
            {['Authentic Xhosa & Zulu beadwork', 'Hand-signed by the artisan', 'Ships to ZA · US · UK · EU', 'Each purchase supports Grand directly'].map(f => (
              <div key={f} className="flex items-center gap-3 text-stone-300">
                <div className="w-5 h-5 rounded-full bg-orange-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs">✓</span>
                </div>
                {f}
              </div>
            ))}
          </div>
          <Link to={createPageUrl('Marketplace')}>
            <Button className="bg-orange-600 hover:bg-orange-500 text-white font-black px-8 py-6 text-base rounded-2xl gap-2 mt-2">
              Get Your Hat <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
        <div className="rounded-3xl overflow-hidden border border-stone-700 shadow-2xl shadow-orange-900/20">
          <img src={BE_FRUITFUL_IMG} alt="Be Fruitful Hat" className="w-full object-cover" />
        </div>
      </section>

      {/* ── ARTISAN STORY ── */}
      <section className="bg-stone-900 py-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <img src={GRAND_IMG} alt="Grand Sibangilizwe" className="w-full rounded-3xl object-cover aspect-square" />
            <div className="absolute -bottom-4 -right-4 bg-orange-600 text-white rounded-2xl px-5 py-3 shadow-xl">
              <p className="font-black text-lg">Grand</p>
              <p className="text-orange-200 text-xs">Mamelodi, Pretoria</p>
            </div>
          </div>
          <div className="space-y-6">
            <p className="text-orange-400 text-xs font-bold uppercase tracking-widest">Meet the Master</p>
            <h2 className="text-4xl font-black leading-tight">Grand Sibangilizwe<br /><span className="text-stone-400">Maghandela</span></h2>
            <blockquote className="border-l-4 border-orange-600 pl-6 text-stone-300 text-lg italic leading-relaxed">
              "I am an artist — my soul message is that art is part of creation. Mine is a God-given talent."
            </blockquote>
            <p className="text-stone-400 leading-relaxed">
              Born 28 August 1960 in Mamelodi, Pretoria. Grand has dedicated his life to the art of Xhosa and Zulu beadwork, transforming natural straw into wearable heritage pieces that carry the spirit of the South African savanna.
            </p>
            <div className="flex gap-6">
              <div className="text-center"><p className="text-2xl font-black text-orange-400">40+</p><p className="text-stone-400 text-xs">Years crafting</p></div>
              <div className="text-center"><p className="text-2xl font-black text-orange-400">5★</p><p className="text-stone-400 text-xs">Artisan rating</p></div>
              <div className="text-center"><p className="text-2xl font-black text-orange-400">100%</p><p className="text-stone-400 text-xs">Handmade</p></div>
            </div>
            <Link to={createPageUrl('ArtisanProfile') + '?brandName=Fruitful%20Shops%20(pty)%20ltd'}>
              <Button variant="outline" className="border-orange-600 text-orange-400 hover:bg-orange-900/20 font-bold gap-2">
                View Full Profile <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ── */}
      <section className="py-16 px-6 border-t border-stone-800">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {[
            { icon: '🌍', title: 'Ships Worldwide', sub: 'ZA · US · UK · EU' },
            { icon: '🔐', title: 'Secure Checkout', sub: 'Powered by Paystack' },
            { icon: '🤝', title: '100% Authentic', sub: 'Artisan-signed pieces' },
            { icon: '🌱', title: 'Proudly Local', sub: 'Supporting South Africa' },
          ].map(({ icon, title, sub }) => (
            <div key={title} className="space-y-2">
              <p className="text-4xl">{icon}</p>
              <p className="font-black text-white">{title}</p>
              <p className="text-stone-400 text-xs">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="bg-orange-600 py-20 px-6 text-center">
        <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">Fruitful. Changing. Seeds.</h2>
        <p className="text-orange-100 text-lg mb-8 max-w-xl mx-auto">Visit the nicest store in the world — tech meets tradition with a national franchise supporting local artisans.</p>
        <Link to={createPageUrl('Marketplace')}>
          <Button className="bg-white text-orange-600 hover:bg-orange-50 font-black text-lg px-12 py-6 rounded-2xl gap-2">
            Shop Now <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>
      </section>
    </div>
  );
}
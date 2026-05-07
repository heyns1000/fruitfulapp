import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lock, Globe, Package, ShieldCheck, Star, ExternalLink } from 'lucide-react';

// ── Pricing constants ─────────────────────────────────────────────────────────
const COST_ZAR = 450;
const SELL_ZAR = Math.round(COST_ZAR * 2.5); // R1,125
const USD_RATE = 18.2;
const EUR_RATE = 20.1;
const GBP_RATE = 23.5;
const SHIP_USD = 30; // avg global small canvas shipping

const toUSD = (zar) => (zar / USD_RATE).toFixed(2);
const toEUR = (zar) => (zar / EUR_RATE).toFixed(2);
const toGBP = (zar) => (zar / GBP_RATE).toFixed(2);

// Subscription tier unlock rule:
// Monthly sub >= $89 (Professional/Enterprise) unlocks physical artwork purchases.
// Starter ($29) does NOT qualify — artwork cost too high relative to plan.
const MIN_SUB_USD = 89;

const PAINTINGS = [
  { code: 'GM-ART-001', name: "Zodwa's Fruit & Veg — Soweto Canvas I",       img: 'https://media.base44.com/images/public/6953a072de46207f94f2b9d2/bc72a588e_IMG_0635.jpeg' },
  { code: 'GM-ART-002', name: "Zodwa's Fruit & Veg — Soweto Canvas II",      img: 'https://media.base44.com/images/public/6953a072de46207f94f2b9d2/23f26634a_IMG_0634.jpeg' },
  { code: 'GM-ART-003', name: 'Autumn Rondavels — Mountain Homeland',         img: 'https://media.base44.com/images/public/6953a072de46207f94f2b9d2/1b5677959_IMG_0633.jpeg' },
  { code: 'GM-ART-004', name: 'The Shop Queue — Township Commerce',           img: 'https://media.base44.com/images/public/6953a072de46207f94f2b9d2/339ce2c45_IMG_0632.jpeg' },
  { code: 'GM-ART-005', name: 'Thandabantu General Dealer',                   img: 'https://media.base44.com/images/public/6953a072de46207f94f2b9d2/b915f71a9_IMG_0631.jpeg' },
  { code: 'GM-ART-006', name: 'Sunday Afternoon — Backyard Gathering',        img: 'https://media.base44.com/images/public/6953a072de46207f94f2b9d2/c6894c318_IMG_0630.jpeg' },
  { code: 'GM-ART-007', name: 'The Grain Pounder — Rondavel Life',            img: 'https://media.base44.com/images/public/6953a072de46207f94f2b9d2/6625ce633_IMG_0629.jpeg' },
  { code: 'GM-ART-008', name: 'Khayelitsha From Above — Aerial Township',    img: 'https://media.base44.com/images/public/6953a072de46207f94f2b9d2/493ea9128_IMG_0628.jpeg' },
  { code: 'GM-ART-009', name: 'Sunset Over the Settlement — Crimson Dusk',   img: 'https://media.base44.com/images/public/6953a072de46207f94f2b9d2/bd1a2a28c_IMG_0627.jpeg' },
  { code: 'GM-ART-010', name: 'Jacaranda Boulevard — Purple Canopy',          img: 'https://media.base44.com/images/public/6953a072de46207f94f2b9d2/6a4c41e0e_IMG_0626.jpeg' },
  { code: 'GM-ART-011', name: 'Three Rondavels — Autumn Homeland II',         img: 'https://media.base44.com/images/public/6953a072de46207f94f2b9d2/4ddf0a33f_IMG_0625.jpeg' },
  { code: 'GM-ART-012', name: 'Fruitful Street — The Brand on the Hill',      img: 'https://media.base44.com/images/public/6953a072de46207f94f2b9d2/7da8f5a9e_IMG_0624.jpeg' },
  { code: 'GM-ART-013', name: 'Siya Bus Stop — Evening Commute',              img: 'https://media.base44.com/images/public/6953a072de46207f94f2b9d2/bd3d5d840_IMG_0623.jpeg' },
  { code: 'GM-ART-014', name: 'Fruitful Street II — Township Daylight',       img: 'https://media.base44.com/images/public/6953a072de46207f94f2b9d2/b46490a8e_IMG_0779.png' },
];

function PricingBadge({ zar }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs mt-2">
      <span className="text-amber-700 font-bold">R {zar.toLocaleString()} ZAR</span>
      <span className="text-emerald-700">${toUSD(zar)} USD</span>
      <span className="text-blue-700">€{toEUR(zar)} EUR</span>
      <span className="text-purple-700">£{toGBP(zar)} GBP</span>
    </div>
  );
}

function PaintingCard({ painting, index }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all border border-stone-100 overflow-hidden flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-50">
        <img
          src={painting.img}
          alt={painting.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 left-2">
          <Badge className="bg-amber-800 text-white text-[10px] px-2">{painting.code}</Badge>
        </div>
        <div className="absolute top-2 right-2">
          <Badge className="bg-black/70 text-white text-[10px] px-2 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Original
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-stone-800 text-sm leading-tight mb-1">{painting.name}</h3>
        <p className="text-[11px] text-stone-500 mb-2">by <span className="italic font-medium text-stone-700">Grand Mashadlela</span> · Oil on Board/Canvas · Hand-signed · 1 of 1</p>

        <div className="mt-auto">
          <PricingBadge zar={SELL_ZAR} />
          <div className="flex items-center gap-1.5 mt-2 text-[10px] text-stone-400">
            <Globe className="w-3 h-3" />
            <span>+~${SHIP_USD} global shipping (excl. insurance)</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-[10px] text-amber-700 font-medium">
            <Lock className="w-3 h-3" />
            <span>Requires Professional or Enterprise subscription (≥ ${MIN_SUB_USD}/mo)</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function GrandMashadlelaCollection() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-orange-50">
      {/* Hero */}
      <div className="relative bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-white py-16 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: `url(${PAINTINGS[11].img})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="relative z-10 max-w-3xl mx-auto">
          <Badge className="bg-amber-600 text-white mb-4 text-xs tracking-widest px-3 py-1">SEEDWAVE ORIGINALS · FRUITFUL ECOSYSTEM</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">Grand Mashadlela</h1>
          <p className="text-amber-200 text-lg mb-2 italic">"The Township Chronicler"</p>
          <p className="text-stone-300 text-sm max-w-xl mx-auto leading-relaxed">
            14 original oil paintings acquired directly from the artist. Each piece documents the living pulse of South African township life —
            Soweto markets, homeland rondavels, sunset settlements, and the @Fruitful@ brand on the hill.
          </p>
        </div>
      </div>

      {/* Pricing transparency bar */}
      <div className="bg-amber-900 text-amber-100 text-xs py-3 px-6">
        <div className="max-w-5xl mx-auto flex flex-wrap gap-6 justify-center items-center text-center">
          <span>💰 <strong>Cost basis:</strong> R{COST_ZAR} avg per piece (excl. VAT)</span>
          <span>🎨 <strong>Sell price:</strong> R{SELL_ZAR} (2.5× cost) · <strong>${toUSD(SELL_ZAR)} USD</strong></span>
          <span>✈️ <strong>Global shipping:</strong> ~${SHIP_USD} small canvas (est.)</span>
          <span>🔒 <strong>Unlock:</strong> Professional / Enterprise plan ≥ ${MIN_SUB_USD}/mo</span>
        </div>
      </div>

      {/* Subscription unlock notice */}
      <div className="max-w-5xl mx-auto px-6 pt-8">
        <div className="bg-white border border-amber-200 rounded-2xl p-5 flex flex-col md:flex-row gap-4 items-start md:items-center shadow-sm">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5 text-amber-700" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-stone-800 text-sm">Subscription-Gated Physical Artwork</p>
            <p className="text-stone-500 text-xs mt-1 leading-relaxed">
              These are one-of-a-kind original paintings. Due to their intrinsic value (R{SELL_ZAR} / ${toUSD(SELL_ZAR)} USD per piece, excl. shipping), 
              purchase is only available to active <strong>Professional</strong> (≥ $89/mo) or <strong>Enterprise</strong> subscribers within the Seedwave / FAA.ZONE ecosystem.
              A $29/month Starter plan does not unlock this collection — the artwork value exceeds the plan tier.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Badge className="bg-stone-200 text-stone-600 text-[10px]">Starter: ✗</Badge>
            <Badge className="bg-amber-600 text-white text-[10px]">Professional: ✓</Badge>
            <Badge className="bg-green-700 text-white text-[10px]">Enterprise: ✓</Badge>
          </div>
        </div>
      </div>

      {/* Gallery grid */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-stone-800">The Collection · 14 Originals</h2>
          <div className="flex items-center gap-2 text-xs text-stone-400">
            <Package className="w-4 h-4" />
            <span>All pieces: 1 of 1 · Physical delivery · Global shipping</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {PAINTINGS.map((p, i) => (
            <PaintingCard key={p.code} painting={p} index={i} />
          ))}
        </div>
      </div>

      {/* Artist note */}
      <div className="max-w-3xl mx-auto px-6 pb-14 text-center">
        <div className="bg-stone-900 text-stone-300 rounded-2xl p-8">
          <Star className="w-6 h-6 text-amber-400 mx-auto mb-3" />
          <p className="italic text-sm leading-relaxed">
            "Grand Mashadlela's work is a living archive of South African township identity — painted with acrylic on board and canvas,
            these small-format originals carry the weight of a people's story. Acquired at R{COST_ZAR} per piece,
            sold at 2.5× to ensure artist equity and platform sustainability across the FAA.ZONE Seedwave ecosystem."
          </p>
          <p className="text-amber-400 font-semibold text-xs mt-4 tracking-widest">FAA.ZONE™ SEEDWAVE ORIGINALS PROGRAMME</p>
        </div>
      </div>
    </div>
  );
}
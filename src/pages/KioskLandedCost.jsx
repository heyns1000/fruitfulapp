import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Package, Truck, DollarSign, TrendingUp, FileText, Globe } from 'lucide-react';

const BRAND_GREEN = '#4ECDC4';
const BRAND_RED = '#E91E63';
const BRAND_DARK = '#1a1a2e';

// ─── Source data (locked from PI + Estimate documents) ───────────────────────
const PI = {
  supplier: 'Guangzhou Welink Technology Co., Ltd',
  piRef: 'WL20260401C',
  piDate: 'April 1, 2026',
  unitQty: 9,
  unitPriceUsd: 3500,
  totalUsd: 31500,
  incoTerms: 'EX-Works Guangzhou',
  description: 'Coffee shop kiosk (fiberglass, Ø2050mm roof, 2630mm H, 32"/43" screens, lighted logo)',
};

const FREIGHT = {
  quoteNo: '108923',
  quoteDate: '06-May-2026',
  freighter: 'Afristar Freight Services',
  route: 'Guangzhou → Durban → Johannesburg (LCL)',
  subtotalExclVat: 44473.92,
  vat: 14036.58,
  totalInclVat: 58510.50,
  usdZarRate: 17.0,
  foreignUsd: 1016.02,
};

// FOB cost = EXW + EXW collection (EXWO line) = $570 already in freight estimate
// True formula: FOB ZAR = PI total USD × ZAR rate
const FOB_ZAR = PI.totalUsd * FREIGHT.usdZarRate; // 31500 × 17 = 535,500
const TRUE_LANDED = FOB_ZAR + FREIGHT.totalInclVat;        // 535,500 + 58,510.50

const PER_UNIT_FOB = FOB_ZAR / PI.unitQty;
const PER_UNIT_LANDED = TRUE_LANDED / PI.unitQty;

const FREIGHT_CHARGES = [
  { code: 'EXWO', desc: 'Ex-Works Pickup Charges', usd: 570, zar: 9690, vat: 0 },
  { code: 'FREICHA', desc: 'Freight Charges ($67/chg.wt)', usd: 368.5, zar: 6264.5, vat: 0 },
  { code: 'IMO2020', desc: 'IMO2020 Surcharge ($6/chg.wt)', usd: 33, zar: 561, vat: 0 },
  { code: 'ALH', desc: 'ALH', usd: 44.52, zar: 756.84, vat: 0 },
  { code: 'COLFEE', desc: 'Collect Fee 3%', usd: null, zar: 495.46, vat: 0 },
  { code: 'DEGRP', desc: 'Unpack Charges (ZAR647.17/chg.wt)', usd: null, zar: 3559.43, vat: 0 },
  { code: 'CARDUE', desc: 'Cargo Dues (ZAR134.62/chg.wt)', usd: null, zar: 740.41, vat: 111.06 },
  { code: 'PORTST', desc: 'Port Stabilisation Levy', usd: null, zar: 53.62, vat: 0 },
  { code: 'ADMINFE', desc: 'Administration Fee', usd: null, zar: 575.89, vat: 0 },
  { code: 'EDIFEE', desc: 'EDI Fee', usd: null, zar: 40.28, vat: 6.04 },
  { code: 'CFSLOAD', desc: 'CFS Loading Out Fee (ZAR74.20/chg.wt)', usd: null, zar: 408.10, vat: 61.22 },
  { code: 'DEPCHA', desc: 'Gate Charges', usd: null, zar: 92.22, vat: 13.83 },
  { code: 'INTZONE', desc: 'Inter-Depot Handling Durban→JHB', usd: null, zar: 2999.92, vat: 449.99 },
  { code: 'FUESUR', desc: 'Fuel Surcharge on IDM 15%', usd: null, zar: 450, vat: 67.50 },
  { code: 'CARTAG', desc: 'Cartage', usd: null, zar: 1835.68, vat: 275.35 },
  { code: 'FUESUR2', desc: 'Fuel Surcharge on Cartage 42.96%', usd: null, zar: 788.60, vat: 118.29 },
  { code: 'CUSDUT', desc: 'Customs Duty', usd: null, zar: 12920, vat: 0 },
  { code: 'CUSVAT', desc: 'Customs VAT', usd: null, zar: 0, vat: 12597 },
  { code: 'DOCSL', desc: 'Documentation Fee', usd: null, zar: 850, vat: 127.50 },
  { code: 'AGE', desc: 'Agency 2.5% (min R950)', usd: null, zar: 1391.97, vat: 208.80 },
];

function fmt(n, dec = 0) {
  return `R${Number(n).toLocaleString('en-ZA', { minimumFractionDigits: dec, maximumFractionDigits: dec })}`;
}

function KpiCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-md border-l-4 flex items-start gap-4" style={{ borderColor: color }}>
      <div className="rounded-full p-3 shrink-0" style={{ backgroundColor: color + '20' }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div>
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-xl font-bold text-gray-800">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function KioskLandedCost() {
  const [showAll, setShowAll] = useState(false);

  const pctFob = (FOB_ZAR / TRUE_LANDED * 100).toFixed(1);
  const pctFreight = (FREIGHT.totalInclVat / TRUE_LANDED * 100).toFixed(1);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #f0fffe 0%, #fff5f8 100%)' }}>
      {/* Hero */}
      <div className="relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${BRAND_DARK} 0%, #1a3a2a 60%, #2d1b4e 100%)` }}>
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-white" style={{ backgroundColor: BRAND_RED }}>
              ☕ Fruitful Coffee
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: BRAND_GREEN + '30', color: BRAND_GREEN }}>
              Kiosk Capital Model
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
            True <span style={{ color: BRAND_GREEN }}>Landed Cost</span> Calculator
          </h1>
          <p className="text-gray-300 max-w-2xl text-sm">
            Aggregates Guangzhou Welink PI hardware cost (FOB EXW) + Afristar Freight & Clearing estimate
            to produce the mathematically correct kiosk landed cost in Johannesburg.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Formula Banner */}
        <div className="bg-gray-900 rounded-2xl p-6 text-center shadow-lg">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">True Landed Cost Formula</p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-white text-sm md:text-base font-mono font-bold">
            <span className="px-4 py-2 rounded-xl" style={{ backgroundColor: BRAND_GREEN + '30', color: BRAND_GREEN }}>
              PI Hardware FOB (ZAR)
            </span>
            <span className="text-gray-500 text-xl">+</span>
            <span className="px-4 py-2 rounded-xl" style={{ backgroundColor: BRAND_RED + '30', color: '#ff6b9d' }}>
              Freight & Clearing (ZAR)
            </span>
            <span className="text-gray-500 text-xl">=</span>
            <span className="px-4 py-2 rounded-xl font-black text-lg" style={{ backgroundColor: '#FF9800' + '30', color: '#FF9800' }}>
              True Landed Cost (ZAR)
            </span>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiCard icon={Globe} label="PI Hardware (FOB ZAR)" value={fmt(FOB_ZAR)} sub={`$${PI.totalUsd.toLocaleString()} USD × ${FREIGHT.usdZarRate} ZAR`} color={BRAND_GREEN} />
          <KpiCard icon={Truck} label="Freight & Clearing" value={fmt(FREIGHT.totalInclVat, 2)} sub="Afristar · incl. VAT" color={BRAND_RED} />
          <KpiCard icon={DollarSign} label="TRUE Landed Cost" value={fmt(TRUE_LANDED, 2)} sub={`${PI.unitQty} units · Guangzhou→JHB`} color="#FF9800" />
          <KpiCard icon={Package} label="Per Unit Landed" value={fmt(PER_UNIT_LANDED, 2)} sub={`FOB/unit: ${fmt(PER_UNIT_FOB, 2)}`} color="#9C27B0" />
        </div>

        {/* Visual split bar */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h3 className="font-bold text-gray-800 mb-4">📊 Cost Composition Split</h3>
          <div className="flex rounded-xl overflow-hidden h-10 mb-3">
            <div className="flex items-center justify-center text-white text-xs font-bold transition-all" style={{ width: `${pctFob}%`, backgroundColor: BRAND_GREEN }}>
              {pctFob}% Hardware
            </div>
            <div className="flex items-center justify-center text-white text-xs font-bold transition-all" style={{ width: `${pctFreight}%`, backgroundColor: BRAND_RED }}>
              {pctFreight}% Freight
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <p className="text-xs text-gray-400 mb-1">Hardware FOB</p>
              <p className="font-black text-xl" style={{ color: BRAND_GREEN }}>{fmt(FOB_ZAR)}</p>
              <p className="text-xs text-gray-400">{pctFob}% of total</p>
            </div>
            <div className="border-x border-gray-100">
              <p className="text-xs text-gray-400 mb-1">Freight & Clearing</p>
              <p className="font-black text-xl" style={{ color: BRAND_RED }}>{fmt(FREIGHT.totalInclVat, 2)}</p>
              <p className="text-xs text-gray-400">{pctFreight}% of total</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">TRUE Landed Total</p>
              <p className="font-black text-2xl" style={{ color: '#FF9800' }}>{fmt(TRUE_LANDED, 2)}</p>
              <p className="text-xs text-gray-400">100% — JHB delivered</p>
            </div>
          </div>
        </div>

        {/* PI Source detail */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" style={{ color: BRAND_GREEN }} />
            Proforma Invoice — Guangzhou Welink Technology Co., Ltd
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-4">
            {[
              { l: 'PI Reference', v: PI.piRef },
              { l: 'Date', v: PI.piDate },
              { l: 'Buyer', v: 'Fruitful Shops (Pty) Ltd' },
              { l: 'Supplier', v: PI.supplier },
              { l: 'INCO Terms', v: PI.incoTerms },
              { l: 'Units', v: `${PI.unitQty} pc` },
              { l: 'Unit Price', v: `$${PI.unitPriceUsd.toLocaleString()} USD` },
              { l: 'PI Total', v: `$${PI.totalUsd.toLocaleString()} USD` },
            ].map(r => (
              <div key={r.l} className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">{r.l}</p>
                <p className="font-semibold text-gray-800 text-xs">{r.v}</p>
              </div>
            ))}
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <p className="text-xs text-emerald-700 font-semibold mb-1">Kiosk Specification</p>
            <p className="text-xs text-emerald-600">{PI.description}</p>
          </div>
          <div className="mt-3 flex items-center justify-between bg-gray-900 rounded-xl px-5 py-3">
            <span className="text-gray-300 text-sm font-semibold">PI Total (ZAR @ {FREIGHT.usdZarRate})</span>
            <span className="text-2xl font-black" style={{ color: BRAND_GREEN }}>{fmt(FOB_ZAR)}</span>
          </div>
        </div>

        {/* Freight estimate detail */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Truck className="w-5 h-5" style={{ color: BRAND_RED }} />
            Freight & Clearing Estimate — Afristar Freight Services (Quote {FREIGHT.quoteNo})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm mb-5">
            {[
              { l: 'Route', v: FREIGHT.route },
              { l: 'Date', v: FREIGHT.quoteDate },
              { l: 'INCO Terms', v: 'EXW' },
              { l: 'Modality', v: 'LCL Sea' },
              { l: 'USD/ZAR Rate', v: `${FREIGHT.usdZarRate}` },
              { l: 'Commodity', v: 'Kiosk' },
            ].map(r => (
              <div key={r.l} className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">{r.l}</p>
                <p className="font-semibold text-gray-800 text-xs">{r.v}</p>
              </div>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-100 text-left">
                  <th className="py-2 px-3 text-xs text-gray-500 font-semibold">Code</th>
                  <th className="py-2 px-3 text-xs text-gray-500 font-semibold">Description</th>
                  <th className="py-2 px-3 text-xs text-gray-500 font-semibold text-right">Foreign (USD)</th>
                  <th className="py-2 px-3 text-xs text-gray-500 font-semibold text-right">Local Excl. (ZAR)</th>
                  <th className="py-2 px-3 text-xs text-gray-500 font-semibold text-right">VAT</th>
                </tr>
              </thead>
              <tbody>
                {(showAll ? FREIGHT_CHARGES : FREIGHT_CHARGES.slice(0, 8)).map((c, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2 px-3 text-xs font-mono text-gray-400">{c.code}</td>
                    <td className="py-2 px-3 text-sm text-gray-700">{c.desc}</td>
                    <td className="py-2 px-3 text-right text-sm text-gray-500">{c.usd ? `$${c.usd}` : '—'}</td>
                    <td className="py-2 px-3 text-right font-medium text-gray-800">R{c.zar.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</td>
                    <td className="py-2 px-3 text-right text-xs text-gray-400">{c.vat ? `R${c.vat.toFixed(2)}` : '—'}</td>
                  </tr>
                ))}
                {!showAll && (
                  <tr>
                    <td colSpan={5} className="py-2 px-3 text-center">
                      <button onClick={() => setShowAll(true)} className="text-xs text-blue-600 hover:text-blue-800 font-semibold">
                        + Show all {FREIGHT_CHARGES.length - 8} more charges
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-200 bg-gray-50">
                  <td colSpan={3} className="py-2 px-3 font-bold text-gray-700">Subtotal (Excl VAT)</td>
                  <td className="py-2 px-3 text-right font-bold">R{FREIGHT.subtotalExclVat.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</td>
                  <td />
                </tr>
                <tr className="bg-gray-50">
                  <td colSpan={3} className="py-2 px-3 text-gray-600">VAT</td>
                  <td className="py-2 px-3 text-right text-gray-600">R{FREIGHT.vat.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</td>
                  <td />
                </tr>
                <tr className="bg-red-50">
                  <td colSpan={3} className="py-2 px-3 font-black text-gray-800">Freight Total (Incl VAT)</td>
                  <td className="py-2 px-3 text-right font-black text-lg" style={{ color: BRAND_RED }}>
                    R{FREIGHT.totalInclVat.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Final summary box */}
        <div className="rounded-2xl p-6 shadow-lg text-white" style={{ background: `linear-gradient(135deg, ${BRAND_DARK} 0%, #1a3a2a 100%)` }}>
          <h3 className="text-lg font-black mb-5 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" style={{ color: BRAND_GREEN }} />
            True Landed Cost Summary — {PI.unitQty} Kiosk Units
          </h3>
          <div className="space-y-2 text-sm font-mono mb-5">
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-gray-300">PI Hardware FOB (${PI.totalUsd.toLocaleString()} USD × {FREIGHT.usdZarRate})</span>
              <span className="font-bold text-xl" style={{ color: BRAND_GREEN }}>{fmt(FOB_ZAR)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-gray-300">Freight & Clearing Incl. VAT (Afristar {FREIGHT.quoteNo})</span>
              <span className="font-bold text-xl" style={{ color: '#ff6b9d' }}>{fmt(FREIGHT.totalInclVat, 2)}</span>
            </div>
            <div className="flex justify-between items-center py-3 bg-white/10 rounded-xl px-4 mt-2">
              <span className="font-black text-white text-base">TRUE LANDED COST (JHB)</span>
              <span className="font-black text-2xl" style={{ color: '#FF9800' }}>{fmt(TRUE_LANDED, 2)}</span>
            </div>
            <div className="flex justify-between items-center py-2 px-4 text-gray-400">
              <span>Per Unit Landed</span>
              <span className="font-bold text-white">{fmt(PER_UNIT_LANDED, 2)} / unit</span>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Note: PI EXW charges ($570 EXWO) are captured within the Afristar freight estimate and are not double-counted.
            ZAR/USD rate applied: {FREIGHT.usdZarRate}.
          </p>
        </div>
      </div>
    </div>
  );
}
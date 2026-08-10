import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Coffee, TrendingUp, Package, DollarSign, ShoppingBag, Truck, ChevronDown, ChevronUp } from 'lucide-react';
import moment from 'moment';
import SourcingProcurement from '@/components/coffee/SourcingProcurement';
import SupplierPerformanceDashboard from '@/components/coffee/SupplierPerformanceDashboard';
import LandedCostComparisonChart from '@/components/coffee/LandedCostComparisonChart';
import CoffeeSubNav from '@/components/coffee/CoffeeSubNav';
import { Link, useSearchParams } from 'react-router-dom';

// True unit landed = Unit hardware ($3,500 × 17) + Afristar freight R58,510.50
const UNIT_FOB_ZAR = 3500 * 17; // 59,500
const TRUE_UNIT_LANDED = UNIT_FOB_ZAR + 58510.50; // 118,010.50

const BRAND_GREEN = '#4ECDC4';
const BRAND_RED = '#E91E63';
const BRAND_DARK = '#1a1a2e';

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-md flex items-center gap-4 border-l-4" style={{ borderColor: color }}>
      <div className="rounded-full p-3" style={{ backgroundColor: color + '20' }}>
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
      <div>
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-xl font-bold text-gray-800">{value}</p>
        {sub && <p className="text-xs text-gray-400">{sub}</p>}
      </div>
    </div>
  );
}

function ShippingChargeRow({ charge }) {
  const total = (charge.local_amount_excl_zar || 0) + (charge.vat_zar || 0);
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      <td className="py-2 px-3 text-xs font-mono text-gray-500">{charge.code}</td>
      <td className="py-2 px-3 text-sm text-gray-700">{charge.description}</td>
      <td className="py-2 px-3 text-xs text-center text-gray-400">{charge.vat_code}</td>
      <td className="py-2 px-3 text-sm text-right text-gray-600">
        {charge.foreign_amount_usd ? `$${charge.foreign_amount_usd.toFixed(2)}` : '—'}
      </td>
      <td className="py-2 px-3 text-sm text-right font-medium text-gray-800">
        R{(charge.local_amount_excl_zar || 0).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
      </td>
      <td className="py-2 px-3 text-xs text-right text-gray-400">
        {charge.vat_zar ? `R${charge.vat_zar.toFixed(2)}` : '—'}
      </td>
    </tr>
  );
}

export default function FruitfulCoffee() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [projections, setProjections] = useState([]);
  const [costInputs, setCostInputs] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [shipping, setShipping] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');
  const [showAllCharges, setShowAllCharges] = useState(false);

  // Sync tab from URL (CoffeeSubNav navigation)
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && tab !== activeTab) setActiveTab(tab);
  }, [searchParams]);

  useEffect(() => {
    const load = async () => {
      const [proj, costs, menu, ship] = await Promise.all([
        base44.entities.CoffeeProjection.list('-month', 50),
        base44.entities.CoffeeCostInput.list('category', 100),
        base44.entities.FoodMenuItem.list('name', 20),
        base44.entities.KioskShippingEstimate.list('-created_date', 1),
      ]);
      setProjections(proj.sort((a, b) => a.month.localeCompare(b.month)));
      setCostInputs(costs);
      setMenuItems(menu);
      setShipping(ship[0] || null);
      setLoading(false);
    };
    load();
  }, []);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  const bomCosts = costInputs.filter(c => c.category === 'Coffee BOM');
  const totalCupCost = bomCosts.find(c => c.label.includes('Total cost'))?.value || 14.16;
  const coffeeSalePrice = 40;
  const coffeeMargin = ((coffeeSalePrice - totalCupCost) / coffeeSalePrice * 100).toFixed(1);

  const chartData = projections.slice(1).map(p => ({
    month: moment(p.month).format('MMM YY'),
    'Coffee Profit': Math.round(p.coffee_profit),
    'Net Profit': Math.round(p.net_profit),
    'Costs': Math.round(Math.abs(p.recurring_costs)),
  }));

  const totalRevenue = projections.reduce((s, p) => s + (p.coffee_profit || 0), 0);
  const totalNet = projections.reduce((s, p) => s + (p.net_profit || 0), 0);
  const avgMonthly = projections.length > 1 ? (totalRevenue / (projections.length - 1)) : 0;

  const tabs = [
    { id: 'overview', label: '☕ Overview' },
    { id: 'costing', label: '💰 Costing Engine' },
    { id: 'menu', label: '🥐 Menu & Pricing' },
    { id: 'shipping', label: '🚢 Kiosk Logistics' },
    { id: 'suppliers', label: '📊 Supplier Metrics' },
    { id: 'sourcing', label: '🌍 Sourcing & Procurement' },
  ];

  const LANDED_DISPLAY = `R${TRUE_UNIT_LANDED.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${BRAND_GREEN}22, ${BRAND_RED}11)` }}>
        <div className="text-center">
          <div className="w-16 h-16 rounded-full border-4 border-t-transparent animate-spin mx-auto mb-4" style={{ borderColor: BRAND_GREEN, borderTopColor: 'transparent' }} />
          <p className="text-gray-500 font-medium">Loading Fruitful Coffee Engine...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: `linear-gradient(160deg, #f0fffe 0%, #fff5f8 100%)` }}>
      {/* Hero Header */}
      <div className="relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${BRAND_DARK} 0%, #2d1b4e 60%, #1a3a3a 100%)` }}>
        <div className="absolute inset-0 opacity-10">
          <img src="https://media.base44.com/images/public/6953a072de46207f94f2b9d2/b004e6e3e_Fruitful_coffe_hero.png" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest" style={{ backgroundColor: BRAND_RED, color: 'white' }}>
                  ☕ Fruitful Coffee
                </div>
                <div className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: BRAND_GREEN + '30', color: BRAND_GREEN }}>
                  Kiosk Edition
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-3">
                Coffee Costing<br />
                <span style={{ color: BRAND_GREEN }}>Engine</span>
              </h1>
              <p className="text-gray-300 text-lg max-w-lg">
                Full financial model — BOM costing, projections, menu pricing & kiosk logistics from Guangzhou to Johannesburg.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: BRAND_GREEN + '40', border: `1px solid ${BRAND_GREEN}60` }}>
                  🇨🇳 Guangzhou Origin
                </span>
                <span className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: BRAND_RED + '40', border: `1px solid ${BRAND_RED}60` }}>
                  🇿🇦 Proudly Fruitful
                </span>
              </div>
            </div>
            <div className="flex gap-4">
              <img
                src="https://media.base44.com/images/public/6953a072de46207f94f2b9d2/4be882485_PHOTO-2023-06-19-06-55-454_1754425495817.jpg"
                alt="Fruitful Kiosk"
                className="w-36 h-36 md:w-48 md:h-48 object-cover rounded-2xl shadow-2xl border-4 border-white/20"
              />
              <img
                src="https://media.base44.com/images/public/6953a072de46207f94f2b9d2/3171f0c33_PHOTO-2023-06-19-06-55-455_1754425495817.jpg"
                alt="Fruitful Kiosk side"
                className="w-36 h-36 md:w-48 md:h-48 object-cover rounded-2xl shadow-2xl border-4 border-white/20"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Persistent Coffee Sub-Navigation — route-level switching, no page reloads */}
      <CoffeeSubNav />

      {/* Granular in-page tabs */}
      <div className="sticky top-[52px] z-20 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => handleTabChange(t.id)}
                className={`px-5 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-all ${activeTab === t.id ? 'border-current text-current' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                style={activeTab === t.id ? { borderColor: BRAND_RED, color: BRAND_RED } : {}}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon={TrendingUp} label="Avg Monthly Revenue" value={`R${Math.round(avgMonthly).toLocaleString()}`} sub="22-month avg" color={BRAND_GREEN} />
              <StatCard icon={DollarSign} label="Total Net Profit" value={`R${Math.round(totalNet).toLocaleString()}`} sub="Incl. setup costs" color={BRAND_RED} />
              <StatCard icon={Coffee} label="Coffee Margin" value={`${coffeeMargin}%`} sub={`R${totalCupCost.toFixed(2)} BOM → R${coffeeSalePrice}`} color="#FF9800" />
              <Link to="/KioskLandedCost" className="block hover:opacity-90 transition-opacity">
                <div className="bg-white rounded-2xl p-5 shadow-md flex items-start gap-4 border-l-4 cursor-pointer" style={{ borderColor: '#9C27B0' }}>
                  <div className="rounded-full p-3 shrink-0" style={{ backgroundColor: '#9C27B020' }}>
                    <Package className="w-6 h-6" style={{ color: '#9C27B0' }} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Kiosk TRUE Landed Cost</p>
                    <p className="text-xl font-bold text-gray-800">{LANDED_DISPLAY}</p>
                    <p className="text-xs text-gray-400">Unit Hardware + Freight · Guangzhou→JHB →</p>
                    <div className="mt-1 flex gap-2 text-[10px]">
                      <span className="px-2 py-0.5 rounded-full font-semibold" style={{ background: '#4ECDC420', color: '#4ECDC4' }}>FOB R59,500</span>
                      <span className="px-2 py-0.5 rounded-full font-semibold" style={{ background: '#E91E6320', color: '#E91E63' }}>Freight R58,511</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Profit Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h2 className="text-lg font-bold text-gray-800 mb-1">📈 Monthly Profit Projections (22 months)</h2>
              <p className="text-xs text-gray-400 mb-5">Coffee gross profit vs net profit after recurring costs (R38,300/mo)</p>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={v => `R${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => `R${v.toLocaleString()}`} />
                  <Legend />
                  <Area type="monotone" dataKey="Coffee Profit" stroke={BRAND_GREEN} fill={BRAND_GREEN + '30'} strokeWidth={2} />
                  <Area type="monotone" dataKey="Net Profit" stroke={BRAND_RED} fill={BRAND_RED + '20'} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Kiosk images */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h2 className="text-lg font-bold text-gray-800 mb-4">🥤 Fruitful Kiosk — Design Reference</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  "https://media.base44.com/images/public/6953a072de46207f94f2b9d2/4be882485_PHOTO-2023-06-19-06-55-454_1754425495817.jpg",
                  "https://media.base44.com/images/public/6953a072de46207f94f2b9d2/3171f0c33_PHOTO-2023-06-19-06-55-455_1754425495817.jpg",
                  "https://media.base44.com/images/public/6953a072de46207f94f2b9d2/7ebde5e3e_PHOTO-2023-06-19-06-55-456_1754425495817.jpg",
                ].map((src, i) => (
                  <img key={i} src={src} alt={`Kiosk view ${i + 1}`} className="w-full h-56 object-cover rounded-xl shadow-sm" />
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-3 text-center">Fruitful Coffee Kiosk — Teal & Red brand colours, self-service touchscreen unit</p>
            </div>

            {/* True Landed vs Estimate Comparison Chart */}
            <LandedCostComparisonChart />
          </div>
        )}

        {/* COSTING ENGINE TAB */}
        {activeTab === 'costing' && (
          <div className="space-y-6">
            {/* BOM */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h2 className="text-lg font-bold text-gray-800 mb-4">☕ Bill of Materials — Per Cup Cost</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-100">
                      <th className="text-left py-3 px-3 text-gray-500 font-semibold">Component</th>
                      <th className="text-right py-3 px-3 text-gray-500 font-semibold">Quantity</th>
                      <th className="text-right py-3 px-3 text-gray-500 font-semibold">Unit</th>
                      <th className="text-right py-3 px-3 text-gray-500 font-semibold">Cost (ZAR)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bomCosts.map((c, i) => (
                      <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-3 px-3 font-medium text-gray-700">{c.label}</td>
                        <td className="py-3 px-3 text-right text-gray-600">{c.unit === 'ZAR' ? '—' : c.value}</td>
                        <td className="py-3 px-3 text-right text-gray-400">{c.unit}</td>
                        <td className="py-3 px-3 text-right font-bold" style={{ color: c.label.includes('Total') ? BRAND_RED : BRAND_GREEN }}>
                          {c.unit === 'ZAR' ? `R${c.value?.toFixed(4)}` : '—'}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50 font-bold">
                      <td className="py-3 px-3 text-gray-800" colSpan={3}>Total BOM Cost Per Cup</td>
                      <td className="py-3 px-3 text-right text-lg" style={{ color: BRAND_RED }}>R{totalCupCost.toFixed(4)}</td>
                    </tr>
                    <tr className="bg-green-50">
                      <td className="py-3 px-3 text-gray-800" colSpan={3}>Selling Price Per Cup</td>
                      <td className="py-3 px-3 text-right text-lg font-bold text-green-700">R{coffeeSalePrice}.00</td>
                    </tr>
                    <tr className="bg-blue-50">
                      <td className="py-3 px-3 text-gray-800" colSpan={3}>Gross Margin Per Cup</td>
                      <td className="py-3 px-3 text-right text-lg font-bold text-blue-700">{coffeeMargin}%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* All cost inputs by category */}
            {['Budget', 'Once-off costs', 'Recurring', 'Sales Target', 'Profitability', 'Shipping'].map(cat => {
              const items = costInputs.filter(c => c.category === cat);
              if (!items.length) return null;
              return (
                <div key={cat} className="bg-white rounded-2xl p-6 shadow-md">
                  <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: BRAND_GREEN }} />
                    {cat}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {items.map((c, i) => (
                      <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-gray-50">
                        <span className="text-sm text-gray-600">{c.label}</span>
                        <span className="font-bold text-sm" style={{ color: BRAND_GREEN }}>
                          {c.unit === 'ZAR' ? `R${(c.value || 0).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}` :
                           c.unit === 'USD' ? `$${c.value}` :
                           c.unit === 'cups' ? `${c.value} cups/day` :
                           c.unit === 'rate' ? `${c.value} ZAR/USD` :
                           `${c.value} ${c.unit}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Monthly breakdown bar */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h2 className="text-lg font-bold text-gray-800 mb-4">📊 Monthly Cost vs Revenue Breakdown</h2>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData.slice(0, 12)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={v => `R${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => `R${v.toLocaleString()}`} />
                  <Legend />
                  <Bar dataKey="Coffee Profit" fill={BRAND_GREEN} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Costs" fill={BRAND_RED + '80'} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Net Profit" fill="#9C27B0" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* MENU & PRICING TAB */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuItems.map((item, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
                  <div className="p-2" style={{ backgroundColor: item.category === 'coffee' ? BRAND_GREEN + '20' : BRAND_RED + '10' }}>
                    <span className="text-2xl">{item.category === 'coffee' ? '☕' : '🥐'}</span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-800 mb-3">{item.name}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-gray-500">
                        <span>Ex-VAT cost</span>
                        <span>R{item.price_ex_vat?.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-500">
                        <span>VAT (15%)</span>
                        <span>R{item.vat?.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-500">
                        <span>Incl. VAT</span>
                        <span>R{item.price_incl_vat?.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-500">
                        <span>Mark-up ({((item.markup_pct || 0) * 100).toFixed(0)}%)</span>
                        <span>R{item.markup_rand?.toFixed(2)}</span>
                      </div>
                      <div className="border-t border-gray-100 pt-2 mt-2 flex justify-between font-bold text-base">
                        <span className="text-gray-700">Final Price</span>
                        <span style={{ color: BRAND_RED }}>R{item.final_price?.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Gross margin</span>
                        <span>{item.price_incl_vat ? (((item.final_price - item.price_incl_vat) / item.final_price) * 100).toFixed(1) : '—'}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="font-bold text-gray-700 mb-2">📌 Pricing Policy</h3>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Standard markup: <strong>45%</strong> above VAT-inclusive cost price</li>
                <li>Coffee cup BOM: <strong>R14.16</strong> → selling at <strong>R40.00</strong> ({coffeeMargin}% margin)</li>
                <li>All prices include 15% South African VAT where applicable</li>
                <li>Bulk / franchise pricing available on request</li>
              </ul>
            </div>
          </div>
        )}

        {/* SHIPPING TAB */}
        {activeTab === 'shipping' && shipping && (
          <div className="space-y-6">
            {/* PI Summary */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5" style={{ color: BRAND_GREEN }} />
                Proforma Invoice — {shipping.pi_reference}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                {[
                  { l: 'Shipper', v: shipping.shipper },
                  { l: 'Consignee', v: shipping.consignee },
                  { l: 'Port of Loading', v: shipping.port_of_loading },
                  { l: 'Port of Destination', v: shipping.port_of_destination },
                  { l: 'Final Destination', v: shipping.final_destination },
                  { l: 'Commodity', v: shipping.commodity },
                  { l: 'INCO Terms', v: shipping.inco_terms },
                  { l: 'No. of Packages', v: shipping.no_of_packages },
                  { l: 'Gross Mass (kg)', v: shipping.gross_mass_kg },
                  { l: 'Chargeable Wt.', v: shipping.chargeable_wt },
                  { l: 'USD/ZAR Rate', v: `${shipping.usd_zar_rate}` },
                  { l: 'Quote No.', v: shipping.quote_no },
                ].map((r, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-1">{r.l}</p>
                    <p className="font-semibold text-gray-800 text-xs">{r.v}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Charges Table */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800">💳 Charge Breakdown</h2>
                <button onClick={() => setShowAllCharges(!showAllCharges)} className="text-sm flex items-center gap-1 text-blue-600 hover:text-blue-800">
                  {showAllCharges ? <><ChevronUp className="w-4 h-4" /> Collapse</> : <><ChevronDown className="w-4 h-4" /> Show all</>}
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-200 text-left">
                      <th className="py-2 px-3 text-gray-500 font-semibold text-xs">Code</th>
                      <th className="py-2 px-3 text-gray-500 font-semibold text-xs">Description</th>
                      <th className="py-2 px-3 text-gray-500 font-semibold text-xs text-center">VAT</th>
                      <th className="py-2 px-3 text-gray-500 font-semibold text-xs text-right">Foreign (USD)</th>
                      <th className="py-2 px-3 text-gray-500 font-semibold text-xs text-right">Local Excl. (ZAR)</th>
                      <th className="py-2 px-3 text-gray-500 font-semibold text-xs text-right">VAT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(shipping.charges || []).slice(0, showAllCharges ? undefined : 8).map((c, i) => (
                      <ShippingChargeRow key={i} charge={c} />
                    ))}
                    {!showAllCharges && (shipping.charges || []).length > 8 && (
                      <tr>
                        <td colSpan={6} className="py-3 px-3 text-center text-xs text-gray-400">
                          +{(shipping.charges || []).length - 8} more charges — click "Show all" above
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-gray-200 bg-gray-50">
                      <td colSpan={4} className="py-3 px-3 font-bold text-gray-700">Subtotal (Excl VAT)</td>
                      <td className="py-3 px-3 text-right font-bold text-gray-800">R{shipping.subtotal_excl_vat_zar?.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</td>
                      <td />
                    </tr>
                    <tr className="bg-gray-50">
                      <td colSpan={4} className="py-3 px-3 text-gray-600">VAT</td>
                      <td className="py-3 px-3 text-right text-gray-600">R{shipping.vat_zar?.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</td>
                      <td />
                    </tr>
                    <tr className="bg-green-50">
                      <td colSpan={4} className="py-3 px-3 font-black text-gray-800 text-base">TOTAL (Incl VAT)</td>
                      <td className="py-3 px-3 text-right font-black text-lg" style={{ color: BRAND_RED }}>
                        R{shipping.total_incl_vat_zar?.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                      </td>
                      <td />
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Cost breakdown visual */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Ex-Works (USD equiv.)', value: `R${(570 * 17).toLocaleString()}`, icon: Package, color: '#FF9800' },
                { label: 'Freight & Logistics', value: `R${(6264.5 + 561 + 756.84).toLocaleString('en-ZA', { maximumFractionDigits: 0 })}`, icon: Truck, color: BRAND_GREEN },
                { label: 'Customs Duty + VAT', value: `R${(12920 + 12597).toLocaleString()}`, icon: ShoppingBag, color: BRAND_RED },
              ].map((c, i) => (
                <StatCard key={i} icon={c.icon} label={c.label} value={c.value} color={c.color} />
              ))}
            </div>
          </div>
        )}

        {/* SUPPLIER METRICS TAB */}
        {activeTab === 'suppliers' && <SupplierPerformanceDashboard />}

        {/* SOURCING & PROCUREMENT TAB */}
        {activeTab === 'sourcing' && <SourcingProcurement />}
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Globe, Truck, Droplets, Award, Clock, TrendingUp, AlertCircle, Zap, Wifi } from 'lucide-react';

const BRAND_GREEN = '#4ECDC4';
const BRAND_RED = '#E91E63';
const BRAND_ORANGE = '#FF9800';

// Baseline delivery estimates by origin (days, port-to-port)
const DELIVERY_BASELINES = {
  'Uganda': { days: 45, route: 'Mombasa → Durban → JHB', mode: 'Sea LCL + Inland' },
  'Indonesia': { days: 38, route: 'Jakarta → Durban → JHB', mode: 'Sea LCL + Inland' },
  'South Africa (Local Allocation)': { days: 3, route: 'Durbanville → JHB', mode: 'Road Direct' },
};

// C-Market baseline (NY ICE KC futures, USD/lb) — locked reference for pricing formula
const C_MARKET_BASELINE = 2.25; // USD/lb
const ZAR_USD_HEDGED = 17.0;

function SupplierMetricCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
      <div className="rounded-lg p-2 shrink-0" style={{ backgroundColor: color + '20' }}>
        <Icon className="w-4 h-4" style={{ color }} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-sm font-bold text-gray-800">{value}</p>
        {sub && <p className="text-xs text-gray-400">{sub}</p>}
      </div>
    </div>
  );
}

function SupplierColumn({ supplier, receipts, color }) {
  if (!supplier) return null;
  const delivery = DELIVERY_BASELINES[supplier.origin] || { days: '—', route: '—', mode: '—' };
  const defectCount = receipts.filter(r => r.primaryDefects?.rejected).length;
  const totalReceipts = receipts.length;
  const defectRate = totalReceipts > 0 ? ((defectCount / totalReceipts) * 100).toFixed(1) : '0.0';

  // Landed pricing estimate: C-Market + origin differential (simplified)
  const originDiff = supplier.origin === 'Uganda' ? 0.35 : supplier.origin === 'Indonesia' ? 0.50 : 0.80;
  const finalPriceUsd = C_MARKET_BASELINE + originDiff;
  const finalPriceZarPerLb = finalPriceUsd * ZAR_USD_HEDGED;
  const finalPriceZarPerKg = finalPriceZarPerLb * 2.20462;

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden border-t-4" style={{ borderColor: color }}>
      {/* Header */}
      <div className="p-5" style={{ background: `linear-gradient(135deg, ${color}15, ${color}05)` }}>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{supplier.flag}</span>
          <div>
            <h3 className="text-lg font-black text-gray-800">{supplier.name}</h3>
            <p className="text-xs font-semibold" style={{ color }}>{supplier.role}</p>
          </div>
        </div>
        <p className="text-xs text-gray-500">{supplier.location}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          {supplier.certifications?.map((c, i) => (
            <span key={i} className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: color + '20', color }}>
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Metrics grid */}
      <div className="p-5 space-y-3">
        <SupplierMetricCard
          icon={Clock}
          label="Delivery Time (Port-to-JHB)"
          value={`${delivery.days} days`}
          sub={`${delivery.route} · ${delivery.mode}`}
          color={BRAND_GREEN}
        />
        <SupplierMetricCard
          icon={AlertCircle}
          label="Defect Rate (QC Rejections)"
          value={`${defectRate}%`}
          sub={totalReceipts > 0 ? `${defectCount} rejected / ${totalReceipts} receipts` : 'No receipts logged yet — baseline 0%'}
          color={BRAND_RED}
        />
        <SupplierMetricCard
          icon={Droplets}
          label="Moisture Tolerance"
          value={supplier.moistureRange || '9.0% - 12.0%'}
          sub="Hard cap · reject outside range"
          color="#3B82F6"
        />
        <SupplierMetricCard
          icon={Award}
          label="Min SCA Cupping Score"
          value={`${supplier.minCuppingScore || 80.0}`}
          sub="Baseline 80 · Premium 83+"
          color={BRAND_ORANGE}
        />
        <SupplierMetricCard
          icon={Globe}
          label="Operational Capacity"
          value={supplier.capacity || '—'}
          sub={supplier.originRegions?.join(', ')}
          color="#9C27B0"
        />
        <SupplierMetricCard
          icon={TrendingUp}
          label="Est. Landed Price (Green/kg)"
          value={`R${finalPriceZarPerKg.toFixed(2)}`}
          sub={`C-Market $${C_MARKET_BASELINE} + $${originDiff.toFixed(2)} diff × ${ZAR_USD_HEDGED} ZAR/USD`}
          color={BRAND_GREEN}
        />
        <SupplierMetricCard
          icon={Truck}
          label="Incoterms"
          value={supplier.terms || '—'}
          sub="Procurement contract terms"
          color={BRAND_RED}
        />
      </div>
    </div>
  );
}

export default function SupplierPerformanceDashboard() {
  const [suppliers, setSuppliers] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [algranoStatus, setAlgranoStatus] = useState('disconnected');

  useEffect(() => {
    const load = async () => {
      const [supps, recs] = await Promise.all([
        base44.entities.SupplierProfile.list('name', 20),
        base44.entities.GreenCoffeeReceipt.list('-created_date', 50),
      ]);
      setSuppliers(supps);
      setReceipts(recs);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: BRAND_GREEN, borderTopColor: 'transparent' }} />
      </div>
    );
  }

  const nonda = suppliers.find(s => s.name === 'Nonda Coffee');
  const royal = suppliers.find(s => s.name === 'Royal Pacific Harvest');
  const green = suppliers.find(s => s.name === 'Green Coffee Supply');

  const nondaReceipts = receipts.filter(r => r.supplierName === 'Nonda Coffee');
  const royalReceipts = receipts.filter(r => r.supplierName === 'Royal Pacific Harvest');
  const greenReceipts = receipts.filter(r => r.supplierName === 'Green Coffee Supply');

  return (
    <div className="space-y-6">
      {/* Section title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-gray-800">📊 Supplier Performance & Telemetry</h2>
          <p className="text-sm text-gray-500">Side-by-side comparison: Nonda Coffee vs Royal Pacific Harvest vs Green Coffee Supply</p>
        </div>
      </div>

      {/* Algrano API status banner */}
      <div className="rounded-2xl p-5 shadow-md" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #2d1b4e 100%)' }}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-full p-3" style={{ backgroundColor: algranoStatus === 'connected' ? BRAND_GREEN + '30' : BRAND_ORANGE + '30' }}>
              <Zap className="w-5 h-5" style={{ color: algranoStatus === 'connected' ? BRAND_GREEN : BRAND_ORANGE }} />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Algrano Real-Time API Feed</p>
              <p className="text-xs text-gray-400">
                {algranoStatus === 'connected'
                  ? 'Streaming live origin costs & vessel transit data'
                  : 'Disconnected — requires ALGRANO_API_KEY credentials to activate live origin cost streaming'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${algranoStatus === 'connected' ? 'bg-green-400 animate-pulse' : 'bg-orange-400'}`} />
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: algranoStatus === 'connected' ? BRAND_GREEN : BRAND_ORANGE }}>
              {algranoStatus === 'connected' ? 'Live' : 'Pending Credentials'}
            </span>
          </div>
        </div>
        {algranoStatus !== 'connected' && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="flex items-center gap-2 text-gray-400">
                <Wifi className="w-4 h-4" style={{ color: BRAND_ORANGE }} />
                Origin cost streaming (C-Market + differentials)
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Truck className="w-4 h-4" style={{ color: BRAND_ORANGE }} />
                Vessel & customs transit tracking
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Globe className="w-4 h-4" style={{ color: BRAND_ORANGE }} />
                Global supplier inventory feed
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Supplier comparison columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <SupplierColumn supplier={nonda} receipts={nondaReceipts} color={BRAND_GREEN} />
        <SupplierColumn supplier={royal} receipts={royalReceipts} color={BRAND_ORANGE} />
        <SupplierColumn supplier={green} receipts={greenReceipts} color={BRAND_RED} />
      </div>

      {/* Green Coffee Receipts log */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h3 className="font-bold text-gray-800 mb-4">📋 Green Coffee Receipt Log</h3>
        {receipts.length === 0 ? (
          <div className="text-center py-8">
            <Droplets className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No green coffee receipts logged yet.</p>
            <p className="text-xs text-gray-400 mt-1">Receipts will appear here as lots are contracted and received via the procurement lifecycle.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-100 text-left">
                  <th className="py-2 px-3 text-xs text-gray-500 font-semibold">Lot Ref</th>
                  <th className="py-2 px-3 text-xs text-gray-500 font-semibold">Supplier</th>
                  <th className="py-2 px-3 text-xs text-gray-500 font-semibold">Origin</th>
                  <th className="py-2 px-3 text-xs text-gray-500 font-semibold text-right">Qty (kg)</th>
                  <th className="py-2 px-3 text-xs text-gray-500 font-semibold text-right">Moisture</th>
                  <th className="py-2 px-3 text-xs text-gray-500 font-semibold text-right">SCA Score</th>
                  <th className="py-2 px-3 text-xs text-gray-500 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {receipts.map((r, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2 px-3 font-mono text-xs text-gray-600">{r.lotReference}</td>
                    <td className="py-2 px-3 text-gray-700">{r.supplierName}</td>
                    <td className="py-2 px-3 text-gray-600">{r.origin}</td>
                    <td className="py-2 px-3 text-right text-gray-700">{r.quantityKg?.toLocaleString('en-ZA')}</td>
                    <td className="py-2 px-3 text-right text-gray-600">{r.moistureContent ? `${r.moistureContent}%` : '—'}</td>
                    <td className="py-2 px-3 text-right text-gray-600">{r.scaCuppingScore || '—'}</td>
                    <td className="py-2 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                        style={{
                          background: r.status === 'received' ? BRAND_GREEN + '20' : r.status === 'qc-rejected' ? BRAND_RED + '20' : '#FF980020',
                          color: r.status === 'received' ? BRAND_GREEN : r.status === 'qc-rejected' ? BRAND_RED : BRAND_ORANGE
                        }}>
                        {r.status || 'contracted'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
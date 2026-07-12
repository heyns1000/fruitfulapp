import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, TrendingUp, TrendingDown, DollarSign, Package, Star, Activity } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, LineChart, Line, AreaChart, Area
} from 'recharts';

const CYCLE_DAYS = 30;

function cycleBounds() {
  const now = new Date();
  const currentStart = new Date(now); currentStart.setDate(now.getDate() - CYCLE_DAYS);
  const prevStart = new Date(currentStart); prevStart.setDate(currentStart.getDate() - CYCLE_DAYS);
  return { currentStart, prevStart, now };
}

function inRange(dateStr, start, end) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  return d >= start && d < end;
}

function pctChange(curr, prev) {
  if (prev === 0) return curr > 0 ? 100 : 0;
  return ((curr - prev) / prev) * 100;
}

function GrowthBadge({ value }) {
  const up = value >= 0;
  return (
    <Badge variant="outline" className={`gap-1 ${up ? 'text-emerald-700 border-emerald-300 bg-emerald-50' : 'text-rose-700 border-rose-300 bg-rose-50'}`}>
      {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {up ? '+' : ''}{value.toFixed(1)}%
    </Badge>
  );
}

function StatCard({ icon: Icon, label, current, previous, format }) {
  const change = pctChange(current, previous);
  const fmt = format || ((v) => v.toLocaleString());
  return (
    <Card className="bg-gradient-to-br from-white to-slate-50 border-slate-200">
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
          <Icon className="w-4 h-4 text-slate-500" />
          {label}
        </CardTitle>
        <GrowthBadge value={change} />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-slate-900">{fmt(current)}</div>
        <p className="text-xs text-slate-400 mt-1">Prev: {fmt(previous)}</p>
      </CardContent>
    </Card>
  );
}

export default function BrandInsights() {
  const { data: brands = [], isLoading: brandsLoading } = useQuery({
    queryKey: ['brands'],
    queryFn: () => base44.entities.Brand.list('-updated_date', 200)
  });

  const { data: services = [], isLoading: servicesLoading } = useQuery({
    queryKey: ['marketplace-services-insights'],
    queryFn: () => base44.entities.MarketplaceService.list('-updated_date', 200)
  });

  const { data: payments = [], isLoading: paymentsLoading } = useQuery({
    queryKey: ['payments-insights'],
    queryFn: () => base44.entities.Payment.list('-created_date', 200)
  });

  const { data: metrics = [], isLoading: metricsLoading } = useQuery({
    queryKey: ['metrics-insights'],
    queryFn: () => base44.entities.Metrics.list('-created_date', 100)
  });

  const loading = brandsLoading || servicesLoading || paymentsLoading || metricsLoading;

  const insights = useMemo(() => {
    const { currentStart, prevStart } = cycleBounds();

    // Revenue by brand per cycle
    const brandRevenue = {};
    brands.forEach(b => {
      brandRevenue[b.id] = { name: b.name, current: 0, prev: 0, salesCurrent: 0, salesPrev: 0 };
    });

    payments.forEach(p => {
      const key = p.brandId || `__${p.brandName}`;
      if (!brandRevenue[key]) {
        brandRevenue[key] = { name: p.brandName || 'Unknown', current: 0, prev: 0, salesCurrent: 0, salesPrev: 0 };
      }
      if (p.status !== 'completed' && p.status !== 'success') return;
      if (inRange(p.created_date, currentStart, new Date())) {
        brandRevenue[key].current += p.amount || 0;
        brandRevenue[key].salesCurrent += 1;
      } else if (inRange(p.created_date, prevStart, currentStart)) {
        brandRevenue[key].prev += p.amount || 0;
        brandRevenue[key].salesPrev += 1;
      }
    });

    // Marketplace service aggregates per brand
    const serviceAgg = {};
    services.forEach(s => {
      const key = s.brandId || `__${s.brandName}`;
      if (!serviceAgg[key]) serviceAgg[key] = { totalSales: 0, rating: 0, count: 0, reviews: 0 };
      serviceAgg[key].totalSales += s.totalSales || 0;
      serviceAgg[key].rating += s.rating || 0;
      serviceAgg[key].reviews += s.reviewCount || 0;
      serviceAgg[key].count += 1;
    });

    // Build brand comparison rows
    const brandRows = Object.entries(brandRevenue)
      .map(([id, r]) => {
        const agg = serviceAgg[id] || {};
        const avgRating = agg.count ? agg.rating / agg.count : 0;
        const growth = pctChange(r.current, r.prev);
        return { ...r, id, totalSales: agg.totalSales || 0, avgRating, reviews: agg.reviews || 0, growth };
      })
      .filter(r => r.current > 0 || r.prev > 0)
      .sort((a, b) => b.current - a.current);

    const totalRevCurrent = brandRows.reduce((s, r) => s + r.current, 0);
    const totalRevPrev = brandRows.reduce((s, r) => s + r.prev, 0);
    const totalSalesCurrent = brandRows.reduce((s, r) => s + r.salesCurrent, 0);
    const totalSalesPrev = brandRows.reduce((s, r) => s + r.salesPrev, 0);
    const activeBrandsCurrent = brandRows.filter(r => r.current > 0).length;
    const activeBrandsPrev = brandRows.filter(r => r.prev > 0).length;
    const avgRatingCurrent = brandRows.length
      ? brandRows.reduce((s, r) => s + r.avgRating, 0) / brandRows.length
      : 0;

    // Top 10 for chart
    const chartData = brandRows.slice(0, 10).map(r => ({
      name: r.name?.length > 14 ? r.name.slice(0, 12) + '…' : r.name,
      Current: Math.round(r.current),
      Previous: Math.round(r.prev),
    }));

    // Growth leaders
    const growthLeaders = [...brandRows]
      .filter(r => r.prev > 0 || r.current > 0)
      .sort((a, b) => b.growth - a.growth)
      .slice(0, 5);

    // Metrics time series
    const metricsSeries = [...metrics]
      .sort((a, b) => new Date(a.timestamp || a.created_date) - new Date(b.timestamp || b.created_date))
      .slice(-12)
      .map(m => ({
        date: new Date(m.timestamp || m.created_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        ActiveNodes: m.activeNodes || 0,
        Licenses: m.licensesActive || 0,
        Vaults: m.vaultDeployments || 0,
        SyncLogs: m.syncLogs || 0,
      }));

    return {
      brandRows, chartData, growthLeaders, metricsSeries,
      totalRevCurrent, totalRevPrev,
      totalSalesCurrent, totalSalesPrev,
      activeBrandsCurrent, activeBrandsPrev,
      avgRatingCurrent,
    };
  }, [brands, services, payments, metrics]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <header className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 text-white py-8 shadow-xl mb-6">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Activity className="w-9 h-9 drop-shadow-lg" />
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold drop-shadow-lg">Brand Insights</h1>
              <p className="opacity-90 mt-1 text-sm sm:text-base">
                Performance comparison · Current vs Previous {CYCLE_DAYS}-day cycle
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 space-y-6">
        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={DollarSign} label="Revenue (Current Cycle)" current={insights.totalRevCurrent} previous={insights.totalRevPrev} format={(v) => v.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })} />
          <StatCard icon={Package} label="Transactions" current={insights.totalSalesCurrent} previous={insights.totalSalesPrev} />
          <StatCard icon={TrendingUp} label="Active Brands" current={insights.activeBrandsCurrent} previous={insights.activeBrandsPrev} />
          <Card className="bg-gradient-to-br from-amber-50 to-yellow-100 border-amber-200">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium text-amber-900 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500" />
                Avg Rating
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-900">{insights.avgRatingCurrent.toFixed(1)}</div>
              <p className="text-xs text-amber-600 mt-1">Across {insights.brandRows.length} brands</p>
            </CardContent>
          </Card>
        </div>

        {/* Revenue comparison bar chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Brand — Current vs Previous Cycle</CardTitle>
            <CardDescription>Top 10 brands by current-cycle revenue</CardDescription>
          </CardHeader>
          <CardContent>
            {insights.chartData.length === 0 ? (
              <p className="text-center py-8 text-sm text-slate-400">No revenue data recorded yet for this cycle.</p>
            ) : (
              <ResponsiveContainer width="100%" height={360}>
                <BarChart data={insights.chartData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={70} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`} />
                  <Tooltip formatter={(v) => `$${v.toLocaleString()}`} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                  <Legend />
                  <Bar dataKey="Previous" fill="#cbd5e1" name="Previous Cycle" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Current" fill="#6366f1" name="Current Cycle" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Growth leaders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                Growth Leaders
              </CardTitle>
              <CardDescription>Biggest revenue growth vs previous cycle</CardDescription>
            </CardHeader>
            <CardContent>
              {insights.growthLeaders.length === 0 ? (
                <p className="text-center py-8 text-sm text-slate-400">No growth data yet.</p>
              ) : (
                <div className="space-y-3">
                  {insights.growthLeaders.map((r, i) => (
                    <div key={r.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-slate-400 w-5">{i + 1}</span>
                        <div>
                          <p className="font-semibold text-slate-800 text-sm">{r.name}</p>
                          <p className="text-xs text-slate-400">${r.current.toLocaleString()} vs ${r.prev.toLocaleString()}</p>
                        </div>
                      </div>
                      <GrowthBadge value={r.growth} />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Metrics time series */}
          <Card>
            <CardHeader>
              <CardTitle>System Metrics Over Time</CardTitle>
              <CardDescription>Active nodes, licenses & vaults trend</CardDescription>
            </CardHeader>
            <CardContent>
              {insights.metricsSeries.length === 0 ? (
                <p className="text-center py-8 text-sm text-slate-400">No metrics snapshots recorded yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={insights.metricsSeries}>
                    <defs>
                      <linearGradient id="gradNodes" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                    <Legend />
                    <Area type="monotone" dataKey="ActiveNodes" stroke="#6366f1" fill="url(#gradNodes)" name="Active Nodes" />
                    <Line type="monotone" dataKey="Licenses" stroke="#10b981" name="Licenses" dot={false} />
                    <Line type="monotone" dataKey="Vaults" stroke="#f59e0b" name="Vaults" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Full brand table */}
        <Card>
          <CardHeader>
            <CardTitle>All Brands — Cycle Comparison</CardTitle>
            <CardDescription>Revenue, transactions, ratings and growth per brand</CardDescription>
          </CardHeader>
          <CardContent>
            {insights.brandRows.length === 0 ? (
              <p className="text-center py-8 text-sm text-slate-400">No brand performance data available yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-left text-xs uppercase text-slate-500">
                      <th className="py-2 pr-4">Brand</th>
                      <th className="py-2 px-4 text-right">Current Rev</th>
                      <th className="py-2 px-4 text-right">Previous Rev</th>
                      <th className="py-2 px-4 text-right">Txns</th>
                      <th className="py-2 px-4 text-right">Avg Rating</th>
                      <th className="py-2 px-4 text-right">Growth</th>
                    </tr>
                  </thead>
                  <tbody>
                    {insights.brandRows.map(r => (
                      <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-2 pr-4 font-medium text-slate-800">{r.name}</td>
                        <td className="py-2 px-4 text-right text-slate-700">${r.current.toLocaleString()}</td>
                        <td className="py-2 px-4 text-right text-slate-400">${r.prev.toLocaleString()}</td>
                        <td className="py-2 px-4 text-right text-slate-600">{r.salesCurrent}</td>
                        <td className="py-2 px-4 text-right text-slate-600">{r.avgRating.toFixed(1)}</td>
                        <td className="py-2 px-4 text-right"><GrowthBadge value={r.growth} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
import React, { useState, useMemo } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { TrendingUp, BarChart3 } from 'lucide-react';

// Interactive growth-trend charts built directly from synced Google Sheet rows.
// User picks which column is the sector/category, which is the time/label axis,
// and which numeric column to trend. Renders one line per sector.
export default function SheetGrowthCharts({ data }) {
  const headers = data?.headers || [];
  const rows = data?.rows || [];

  const numericKeys = useMemo(() => {
    return headers.filter((h) =>
      rows.some((r) => r[h] !== '' && !isNaN(Number(String(r[h]).replace(/[^0-9.\-]/g, ''))))
    );
  }, [headers, rows]);

  const categoricalKeys = useMemo(() => {
    return headers.filter((h) => !numericKeys.includes(h));
  }, [headers, numericKeys]);

  const [sectorKey, setSectorKey] = useState('');
  const [timeKey, setTimeKey] = useState('');
  const [valueKey, setValueKey] = useState('');
  const [chartType, setChartType] = useState('area');

  // auto-pick defaults once data arrives
  React.useEffect(() => {
    if (headers.length && !sectorKey) {
      const guess = categoricalKeys.find((h) => /sector|brand|category|region/i.test(h)) || categoricalKeys[0] || '';
      setSectorKey(guess);
    }
    if (headers.length && !timeKey) {
      const guess = headers.find((h) => /date|month|week|period|time/i.test(h)) || categoricalKeys.find((h) => h !== sectorKey) || headers[0] || '';
      setTimeKey(guess);
    }
    if (numericKeys.length && !valueKey) {
      setValueKey(numericKeys[0]);
    }
  }, [headers, numericKeys, categoricalKeys]);

  // Build chart data: group rows by timeKey, each sector becomes a series.
  const { chartData, sectors } = useMemo(() => {
    if (!timeKey || !valueKey || rows.length === 0) return { chartData: [], sectors: [] };
    const parseNum = (v) => {
      const n = Number(String(v).replace(/[^0-9.\-]/g, ''));
      return isNaN(n) ? 0 : n;
    };
    const timeBuckets = new Map();
    const sectorSet = new Set();
    rows.forEach((r) => {
      const t = String(r[timeKey] || '—');
      const s = sectorKey ? String(r[sectorKey] || 'Unknown') : 'All';
      sectorSet.add(s);
      if (!timeBuckets.has(t)) timeBuckets.set(t, { _time: t });
      timeBuckets.get(t)[s] = (timeBuckets.get(t)[s] || 0) + parseNum(r[valueKey]);
    });
    const sorted = [...timeBuckets.values()].sort((a, b) => String(a._time).localeCompare(String(b._time)));
    return { chartData: sorted, sectors: [...sectorSet].sort() };
  }, [rows, timeKey, valueKey, sectorKey]);

  const palette = ['#0891b2', '#7c3aed', '#db2777', '#16a34a', '#ea580c', '#2563eb', '#ca8a04', '#dc2626'];

  if (!data || !rows.length) {
    return (
      <Card className="bg-white/80 backdrop-blur">
        <CardContent className="py-10 text-center text-slate-500">
          <BarChart3 className="w-8 h-8 mx-auto mb-2 text-slate-400" />
          Sync a Google Sheet first to see growth-trend charts by sector.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur border-slate-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          Sector Growth Trends
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-600">Sector column</Label>
            <select
              value={sectorKey}
              onChange={(e) => setSectorKey(e.target.value)}
              className="w-full h-9 rounded-md border border-slate-300 bg-white px-3 text-sm"
            >
              <option value="">(none — single series)</option>
              {headers.map((h) => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-600">Time / axis</Label>
            <select
              value={timeKey}
              onChange={(e) => setTimeKey(e.target.value)}
              className="w-full h-9 rounded-md border border-slate-300 bg-white px-3 text-sm"
            >
              {headers.map((h) => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-600">Value column</Label>
            <select
              value={valueKey}
              onChange={(e) => setValueKey(e.target.value)}
              className="w-full h-9 rounded-md border border-slate-300 bg-white px-3 text-sm"
            >
              {numericKeys.map((h) => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-600">Chart type</Label>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className="w-full h-9 rounded-md border border-slate-300 bg-white px-3 text-sm"
            >
              <option value="area">Area</option>
              <option value="line">Line</option>
            </select>
          </div>
        </div>

        {/* Chart */}
        {chartData.length > 0 ? (
          <div className="w-full h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'area' ? (
                <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                  <defs>
                    {sectors.map((s, i) => (
                      <linearGradient key={s} id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={palette[i % palette.length]} stopOpacity={0.35} />
                        <stop offset="95%" stopColor={palette[i % palette.length]} stopOpacity={0.02} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="_time" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(1)}k` : v} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  {sectors.map((s, i) => (
                    <Area key={s} type="monotone" dataKey={s} stroke={palette[i % palette.length]} fill={`url(#grad-${i})`} strokeWidth={2} />
                  ))}
                </AreaChart>
              ) : (
                <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="_time" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(1)}k` : v} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  {sectors.map((s, i) => (
                    <Line key={s} type="monotone" dataKey={s} stroke={palette[i % palette.length]} strokeWidth={2} dot={{ r: 3 }} />
                  ))}
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-sm text-slate-500 text-center py-8">Select columns to render the trend chart.</p>
        )}
      </CardContent>
    </Card>
  );
}
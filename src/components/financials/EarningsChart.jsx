import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO, startOfMonth } from 'date-fns';

export default function EarningsChart({ orders }) {
  // Group paid orders by month
  const monthMap = {};
  orders
    .filter(o => o.paymentStatus === 'paid')
    .forEach(o => {
      const key = format(startOfMonth(parseISO(o.created_date)), 'yyyy-MM');
      monthMap[key] = (monthMap[key] || 0) + (o.totalAmount || 0);
    });

  const data = Object.entries(monthMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12)
    .map(([key, total]) => ({
      month: format(parseISO(key + '-01'), 'MMM yy'),
      earnings: total,
    }));

  if (data.length === 0) return (
    <div className="h-40 flex items-center justify-center text-muted-foreground text-sm">No earnings data yet</div>
  );

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#292524" />
        <XAxis dataKey="month" tick={{ fill: '#78716c', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#78716c', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
        <Tooltip
          contentStyle={{ background: '#1c1917', border: '1px solid #292524', borderRadius: 8, color: '#fff' }}
          formatter={(v) => [`$${v.toFixed(2)}`, 'Earnings']}
        />
        <Area type="monotone" dataKey="earnings" stroke="#f97316" strokeWidth={2} fill="url(#earningsGrad)" dot={{ fill: '#f97316', strokeWidth: 0, r: 3 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
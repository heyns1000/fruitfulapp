import React from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const DEPLOYMENT_TRENDS = [
  { month: 'Jan', scrolls: 500 },
  { month: 'Feb', scrolls: 650 },
  { month: 'Mar', scrolls: 720 },
  { month: 'Apr', scrolls: 800 },
  { month: 'May', scrolls: 780 },
  { month: 'Jun', scrolls: 920 },
];

const ROYALTY_DISTRIBUTION = [
  { name: 'AI Logic', value: 25, color: '#0071e3' },
  { name: 'Logistics', value: 18, color: '#30d158' },
  { name: 'Finance', value: 15, color: '#f59e0b' },
  { name: 'Creative', value: 12, color: '#ef4444' },
  { name: 'Health', value: 10, color: '#B8860B' },
  { name: 'Other', value: 20, color: '#6e6e73' },
];

const USER_ACTIVITY = [
  { day: 'Mon', users: 200, apiCalls: 12 },
  { day: 'Tue', users: 250, apiCalls: 15 },
  { day: 'Wed', users: 230, apiCalls: 14 },
  { day: 'Thu', users: 280, apiCalls: 18 },
  { day: 'Fri', users: 300, apiCalls: 20 },
  { day: 'Sat', users: 150, apiCalls: 8 },
  { day: 'Sun', users: 120, apiCalls: 6 },
];

export default function CodenestAnalytics() {
  return (
    <div className="bg-[#2a2a2e] rounded-xl p-6 border border-[#3a3a3e]">
      <h3 className="text-xl font-bold text-[#B8860B] mb-4">Performance Analytics</h3>
      <p className="text-gray-400 text-sm mb-6">Insights into your deployed scrolls and overall platform engagement.</p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-[#1a1a1c] rounded-lg p-4 border border-[#3a3a3e]">
          <h4 className="text-sm font-semibold text-gray-300 mb-3">Deployment Trends</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DEPLOYMENT_TRENDS}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip contentStyle={{ background: '#1a1a1c', border: '1px solid #3a3a3e', borderRadius: '8px' }} />
                <Bar dataKey="scrolls" name="New Scrolls Deployed" fill="#0071e3" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-[#1a1a1c] rounded-lg p-4 border border-[#3a3a3e]">
          <h4 className="text-sm font-semibold text-gray-300 mb-3">Royalty Distribution by Sector</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={ROYALTY_DISTRIBUTION} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2}>
                  {ROYALTY_DISTRIBUTION.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#1a1a1c', border: '1px solid #3a3a3e', borderRadius: '8px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="bg-[#1a1a1c] rounded-lg p-4 border border-[#3a3a3e]">
        <h4 className="text-sm font-semibold text-gray-300 mb-3">User Engagement Metrics</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={USER_ACTIVITY}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
              <YAxis yAxisId="left" stroke="#9ca3af" fontSize={12} />
              <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" fontSize={12} />
              <Tooltip contentStyle={{ background: '#1a1a1c', border: '1px solid #3a3a3e', borderRadius: '8px' }} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Line yAxisId="left" type="monotone" dataKey="users" name="Active Users" stroke="#30d158" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="apiCalls" name="API Calls (K)" stroke="#B8860B" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
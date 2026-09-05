import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { FolderPlus, Activity, DollarSign, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const SYSTEM_HEALTH_DATA = [
  { month: 'Jan', successRate: 95, latency: 80 },
  { month: 'Feb', successRate: 96, latency: 75 },
  { month: 'Mar', successRate: 97, latency: 70 },
  { month: 'Apr', successRate: 98, latency: 65 },
  { month: 'May', successRate: 97, latency: 72 },
  { month: 'Jun', successRate: 99, latency: 68 },
  { month: 'Jul', successRate: 98, latency: 62 },
  { month: 'Aug', successRate: 99, latency: 58 },
  { month: 'Sep', successRate: 99, latency: 55 },
  { month: 'Oct', successRate: 100, latency: 50 },
  { month: 'Nov', successRate: 99, latency: 48 },
  { month: 'Dec', successRate: 99, latency: 45 },
];

export default function CodenestOverview({ onViewChange }) {
  const { data: projects = [] } = useQuery({
    queryKey: ['scrollProjects'],
    queryFn: () => base44.entities.ScrollProject.list('-updated_date', 500),
  });

  const totalProjects = projects.length;
  const liveScrolls = projects.filter((p) => p.status === 'live').length;
  const monthlyRoyalties = projects
    .filter((p) => p.royalty && p.royalty !== 'N/A')
    .reduce((sum, p) => sum + (parseFloat(p.royalty) || 0) * 100, 0);

  return (
    <div className="space-y-6">
      <div className="bg-[#2a2a2e] rounded-xl p-6 border border-[#3a3a3e]">
        <h3 className="text-xl font-bold text-[#B8860B] mb-2">Welcome Back, Scroll Creator!</h3>
        <p className="text-gray-300 mb-4 text-sm">
          Your CodeNest™ portal offers comprehensive tools to build, license, and deploy scroll-based web projects across the Fruitful Global Treaty Grid.
        </p>
        <Button onClick={() => onViewChange('new-project')} className="bg-[#30d158] hover:bg-[#28a745] text-white">
          <FolderPlus className="w-4 h-4 mr-2" /> Start New Scroll Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#2a2a2e] rounded-xl p-5 border border-[#3a3a3e] text-center">
          <div className="flex items-center justify-center gap-2 text-gray-400 text-sm mb-2"><FolderPlus className="w-4 h-4" /> Total Projects</div>
          <p className="text-3xl font-extrabold text-[#0071e3]">{totalProjects.toLocaleString()}</p>
        </div>
        <div className="bg-[#2a2a2e] rounded-xl p-5 border border-[#3a3a3e] text-center">
          <div className="flex items-center justify-center gap-2 text-gray-400 text-sm mb-2"><Activity className="w-4 h-4" /> Live Scrolls</div>
          <p className="text-3xl font-extrabold text-[#30d158]">{liveScrolls.toLocaleString()}</p>
        </div>
        <div className="bg-[#2a2a2e] rounded-xl p-5 border border-[#3a3a3e] text-center">
          <div className="flex items-center justify-center gap-2 text-gray-400 text-sm mb-2"><DollarSign className="w-4 h-4" /> Monthly Royalties</div>
          <p className="text-3xl font-extrabold text-[#B8860B]">${monthlyRoyalties.toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-[#2a2a2e] rounded-xl p-6 border border-[#3a3a3e]">
        <h3 className="text-lg font-bold text-[#B8860B] mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5" /> System Health Overview</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={SYSTEM_HEALTH_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
              <YAxis yAxisId="left" stroke="#9ca3af" fontSize={12} />
              <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" fontSize={12} />
              <Tooltip contentStyle={{ background: '#1a1a1c', border: '1px solid #3a3a3e', borderRadius: '8px' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line yAxisId="left" type="monotone" dataKey="successRate" name="Deployment Success Rate (%)" stroke="#30d158" strokeWidth={2} dot={{ r: 3 }} />
              <Line yAxisId="right" type="monotone" dataKey="latency" name="Vault Sync Latency (ms)" stroke="#0071e3" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
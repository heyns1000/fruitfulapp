import React from 'react';
import { Activity, Key, Database, FileText, TrendingUp, Radio, Grid } from 'lucide-react';

export default function MetricsCards({ metrics }) {
  const cards = [
    { icon: Activity, label: 'Active Nodes', value: metrics?.activeNodes || 0, color: 'text-blue-600' },
    { icon: Key, label: 'Licenses Active', value: metrics?.licensesActive || 0, color: 'text-green-600' },
    { icon: Database, label: 'Vault Deployments', value: metrics?.vaultDeployments || 0, color: 'text-purple-600' },
    { icon: FileText, label: 'Sync Logs', value: metrics?.syncLogs || 0, color: 'text-yellow-600' },
    { icon: TrendingUp, label: 'Audits Running', value: metrics?.auditsRunning || 0, color: 'text-red-600' },
    { icon: Radio, label: 'Signal Zones', value: metrics?.signalZones || 0, color: 'text-indigo-600' },
    { icon: Grid, label: 'Scroll Grid Index', value: metrics?.scrollGridIndex || 0, color: 'text-pink-600' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-7 gap-4 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white p-5 rounded-lg shadow hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
        >
          <div className="flex items-center justify-between mb-2">
            <card.icon className={`w-5 h-5 ${card.color}`} />
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">{card.label}</h3>
          <p className="text-2xl font-bold text-gray-900">{card.value.toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}
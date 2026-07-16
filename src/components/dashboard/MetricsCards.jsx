import React from 'react';
import { Activity, Key, Database, FileText, TrendingUp, Radio, Grid } from 'lucide-react';

export default function MetricsCards({ metrics }) {
  const cards = [
    { icon: Activity, label: 'Active Nodes', value: metrics?.activeNodes || 0 },
    { icon: Key, label: 'Licenses Active', value: metrics?.licensesActive || 0 },
    { icon: Database, label: 'Vault Deployments', value: metrics?.vaultDeployments || 0 },
    { icon: FileText, label: 'Sync Logs', value: metrics?.syncLogs || 0 },
    { icon: TrendingUp, label: 'Audits Running', value: metrics?.auditsRunning || 0 },
    { icon: Radio, label: 'Signal Zones', value: metrics?.signalZones || 0 },
    { icon: Grid, label: 'Scroll Grid Index', value: metrics?.scrollGridIndex || 0 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-7 gap-4 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-card border border-border p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 text-primary">
              <card.icon className="w-5 h-5" />
            </span>
          </div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">{card.label}</h3>
          <p className="text-2xl font-bold text-foreground">{card.value.toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}

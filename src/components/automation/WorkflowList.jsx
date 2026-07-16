import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap, Play, Pause, Pencil, Trash2, ArrowDown, CheckCircle, XCircle, Clock } from 'lucide-react';

function StatusBadge({ status }) {
  const map = {
    active: 'bg-green-100 text-green-700 border-green-200',
    paused: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    draft: 'bg-gray-100 text-gray-600 border-gray-200',
  };
  return <Badge className={`text-xs border ${map[status] || map.draft}`}>{status}</Badge>;
}

function RunStatusIcon({ status }) {
  if (status === 'success') return <CheckCircle className="w-4 h-4 text-green-500" />;
  if (status === 'failed') return <XCircle className="w-4 h-4 text-red-500" />;
  return <Clock className="w-4 h-4 text-gray-400" />;
}

export default function WorkflowList({ rules, isLoading, onEdit, onRefresh }) {
  const [simulating, setSimulating] = useState(null);

  const toggleStatus = async (rule) => {
    const newStatus = rule.status === 'active' ? 'paused' : 'active';
    await base44.entities.AutomationRule.update(rule.id, { status: newStatus });
    onRefresh();
  };

  const deleteRule = async (id) => {
    await base44.entities.AutomationRule.delete(id);
    onRefresh();
  };

  const simulateRun = async (rule) => {
    setSimulating(rule.id);
    await base44.entities.AutomationRule.update(rule.id, {
      runCount: (rule.runCount || 0) + 1,
      lastRunAt: new Date().toISOString(),
      lastRunStatus: 'success',
    });
    setTimeout(() => {
      setSimulating(null);
      onRefresh();
    }, 1800);
  };

  if (isLoading) return (
    <div className="text-center py-16 text-gray-400">Loading workflows...</div>
  );

  if (rules.length === 0) return (
    <div className="text-center py-20">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <Zap className="w-10 h-10 text-primary" />
      </div>
      <p className="text-xl font-semibold text-gray-700">No automations yet</p>
      <p className="text-gray-500 text-sm mt-2">Click "New Workflow" to build your first If-This-Then-That rule</p>
    </div>
  );

  return (
    <div className="space-y-4">
      {rules.map(rule => (
        <Card key={rule.id} className={`border-gray-200 transition-all ${rule.status === 'paused' ? 'opacity-70' : ''}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="font-bold text-gray-900">{rule.name}</h3>
                  <StatusBadge status={rule.status} />
                  {rule.brandName && <Badge variant="outline" className="text-xs">{rule.brandName}</Badge>}
                </div>

                {/* Visual Flow */}
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 border border-primary/30 rounded-full">
                    <Zap className="w-3 h-3 text-primary shrink-0" />
                    <span className="text-xs font-medium text-primary whitespace-nowrap">
                      {rule.trigger?.icon} {rule.trigger?.label}
                    </span>
                  </div>
                  <ArrowDown className="w-4 h-4 text-gray-300 rotate-[-90deg] shrink-0" />
                  <div className="flex flex-wrap gap-1.5">
                    {(rule.actions || []).map((a, i) => (
                      <div key={i} className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full">
                        <span className="text-xs font-medium text-blue-800 whitespace-nowrap">{a.icon} {a.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Run stats */}
                <div className="flex items-center gap-3 mt-2">
                  {rule.runCount > 0 && (
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <RunStatusIcon status={rule.lastRunStatus} />
                      Ran {rule.runCount} time{rule.runCount !== 1 ? 's' : ''}
                      {rule.lastRunAt && ` · Last: ${new Date(rule.lastRunAt).toLocaleDateString()}`}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  size="sm" variant="outline"
                  onClick={() => simulateRun(rule)}
                  disabled={simulating === rule.id || rule.status === 'paused'}
                  className="text-xs border-green-300 text-green-700 hover:bg-green-50"
                >
                  {simulating === rule.id
                    ? <><div className="w-3 h-3 border-2 border-green-500 border-t-transparent rounded-full animate-spin mr-1" />Running...</>
                    : <><Play className="w-3 h-3 mr-1" />Test Run</>
                  }
                </Button>
                <Button
                  size="sm" variant="ghost"
                  onClick={() => toggleStatus(rule)}
                  className="text-xs text-gray-500 hover:text-gray-700"
                  title={rule.status === 'active' ? 'Pause' : 'Activate'}
                >
                  {rule.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => onEdit(rule)} className="text-xs text-gray-500 hover:text-gray-700">
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  size="sm" variant="ghost"
                  onClick={() => deleteRule(rule.id)}
                  className="text-xs text-red-400 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
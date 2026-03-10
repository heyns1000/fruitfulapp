import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Zap, Plus } from 'lucide-react';
import WorkflowList from '../components/automation/WorkflowList';
import WorkflowBuilder from '../components/automation/WorkflowBuilder';

export default function AutomationEngine() {
  const [view, setView] = useState('list'); // 'list' | 'build' | 'edit'
  const [editingRule, setEditingRule] = useState(null);
  const queryClient = useQueryClient();

  const { data: rules = [], isLoading } = useQuery({
    queryKey: ['automation-rules'],
    queryFn: () => base44.entities.AutomationRule.list('-created_date'),
  });

  const handleSaved = () => {
    queryClient.invalidateQueries({ queryKey: ['automation-rules'] });
    setView('list');
    setEditingRule(null);
  };

  const handleEdit = (rule) => {
    setEditingRule(rule);
    setView('edit');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <header className="bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 text-white py-8 shadow-xl">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Zap className="w-9 h-9 drop-shadow-lg" />
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold drop-shadow-lg">Automation Engine</h1>
                <p className="opacity-90 mt-1 text-sm sm:text-base">Build If-This-Then-That workflows across your FAA.ZONE tools</p>
              </div>
            </div>
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6953a072de46207f94f2b9d2/52acd159d_Chief_02_1753263376705.png"
              alt="FAA" className="w-10 h-10 object-contain opacity-90"
            />
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {(view === 'list') && (
          <>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Your Workflows</h2>
                <p className="text-sm text-gray-500 mt-0.5">{rules.length} automation rule{rules.length !== 1 ? 's' : ''} configured</p>
              </div>
              <Button
                onClick={() => setView('build')}
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />New Workflow
              </Button>
            </div>
            <WorkflowList rules={rules} isLoading={isLoading} onEdit={handleEdit} onRefresh={() => queryClient.invalidateQueries({ queryKey: ['automation-rules'] })} />
          </>
        )}

        {(view === 'build' || view === 'edit') && (
          <WorkflowBuilder
            existingRule={editingRule}
            onSaved={handleSaved}
            onCancel={() => { setView('list'); setEditingRule(null); }}
          />
        )}
      </div>
    </div>
  );
}
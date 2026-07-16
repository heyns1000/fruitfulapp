import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Zap, ArrowDown, Plus, X, Save, Sparkles } from 'lucide-react';
import { TRIGGERS, ACTIONS, CATEGORY_COLORS } from './triggerActions';

function ItemPicker({ title, groups, selected, onSelect, accent }) {
  return (
    <div className="space-y-3">
      {groups.map(group => {
        const colors = CATEGORY_COLORS[group.color] || CATEGORY_COLORS.blue;
        return (
          <div key={group.category}>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">{group.category}</p>
            <div className="grid sm:grid-cols-2 gap-1.5">
              {group.items.map(item => (
                <button
                  key={item.id}
                  onClick={() => onSelect(item)}
                  className={`text-left p-2.5 rounded-lg border transition-all text-sm flex items-center gap-2 ${
                    selected?.id === item.id
                      ? `${colors.bg} ${colors.border} ${colors.text} font-semibold ring-2 ring-offset-1 ring-current`
                      : 'bg-white border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span className="leading-tight">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function WorkflowBuilder({ existingRule, onSaved, onCancel }) {
  const [name, setName] = useState(existingRule?.name || '');
  const [brandId, setBrandId] = useState(existingRule?.brandId || '');
  const [trigger, setTrigger] = useState(existingRule?.trigger || null);
  const [actions, setActions] = useState(existingRule?.actions || []);
  const [saving, setSaving] = useState(false);
  const [aiSuggesting, setAiSuggesting] = useState(false);
  const [step, setStep] = useState(1); // 1=trigger, 2=actions, 3=review

  const { data: brands = [] } = useQuery({
    queryKey: ['brands-automation'],
    queryFn: () => base44.entities.Brand.list(),
  });

  const selectedBrand = brands.find(b => b.id === brandId);

  const addAction = (action) => {
    if (!actions.find(a => a.id === action.id)) {
      setActions(prev => [...prev, action]);
    }
  };

  const removeAction = (id) => setActions(prev => prev.filter(a => a.id !== id));

  const suggestActions = async () => {
    if (!trigger) return;
    setAiSuggesting(true);
    const resp = await base44.integrations.Core.InvokeLLM({
      prompt: `For a FAA.ZONE brand automation workflow, given the trigger: "${trigger.label}", suggest the 3 most impactful follow-up actions from this list: ${ACTIONS.flatMap(g => g.items).map(a => a.id + ': ' + a.label).join(', ')}. Return only action ids.`,
      response_json_schema: {
        type: 'object',
        properties: { actionIds: { type: 'array', items: { type: 'string' } } }
      }
    });
    const allActions = ACTIONS.flatMap(g => g.items);
    const suggested = (resp.actionIds || []).map(id => allActions.find(a => a.id === id)).filter(Boolean);
    setActions(suggested);
    setAiSuggesting(false);
  };

  const suggestName = async () => {
    if (!trigger || actions.length === 0) return;
    const resp = await base44.integrations.Core.InvokeLLM({
      prompt: `Generate a short, clear automation workflow name (max 8 words) for: When "${trigger.label}", then ${actions.map(a => a.label).join(' and ')}. Return just the name.`
    });
    setName(resp.trim().replace(/^["']|["']$/g, ''));
  };

  const save = async () => {
    if (!name || !trigger || actions.length === 0) return;
    setSaving(true);
    const data = {
      name,
      brandId: brandId || '',
      brandName: selectedBrand?.name || '',
      trigger,
      actions,
      status: 'active',
      runCount: existingRule?.runCount || 0,
    };
    if (existingRule?.id) {
      await base44.entities.AutomationRule.update(existingRule.id, data);
    } else {
      await base44.entities.AutomationRule.create(data);
    }
    setSaving(false);
    onSaved();
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button variant="outline" size="sm" onClick={onCancel}>
          <ArrowLeft className="w-4 h-4 mr-1" />Back
        </Button>
        <h2 className="text-xl font-bold text-gray-900">{existingRule ? 'Edit Workflow' : 'New Workflow'}</h2>
      </div>

      {/* Step Tabs */}
      <div className="flex items-center gap-2 mb-6">
        {['Set Trigger', 'Add Actions', 'Review & Save'].map((s, i) => (
          <React.Fragment key={s}>
            <button
              onClick={() => setStep(i + 1)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                step === i + 1 ? 'bg-primary text-primary-foreground shadow' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {i + 1}. {s}
            </button>
            {i < 2 && <ArrowDown className="w-4 h-4 text-gray-300 rotate-[-90deg]" />}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1: Trigger */}
      {step === 1 && (
        <Card className="border-primary/30">
          <CardHeader className="bg-primary/5 border-b border-primary/20 rounded-t-xl pb-3">
            <CardTitle className="text-base text-primary flex items-center gap-2">
              <Zap className="w-4 h-4" />IF THIS HAPPENS...
            </CardTitle>
            <p className="text-xs text-primary mt-1">Choose the event that starts this automation</p>
          </CardHeader>
          <CardContent className="pt-4">
            <ItemPicker groups={TRIGGERS} selected={trigger} onSelect={setTrigger} accent="orange" />
            {trigger && (
              <div className="mt-4 flex justify-end">
                <Button onClick={() => setStep(2)} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Next: Add Actions →
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 2: Actions */}
      {step === 2 && (
        <Card className="border-blue-200">
          <CardHeader className="bg-blue-50 border-b border-blue-100 rounded-t-xl pb-3">
            <CardTitle className="text-base text-blue-900 flex items-center justify-between gap-2">
              <span className="flex items-center gap-2"><Plus className="w-4 h-4" />THEN DO THIS...</span>
              <Button
                size="sm" variant="outline"
                onClick={suggestActions}
                disabled={aiSuggesting}
                className="border-blue-300 text-blue-700 text-xs"
              >
                <Sparkles className="w-3 h-3 mr-1" />{aiSuggesting ? 'Thinking...' : 'AI Suggest'}
              </Button>
            </CardTitle>
            <p className="text-xs text-blue-700 mt-1">Select one or more actions to trigger</p>
          </CardHeader>
          <CardContent className="pt-4">
            {actions.length > 0 && (
              <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-xs font-semibold text-green-700 mb-2">Selected Actions:</p>
                <div className="flex flex-wrap gap-2">
                  {actions.map(a => (
                    <Badge key={a.id} className="bg-white border border-green-200 text-green-800 flex items-center gap-1 px-2 py-1">
                      {a.icon} {a.label}
                      <button onClick={() => removeAction(a.id)} className="ml-1 hover:text-red-500">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            <ItemPicker groups={ACTIONS} selected={null} onSelect={addAction} />
            {actions.length > 0 && (
              <div className="mt-4 flex justify-end">
                <Button onClick={() => setStep(3)} className="bg-blue-600 hover:bg-blue-700 text-foreground">
                  Next: Review →
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <Card className="border-green-200">
          <CardHeader className="bg-green-50 border-b border-green-100 rounded-t-xl pb-3">
            <CardTitle className="text-base text-green-900 flex items-center gap-2">
              <Save className="w-4 h-4" />Review & Save
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            {/* Visual summary */}
            <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="w-full p-3 rounded-lg bg-primary/5 border border-primary/30 text-center">
                <p className="text-xs text-primary uppercase font-bold mb-1">Trigger</p>
                <p className="text-sm font-semibold text-primary">{trigger?.icon} {trigger?.label}</p>
              </div>
              <ArrowDown className="w-5 h-5 text-gray-400" />
              <div className="w-full space-y-1.5">
                {actions.map((a, i) => (
                  <div key={i} className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-center">
                    <p className="text-xs text-blue-500 uppercase font-bold mb-1">Action {i + 1}</p>
                    <p className="text-sm font-semibold text-blue-800">{a.icon} {a.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Name & Brand */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Workflow Name</label>
                <div className="flex gap-2">
                  <Input value={name} onChange={e => setName(e.target.value)} placeholder="Name this workflow..." className="flex-1" />
                  <Button variant="outline" size="sm" onClick={suggestName} className="shrink-0 text-xs">
                    <Sparkles className="w-3 h-3 mr-1" />AI Name
                  </Button>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Assign to Brand (optional)</label>
                <Select value={brandId} onValueChange={setBrandId}>
                  <SelectTrigger><SelectValue placeholder="Select brand..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value={null}>No specific brand</SelectItem>
                    {brands.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={save}
              disabled={!name || saving}
              className="w-full bg-gradient-to-r from-primary to-fruitful-green hover:from-primary hover:to-amber-600 text-foreground h-11 text-base font-semibold"
            >
              {saving ? 'Saving...' : <><Save className="w-4 h-4 mr-2" />{existingRule ? 'Update Workflow' : 'Activate Workflow'}</>}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
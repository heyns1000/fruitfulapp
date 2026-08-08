import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

function getDefault(type) {
  switch (type) {
    case 'boolean': return false;
    case 'number': return null;
    case 'array': return [];
    case 'object': return {};
    default: return '';
  }
}

export default function BlockVaultForm({ entityConfig, record, onSave, onCancel, saving }) {
  const [formData, setFormData] = useState(() => {
    const initial = {};
    entityConfig.fields.forEach(f => {
      initial[f.key] = record?.[f.key] ?? getDefault(f.type);
    });
    return initial;
  });

  const setField = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleaned = { ...formData };
    entityConfig.fields.forEach(f => {
      if (f.type === 'number' && cleaned[f.key] === '') {
        cleaned[f.key] = null;
      }
    });
    onSave(cleaned);
  };

  return (
    <Dialog open={true} onOpenChange={(open) => { if (!open && !saving) onCancel(); }}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-emerald-400">
            {record ? `Edit ${entityConfig.label}` : `New ${entityConfig.label}`}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {entityConfig.fields.map(field => (
              <FieldRenderer
                key={field.key}
                field={field}
                value={formData[field.key]}
                onChange={(v) => setField(field.key, v)}
              />
            ))}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {record ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function FieldRenderer({ field, value, onChange }) {
  const fullWidth = field.type === 'object' || field.type === 'array' || field.fullWidth;

  return (
    <div className={fullWidth ? 'col-span-1 sm:col-span-2' : ''}>
      <Label className="text-xs font-semibold text-slate-300 mb-1.5 block">
        {field.label} {field.required && <span className="text-red-400">*</span>}
      </Label>
      {renderField(field, value, onChange)}
    </div>
  );
}

function renderField(field, value, onChange) {
  switch (field.type) {
    case 'boolean':
      return (
        <div className="flex items-center h-9">
          <Switch checked={!!value} onCheckedChange={onChange} />
        </div>
      );
    case 'enum':
      return (
        <Select value={String(value ?? '')} onValueChange={onChange}>
          <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
            <SelectValue placeholder="Select..." />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700 text-white">
            {field.options.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    case 'number':
      return (
        <Input
          type="number"
          value={value ?? ''}
          onChange={e => onChange(e.target.value === '' ? null : Number(e.target.value))}
          className="bg-slate-800 border-slate-700 text-white"
        />
      );
    case 'date':
      return (
        <Input
          type="date"
          value={value ? String(value).split('T')[0] : ''}
          onChange={e => onChange(e.target.value)}
          className="bg-slate-800 border-slate-700 text-white"
        />
      );
    case 'object':
    case 'array':
      return (
        <Textarea
          value={typeof value === 'string' ? value : (value ? JSON.stringify(value, null, 2) : '')}
          onChange={e => {
            const raw = e.target.value;
            if (raw.trim() === '') {
              onChange(field.type === 'array' ? [] : {});
              return;
            }
            try {
              onChange(JSON.parse(raw));
            } catch {
              onChange(raw);
            }
          }}
          rows={3}
          className="bg-slate-800 border-slate-700 text-white font-mono text-xs"
        />
      );
    default:
      return (
        <Input
          value={String(value ?? '')}
          onChange={e => onChange(e.target.value)}
          className="bg-slate-800 border-slate-700 text-white"
        />
      );
  }
}
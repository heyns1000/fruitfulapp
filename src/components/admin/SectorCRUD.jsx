import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Plus, Save, X } from 'lucide-react';
import { toast } from 'sonner';

const emptyForm = { name: '', description: '', subnodes: '', tags: '' };

export default function SectorCRUD({ sectorKey, sectorName, brands, onRefresh }) {
  const [editing, setEditing] = useState(null); // brand id or 'new'
  const [form, setForm] = useState(emptyForm);

  const startEdit = (brand) => {
    setEditing(brand.id);
    setForm({
      name: brand.name || '',
      description: brand.description || '',
      subnodes: (brand.subnodes || []).join(', '),
      tags: (brand.tags || []).join(', '),
    });
  };

  const startNew = () => {
    setEditing('new');
    setForm(emptyForm);
  };

  const cancel = () => { setEditing(null); setForm(emptyForm); };

  const buildPayload = () => ({
    name: form.name.trim(),
    description: form.description.trim(),
    sector: sectorKey,
    subnodes: form.subnodes.split(',').map(s => s.trim()).filter(Boolean),
    tags: form.tags.split(',').map(s => s.trim()).filter(Boolean),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Brand.create(data),
    onSuccess: () => { toast.success('Brand created'); cancel(); onRefresh(); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Brand.update(id, data),
    onSuccess: () => { toast.success('Brand updated'); cancel(); onRefresh(); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Brand.delete(id),
    onSuccess: () => { toast.success('Brand deleted'); onRefresh(); },
  });

  const handleSave = () => {
    if (!form.name.trim()) { toast.error('Brand name is required'); return; }
    const payload = buildPayload();
    if (editing === 'new') createMutation.mutate(payload);
    else updateMutation.mutate({ id: editing, data: payload });
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-teal-700">{sectorName} — Brand Management</h2>
        <Button size="sm" onClick={startNew} className="bg-teal-600 hover:bg-teal-700 gap-1">
          <Plus className="w-4 h-4" /> Add Brand
        </Button>
      </div>

      {/* Add / Edit Form */}
      {editing && (
        <div className="border border-teal-200 rounded-lg p-4 mb-5 bg-teal-50/40 space-y-3">
          <h3 className="font-semibold text-teal-800">{editing === 'new' ? '➕ New Brand' : '✏️ Edit Brand'}</h3>
          <Input placeholder="Brand name *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <Input placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          <Input placeholder="Subnodes (comma-separated)" value={form.subnodes} onChange={e => setForm(f => ({ ...f, subnodes: e.target.value }))} />
          <Input placeholder="Tags (comma-separated)" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave} className="bg-teal-600 hover:bg-teal-700 gap-1">
              <Save className="w-4 h-4" /> Save
            </Button>
            <Button size="sm" variant="outline" onClick={cancel} className="gap-1">
              <X className="w-4 h-4" /> Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Brand List */}
      {brands.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No brands in this sector yet.</p>
      ) : (
        <div className="space-y-3">
          {brands.map(brand => (
            <div key={brand.id} className={`border rounded-lg p-4 flex items-start justify-between gap-4 ${editing === brand.id ? 'opacity-40 pointer-events-none' : ''}`}>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900">{brand.name}™</div>
                <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">{brand.description || '—'}</div>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">{brand.subnodes?.length || 0} subnodes</span>
                  {(brand.tags || []).slice(0, 3).map(t => (
                    <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button size="icon" variant="outline" onClick={() => startEdit(brand)} title="Edit">
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="outline" className="text-red-500 hover:text-red-700 hover:border-red-300"
                  onClick={() => { if (confirm(`Delete ${brand.name}?`)) deleteMutation.mutate(brand.id); }} title="Delete">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
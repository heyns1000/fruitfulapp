import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Plus, Pencil, Trash2, ChevronLeft, ChevronRight, Search, AlertCircle } from 'lucide-react';
import { BLOCKVAULT_ENTITIES } from './blockVaultEntities';
import BlockVaultForm from './BlockVaultForm';

const PAGE_SIZE = 50;

export default function BlockVaultAdmin() {
  const [activeEntity, setActiveEntity] = useState(BLOCKVAULT_ENTITIES[0].name);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();

  const entityConfig = BLOCKVAULT_ENTITIES.find(e => e.name === activeEntity);

  const { data: records = [], isLoading } = useQuery({
    queryKey: ['blockvault', activeEntity, page],
    queryFn: async () => {
      setError(null);
      try {
        const Entity = base44.entities[activeEntity];
        if (!Entity) throw new Error(`Entity ${activeEntity} not found`);
        return await Entity.list('-updated_date', PAGE_SIZE);
      } catch (err) {
        const msg = err?.response?.data?.error || err.message;
        setError(msg);
        return [];
      }
    },
  });

  const filteredRecords = search
    ? records.filter(r => {
        const s = search.toLowerCase();
        return entityConfig.fields.some(f =>
          f.listColumn && String(r[f.key] ?? '').toLowerCase().includes(s)
        );
      })
    : records;

  const createMutation = useMutation({
    mutationFn: async (data) => base44.entities[activeEntity].create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['blockvault', activeEntity] }); setShowForm(false); },
    onError: (err) => setError(err?.response?.data?.error || err.message),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => base44.entities[activeEntity].update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['blockvault', activeEntity] }); setShowForm(false); },
    onError: (err) => setError(err?.response?.data?.error || err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => base44.entities[activeEntity].delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blockvault', activeEntity] }),
    onError: (err) => setError(err?.response?.data?.error || err.message),
  });

  const handleNew = () => { setEditingRecord(null); setShowForm(true); };
  const handleEdit = (record) => { setEditingRecord(record); setShowForm(true); };
  const handleSave = (data) => {
    if (editingRecord) updateMutation.mutate({ id: editingRecord.id, data });
    else createMutation.mutate(data);
  };
  const handleDelete = (record) => {
    if (confirm(`Delete this ${entityConfig.label} record?`)) deleteMutation.mutate(record.id);
  };
  const handleEntityChange = (name) => { setActiveEntity(name); setPage(0); setSearch(''); setError(null); };

  const listColumns = entityConfig.fields.filter(f => f.listColumn);
  const saving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-xl border p-4" style={{ background: 'rgba(0,30,15,0.7)', borderColor: '#00ff9920' }}>
        <h2 className="text-lg font-black" style={{ color: '#00ffc8' }}>🔐 BlockVault Core Admin</h2>
        <p className="text-xs mt-1" style={{ color: '#9dfcdc60' }}>
          Full CRUD for all SKUs, items, barcodes, cost rows & more · synced from savvy-block-vault-sync.base44.app
        </p>
      </div>

      {/* Entity tabs */}
      <div className="overflow-x-auto rounded-lg border" style={{ borderColor: '#00ff9920' }}>
        <div className="flex min-w-max gap-1 p-2" style={{ background: 'rgba(0,30,15,0.5)' }}>
          {BLOCKVAULT_ENTITIES.map(entity => (
            <button
              key={entity.name}
              onClick={() => handleEntityChange(entity.name)}
              className="px-3 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all"
              style={{
                background: activeEntity === entity.name ? '#00b37a' : 'transparent',
                color: activeEntity === entity.name ? '#fff' : '#9dfcdc99',
              }}
            >
              {entity.icon} {entity.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-start gap-2 rounded-lg border p-3 text-sm" style={{ background: 'rgba(120,20,20,0.3)', borderColor: '#ff444450', color: '#ff9999' }}>
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder={`Search ${entityConfig.label.toLowerCase()}...`}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 bg-slate-900/50 border-slate-700 text-white"
          />
        </div>
        <Button onClick={handleNew} className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <Plus className="w-4 h-4" /> New {entityConfig.label}
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border overflow-hidden" style={{ borderColor: '#00ff9920', background: 'rgba(0,20,10,0.5)' }}>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="text-center py-12 text-sm" style={{ color: '#9dfcdc60' }}>No records found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: '#00ff9920', background: 'rgba(0,40,20,0.5)' }}>
                  {listColumns.map(col => (
                    <th key={col.key} className="text-left px-3 py-2 font-semibold text-emerald-200 whitespace-nowrap">
                      {col.label}
                    </th>
                  ))}
                  <th className="text-right px-3 py-2 font-semibold text-emerald-200">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map(record => (
                  <tr key={record.id} className="border-b hover:bg-emerald-900/10" style={{ borderColor: '#00ff9910' }}>
                    {listColumns.map(col => (
                      <td key={col.key} className="px-3 py-2 text-slate-200 whitespace-nowrap max-w-[240px] overflow-hidden text-ellipsis">
                        {formatCellValue(record[col.key], col)}
                      </td>
                    ))}
                    <td className="px-3 py-2 text-right whitespace-nowrap">
                      <button onClick={() => handleEdit(record)} className="p-1.5 rounded hover:bg-emerald-700/30 text-emerald-400">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(record)} className="p-1.5 rounded hover:bg-red-700/30 text-red-400 ml-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: '#9dfcdc60' }}>
          Page {page + 1} · {filteredRecords.length} records
        </span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
            <ChevronLeft className="w-4 h-4" /> Prev
          </Button>
          <Button variant="outline" size="sm" disabled={filteredRecords.length < PAGE_SIZE} onClick={() => setPage(p => p + 1)}>
            Next <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Form dialog */}
      {showForm && (
        <BlockVaultForm
          entityConfig={entityConfig}
          record={editingRecord}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
          saving={saving}
        />
      )}
    </div>
  );
}

function formatCellValue(value, field) {
  if (value === null || value === undefined) return '—';
  if (field.type === 'boolean') return value ? '✓' : '✗';
  if (field.type === 'enum' && field.options) {
    const opt = field.options.find(o => o.value === value);
    return opt ? opt.label : String(value);
  }
  if (typeof value === 'object') return JSON.stringify(value).slice(0, 60);
  return String(value);
}
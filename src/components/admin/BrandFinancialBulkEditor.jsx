import React, { useState, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { Save, Loader2, CheckSquare, Search } from 'lucide-react';

export default function BrandFinancialBulkEditor() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: brands = [], isLoading } = useQuery({
    queryKey: ['brands'],
    queryFn: () => base44.entities.Brand.list('-updated_date', 500),
  });

  const [selected, setSelected] = useState(new Set());
  const [search, setSearch] = useState('');
  const [draft, setDraft] = useState({ financialAllocation: '', performanceScore: '', revenue: '', budget: '' });
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => {
    if (!search.trim()) return brands;
    const q = search.toLowerCase();
    return brands.filter((b) => (b.name || '').toLowerCase().includes(q) || (b.sector || '').toLowerCase().includes(q));
  }, [brands, search]);

  const allSelected = filtered.length > 0 && filtered.every((b) => selected.has(b.id));
  const toggleAll = () => {
    const next = new Set(selected);
    if (allSelected) filtered.forEach((b) => next.delete(b.id));
    else filtered.forEach((b) => next.add(b.id));
    setSelected(next);
  };
  const toggleOne = (id) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const handleBulkUpdate = async () => {
    if (selected.size === 0) {
      toast({ title: 'Select at least one brand', variant: 'destructive' });
      return;
    }
    const patch = {};
    if (draft.financialAllocation !== '') patch.financialAllocation = Number(draft.financialAllocation);
    if (draft.performanceScore !== '') patch.performanceScore = Number(draft.performanceScore);
    if (draft.revenue !== '') patch.revenue = Number(draft.revenue);
    if (draft.budget !== '') patch.budget = Number(draft.budget);

    if (Object.keys(patch).length === 0) {
      toast({ title: 'Enter at least one value to update', variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
      const updates = Array.from(selected).map((id) => ({ id, ...patch }));
      await base44.entities.Brand.bulkUpdate(updates);
      toast({ title: `${selected.size} brand(s) updated`, description: 'Financial metrics saved.' });
      setSelected(new Set());
      setDraft({ financialAllocation: '', performanceScore: '', revenue: '', budget: '' });
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    } catch (err) {
      toast({ title: 'Update failed', description: err?.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const fmt = (n) => (n == null ? '—' : Number(n).toLocaleString(undefined, { maximumFractionDigits: 0 }));

  return (
    <Card className="bg-white/80 backdrop-blur border-slate-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <CheckSquare className="w-5 h-5 text-emerald-600" />
          Brand Financial Bulk Editor
        </CardTitle>
        <p className="text-xs text-slate-500">Select multiple brands and update their financial metrics at once.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Bulk edit bar */}
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-slate-700">{selected.size} selected</span>
            <div className="flex flex-wrap gap-2 items-center">
              <Input
                type="number"
                placeholder="Allocation"
                value={draft.financialAllocation}
                onChange={(e) => setDraft({ ...draft, financialAllocation: e.target.value })}
                className="w-32 h-8"
              />
              <Input
                type="number"
                placeholder="Score (0-100)"
                value={draft.performanceScore}
                onChange={(e) => setDraft({ ...draft, performanceScore: e.target.value })}
                className="w-32 h-8"
              />
              <Input
                type="number"
                placeholder="Revenue"
                value={draft.revenue}
                onChange={(e) => setDraft({ ...draft, revenue: e.target.value })}
                className="w-32 h-8"
              />
              <Input
                type="number"
                placeholder="Budget"
                value={draft.budget}
                onChange={(e) => setDraft({ ...draft, budget: e.target.value })}
                className="w-32 h-8"
              />
              <Button onClick={handleBulkUpdate} disabled={saving || selected.size === 0} size="sm">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Apply to {selected.size || '0'}
              </Button>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search brands or sectors…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-md border border-slate-200 max-h-[420px] overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-slate-50">
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox checked={allSelected} onCheckedChange={toggleAll} />
                </TableHead>
                <TableHead className="font-semibold text-slate-700">Brand</TableHead>
                <TableHead className="font-semibold text-slate-700">Sector</TableHead>
                <TableHead className="text-right font-semibold text-slate-700">Allocation</TableHead>
                <TableHead className="text-right font-semibold text-slate-700">Score</TableHead>
                <TableHead className="text-right font-semibold text-slate-700">Revenue</TableHead>
                <TableHead className="text-right font-semibold text-slate-700">Budget</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((b) => (
                <TableRow key={b.id} className={selected.has(b.id) ? 'bg-emerald-50' : ''}>
                  <TableCell>
                    <Checkbox checked={selected.has(b.id)} onCheckedChange={() => toggleOne(b.id)} />
                  </TableCell>
                  <TableCell className="font-medium text-slate-800">{b.name}™</TableCell>
                  <TableCell className="text-slate-600 capitalize">{b.sector}</TableCell>
                  <TableCell className="text-right text-slate-700">{fmt(b.financialAllocation)}</TableCell>
                  <TableCell className="text-right text-slate-700">{fmt(b.performanceScore)}</TableCell>
                  <TableCell className="text-right text-slate-700">{fmt(b.revenue)}</TableCell>
                  <TableCell className="text-right text-slate-700">{fmt(b.budget)}</TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-slate-400 py-6">No brands found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
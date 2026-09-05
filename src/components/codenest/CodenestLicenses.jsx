import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, Hourglass, Sparkles, Loader2, Signature } from 'lucide-react';
import { ROYALTY_AGREEMENTS } from '@/lib/codenestData';
import { toast } from 'sonner';

export default function CodenestLicenses() {
  const qc = useQueryClient();
  const [newLicense, setNewLicense] = useState({ name: '', licenseId: '', region: 'Global', royalty: '6%', activationDate: '' });

  const { data: licenses = [], isLoading } = useQuery({
    queryKey: ['scrollLicenses'],
    queryFn: () => base44.entities.ScrollLicense.list('-updated_date', 100),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.ScrollLicense.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['scrollLicenses'] }); toast.success('License created!'); setNewLicense({ name: '', licenseId: '', region: 'Global', royalty: '6%', activationDate: '' }); },
  });

  const handleSimplify = async (agreement, btn) => {
    btn.disabled = true;
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `Simplify this legal agreement into plain language. Keep key points:\n\n${agreement.description}`,
      });
      toast.success('Agreement simplified!', { description: res.slice(0, 100) + '...' });
    } catch { toast.error('AI call failed'); }
    btn.disabled = false;
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#2a2a2e] rounded-xl p-6 border border-[#3a3a3e]">
        <h3 className="text-xl font-bold text-[#B8860B] mb-4">My Licensed Scrolls</h3>
        {isLoading ? (
          <div className="text-center py-8 text-gray-400">Loading licenses...</div>
        ) : licenses.length === 0 ? (
          <p className="text-gray-400 text-sm mb-4">No licenses yet. Create one below.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {licenses.map((lic) => (
              <div key={lic.id} className="bg-[#1a1a1c] rounded-lg p-4 border border-[#3a3a3e]">
                <h4 className="font-bold text-[#0071e3] mb-2">{lic.name}</h4>
                <p className="text-xs text-gray-400">ID: {lic.licenseId}</p>
                <p className="text-xs text-gray-400">Region: {lic.region}</p>
                <p className="text-xs text-gray-400">Royalty: {lic.royalty}</p>
                <p className="text-xs text-gray-400">ClaimRoot: {lic.claimStatus}</p>
                <div className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded mt-2 ${lic.verified ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}`}>
                  {lic.verified ? <CheckCircle className="w-3 h-3" /> : <Hourglass className="w-3 h-3" />}
                  {lic.verified ? 'Verified & Active' : 'Awaiting Registration'}
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="border-t border-[#3a3a3e] pt-4">
          <h4 className="text-sm font-semibold text-gray-300 mb-3">Create New License</h4>
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="License Name" value={newLicense.name} onChange={(e) => setNewLicense({ ...newLicense, name: e.target.value })} className="bg-[#3a3a3e] border-[#3a3a3e] text-white" />
            <Input placeholder="License ID (e.g. CN-0401)" value={newLicense.licenseId} onChange={(e) => setNewLicense({ ...newLicense, licenseId: e.target.value })} className="bg-[#3a3a3e] border-[#3a3a3e] text-white" />
            <select value={newLicense.region} onChange={(e) => setNewLicense({ ...newLicense, region: e.target.value })} className="bg-[#3a3a3e] border border-[#3a3a3e] text-white rounded-md px-3 py-2">
              <option>Global</option><option>Local</option><option>Regional</option><option>Enterprise</option>
            </select>
            <Input placeholder="Royalty (e.g. 6%)" value={newLicense.royalty} onChange={(e) => setNewLicense({ ...newLicense, royalty: e.target.value })} className="bg-[#3a3a3e] border-[#3a3a3e] text-white" />
            <Input type="date" value={newLicense.activationDate} onChange={(e) => setNewLicense({ ...newLicense, activationDate: e.target.value })} className="bg-[#3a3a3e] border-[#3a3a3e] text-white" />
            <Button onClick={() => createMutation.mutate({ ...newLicense, claimStatus: 'Pending Sync', verified: false })} disabled={createMutation.isPending || !newLicense.name || !newLicense.licenseId} className="bg-[#30d158] hover:bg-[#28a745] text-white">
              {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Create License
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-[#2a2a2e] rounded-xl p-6 border border-[#3a3a3e]">
        <h3 className="text-xl font-bold text-[#B8860B] mb-4">Royalty License Agreements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ROYALTY_AGREEMENTS.map((ag) => (
            <div key={ag.id} className="bg-[#1a1a1c] rounded-lg p-4 border border-[#3a3a3e]">
              <h4 className="font-bold text-white mb-1">{ag.name}</h4>
              <p className="text-xs text-gray-400 mb-2">{ag.description}</p>
              <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded ${ag.status === 'Signed' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}`}>
                {ag.status.toUpperCase()}
              </span>
              <div className="flex gap-2 mt-3">
                <Button size="sm" className="bg-[#B8860B] hover:bg-[#DAA520] text-white text-xs">
                  <Signature className="w-3 h-3 mr-1" /> {ag.status === 'Signed' ? 'View' : 'Sign via SecureSign™'}
                </Button>
                <Button size="sm" variant="outline" onClick={(e) => handleSimplify(ag, e.currentTarget)} className="border-[#0071e3] text-[#0071e3] text-xs">
                  <Sparkles className="w-3 h-3 mr-1" /> Simplify
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { base44 as base44Integrations } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Sparkles, Loader2 } from 'lucide-react';
import { TEMPLATES } from '@/lib/codenestData';
import { toast } from 'sonner';

export default function CodenestNewProject({ onViewChange }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({ name: '', template: '', description: '', concept: '', region: 'Global', claim: 'yes' });
  const [generating, setGenerating] = useState(false);

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.ScrollProject.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['scrollProjects'] });
      toast.success('Project created!');
      onViewChange('projects');
    },
  });

  const handleGenerateDescription = async () => {
    if (!form.name) { toast.error('Enter a project name first'); return; }
    setGenerating(true);
    try {
      const res = await base44Integrations.integrations.Core.InvokeLLM({
        prompt: `Generate a concise project description (max 100 words) for a web scroll named '${form.name}' of type '${form.template}' for '${form.region}' deployment. Focus on benefits and key features.`,
      });
      setForm({ ...form, description: res });
    } catch { toast.error('AI generation failed'); }
    setGenerating(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const royalty = form.claim === 'yes' ? '6.0%' : 'N/A';
    createMutation.mutate({
      name: form.name,
      template: form.template,
      description: form.description,
      region: form.region,
      status: 'draft',
      royalty,
      claimEnabled: form.claim === 'yes',
      projectId: `CN-${Math.floor(Math.random() * 10000)}`,
      lastActivity: new Date().toISOString(),
      htmlCode: `<div style="text-align:center;padding:2rem;"><h1>${form.name}</h1><p>${form.description || 'New scroll project'}</p></div>`,
    });
  };

  return (
    <div className="bg-[#2a2a2e] rounded-xl p-6 border border-[#3a3a3e] max-w-2xl">
      <h3 className="text-xl font-bold text-[#B8860B] mb-4">Start a New Scroll Project</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label className="text-gray-300 mb-1.5 block">Project Name</Label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. UrbanNest Launch Scroll" required className="bg-[#3a3a3e] border-[#3a3a3e] text-white" />
        </div>
        <div>
          <Label className="text-gray-300 mb-1.5 block">Choose Template</Label>
          <select value={form.template} onChange={(e) => setForm({ ...form, template: e.target.value })} className="w-full bg-[#3a3a3e] border border-[#3a3a3e] text-white rounded-md px-3 py-2" required>
            <option value="">Select a template...</option>
            {TEMPLATES.map((t) => <option key={t.name} value={t.name}>{t.name}</option>)}
          </select>
        </div>
        <div>
          <Label className="text-gray-300 mb-1.5 block">Project Description</Label>
          <div className="flex gap-2">
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} placeholder="Describe your project goals..." className="flex-1 bg-[#3a3a3e] border-[#3a3a3e] text-white" />
            <Button type="button" onClick={handleGenerateDescription} disabled={generating} className="bg-[#30d158] hover:bg-[#28a745] text-white self-start text-xs px-3">
              {generating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3 mr-1" />} AI Generate
            </Button>
          </div>
        </div>
        <div>
          <Label className="text-gray-300 mb-1.5 block">Deployment Region</Label>
          <select value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} className="w-full bg-[#3a3a3e] border border-[#3a3a3e] text-white rounded-md px-3 py-2">
            <option value="Global">Global</option>
            <option value="Local">Local Only</option>
            <option value="Street Scroll">Street Scroll (Pop-up deploy)</option>
          </select>
        </div>
        <div>
          <Label className="text-gray-300 mb-1.5 block">Enable ClaimRoot™ Auto-License?</Label>
          <select value={form.claim} onChange={(e) => setForm({ ...form, claim: e.target.value })} className="w-full bg-[#3a3a3e] border border-[#3a3a3e] text-white rounded-md px-3 py-2">
            <option value="yes">Yes – License this scroll</option>
            <option value="no">No – Just save it</option>
          </select>
        </div>
        <Button type="submit" disabled={createMutation.isPending} className="bg-[#30d158] hover:bg-[#28a745] text-white">
          {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          Create Project
        </Button>
      </form>
    </div>
  );
}
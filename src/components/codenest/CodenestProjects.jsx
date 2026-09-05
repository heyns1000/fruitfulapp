import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit, Globe, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const STATUS_COLORS = {
  live: 'bg-green-500',
  pending: 'bg-yellow-500',
  draft: 'bg-gray-500',
  error: 'bg-red-500',
};

export default function CodenestProjects({ onViewChange }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const qc = useQueryClient();

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['scrollProjects'],
    queryFn: () => base44.entities.ScrollProject.list('-updated_date', 500),
  });

  const filtered = projects.filter((p) => {
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase()) || p.projectId?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.ScrollProject.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['scrollProjects'] }); toast.success('Project deleted'); },
  });

  return (
    <div className="bg-[#2a2a2e] rounded-xl p-6 border border-[#3a3a3e]">
      <h3 className="text-xl font-bold text-[#B8860B] mb-4">Your Projects</h3>
      <div className="flex flex-wrap gap-3 mb-4">
        <Input
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-[#3a3a3e] border-[#3a3a3e] text-white placeholder:text-gray-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#3a3a3e] border border-[#3a3a3e] text-white rounded-md px-3 py-2 text-sm"
        >
          <option value="all">All Statuses</option>
          <option value="live">Live</option>
          <option value="pending">Pending</option>
          <option value="draft">Draft</option>
          <option value="error">Error</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-gray-500" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p>No projects found. Start a new project!</p>
          <Button onClick={() => onViewChange('new-project')} className="mt-4 bg-[#30d158] hover:bg-[#28a745] text-white">Start New Project</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((project) => (
            <div key={project.id} className="bg-[#1a1a1a] rounded-lg p-4 border border-[#3a3a3e] hover:border-[#0071e3] transition-colors">
              <h4 className="font-bold text-[#0071e3] mb-1 truncate">{project.name}</h4>
              <p className="text-xs text-gray-400 mb-1">ID: {project.projectId || project.id?.slice(0, 8)}</p>
              <p className="text-xs text-gray-400 mb-1">Region: {project.region}</p>
              <p className="text-xs text-gray-400 mb-1">Royalty: {project.royalty || 'N/A'}</p>
              <p className="text-xs text-gray-400 mb-2">Last: {project.lastActivity ? new Date(project.lastActivity).toLocaleDateString() : '—'}</p>
              <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded text-white ${STATUS_COLORS[project.status] || 'bg-gray-500'}`}>
                {project.status?.toUpperCase()}
              </span>
              <div className="flex gap-2 mt-3">
                <Button size="sm" className="bg-[#B8860B] hover:bg-[#DAA520] text-white text-xs" onClick={() => onViewChange('scroll-builder')}>
                  <Edit className="w-3 h-3 mr-1" /> Editor
                </Button>
                <Button size="sm" variant="outline" className="border-[#0071e3] text-[#0071e3] hover:bg-[#0071e3]/10 text-xs">
                  <Globe className="w-3 h-3 mr-1" /> Live
                </Button>
                <Button size="sm" variant="ghost" className="text-red-400 hover:bg-red-500/10 text-xs" onClick={() => deleteMutation.mutate(project.id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
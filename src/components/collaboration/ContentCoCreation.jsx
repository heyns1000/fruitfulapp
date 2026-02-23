import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Sparkles, Users, FileText, Image, Video } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';

export default function ContentCoCreation() {
  const [showNewProject, setShowNewProject] = useState(false);
  const [generating, setGenerating] = useState(false);

  const { data: brands = [] } = useQuery({
    queryKey: ['brands'],
    queryFn: () => base44.entities.Brand.list(),
  });

  const projects = [
    {
      id: 1,
      title: 'Summer Collection Campaign',
      brands: ['Brand A', 'Brand B'],
      type: 'Visual Content',
      status: 'In Progress',
      aiSuggestions: 3,
      collaborators: 5
    },
    {
      id: 2,
      title: 'Cross-Brand Blog Series',
      brands: ['Brand C', 'Brand D'],
      type: 'Written Content',
      status: 'Review',
      aiSuggestions: 7,
      collaborators: 3
    }
  ];

  const handleAIGenerate = async () => {
    setGenerating(true);
    // AI content generation logic
    setTimeout(() => setGenerating(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Content Co-Creation</h2>
          <p className="text-gray-600 text-sm">Collaborate on content across multiple brands</p>
        </div>
        <Button onClick={() => setShowNewProject(true)} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* AI Content Suggestions */}
      <Card className="border-2 border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-900">
            <Sparkles className="w-5 h-5" />
            AI Content Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-white rounded-lg border border-purple-200">
            <p className="text-sm font-semibold text-gray-900">📝 "5 Ways Brand A + Brand B Complement Each Other"</p>
            <p className="text-xs text-gray-600 mt-1">Blog post • Estimated engagement: High</p>
            <Button size="sm" className="mt-2" onClick={handleAIGenerate} disabled={generating}>
              {generating ? 'Generating...' : 'Generate Draft'}
            </Button>
          </div>
          <div className="p-3 bg-white rounded-lg border border-purple-200">
            <p className="text-sm font-semibold text-gray-900">🎥 Joint Product Demo Video Script</p>
            <p className="text-xs text-gray-600 mt-1">Video content • Cross-brand synergy: 92%</p>
            <Button size="sm" className="mt-2">Generate Storyboard</Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map(project => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  <div className="flex gap-2 mt-2">
                    {project.brands.map(brand => (
                      <Badge key={brand} variant="outline" className="text-xs">
                        {brand}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Badge className={project.status === 'In Progress' ? 'bg-blue-600' : 'bg-orange-600'}>
                  {project.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FileText className="w-4 h-4" />
                  {project.type}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1 text-purple-700">
                    <Sparkles className="w-4 h-4" />
                    {project.aiSuggestions} AI suggestions
                  </span>
                  <span className="flex items-center gap-1 text-blue-700">
                    <Users className="w-4 h-4" />
                    {project.collaborators} collaborators
                  </span>
                </div>
                <Button className="w-full" variant="outline">Open Project</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
import React from 'react';
import { TEMPLATES } from '@/lib/codenestData';
import { Button } from '@/components/ui/button';
import { Rocket, ShoppingCart, FileText, Layers, CloudDownload, Store, AudioWaveform, Video, Layout } from 'lucide-react';

const ICON_MAP = {
  Rocket, ShoppingCart, FileText, Layers, CloudDownload, Store, AudioWaveform, Video, Layout,
};

export default function CodenestTemplates({ onViewChange }) {
  return (
    <div className="bg-[#2a2a2e] rounded-xl p-6 border border-[#3a3a3e]">
      <h3 className="text-xl font-bold text-[#B8860B] mb-4">Select a Template</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {TEMPLATES.map((tpl) => {
          const Icon = ICON_MAP[tpl.icon] || Layout;
          return (
            <div key={tpl.name} className="bg-[#1a1a1c] rounded-lg p-4 border border-[#3a3a3e] hover:border-[#0071e3] transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-5 h-5 text-[#B8860B]" />
                <h4 className="font-bold text-[#0071e3]">{tpl.name}</h4>
              </div>
              <p className="text-xs text-gray-400 mb-3">{tpl.description}</p>
              <Button size="sm" onClick={() => onViewChange('new-project')} className="bg-[#30d158] hover:bg-[#28a745] text-white w-full">
                Use This Template
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
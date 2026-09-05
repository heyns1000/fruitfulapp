import React from 'react';
import { VAULTMESH_SECTIONS } from '@/lib/codenestData';
import { BookOpen, Settings, FileText, GitBranch, Award, Globe, Briefcase, DollarSign, Map, Users } from 'lucide-react';

const ICON_MAP = {
  BookOpen, Settings, FileContract: FileText, GitBranch, Award, Globe, Briefcase, DollarSign, Roadmap: Map, Users,
};

export default function CodenestVaultMesh() {
  return (
    <div className="bg-[#2a2a2e] rounded-xl p-6 border border-[#3a3a3e]">
      <h2 className="text-2xl font-extrabold text-[#B8860B] mb-2">🧠 VaultMesh™: Executive Summary</h2>
      <p className="text-gray-400 text-sm mb-4">
        VaultMesh™ is an intelligent data orchestration framework for the segmentation, synchronization, and secure deployment of high-value digital assets (scrolls) across decentralized networks.
      </p>
      <div className="space-y-4">
        {VAULTMESH_SECTIONS.map((section, i) => {
          const Icon = ICON_MAP[section.icon] || BookOpen;
          return (
            <div key={i} className="bg-[#1a1a1c] rounded-lg p-4 border border-[#3a3a3e]">
              <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <Icon className="w-4 h-4 text-[#0071e3]" />
                {i + 1}. {section.title}
              </h3>
              {section.body && <p className="text-gray-400 text-sm mb-2">{section.body}</p>}
              {section.items && (
                <ul className="space-y-1">
                  {section.items.map((item, j) => (
                    <li key={j} className="text-gray-400 text-sm flex items-start gap-2">
                      <span className="text-[#30d158] mt-0.5">•</span> {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
      <p className="text-xs text-gray-500 mt-4">📎 This plan can be exported as HTML, PDF, or ZIP.</p>
    </div>
  );
}
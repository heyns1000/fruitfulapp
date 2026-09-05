import React from 'react';
import { Home, FolderPlus, Folder, Wrench, Network, ShoppingCart, Palette, FileText, BarChart3, KeyRound, Settings, LogIn, UserPlus } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'projects', label: 'Projects', icon: Folder },
  { id: 'new-project', label: 'New Project', icon: FolderPlus },
  { id: 'scroll-builder', label: 'ScrollBuilder', icon: Wrench },
  { id: 'ecosystem-map', label: 'Ecosystem Map', icon: Network },
  { id: 'global-checkout', label: 'Global Payment', icon: ShoppingCart },
  { id: 'templates', label: 'Templates', icon: Palette },
  { id: 'licenses', label: 'My Licenses', icon: FileText },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, badge: 'NEW' },
  { id: 'api-keys', label: 'API Keys', icon: KeyRound },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function CodenestSidebar({ activeView, onViewChange }) {
  return (
    <aside className="w-64 bg-[#2a2a2e] border-r border-[#3a3a3e] flex flex-col shrink-0 overflow-y-auto">
      <div className="text-center py-6 border-b border-[#3a3a3e]">
        <h2 className="text-xl font-extrabold text-white">
          Fruitful™ | <span className="text-[#B8860B] text-sm">CodeNest™</span>
        </h2>
      </div>
      <nav className="flex-1 py-4 px-2 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive ? 'bg-[#0071e3] text-white shadow-md' : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-auto text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">{item.badge}</span>
              )}
            </button>
          );
        })}
      </nav>
      <div className="p-2 border-t border-[#3a3a3e] space-y-1">
        <button onClick={() => onViewChange('login')} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/5">
          <LogIn className="w-4 h-4" /> Sign In
        </button>
        <button onClick={() => onViewChange('signup')} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/5">
          <UserPlus className="w-4 h-4" /> Sign Up
        </button>
      </div>
    </aside>
  );
}
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { COMPANY_DATA, SECTOR_LIST } from '@/lib/codenestData';
import { User, Shield, Globe, Server, Mail, Building2 } from 'lucide-react';
import { toast } from 'sonner';

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'preferences', label: 'Scroll Preferences', icon: Shield },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'domains', label: 'Domain & Cloud', icon: Globe },
];

export default function CodenestSettings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [selectedCompany, setSelectedCompany] = useState(null);

  return (
    <div className="bg-[#2a2a2e] rounded-xl p-6 border border-[#3a3a3e]">
      <h3 className="text-xl font-bold text-[#B8860B] mb-4">My Settings</h3>
      <div className="flex gap-1 border-b border-[#3a3a3e] mb-6">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id ? 'border-[#0071e3] text-[#0071e3]' : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5 inline mr-1" /> {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'profile' && (
        <div className="space-y-4 max-w-md">
          <div><Label className="text-gray-300">Display Name</Label><Input defaultValue="ScrollUser001" className="bg-[#3a3a3e] border-[#3a3a3e] text-white mt-1" /></div>
          <div><Label className="text-gray-300">Email</Label><Input defaultValue="user@scrollmail.com" className="bg-[#3a3a3e] border-[#3a3a3e] text-white mt-1" /></div>
          <Button onClick={() => toast.success('Profile updated!')} className="bg-[#30d158] hover:bg-[#28a745] text-white">Update Profile</Button>
        </div>
      )}

      {activeTab === 'preferences' && (
        <div className="space-y-4 max-w-md">
          <div>
            <Label className="text-gray-300">Default Deployment Region</Label>
            <select className="w-full bg-[#3a3a3e] border border-[#3a3a3e] text-white rounded-md px-3 py-2 mt-1">
              <option>Global</option><option>Local</option><option>Street Scroll (Pop-up)</option>
            </select>
          </div>
          <div>
            <Label className="text-gray-300">Auto-Enable ClaimRoot™ on Save?</Label>
            <select className="w-full bg-[#3a3a3e] border border-[#3a3a3e] text-white rounded-md px-3 py-2 mt-1">
              <option value="yes">Yes</option><option value="no">No</option>
            </select>
          </div>
          <Button onClick={() => toast.success('Preferences saved!')} className="bg-[#30d158] hover:bg-[#28a745] text-white">Save Preferences</Button>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="space-y-4 max-w-md">
          <div><Label className="text-gray-300">Change Password</Label><Input type="password" placeholder="New Password" className="bg-[#3a3a3e] border-[#3a3a3e] text-white mt-1" /></div>
          <div><Label className="text-gray-300">Confirm Password</Label><Input type="password" placeholder="Confirm" className="bg-[#3a3a3e] border-[#3a3a3e] text-white mt-1" /></div>
          <Button onClick={() => toast.success('Password updated!')} className="bg-[#30d158] hover:bg-[#28a745] text-white">Update Password</Button>
        </div>
      )}

      {activeTab === 'domains' && (
        <div className="space-y-6">
          <div className="bg-[#1a1a1c] rounded-lg p-4 border border-[#3a3a3e]">
            <h4 className="text-sm font-semibold text-[#B8860B] mb-2 flex items-center gap-2"><Server className="w-4 h-4" /> DNS Zone Management</h4>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between bg-[#3a3a3e] px-3 py-1.5 rounded"><span className="text-gray-300">A @ → 192.0.2.1</span><span className="text-gray-500">Auto</span></div>
              <div className="flex justify-between bg-[#3a3a3e] px-3 py-1.5 rounded"><span className="text-gray-300">CNAME www → @</span><span className="text-gray-500">Auto</span></div>
              <div className="flex justify-between bg-[#3a3a3e] px-3 py-1.5 rounded"><span className="text-gray-300">MX @ → mx.zoho.com (10)</span><span className="text-gray-500">Auto</span></div>
            </div>
          </div>
          <div className="bg-[#1a1a1c] rounded-lg p-4 border border-[#3a3a3e]">
            <h4 className="text-sm font-semibold text-[#B8860B] mb-2 flex items-center gap-2"><Globe className="w-4 h-4" /> Domain Management</h4>
            <ul className="text-xs text-gray-300 space-y-1">
              <li>✅ examplefruitful.com (Primary)</li>
              <li>✅ myblog.examplefruitful.com (Subdomain)</li>
            </ul>
          </div>
          <div className="bg-[#1a1a1c] rounded-lg p-4 border border-[#3a3a3e]">
            <h4 className="text-sm font-semibold text-[#B8860B] mb-2 flex items-center gap-2"><Building2 className="w-4 h-4" /> Company Infrastructure</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              {Object.entries(COMPANY_DATA).map(([key, company]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCompany(key)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    selectedCompany === key ? 'border-[#0071e3] bg-[#0071e3]/10' : 'border-[#3a3a3e] bg-[#2a2a2e] hover:border-[#0071e3]/50'
                  }`}
                >
                  <h5 className="text-sm font-bold text-white">{company.name}</h5>
                  <p className="text-xs text-gray-500">{SECTOR_LIST[company.sector_key]?.name}</p>
                </button>
              ))}
            </div>
            {selectedCompany && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                {Object.entries(COMPANY_DATA[selectedCompany].details).map(([key, value]) => (
                  <div key={key} className="bg-[#3a3a3e] p-3 rounded border border-[#3a3a3e]">
                    <span className="text-[#B8860B] text-xs font-semibold">{key}:</span> <span className="text-gray-300 text-xs">{value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
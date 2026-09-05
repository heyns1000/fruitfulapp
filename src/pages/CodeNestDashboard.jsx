import React, { useState } from 'react';
import CodenestSidebar from '@/components/codenest/CodenestSidebar';
import CodenestOverview from '@/components/codenest/CodenestOverview';
import CodenestProjects from '@/components/codenest/CodenestProjects';
import CodenestNewProject from '@/components/codenest/CodenestNewProject';
import CodenestScrollBuilder from '@/components/codenest/CodenestScrollBuilder';
import CodenestEcosystemMap from '@/components/codenest/CodenestEcosystemMap';
import CodenestCheckout from '@/components/codenest/CodenestCheckout';
import CodenestTemplates from '@/components/codenest/CodenestTemplates';
import CodenestLicenses from '@/components/codenest/CodenestLicenses';
import CodenestAnalytics from '@/components/codenest/CodenestAnalytics';
import CodenestApiKeys from '@/components/codenest/CodenestApiKeys';
import CodenestSettings from '@/components/codenest/CodenestSettings';
import CodenestVaultMesh from '@/components/codenest/CodenestVaultMesh';
import GlobalFooter from '@/components/GlobalFooter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

function AuthView({ mode }) {
  const navigate = useNavigate();
  return (
    <div className="bg-[#2a2a2e] rounded-xl p-6 border border-[#3a3a3e] max-w-md mx-auto">
      <h3 className="text-xl font-bold text-[#B8860B] mb-4">{mode === 'login' ? 'Sign In to CodeNest™' : 'Join CodeNest™'}</h3>
      <form onSubmit={(e) => { e.preventDefault(); toast.success(`${mode === 'login' ? 'Login' : 'Signup'} successful!`); navigate('/CodeNestDashboard'); }} className="space-y-4">
        {mode === 'signup' && (
          <div><Label className="text-gray-300">Display Name</Label><Input required placeholder="Your Name" className="bg-[#3a3a3e] border-[#3a3a3e] text-white mt-1" /></div>
        )}
        <div><Label className="text-gray-300">Email</Label><Input type="email" required defaultValue={mode === 'login' ? 'test@example.com' : ''} className="bg-[#3a3a3e] border-[#3a3a3e] text-white mt-1" /></div>
        <div><Label className="text-gray-300">Password</Label><Input type="password" required defaultValue={mode === 'login' ? 'password123' : ''} className="bg-[#3a3a3e] border-[#3a3a3e] text-white mt-1" /></div>
        {mode === 'signup' && (
          <div><Label className="text-gray-300">Confirm Password</Label><Input type="password" required className="bg-[#3a3a3e] border-[#3a3a3e] text-white mt-1" /></div>
        )}
        <Button type="submit" className="bg-[#30d158] hover:bg-[#28a745] text-white w-full">{mode === 'login' ? 'Login' : 'Sign Up'}</Button>
      </form>
    </div>
  );
}

export default function CodeNestDashboard() {
  const [activeView, setActiveView] = useState('dashboard');

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <CodenestOverview onViewChange={setActiveView} />;
      case 'projects': return <CodenestProjects onViewChange={setActiveView} />;
      case 'new-project': return <CodenestNewProject onViewChange={setActiveView} />;
      case 'scroll-builder': return <CodenestScrollBuilder />;
      case 'ecosystem-map': return <CodenestEcosystemMap />;
      case 'global-checkout': return <CodenestCheckout />;
      case 'templates': return <CodenestTemplates onViewChange={setActiveView} />;
      case 'licenses': return <CodenestLicenses />;
      case 'analytics': return <CodenestAnalytics />;
      case 'api-keys': return <CodenestApiKeys />;
      case 'settings': return <CodenestSettings />;
      case 'vaultmesh': return <CodenestVaultMesh />;
      case 'login': return <AuthView mode="login" />;
      case 'signup': return <AuthView mode="signup" />;
      default: return <CodenestOverview onViewChange={setActiveView} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1c] text-white flex flex-col">
      <div className="flex flex-1">
        <CodenestSidebar activeView={activeView} onViewChange={setActiveView} />
        <main className="flex-1 p-8 overflow-y-auto">
          {renderView()}
          {activeView === 'dashboard' && (
            <div className="mt-6">
              <CodenestVaultMesh />
            </div>
          )}
        </main>
      </div>
      <GlobalFooter />
    </div>
  );
}
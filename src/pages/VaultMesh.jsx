import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VaultManager from '../components/vaultmesh/VaultManager';
import VaultCreator from '../components/vaultmesh/VaultCreator';
import AccessControl from '../components/vaultmesh/AccessControl';
import AuditLog from '../components/vaultmesh/AuditLog';
import ComplianceAuditor from '../components/vaultmesh/ComplianceAuditor';
import BackButton from '../components/navigation/BackButton';
import { Loader2, Shield } from 'lucide-react';

export default function VaultMesh() {
  const [selectedTab, setSelectedTab] = useState('manager');

  const { data: vaults = [], isLoading } = useQuery({
    queryKey: ['vaults'],
    queryFn: () => base44.entities.Vault.list('-updated_date')
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white py-8 mb-8 shadow-xl">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-3">
            <Shield className="w-10 h-10" />
            <div>
              <h1 className="text-4xl font-extrabold drop-shadow-lg">VaultMesh™</h1>
              <p className="text-lg opacity-90 mt-1">Secure Storage & Secrets Management Platform</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 pb-12">
        <BackButton />
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="bg-white p-2 rounded-lg shadow">
            <TabsTrigger value="manager" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              🔐 Vault Manager
            </TabsTrigger>
            <TabsTrigger value="creator" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              ➕ Create Vault
            </TabsTrigger>
            <TabsTrigger value="access" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              👥 Access Control
            </TabsTrigger>
            <TabsTrigger value="audit" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              📋 Audit Log
            </TabsTrigger>
            <TabsTrigger value="compliance" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              🛡️ Compliance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manager">
            <VaultManager vaults={vaults} />
          </TabsContent>

          <TabsContent value="creator">
            <VaultCreator />
          </TabsContent>

          <TabsContent value="access">
            <AccessControl vaults={vaults} />
          </TabsContent>

          <TabsContent value="audit">
            <AuditLog vaults={vaults} />
          </TabsContent>

          <TabsContent value="compliance">
            <ComplianceAuditor vaults={vaults} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
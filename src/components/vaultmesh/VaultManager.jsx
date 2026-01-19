import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Lock, Unlock, Archive, Shield, Key, FileText } from 'lucide-react';
import { toast } from 'sonner';

const VAULT_ICONS = {
  secrets: Key,
  documents: FileText,
  keys: Shield,
  certificates: Lock,
  general: Archive
};

const STATUS_COLORS = {
  active: 'bg-green-100 text-green-800',
  locked: 'bg-red-100 text-red-800',
  archived: 'bg-gray-100 text-gray-800'
};

export default function VaultManager({ vaults }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVault, setSelectedVault] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const queryClient = useQueryClient();

  const updateVaultMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Vault.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vaults'] });
      toast.success('Vault updated');
      setIsDetailsOpen(false);
    }
  });

  const toggleVaultStatus = (vault) => {
    const newStatus = vault.status === 'active' ? 'locked' : 'active';
    updateVaultMutation.mutate({
      id: vault.id,
      data: { status: newStatus }
    });
  };

  const filteredVaults = vaults.filter(v =>
    v.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: vaults.length,
    active: vaults.filter(v => v.status === 'active').length,
    locked: vaults.filter(v => v.status === 'locked').length,
    totalItems: vaults.reduce((sum, v) => sum + (v.metadata?.itemCount || 0), 0)
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Vaults</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-emerald-700">{stats.total}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-700">{stats.active}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Locked</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-700">{stats.locked}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Stored Items</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-700">{stats.totalItems}</p>
          </CardContent>
        </Card>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search vaults..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVaults.map((vault) => {
          const Icon = VAULT_ICONS[vault.vaultType] || Archive;
          
          return (
            <Card key={vault.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <Icon className="w-5 h-5 text-emerald-700" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{vault.name}</CardTitle>
                      <p className="text-sm text-gray-500">{vault.vaultType}</p>
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => toggleVaultStatus(vault)}
                    className={vault.status === 'active' ? 'text-green-600 hover:bg-green-50' : 'text-red-600 hover:bg-red-50'}
                  >
                    {vault.status === 'active' ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Badge className={STATUS_COLORS[vault.status]}>
                  {vault.status}
                </Badge>

                {vault.description && (
                  <p className="text-sm text-gray-600">{vault.description}</p>
                )}

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">Items</p>
                    <p className="font-semibold">{vault.metadata?.itemCount || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Encryption</p>
                    <p className="font-semibold">{vault.encryptionLevel}</p>
                  </div>
                </div>

                {vault.brandName && (
                  <Badge variant="outline" className="mt-2">
                    {vault.brandName}
                  </Badge>
                )}

                <Button
                  onClick={() => {
                    setSelectedVault(vault);
                    setIsDetailsOpen(true);
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  size="sm"
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Vault Details: {selectedVault?.name}</DialogTitle>
          </DialogHeader>

          {selectedVault && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Type</p>
                  <p className="text-lg">{selectedVault.vaultType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <Badge className={STATUS_COLORS[selectedVault.status]}>
                    {selectedVault.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Encryption</p>
                  <p className="text-lg">{selectedVault.encryptionLevel}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Access Level</p>
                  <p className="text-lg">{selectedVault.accessLevel}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Items Stored</p>
                  <p className="text-lg">{selectedVault.metadata?.itemCount || 0}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Region</p>
                  <p className="text-lg">{selectedVault.metadata?.region || 'Default'}</p>
                </div>
              </div>

              {selectedVault.brandName && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Associated Brand</p>
                  <p className="text-lg">{selectedVault.brandName}</p>
                </div>
              )}

              {selectedVault.metadata?.lastAccessed && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Last Accessed</p>
                  <p className="text-lg">{new Date(selectedVault.metadata.lastAccessed).toLocaleString()}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
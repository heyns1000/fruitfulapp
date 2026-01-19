import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Plus, Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function VaultCreator() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [vaultType, setVaultType] = useState('general');
  const [encryptionLevel, setEncryptionLevel] = useState('AES-256');
  const [accessLevel, setAccessLevel] = useState('private');
  const [selectedBrand, setSelectedBrand] = useState('');

  const queryClient = useQueryClient();

  const { data: brands = [] } = useQuery({
    queryKey: ['brands'],
    queryFn: () => base44.entities.Brand.list()
  });

  const createVaultMutation = useMutation({
    mutationFn: (data) => base44.entities.Vault.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vaults'] });
      toast.success('Vault created successfully');
      resetForm();
    },
    onError: () => toast.error('Failed to create vault')
  });

  const resetForm = () => {
    setName('');
    setDescription('');
    setVaultType('general');
    setEncryptionLevel('AES-256');
    setAccessLevel('private');
    setSelectedBrand('');
  };

  const createVault = async () => {
    if (!name.trim()) {
      toast.error('Please enter a vault name');
      return;
    }

    const brand = brands.find(b => b.id === selectedBrand);

    await createVaultMutation.mutateAsync({
      name,
      description,
      vaultType,
      status: 'active',
      encryptionLevel,
      accessLevel,
      brandId: selectedBrand || null,
      brandName: brand?.name || null,
      metadata: {
        itemCount: 0,
        sizeBytes: 0,
        region: 'za-south-1',
        lastAccessed: new Date().toISOString()
      }
    });
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardContent className="p-8">
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-emerald-600" />
            <div>
              <h2 className="text-2xl font-bold text-emerald-700">Create New Vault</h2>
              <p className="text-gray-600">Set up a secure storage container</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Vault Name</label>
              <Input
                placeholder="e.g., Production Secrets"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Vault Type</label>
              <Select value={vaultType} onValueChange={setVaultType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="secrets">🔑 Secrets</SelectItem>
                  <SelectItem value="documents">📄 Documents</SelectItem>
                  <SelectItem value="keys">🔐 Keys</SelectItem>
                  <SelectItem value="certificates">📜 Certificates</SelectItem>
                  <SelectItem value="general">📦 General</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Description</label>
            <Textarea
              placeholder="Describe what this vault will store..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-24"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Encryption Level</label>
              <Select value={encryptionLevel} onValueChange={setEncryptionLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AES-256">AES-256 (Standard)</SelectItem>
                  <SelectItem value="AES-512">AES-512 (High)</SelectItem>
                  <SelectItem value="SGX">SGX (Hardware)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Access Level</label>
              <Select value={accessLevel} onValueChange={setAccessLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="restricted">Restricted</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Associate with Brand</label>
              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger>
                  <SelectValue placeholder="Optional" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={null}>None</SelectItem>
                  {brands.map(brand => (
                    <SelectItem key={brand.id} value={brand.id}>
                      {brand.name}™
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={createVault}
              disabled={createVaultMutation.isPending}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              size="lg"
            >
              {createVaultMutation.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : (
                <Plus className="w-5 h-5 mr-2" />
              )}
              Create Vault
            </Button>

            <Button
              onClick={resetForm}
              variant="outline"
              size="lg"
            >
              Reset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
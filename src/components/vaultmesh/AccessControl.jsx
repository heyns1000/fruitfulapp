import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Lock, Shield } from 'lucide-react';

export default function AccessControl({ vaults }) {
  const accessStats = {
    public: vaults.filter(v => v.accessLevel === 'public').length,
    private: vaults.filter(v => v.accessLevel === 'private').length,
    restricted: vaults.filter(v => v.accessLevel === 'restricted').length
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Public Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-700">{accessStats.public}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-primary/5 border-yellow-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Private Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-700">{accessStats.private}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Restricted Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-700">{accessStats.restricted}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Access Control Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {vaults.map(vault => (
              <div key={vault.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold">{vault.name}</p>
                  <p className="text-sm text-gray-500">{vault.vaultType}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{vault.encryptionLevel}</Badge>
                  <Badge className={
                    vault.accessLevel === 'public' ? 'bg-blue-100 text-blue-800' :
                    vault.accessLevel === 'restricted' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }>
                    {vault.accessLevel}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
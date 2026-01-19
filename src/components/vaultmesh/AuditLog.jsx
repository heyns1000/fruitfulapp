import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Clock } from 'lucide-react';

export default function AuditLog({ vaults }) {
  const recentActivity = vaults
    .filter(v => v.metadata?.lastAccessed)
    .sort((a, b) => new Date(b.metadata.lastAccessed) - new Date(a.metadata.lastAccessed))
    .slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Recent Vault Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentActivity.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No recent activity</p>
          ) : (
            recentActivity.map((vault) => (
              <div key={vault.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <FileText className="w-4 h-4 text-emerald-700" />
                  </div>
                  <div>
                    <p className="font-semibold">{vault.name}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(vault.metadata.lastAccessed).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <Badge variant="outline">{vault.status}</Badge>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
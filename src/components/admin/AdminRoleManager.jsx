import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, UserCheck, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminRoleManager() {
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users-all'],
    queryFn: () => base44.entities.User.list(),
  });

  const { data: me } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me(),
  });

  const promoteMutation = useMutation({
    mutationFn: async (userId) => base44.entities.User.update(userId, { role: 'admin' }),
    onSuccess: (_, userId) => {
      toast.success('User promoted to admin');
      queryClient.invalidateQueries({ queryKey: ['users-all'] });
    },
    onError: () => toast.error('Failed to update role — you must be an admin to do this'),
  });

  const demoteMutation = useMutation({
    mutationFn: async (userId) => base44.entities.User.update(userId, { role: 'user' }),
    onSuccess: () => {
      toast.success('User demoted to regular user');
      queryClient.invalidateQueries({ queryKey: ['users-all'] });
    },
  });

  const promoteMe = async () => {
    if (!me?.id) { toast.error('Could not identify current user'); return; }
    promoteMutation.mutate(me.id);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-12"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Self-promote CTA */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-4">
        <ShieldCheck className="w-8 h-8 text-amber-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-bold text-amber-800">Grant Yourself Admin Access</h3>
          <p className="text-sm text-amber-700 mt-1 mb-3">
            Your current role: <Badge className="bg-amber-100 text-amber-800">{me?.role || 'unknown'}</Badge>
            {' '} · Logged in as <strong>{me?.email}</strong>
          </p>
          {me?.role !== 'admin' ? (
            <Button
              onClick={promoteMe}
              disabled={promoteMutation.isPending}
              className="bg-amber-600 hover:bg-amber-700 gap-2"
            >
              {promoteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              Promote Me to Admin
            </Button>
          ) : (
            <span className="text-sm text-green-700 font-semibold flex items-center gap-1">
              <UserCheck className="w-4 h-4" /> You already have admin access
            </span>
          )}
        </div>
      </div>

      {/* User List */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">👥 All Users</h2>
        <div className="space-y-3">
          {users.map(user => (
            <div key={user.id} className="flex items-center justify-between border rounded-lg px-4 py-3 gap-3">
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 truncate">{user.full_name || '(no name)'}</div>
                <div className="text-xs text-gray-500 truncate">{user.email}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge className={user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}>
                  {user.role || 'user'}
                </Badge>
                {user.role !== 'admin' ? (
                  <Button size="sm" variant="outline"
                    onClick={() => promoteMutation.mutate(user.id)}
                    disabled={promoteMutation.isPending}
                    className="text-xs gap-1">
                    <ShieldCheck className="w-3 h-3" /> Make Admin
                  </Button>
                ) : user.id !== me?.id ? (
                  <Button size="sm" variant="outline"
                    onClick={() => demoteMutation.mutate(user.id)}
                    className="text-xs text-red-600 hover:text-red-700 gap-1">
                    Remove Admin
                  </Button>
                ) : (
                  <span className="text-xs text-green-600">You</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Flame } from 'lucide-react';
import HotStackStudio from '../components/appbuilder/HotStackStudio';

export default function AppBuilder() {
  const { data: brands = [], isLoading } = useQuery({
    queryKey: ['brands'],
    queryFn: () => base44.entities.Brand.list('-updated_date'),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-hotstack-ember to-hotstack-amber shadow-lg shadow-orange-500/30">
            <Flame className="h-7 w-7 text-white" />
          </div>
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-hotstack-ember" />
          <p className="text-sm text-muted-foreground">Loading HotStack&trade; ecosystem&hellip;</p>
        </div>
      </div>
    );
  }

  return <HotStackStudio brands={brands} />;
}

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function BackButton({ to = 'Dashboard', label = 'Back to Dashboard' }) {
  return (
    <Button
      onClick={() => window.location.href = createPageUrl(to)}
      variant="outline"
      className="mb-6"
    >
      <ArrowLeft className="w-4 h-4 mr-2" />
      {label}
    </Button>
  );
}
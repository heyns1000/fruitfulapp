import React from 'react';
import BlockVaultAdmin from '@/components/blockvault/BlockVaultAdmin';

export default function BlockVault() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#001a0f] via-[#012b19] to-[#001a0f] relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #00ff99 1px, transparent 0)', backgroundSize: '32px 32px' }} />
      <div className="container mx-auto px-4 sm:px-6 py-6 relative z-10">
        <BlockVaultAdmin />
      </div>
    </div>
  );
}
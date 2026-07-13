import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BackButton({ to = '/Dashboard' }) {
  return (
    <Link
      to={to}
      className="fixed top-4 left-4 z-[9999] flex items-center gap-2 px-4 py-2.5 rounded-full text-white text-sm font-semibold shadow-lg hover:opacity-90 active:scale-95 transition-all"
      style={{ background: '#18241C' }}
    >
      <ArrowLeft className="w-4 h-4" />
      <span className="hidden sm:inline">Back</span>
    </Link>
  );
}
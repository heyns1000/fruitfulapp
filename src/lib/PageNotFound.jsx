import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function PageNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-teal-50 flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="text-8xl font-black text-teal-200 mb-4">404</div>
        <h1 className="text-2xl font-bold text-teal-900 mb-2">Page Not Found</h1>
        <p className="text-teal-600 mb-6">This page doesn't exist in the FAA.ZONE ecosystem.</p>
        <Link to={createPageUrl('Dashboard')}>
          <button className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-3 rounded-full transition-colors">
            Back to Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
}
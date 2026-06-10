import React from 'react';
import { Link } from 'react-router-dom';
import ProductCSVImporter from '../components/marketplace/ProductCSVImporter';
import { ArrowLeft } from 'lucide-react';

export default function CSVImport() {
  return (
    <div className="min-h-screen" style={{ background: '#001a0f' }}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to="/BanimalDashboard" className="inline-flex items-center gap-2 text-sm font-bold mb-6 hover:underline" style={{ color: '#00ffc8' }}>
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-black mb-2" style={{ color: '#00ffc8' }}>📦 Bulk Product CSV Import</h1>
        <p className="text-sm mb-8" style={{ color: '#9dfcdc99' }}>Upload your artisan products, prices, and inventory all at once — no manual entry needed.</p>
        <ProductCSVImporter />
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BrandSnapshot from './BrandSnapshot';

export default function SectorGrid({ brands, sectorKey, sectorName }) {
  const [selectedBrand, setSelectedBrand] = useState(null);

  const getHoverColor = () => {
    if (['banking', 'ai-logic', 'professional', 'saas'].includes(sectorKey)) 
      return 'hover:bg-indigo-100 hover:text-indigo-800';
    if (['agriculture', 'fsf', 'education-ip', 'education-youth', 'health', 'zerowaste', 'nutrition', 'wildlife'].includes(sectorKey))
      return 'hover:bg-green-100 hover:text-green-800';
    if (['creative', 'gaming', 'quantum', 'voice', 'nft', 'ritual', 'media'].includes(sectorKey))
      return 'hover:bg-purple-100 hover:text-purple-800';
    if (['logistics', 'housing', 'packaging', 'utilities', 'trade', 'micromesh', 'payroll-mining', 'mining'].includes(sectorKey))
      return 'hover:bg-yellow-100 hover:text-yellow-800';
    return 'hover:bg-gray-100 hover:text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
        {brands.map((brand, index) => (
          <button
            key={brand.id || index}
            onClick={() => setSelectedBrand(selectedBrand?.id === brand.id ? null : brand)}
            className={`px-3 py-2 text-sm rounded-lg shadow transition-all duration-200 hover:-translate-y-1 hover:scale-105 font-semibold border ${selectedBrand?.id === brand.id ? 'ring-2 ring-emerald-400' : ''}`}
            style={{
              background: selectedBrand?.id === brand.id ? 'rgba(0,255,160,0.15)' : 'rgba(0,30,15,0.7)',
              color: selectedBrand?.id === brand.id ? '#00ffc8' : '#b5ffe5',
              borderColor: selectedBrand?.id === brand.id ? '#00ff99' : '#00ff9920',
            }}
          >
            {brand.name}
            <sup>™</sup>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {selectedBrand && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <BrandSnapshot brand={selectedBrand} sectorKey={sectorKey} sectorName={sectorName} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
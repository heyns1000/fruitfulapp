import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Eye } from 'lucide-react';

export default function BrandNodeCard({ brand, sector, onVisit }) {
  const [visited, setVisited] = useState(false);
  const [localCount, setLocalCount] = useState(brand.visitCount);

  const handleClick = () => {
    setVisited(true);
    setLocalCount(c => c + 1);
    onVisit(brand);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.04, y: -3 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={handleClick}
      className={`cursor-pointer rounded-2xl border-2 p-4 select-none transition-all duration-200 ${
        visited
          ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-teal-50 shadow-lg shadow-yellow-100'
          : 'border-teal-200 bg-white hover:border-teal-400 hover:shadow-md'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-2xl">{sector.glyph}</span>
        {visited && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
            <Activity className="w-4 h-4 text-yellow-500" />
          </motion.div>
        )}
      </div>
      <p className="font-bold text-sm text-gray-800 leading-tight">{brand.name}</p>
      <p className="text-xs text-teal-600 font-mono mt-0.5">{brand.code}</p>
      <p className="text-xs text-gray-500 mt-0.5 truncate">{brand.subnode}</p>
      <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
        <Eye className="w-3 h-3" />
        <span>{localCount.toLocaleString()}</span>
      </div>
    </motion.div>
  );
}
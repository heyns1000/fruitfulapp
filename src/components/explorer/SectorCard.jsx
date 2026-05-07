import React from 'react';
import { motion } from 'framer-motion';
import { TIER_COLORS } from './SectorData';

export default function SectorCard({ sector, isSelected, onClick, visitCount }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={`cursor-pointer rounded-2xl border-2 p-4 flex flex-col gap-2 transition-all duration-200 select-none ${
        isSelected
          ? 'border-teal-500 bg-gradient-to-br from-teal-600 to-green-600 text-white shadow-xl shadow-teal-300'
          : 'border-teal-200 bg-white hover:border-teal-400 hover:shadow-lg'
      }`}
    >
      <span className="text-4xl leading-none">{sector.glyph}</span>
      <p className={`font-bold text-sm leading-tight ${isSelected ? 'text-white' : 'text-gray-800'}`}>{sector.label}</p>
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
          isSelected ? 'bg-white/20 text-white border-white/30' : TIER_COLORS[sector.tier]
        }`}>
          {sector.tier}
        </span>
        <span className={`text-xs font-semibold ${isSelected ? 'text-teal-100' : 'text-teal-600'}`}>
          ${sector.monthly}/mo
        </span>
      </div>
      {visitCount > 0 && (
        <p className={`text-xs ${isSelected ? 'text-teal-100' : 'text-gray-400'}`}>
          {visitCount} pulse{visitCount !== 1 ? 's' : ''}
        </p>
      )}
    </motion.div>
  );
}
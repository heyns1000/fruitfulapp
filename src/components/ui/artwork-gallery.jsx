import React from 'react';
import { motion } from 'framer-motion';

const artworks = [
  {
    url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6953a072de46207f94f2b9d2/52acd159d_Chief_02_1753263376705.png",
    name: "Chief 02",
    color: "from-teal-400 to-cyan-600"
  },
  {
    url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6953a072de46207f94f2b9d2/bdd987cfa_1st_eye_1753263376706.png",
    name: "First Eye",
    color: "from-orange-400 to-amber-600"
  },
  {
    url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6953a072de46207f94f2b9d2/80c4597b5_3_1753260859823.png",
    name: "Monster Champ",
    color: "from-emerald-400 to-teal-600"
  },
  {
    url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6953a072de46207f94f2b9d2/4540be9bd_Monster_01_1753263376704.png",
    name: "Monster 01",
    color: "from-yellow-400 to-orange-600"
  },
  {
    url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6953a072de46207f94f2b9d2/de7b64647_Nikon_1753263376703.png",
    name: "Nikon Artist",
    color: "from-orange-400 to-red-600"
  }
];

export default function ArtworkGallery() {
  return (
    <div className="py-12 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            🎨 Ecosystem Gallery
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">Celebrating our creative community · Seeds of Appreciation</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {artworks.map((artwork, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05, rotate: 2 }}
              className="relative group"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${artwork.color} rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity`}></div>
              <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border-4 border-white">
                <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 p-4">
                  <img
                    src={artwork.url}
                    alt={artwork.name}
                    className="w-full h-full object-contain drop-shadow-2xl"
                  />
                </div>
                <div className={`bg-gradient-to-r ${artwork.color} text-white px-4 py-3 text-center`}>
                  <p className="font-bold text-sm sm:text-base">{artwork.name}</p>
                  <p className="text-xs opacity-90">by Sam Fox</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
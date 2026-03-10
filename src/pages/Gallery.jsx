import React from 'react';
import { motion } from 'framer-motion';
import BackButton from '../components/navigation/BackButton';
import CrossAppLinks from '../components/common/CrossAppLinks';
import ArtworkGallery from '../components/ui/artwork-gallery';
import { Sparkles } from 'lucide-react';

export default function Gallery() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none opacity-5">
        <motion.img 
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6953a072de46207f94f2b9d2/bdd987cfa_1st_eye_1753263376706.png" 
          alt="" 
          className="absolute top-20 left-10 w-64 h-64 object-contain"
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.img 
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6953a072de46207f94f2b9d2/4540be9bd_Monster_01_1753263376704.png" 
          alt="" 
          className="absolute bottom-20 right-10 w-64 h-64 object-contain"
          animate={{ 
            y: [0, -20, 0]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <header className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white py-16 mb-12 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <Sparkles className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 drop-shadow-2xl" />
          </motion.div>
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold drop-shadow-2xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Ecosystem Art Gallery
          </motion.h1>
          <motion.p 
            className="text-base sm:text-lg md:text-xl opacity-95 mt-3 font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Seeds of Appreciation · Celebrating Creative Brilliance
          </motion.p>
          <motion.p 
            className="text-xs sm:text-sm opacity-80 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            🌈 Featuring artwork from our vibrant community
          </motion.p>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 pb-12 relative z-10">
        <BackButton />
        <div className="mb-6">
          <CrossAppLinks
            title="🔗 Explore FAA.ZONE"
            pages={['Dashboard', 'Marketplace', 'ArtisanDashboard', 'Wishlist', 'SubscriptionBoxes', 'LoyaltyProgram']}
          />
        </div>
        <ArtworkGallery />

        {/* Artist Spotlight */}
        <motion.div 
          className="mt-16 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-4 border-purple-200"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-purple-400 shadow-xl">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6953a072de46207f94f2b9d2/de7b64647_Nikon_1753263376703.png" 
                alt="Artist" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl sm:text-3xl font-bold text-purple-900 mb-2">✨ Artist Spotlight</h3>
              <p className="text-lg font-semibold text-purple-700 mb-3">Sam Fox</p>
              <p className="text-gray-700 leading-relaxed">
                A visionary artist bringing life, color, and imagination to the Omnigrid ecosystem. 
                Each piece tells a story of creativity, innovation, and the boundless possibilities 
                of artistic expression. Thank you for inspiring us all! 🎨
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
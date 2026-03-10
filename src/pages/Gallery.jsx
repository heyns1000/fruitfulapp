import React from 'react';
import { motion } from 'framer-motion';
import CrossAppLinks from '../components/common/CrossAppLinks';
import ArtworkGallery from '../components/ui/artwork-gallery';
import { Sparkles, Palette, Eye } from 'lucide-react';

export default function Gallery() {
  return (
    <div className="min-h-screen bg-stone-950 text-white">

      {/* Animated background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[700px] h-[700px] bg-orange-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl" />
        <motion.img
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6953a072de46207f94f2b9d2/bdd987cfa_1st_eye_1753263376706.png"
          alt=""
          className="absolute top-20 left-10 w-48 h-48 object-contain opacity-[0.03]"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        />
        <motion.img
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6953a072de46207f94f2b9d2/4540be9bd_Monster_01_1753263376704.png"
          alt=""
          className="absolute bottom-20 right-10 w-48 h-48 object-contain opacity-[0.03]"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* ── HERO HEADER ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-stone-900 via-orange-950/30 to-stone-900 border-b border-stone-800 px-8 md:px-16 py-20">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #e85d26 1px, transparent 0)', backgroundSize: '36px 36px' }} />
        <div className="max-w-5xl mx-auto relative text-center">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="inline-flex w-20 h-20 rounded-3xl bg-orange-600/20 border border-orange-600/40 items-center justify-center mx-auto mb-6"
          >
            <Palette className="w-10 h-10 text-orange-400" />
          </motion.div>

          <motion.p
            className="text-orange-400 text-xs font-bold tracking-[0.3em] uppercase mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            ✦ @Fruitful@ Art Collection
          </motion.p>

          <motion.h1
            className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-4"
            style={{ fontFamily: 'Georgia, serif' }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Ecosystem<br /><span className="text-orange-500">Art Gallery</span>
          </motion.h1>

          <motion.p
            className="text-stone-300 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            Seeds of Appreciation · Celebrating Creative Brilliance from Africa's finest artisan community.
          </motion.p>

          <motion.div
            className="flex items-center justify-center gap-3 mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span className="flex items-center gap-1.5 text-sm text-stone-400 bg-stone-900/60 backdrop-blur-sm border border-stone-700 rounded-full px-4 py-1.5">
              <Eye className="w-3.5 h-3.5 text-orange-400" /> Community curated
            </span>
            <span className="flex items-center gap-1.5 text-sm text-stone-400 bg-stone-900/60 backdrop-blur-sm border border-stone-700 rounded-full px-4 py-1.5">
              <Sparkles className="w-3.5 h-3.5 text-orange-400" /> Original artwork
            </span>
          </motion.div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-10 py-12 relative z-10 space-y-10">

        <CrossAppLinks
          title="Explore FAA.ZONE"
          pages={['Dashboard', 'Marketplace', 'ArtisanDashboard', 'Wishlist', 'SubscriptionBoxes', 'LoyaltyProgram']}
        />

        <ArtworkGallery />

        {/* ── ARTIST SPOTLIGHT ── */}
        <motion.div
          className="bg-stone-900 border border-stone-700 rounded-3xl overflow-hidden hover:border-orange-600 transition-colors"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="h-1 w-full bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600" />
          <div className="flex flex-col md:flex-row items-center gap-8 p-8">
            <div className="w-36 h-36 rounded-2xl overflow-hidden border-2 border-orange-600 shadow-2xl shadow-orange-900/40 shrink-0">
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6953a072de46207f94f2b9d2/de7b64647_Nikon_1753263376703.png"
                alt="Artist"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <p className="text-orange-400 text-xs font-bold tracking-[0.25em] uppercase mb-2">✦ Artist Spotlight</p>
              <h3 className="text-2xl md:text-3xl font-black text-white mb-1">Sam Fox</h3>
              <p className="text-stone-400 leading-relaxed text-sm md:text-base">
                A visionary artist bringing life, colour, and imagination to the Omnigrid ecosystem.
                Each piece tells a story of creativity, innovation, and the boundless possibilities
                of artistic expression.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
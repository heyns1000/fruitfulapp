import React, { useEffect } from 'react';

/**
 * FruitfulThankYou
 * Full-screen thank-you overlay shown whenever a user supports Fruitful
 * (purchase, subscription, loyalty redemption, etc.)
 * Usage: <FruitfulThankYou show={true} onClose={() => setShow(false)} />
 */
export default function FruitfulThankYou({ show, onClose, message = '' }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose?.();
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-w-2xl w-full mx-4 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-500"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6953a072de46207f94f2b9d2/306e0eb84_Fruitful_thank_you_1753372356062_png_1772316932717.jpg"
          alt="Fruitful. Thank. You."
          className="w-full object-cover"
        />
        {message && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
            <p className="text-white text-center text-lg font-semibold">{message}</p>
          </div>
        )}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-white/80 hover:bg-white text-gray-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
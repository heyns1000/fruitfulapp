import React from 'react';
import { ShieldCheck, Star, Users, TrendingUp } from 'lucide-react';

function calcTrustScore(reviews) {
  if (!reviews.length) return { score: 0, label: 'No Reviews', color: 'text-stone-500', bg: 'bg-stone-800', ring: 'ring-stone-600' };

  const avgRating = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  const ratingPoints = (avgRating / 5) * 65; // up to 65

  const countPoints = Math.min(Math.log(reviews.length + 1) / Math.log(51), 1) * 25; // up to 25, hits 25 at ~50 reviews

  const verifiedRatio = reviews.filter(r => r.verified).length / reviews.length;
  const verifiedPoints = verifiedRatio * 10; // up to 10

  const score = Math.round(ratingPoints + countPoints + verifiedPoints);

  let label, color, bg, ring;
  if (score >= 85) { label = 'Elite Trusted'; color = 'text-emerald-400'; bg = 'bg-emerald-500/10'; ring = 'ring-emerald-500/40'; }
  else if (score >= 70) { label = 'Highly Trusted'; color = 'text-teal-400'; bg = 'bg-teal-500/10'; ring = 'ring-teal-500/40'; }
  else if (score >= 55) { label = 'Trusted'; color = 'text-orange-400'; bg = 'bg-orange-500/10'; ring = 'ring-orange-500/40'; }
  else if (score >= 35) { label = 'Building Trust'; color = 'text-amber-400'; bg = 'bg-amber-500/10'; ring = 'ring-amber-500/40'; }
  else { label = 'New Seller'; color = 'text-stone-400'; bg = 'bg-stone-800'; ring = 'ring-stone-600'; }

  return { score, label, color, bg, ring, avgRating: avgRating.toFixed(1), verifiedCount: reviews.filter(r => r.verified).length };
}

export default function TrustScore({ reviews = [] }) {
  const { score, label, color, bg, ring, avgRating, verifiedCount } = calcTrustScore(reviews);
  const pct = score;

  return (
    <div className={`${bg} ring-1 ${ring} rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6`}>
      {/* Circular score */}
      <div className="relative w-24 h-24 shrink-0">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
          <circle cx="48" cy="48" r="40" fill="none" stroke="#292524" strokeWidth="8" />
          <circle
            cx="48" cy="48" r="40" fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 40}`}
            strokeDashoffset={`${2 * Math.PI * 40 * (1 - pct / 100)}`}
            className={`${color} transition-all duration-700`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <ShieldCheck className={`w-5 h-5 ${color} mb-0.5`} />
          <span className={`text-xl font-black ${color} leading-none`}>{score}</span>
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 text-center sm:text-left">
        <p className="text-xs font-bold tracking-widest uppercase text-stone-500 mb-0.5">Trust Score</p>
        <p className={`text-2xl font-black ${color}`}>{label}</p>
        <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-3 text-sm">
          <span className="flex items-center gap-1.5 text-stone-400">
            <Star className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
            {avgRating || '—'} avg rating
          </span>
          <span className="flex items-center gap-1.5 text-stone-400">
            <Users className="w-3.5 h-3.5 text-stone-500" />
            {reviews.length} review{reviews.length !== 1 ? 's' : ''}
          </span>
          {verifiedCount > 0 && (
            <span className="flex items-center gap-1.5 text-stone-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              {verifiedCount} verified
            </span>
          )}
        </div>
      </div>

      {/* Mini bar breakdown */}
      <div className="w-full sm:w-36 space-y-1.5">
        {[5,4,3,2,1].map(star => {
          const count = reviews.filter(r => r.rating === star).length;
          const pct = reviews.length ? (count / reviews.length) * 100 : 0;
          return (
            <div key={star} className="flex items-center gap-2">
              <span className="text-xs text-stone-500 w-3">{star}</span>
              <Star className="w-3 h-3 fill-orange-400 text-orange-400 shrink-0" />
              <div className="flex-1 h-1.5 bg-stone-800 rounded-full overflow-hidden">
                <div className="h-full bg-orange-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
              </div>
              <span className="text-xs text-stone-600 w-3 text-right">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
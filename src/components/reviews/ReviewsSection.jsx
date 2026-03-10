import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Quote, Star, ShieldCheck, PenLine, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import StarRating from './StarRating';
import TrustScore from './TrustScore';
import ReviewForm from './ReviewForm';

export default function ReviewsSection({ artisan, services = [] }) {
  const [showForm, setShowForm] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const { data: reviews = [] } = useQuery({
    queryKey: ['reviews', artisan.id],
    queryFn: () => base44.entities.Review.filter({ artisanId: artisan.id }, '-created_date', 100),
    enabled: !!artisan.id,
  });

  // Combine DB reviews + legacy testimonials from artisan profile
  const legacyReviews = (artisan.testimonials || []).map(t => ({
    id: `legacy-${t.customerName}`,
    reviewerName: t.customerName,
    rating: t.rating || 5,
    feedback: t.comment,
    productName: t.productPurchased,
    created_date: t.date,
    verified: true,
    legacy: true,
  }));

  const allReviews = [...reviews, ...legacyReviews];
  const displayedReviews = showAll ? allReviews : allReviews.slice(0, 6);

  return (
    <section className="space-y-8">
      <div className="border-b border-stone-800 pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold tracking-[0.25em] uppercase text-orange-500 mb-1">Community</p>
          <h2 className="text-4xl font-black text-white">Reviews & Trust</h2>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-orange-600 hover:bg-orange-500 text-white font-bold gap-2 shrink-0"
        >
          <PenLine className="w-4 h-4" />
          Write a Review
        </Button>
      </div>

      {/* Trust Score */}
      <TrustScore reviews={allReviews} />

      {/* Review Form */}
      {showForm && (
        <div className="bg-stone-900 border border-orange-800/30 rounded-2xl p-7">
          <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
            <PenLine className="w-5 h-5 text-orange-400" />
            Share Your Experience
          </h3>
          <ReviewForm
            artisanId={artisan.id}
            artisanName={artisan.artisanName}
            services={services}
            onSuccess={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Reviews list */}
      {allReviews.length === 0 ? (
        <div className="text-center py-14 text-stone-500">
          <Star className="w-10 h-10 mx-auto mb-3 opacity-20" />
          <p>No reviews yet. Be the first to leave feedback!</p>
        </div>
      ) : (
        <>
          {/* Hero review */}
          {allReviews[0] && (
            <div className="relative bg-gradient-to-br from-orange-950/50 to-stone-900 border border-orange-800/40 rounded-3xl p-10 overflow-hidden">
              <Quote className="absolute -top-2 -right-2 w-32 h-32 text-orange-900/20" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <StarRating value={allReviews[0].rating} readonly size="md" />
                  {allReviews[0].verified && (
                    <Badge className="bg-emerald-900/50 text-emerald-400 border border-emerald-700 gap-1 text-xs">
                      <ShieldCheck className="w-3 h-3" /> Verified
                    </Badge>
                  )}
                </div>
                <p className="text-2xl md:text-3xl text-stone-100 italic font-light leading-relaxed mb-7">
                  "{allReviews[0].feedback}"
                </p>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="font-bold text-white text-lg">— {allReviews[0].reviewerName}</p>
                    {allReviews[0].created_date && (
                      <p className="text-stone-500 text-sm">{new Date(allReviews[0].created_date).toLocaleDateString()}</p>
                    )}
                  </div>
                  {allReviews[0].productName && (
                    <Badge className="bg-orange-600/30 text-orange-300 border border-orange-700 text-sm px-4 py-1.5">
                      {allReviews[0].productName}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Review grid */}
          {allReviews.length > 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayedReviews.slice(1).map((review) => (
                <div key={review.id} className="group bg-stone-900 border border-stone-700 rounded-2xl p-6 space-y-4 hover:border-orange-600 transition-all hover:-translate-y-0.5">
                  <div className="flex items-center justify-between">
                    <StarRating value={review.rating} readonly size="sm" />
                    <div className="flex items-center gap-1.5">
                      {review.verified && (
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" title="Verified purchase" />
                      )}
                      {review.productName && (
                        <span className="text-orange-400 text-xs bg-orange-950/50 px-2.5 py-1 rounded-full truncate max-w-[100px]">{review.productName}</span>
                      )}
                    </div>
                  </div>
                  <p className="text-stone-300 italic leading-relaxed text-sm">"{review.feedback}"</p>
                  <div className="flex items-center justify-between border-t border-stone-800 pt-4 text-sm">
                    <span className="font-bold text-white">{review.reviewerName}</span>
                    {review.created_date && (
                      <span className="text-stone-600 text-xs">
                        {new Date(review.created_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {allReviews.length > 6 && !showAll && (
            <div className="text-center">
              <Button variant="outline" onClick={() => setShowAll(true)}
                className="border-stone-600 text-stone-300 hover:border-orange-500 hover:text-orange-400 gap-2">
                <ChevronDown className="w-4 h-4" />
                Show all {allReviews.length} reviews
              </Button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
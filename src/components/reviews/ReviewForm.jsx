import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import StarRating from './StarRating';
import { Send, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ReviewForm({ artisanId, artisanName, services = [], onSuccess }) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerEmail, setReviewerEmail] = useState('');
  const [productId, setProductId] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data) => base44.entities.Review.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reviews', artisanId] });
      setSubmitted(true);
      onSuccess?.();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating) { toast.error('Please select a star rating'); return; }
    if (!reviewerName.trim()) { toast.error('Please enter your name'); return; }
    if (!feedback.trim()) { toast.error('Please write some feedback'); return; }
    const product = services.find(s => s.id === productId);
    mutation.mutate({
      artisanId,
      artisanName,
      rating,
      feedback: feedback.trim(),
      reviewerName: reviewerName.trim(),
      reviewerEmail: reviewerEmail.trim(),
      productId: productId || undefined,
      productName: product?.serviceName || undefined,
      verified: false,
    });
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
        <div className="w-14 h-14 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center">
          <CheckCircle2 className="w-7 h-7 text-green-400" />
        </div>
        <p className="text-foreground font-bold text-lg">Thank you for your review!</p>
        <p className="text-muted-foreground text-sm">Your feedback helps the community.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Star rating */}
      <div>
        <label className="text-xs font-bold tracking-widest uppercase text-primary block mb-2">Your Rating *</label>
        <StarRating value={rating} onChange={setRating} size="lg" />
        {rating > 0 && (
          <p className="text-muted-foreground text-xs mt-1">
            {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!'][rating]}
          </p>
        )}
      </div>

      {/* Product selector */}
      {services.length > 0 && (
        <div>
          <label className="text-xs font-bold tracking-widest uppercase text-muted-foreground block mb-2">Product Reviewed</label>
          <Select value={productId} onValueChange={setProductId}>
            <SelectTrigger className="bg-muted border-border text-foreground">
              <SelectValue placeholder="General artisan review" />
            </SelectTrigger>
            <SelectContent className="bg-muted border-border text-foreground">
              <SelectItem value={null}>General artisan review</SelectItem>
              {services.map(s => (
                <SelectItem key={s.id} value={s.id}>{s.serviceName}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Feedback */}
      <div>
        <label className="text-xs font-bold tracking-widest uppercase text-muted-foreground block mb-2">Your Feedback *</label>
        <Textarea
          value={feedback}
          onChange={e => setFeedback(e.target.value)}
          placeholder="Share your experience with this artisan or product..."
          rows={4}
          className="bg-muted border-border text-foreground placeholder:text-muted-foreground resize-none"
        />
      </div>

      {/* Reviewer info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-bold tracking-widest uppercase text-muted-foreground block mb-2">Your Name *</label>
          <Input
            value={reviewerName}
            onChange={e => setReviewerName(e.target.value)}
            placeholder="Display name"
            className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <div>
          <label className="text-xs font-bold tracking-widest uppercase text-muted-foreground block mb-2">Email (optional)</label>
          <Input
            type="email"
            value={reviewerEmail}
            onChange={e => setReviewerEmail(e.target.value)}
            placeholder="Kept private"
            className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={mutation.isPending}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold gap-2"
      >
        <Send className="w-4 h-4" />
        {mutation.isPending ? 'Submitting...' : 'Submit Review'}
      </Button>
    </form>
  );
}
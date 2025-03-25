'use client';

import { useState } from 'react';
import { StarRating } from './StarRating';

interface ReviewFormProps {
  onSubmit: (data: { rating: number; comment: string }) => Promise<void>;
  targetUserName: string;
  className?: string;
}

export function ReviewForm({
  onSubmit,
  targetUserName,
  className = '',
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    setIsSubmitting(true);
    try {
      await onSubmit({ rating, comment });
      setRating(0);
      setComment('');
    } catch (error) {
      console.error('Failed to submit review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-base-content/70">
          Rate {targetUserName}
        </label>
        <StarRating rating={rating} onChange={setRating} size="lg" />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="comment"
          className="block text-sm font-medium text-base-content/70"
        >
          Comment (optional)
        </label>
        <textarea
          id="comment"
          rows={3}
          className="textarea textarea-bordered w-full"
          placeholder="Share your experience..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={rating === 0 || isSubmitting}
        className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`}
      >
        Submit Review
      </button>
    </form>
  );
}

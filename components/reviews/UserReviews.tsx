'use client';

import { StarRating } from './StarRating';
import { ReviewList } from './ReviewList';
import { useState } from 'react';

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  isReviewer: boolean;
  reviewer: {
    id: string;
    name: string;
    image: string;
  };
  targetUser: {
    id: string;
    name: string;
    image: string;
  };
  event: {
    id: string;
    name: string;
  };
}

interface Stats {
  averageRating: number;
  totalReviews: number;
}

interface UserReviewsClientProps {
  reviews: Review[];
  stats: Stats;
  className?: string;
}

export function UserReviewsClient({
  reviews,
  stats,
  className = '',
}: UserReviewsClientProps) {
  const [showGivenReviews, setShowGivenReviews] = useState(false);

  return (
    <div className={`space-y-8 ${className}`}>
      <div className="bg-base-200/50 rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div>
            <h3 className="text-lg font-medium mb-1">Rating</h3>
            <div className="flex items-center gap-3">
              <StarRating rating={stats.averageRating} readonly size="lg" />
              <span className="text-base-content/70">
                ({stats.averageRating.toFixed(1)}/5 • {stats.totalReviews}{' '}
                reviews)
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="tabs tabs-boxed bg-base-200/50 p-1 rounded-xl">
          <button
            className={`tab text-md font-medium transition-all duration-200 hover:bg-base-100 hover:text-primary ${
              !showGivenReviews
                ? 'bg-base-100 !text-primary'
                : 'text-base-content/70'
            }`}
            onClick={() => setShowGivenReviews(false)}
          >
            Reviews Received
          </button>
          <button
            className={`tab text-md font-medium transition-all duration-200 hover:bg-base-100 hover:text-primary ${
              showGivenReviews
                ? 'bg-base-100 !text-primary'
                : 'text-base-content/70'
            }`}
            onClick={() => setShowGivenReviews(true)}
          >
            Reviews Given
          </button>
        </div>

        <ReviewList
          reviews={reviews.filter((review) =>
            showGivenReviews ? review.isReviewer : !review.isReviewer
          )}
        />
      </div>
    </div>
  );
}

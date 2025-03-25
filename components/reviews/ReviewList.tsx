import { StarRating } from './StarRating';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  reviewer: {
    id: string;
    name: string;
    image: string;
  };
  event: {
    id: string;
    name: string;
  };
}

interface ReviewListProps {
  reviews: Review[];
  className?: string;
}

export function ReviewList({ reviews, className = '' }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-base-content/70">
        No reviews yet.
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {reviews.map((review) => (
        <div
          key={review.id}
          className="bg-base-200/50 rounded-xl p-6 space-y-4"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/profile/${review.reviewer.id}`}>
                {review.reviewer.image ? (
                  <Image
                    src={review.reviewer.image}
                    alt={review.reviewer.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="avatar placeholder">
                    <div className="bg-neutral-focus text-neutral-content rounded-full w-10">
                      <span className="text-lg">
                        {review.reviewer.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                )}
              </Link>
              <div>
                <Link
                  href={`/profile/${review.reviewer.id}`}
                  className="font-medium hover:text-primary transition-colors"
                >
                  {review.reviewer.name}
                </Link>
                <div className="text-sm text-base-content/70">
                  {formatDate(review.createdAt)}
                </div>
              </div>
            </div>
            <StarRating rating={review.rating} readonly size="sm" />
          </div>

          {review.comment && (
            <p className="text-base-content/80">{review.comment}</p>
          )}

          <div className="text-sm">
            <span className="text-base-content/60">Review for: </span>
            <Link
              href={`/trainings/${review.event.id}`}
              className="text-primary hover:underline"
            >
              {review.event.name}
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

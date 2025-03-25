'use client';

import { useState } from 'react';
import { StarRating } from './StarRating';
import Image from 'next/image';

interface Participant {
  id: string;
  name: string;
  image: string;
}

interface BulkReviewFormProps {
  eventId: string;
  participants: Participant[];
  onSubmitReview: (data: {
    targetUserId: string;
    rating: number;
    comment: string;
  }) => Promise<void>;
  onComplete: () => void;
}

interface ReviewData {
  rating: number;
  comment: string;
}

export function BulkReviewForm({
  eventId,
  participants,
  onSubmitReview,
  onComplete,
}: BulkReviewFormProps) {
  const [reviews, setReviews] = useState<Record<string, ReviewData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await Promise.all(
        Object.entries(reviews).map(([userId, review]) =>
          onSubmitReview({
            targetUserId: userId,
            rating: review.rating,
            comment: review.comment,
          })
        )
      );
      onComplete();
    } catch (error) {
      console.error('Failed to submit reviews:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentParticipant = participants[currentStep];
  const totalSteps = participants.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  if (!currentParticipant) return null;

  const currentReview = reviews[currentParticipant.id] || {
    rating: 0,
    comment: '',
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center text-sm text-base-content/70">
        <span>
          Participant {currentStep + 1} of {totalSteps}
        </span>
        <progress
          className="progress progress-primary w-56"
          value={progress}
          max="100"
        />
      </div>

      <div className="flex items-center gap-4 mb-6">
        {currentParticipant.image ? (
          <Image
            src={currentParticipant.image}
            alt={currentParticipant.name}
            width={64}
            height={64}
            className="rounded-full"
          />
        ) : (
          <div className="avatar placeholder">
            <div className="bg-neutral-focus text-neutral-content rounded-full w-16">
              <span className="text-2xl">
                {currentParticipant.name.charAt(0)}
              </span>
            </div>
          </div>
        )}
        <div>
          <h4 className="text-lg font-medium">{currentParticipant.name}</h4>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-base-content/70 mb-2">
            Rating
          </label>
          <StarRating
            rating={currentReview.rating}
            onChange={(rating) =>
              setReviews({
                ...reviews,
                [currentParticipant.id]: {
                  ...currentReview,
                  rating,
                },
              })
            }
            size="lg"
          />
        </div>

        <div>
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-base-content/70 mb-2"
          >
            Comment (optional)
          </label>
          <textarea
            id="comment"
            rows={3}
            className="textarea textarea-bordered w-full"
            placeholder="Share your experience..."
            value={currentReview.comment}
            onChange={(e) =>
              setReviews({
                ...reviews,
                [currentParticipant.id]: {
                  ...currentReview,
                  comment: e.target.value,
                },
              })
            }
          />
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="btn btn-ghost"
        >
          Previous
        </button>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSkip}
            className="btn btn-ghost"
            disabled={currentStep === totalSteps - 1}
          >
            Skip
          </button>

          {currentStep === totalSteps - 1 ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`}
            >
              Submit All Reviews
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              disabled={!currentReview.rating}
              className="btn btn-primary"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { StarRating } from './StarRating';
import Image from 'next/image';
import { createReviews } from '@/actions/reviews';

interface BulkReviewFormProps {
  eventId: string;
  participants: {
    eventId: string;
    attendeeId: string;
    status: string;
    createdAt: Date;
    isHost?: boolean;
  }[];
  userId?: string;
}

export interface ReviewData {
  rating: number;
  comment: string;
}

export function BulkReviewForm({
  eventId,
  participants,
  userId,
}: BulkReviewFormProps) {
  const [reviews, setReviews] = useState<Record<string, ReviewData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const handleSubmit = async () => {
    if (!userId) return;
    setIsSubmitting(true);
    try {
      const reviewData = Object.entries(reviews).map(([key, value]) => ({
        eventId: eventId,
        targetUserId: key,
        reviewerId: userId,
        ...value,
      }));
      const result = await createReviews(reviewData);
      if (result.success) {
        window.location.reload();
      } else {
        alert(
          ('error' in result && result.error) || 'Failed to submit reviews'
        );
      }
    } catch (error) {
      console.error('Failed to submit reviews:', error);
      alert('Failed to submit reviews. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  const filteredParticipants = participants.filter(
    (participant) => participant.attendeeId !== userId && !participant.isHost
  );
  const currentParticipant = filteredParticipants[currentStep];
  const totalSteps = filteredParticipants.length;
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

  const currentReview = reviews[currentParticipant.attendeeId] || {
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
        {/* {currentParticipant.image ? (
          <Image
            src={currentParticipant.image}
            alt={currentParticipant.name || 'User'}
            width={64}
            height={64}
            className="rounded-full"
          />
        ) : (
          <div className="avatar placeholder">
            <div className="bg-neutral-focus text-neutral-content rounded-full w-16">
              <span className="text-2xl">
                {currentParticipant.name?.charAt(0) || 'U'}
              </span>
            </div>
          </div>
        )}
        <div>
          <h4 className="text-lg font-medium">
            {currentParticipant.name || 'Anonymous User'}
          </h4>
        </div> */}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-base-content/70 mb-2">
            Rating
          </label>
          <StarRating
            rating={reviews[currentParticipant.attendeeId]?.rating || 0}
            onChange={(rating) => {
              console.log(currentParticipant);
              return setReviews({
                ...reviews,
                [currentParticipant.attendeeId]: {
                  ...currentReview,
                  rating,
                },
              });
            }}
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
            value={reviews[currentParticipant.attendeeId]?.comment || ''}
            onChange={(e) =>
              setReviews({
                ...reviews,
                [currentParticipant.attendeeId]: {
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
              Submit Reviews
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

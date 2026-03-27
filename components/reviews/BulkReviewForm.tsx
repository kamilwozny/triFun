'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { StarRating } from './StarRating';
import { createReviews } from '@/actions/reviews';
import { useTranslation } from 'react-i18next';

interface BulkReviewFormProps {
  eventId: string;
  participants: {
    attendeeId: string;
    name?: string | null;
    status: string;
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
  const { t } = useTranslation();
  const router = useRouter();

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
        toast.success('Reviews submitted successfully!');
        router.refresh();
      } else {
        toast.error('Failed to submit reviews');
      }
    } catch (error) {
      console.error('Failed to submit reviews:', error);
      toast.error('Failed to submit reviews. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  const filteredParticipants = participants.filter(
    (participant) =>
      participant.attendeeId !== userId && participant.status === 'confirmed',
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
          {`${t('participant')} ${currentStep + 1} ${t('of')} ${totalSteps}`}
        </span>
        <progress
          className="progress progress-primary w-56"
          value={progress}
          max="100"
        />
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="avatar placeholder">
          <div className="bg-neutral text-neutral-content rounded-full w-12">
            <span className="text-xl">
              {currentParticipant.name?.charAt(0).toUpperCase() ?? '?'}
            </span>
          </div>
        </div>
        <div>
          {currentParticipant.name && (
            <p className="font-semibold text-base-content">{currentParticipant.name}</p>
          )}
          <span
            className={`badge badge-sm ${currentParticipant.isHost ? 'badge-warning' : 'badge-info'}`}
          >
            {currentParticipant.isHost ? t('host') : t('participant')}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-base-content/70 mb-2">
            {t('rating')}
          </label>
          <StarRating
            rating={reviews[currentParticipant.attendeeId]?.rating || 0}
            onChange={(rating) => {
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
            {t('optionalComment')}
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
          {t('previous')}
        </button>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSkip}
            className="btn btn-ghost"
            disabled={currentStep === totalSteps - 1}
          >
            {t('skip')}
          </button>

          {currentStep === totalSteps - 1 ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`}
            >
              {t('submitReviews')}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              disabled={!currentReview.rating}
              className="btn btn-primary"
            >
              {t('next')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

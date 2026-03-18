'use client';

import { useCallback, useState } from 'react';
import { TrainingEvent } from '@/types/training';
import { TrainingEventCard } from './TrainingEventCard';
import { ReviewModal } from './ReviewModal';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

interface TrainingEventListProps {
  events: TrainingEvent[];
  activeTab: 'upcoming' | 'myEvents' | 'past';
  userId?: string;
  reviewedEventIds: string[];
}

export function TrainingEventList({
  events,
  activeTab,
  userId,
  reviewedEventIds,
}: TrainingEventListProps) {
  const [reviewEventId, setReviewEventId] = useState<string>('');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);

  const { t } = useTranslation();

  const handleReview = useCallback((eventId: string) => {
    setReviewEventId(eventId);
    setIsReviewModalOpen(true);
  }, []);
  if (events.length === 0) {
    return (
      <div className="text-center text-neutral text-xl font-extrabold mt-4 h-40 gap-8 flex justify-center flex-col items-center">
        {activeTab === 'myEvents' ? (
          "You don't have any events yet created."
        ) : activeTab === 'past' ? (
          'No past events found.'
        ) : (
          <>
            <p>No events found matching your criteria?</p>
            <Link
              href="trainings/create"
              className="bg-foreground hover:bg-card-foreground text-white text-lg font-bold p-4 px-6 rounded-md btn-lg"
            >
              {t('btnCreateEvent')}
            </Link>
          </>
        )}
      </div>
    );
  }

  const reviewEvent = events.find((event) => event.id === reviewEventId);

  return (
    <>
      <div className="space-y-6">
        {events.map((event) => (
          <TrainingEventCard
            key={event.id}
            event={event}
            showReviewButton={
              activeTab === 'past' &&
              userId === event.createdBy &&
              !reviewedEventIds.includes(event.id) &&
              (event.attendees?.length || 0) > 2
            }
            onReview={handleReview}
          />
        ))}
      </div>

      <ReviewModal
        reviewEvent={reviewEvent}
        reviewEventId={reviewEventId}
        userId={userId}
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
      />
    </>
  );
}

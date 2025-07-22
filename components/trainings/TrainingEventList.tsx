'use client';

import { useCallback, useState } from 'react';
import { TrainingEvent } from '@/types/training';
import { TrainingEventCard } from './TrainingEventCard';
import { ReviewModal } from './ReviewModal';

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
  const [modalTrigger, setModalTrigger] = useState<number>(0);

  const handleReview = useCallback((eventId: string) => {
    setReviewEventId(eventId);
    setModalTrigger((prev) => prev + 1);
  }, []);
  if (events.length === 0) {
    return (
      <div className="text-center text-neutral text-xl font-extrabold mt-4">
        {activeTab === 'myEvents'
          ? "You don't have any events yet."
          : activeTab === 'past'
          ? 'No past events found.'
          : 'No events found matching your criteria.'}
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
        modalTrigger={modalTrigger}
      />
    </>
  );
}

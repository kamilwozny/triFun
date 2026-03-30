'use client';

import { useCallback, useState } from 'react';
import { TrainingEvent } from '@/types/training';
import { ReviewModal } from './ReviewModal';
import { VirtualizedTrainingList } from './VirtualizedTrainingList';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { getTodayMidnight } from '@/lib/utils';

interface TrainingEventListProps {
  events: TrainingEvent[];
  activeTab: 'upcoming' | 'myEvents' | 'past';
  userId?: string;
  reviewedEventIds: string[];
  filterVersion: number;
}

export function TrainingEventList({
  events,
  activeTab,
  userId,
  reviewedEventIds,
  filterVersion,
}: TrainingEventListProps) {
  const [reviewEventId, setReviewEventId] = useState<string>('');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);

  const { t } = useTranslation();

  const handleReview = useCallback((eventId: string) => {
    setReviewEventId(eventId);
    setIsReviewModalOpen(true);
  }, []);

  const showReviewButton = useCallback(
    (event: TrainingEvent) => {
      if (!userId) return false;
      const isPast = new Date(event.date) < getTodayMidnight();
      const isConfirmedAttendee =
        event.attendees?.some(
          (a) => a.attendeeId === userId && a.status === 'confirmed',
        ) ?? false;
      return isPast && isConfirmedAttendee && !reviewedEventIds.includes(event.id);
    },
    [userId, reviewedEventIds],
  );

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
    <div className="h-full">
      <VirtualizedTrainingList
        events={events}
        showReviewButton={showReviewButton}
        onReview={handleReview}
        filterVersion={filterVersion}
      />

      <ReviewModal
        reviewEvent={reviewEvent}
        reviewEventId={reviewEventId}
        userId={userId}
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
      />
    </div>
  );
}

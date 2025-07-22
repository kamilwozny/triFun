'use client';

import { TrainingEvent } from '@/types/training';
import { TrainingEventCard } from './TrainingEventCard';

interface TrainingEventListProps {
  events: TrainingEvent[];
  selectedTraining: string | null;
  onSelectTraining: (eventId: string) => void;
  activeTab: 'upcoming' | 'myEvents' | 'past';
  userId?: string;
  reviewedEventIds: string[];
  onReview: (eventId: string) => void;
}

export function TrainingEventList({
  events,
  selectedTraining,
  onSelectTraining,
  activeTab,
  userId,
  reviewedEventIds,
  onReview,
}: TrainingEventListProps) {
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

  return (
    <div className="space-y-6">
      {events.map((event) => (
        <TrainingEventCard
          key={event.id}
          event={event}
          selectedTraining={selectedTraining}
          onSelect={onSelectTraining}
          showReviewButton={
            activeTab === 'past' &&
            userId === event.createdBy &&
            !reviewedEventIds.includes(event.id)
          }
          onReview={onReview}
        />
      ))}
    </div>
  );
}
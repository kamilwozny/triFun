'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import { TrainingEvent } from '@/types/training';
import { useTranslation } from 'react-i18next';

const difficultyColors = {
  Beginner: 'bg-green-100 text-green-800',
  Intermediate: 'bg-yellow-100 text-yellow-800',
  Expert: 'bg-red-100 text-red-800',
};

interface TrainingEventCardProps {
  event: TrainingEvent;
  showReviewButton?: boolean;
  onReview?: (eventId: string) => void;
}

export function TrainingEventCard({
  event,
  showReviewButton = false,
  onReview,
}: TrainingEventCardProps) {
  const router = useRouter();
  const { t } = useTranslation();

  const handleCardClick = useCallback(() => {
    router.push(`/trainings/${event.id}`);
  }, [event.id, router]);

  const handleReviewClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onReview?.(event.id);
    },
    [onReview, event.id]
  );

  return (
    <div
      key={event.id}
      onClick={handleCardClick}
      className={`card bg-white shadow-xl rounded-xl transition-all hover:shadow-2xl hover:cursor-pointer`}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-2xl font-bold text-neutral-800 mb-2">
              {event.name}
            </h3>
            <p className="text-neutral-600 flex items-center gap-2">
              <span className="inline-block">📍</span>
              {event.city}, {event.country}
            </p>
          </div>
          <div className="flex flex-col items-end">
            <span className="bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-semibold">
              {formatDate(event.date)}
            </span>
            <span
              className={`mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                difficultyColors[event.level as keyof typeof difficultyColors]
              }`}
            >
              {event.level}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
          {event.activities.map((activity) => (
            <div
              key={activity}
              className="bg-neutral-50 p-4 rounded-lg flex items-center gap-3"
            >
              <div>
                <span className="block text-sm font-semibold text-neutral-800">
                  {activity}
                </span>
                <span className="text-neutral-600">
                  {
                    event.parsedDistances.find((d) => d.activity === activity)
                      ?.distance
                  }{' '}
                  {
                    event.parsedDistances.find((d) => d.activity === activity)
                      ?.unit
                  }
                </span>
              </div>
            </div>
          ))}
        </div>

        {showReviewButton && (
          <div className="mt-6 pt-4 border-t border-base-200">
            <button
              onClick={handleReviewClick}
              className="btn btn-primary btn-sm"
            >
              Review Participants
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

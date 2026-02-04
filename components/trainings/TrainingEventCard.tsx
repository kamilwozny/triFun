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
    [onReview, event.id],
  );

  return (
    <div
      key={event.id}
      onClick={handleCardClick}
      className={`bg-white shadow-xl rounded-xl transition-all hover:shadow-md hover:shadow-foreground hover:cursor-pointer`}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-2xl font-bold text-neutral-800 mb-2">
              {event.name}
            </h3>
            <p className="text-secondary-foreground flex items-center">
              <span className="inline-block">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="lucide lucide-map-pin-icon lucide-map-pin"
                >
                  <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </span>
              {event.city}, {event.country}
            </p>
          </div>
          <div className="flex flex-col items-end">
            <span className="px-4 py-1 rounded-full text-sm font-semibold text-secondary-foreground">
              {formatDate(event.date)}
            </span>
            <span
              className={`mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                difficultyColors[event.level as keyof typeof difficultyColors]
              }`}
            >
              {t(event.level.toLowerCase())}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-6 h-12">
          {event.activities.map((activity) => (
            <div
              key={activity}
              className="bg-background shadow-md p-2 rounded-lg flex items-center gap-3 w-40"
            >
              <div>
                <span className="block text-md font-semibold text-foreground">
                  {activity}
                </span>
                <span className="text-sm">
                  {
                    event.parsedDistances.find((d) => d.activity === activity)
                      ?.distance
                  }
                  {t(
                    event.parsedDistances.find((d) => d.activity === activity)
                      ?.unit || '',
                  )}
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
              {t('reviewParticipants')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import { TrainingEvent } from '@/types/training';
import { useTranslation } from 'react-i18next';
import { TRAININGS_RETURN_URL_KEY, DIFFICULTY_COLORS } from '@/helpers/constants';
import { MapPin } from 'lucide-react';

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
    sessionStorage.setItem(
      TRAININGS_RETURN_URL_KEY,
      window.location.pathname + window.location.search,
    );
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
      <div className="p-4 lg:p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl lg:text-2xl font-bold text-neutral-800 mb-2">
              {event.name}
            </h3>
            <p className="text-secondary-foreground flex items-center gap-1">
              <MapPin className="h-4 w-4 shrink-0" />
              {event.city}, {event.country}
            </p>
          </div>
          <div className="flex flex-col items-end">
            <span className="px-4 py-1 rounded-full text-sm font-semibold text-secondary-foreground">
              {formatDate(event.date)}
            </span>
            <span
              className={`mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                DIFFICULTY_COLORS[event.level as keyof typeof DIFFICULTY_COLORS]
              }`}
            >
              {t(event.level.toLowerCase())}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 my-4">
          {event.activities.map((activity, i) => (
            <div
              key={`${activity}-${i}`}
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

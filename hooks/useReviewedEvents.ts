import { useState, useEffect } from 'react';
import { TrainingEvent } from '@/types/training';
import { getReviewsForEvent } from '@/actions/reviews';

export function useReviewedEvents(pastEvents: TrainingEvent[], activeTab: string) {
  const [reviewedEventIds, setReviewedEventIds] = useState<string[]>([]);

  useEffect(() => {
    if (activeTab === 'past') {
      Promise.all(
        pastEvents.map(async (event) => {
          if (event.attendees && event.attendees.length < 1) return event.id;
          const reviews = await getReviewsForEvent(event.id);
          return reviews && reviews.length > 0 ? event.id : null;
        })
      ).then((ids) => {
        setReviewedEventIds(ids.filter(Boolean) as string[]);
      });
    }
  }, [activeTab, pastEvents]);

  return reviewedEventIds;
}
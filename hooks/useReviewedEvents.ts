import { useState, useEffect } from 'react';
import { TrainingEvent } from '@/types/training';
import { getReviewedEventIds } from '@/actions/reviews';

export function useReviewedEvents(pastEvents: TrainingEvent[], activeTab: string) {
  const [reviewedEventIds, setReviewedEventIds] = useState<string[]>([]);

  useEffect(() => {
    if (activeTab === 'past') {
      const noAttendeeIds = pastEvents
        .filter((e) => !e.attendees || e.attendees.length < 1)
        .map((e) => e.id);

      const eligibleIds = pastEvents
        .filter((e) => e.attendees && e.attendees.length >= 1)
        .map((e) => e.id);

      getReviewedEventIds(eligibleIds).then((reviewedIds) => {
        setReviewedEventIds([...noAttendeeIds, ...reviewedIds]);
      });
    }
  }, [activeTab, pastEvents]);

  return reviewedEventIds;
}

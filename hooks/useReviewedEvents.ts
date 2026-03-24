import { useState, useEffect, useMemo } from 'react';
import { TrainingEvent } from '@/types/training';
import { getReviewedEventIds } from '@/actions/reviews';

export function useReviewedEvents(pastEvents: TrainingEvent[], activeTab: string) {
  const [reviewedEventIds, setReviewedEventIds] = useState<string[]>([]);

  const noAttendeeIds = useMemo(
    () => pastEvents.filter((e) => !e.attendees || e.attendees.length < 1).map((e) => e.id),
    [pastEvents],
  );

  const eligibleIds = useMemo(
    () => pastEvents.filter((e) => e.attendees && e.attendees.length >= 1).map((e) => e.id),
    [pastEvents],
  );

  useEffect(() => {
    if (activeTab === 'past') {
      getReviewedEventIds(eligibleIds).then((reviewedIds) => {
        setReviewedEventIds([...noAttendeeIds, ...reviewedIds]);
      });
    }
  }, [activeTab, eligibleIds, noAttendeeIds]);

  return reviewedEventIds;
}

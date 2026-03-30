import { useMemo } from 'react';
import { TrainingEvent } from '@/types/training';
import { getTodayMidnight } from '@/lib/utils';

export function useTrainingEventsFilter(events: TrainingEvent[], userId?: string) {
  const upcomingEvents = useMemo(() => {
    const today = getTodayMidnight();
    return events.filter((event) => new Date(event.date) >= today);
  }, [events]);

  const userEvents = useMemo(() => {
    if (!userId) return [];
    return upcomingEvents.filter((event) => {
      return (
        event.createdBy === userId ||
        event.attendees?.find(
          (attendee) => attendee.attendeeId === userId
        )
      );
    });
  }, [upcomingEvents, userId]);

  const pastEvents = useMemo(() => {
    const today = getTodayMidnight();
    return events.filter((event) => new Date(event.date) < today);
  }, [events]);

  return {
    upcomingEvents,
    userEvents,
    pastEvents,
  };
}


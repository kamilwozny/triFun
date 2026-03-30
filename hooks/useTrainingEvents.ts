import { useMemo } from 'react';
import { TrainingEvent } from '@/types/training';
import { getTodayMidnight } from '@/lib/utils';

export function useEventFiltering(
  events: TrainingEvent[],
  query: string,
  activity: string | null,
): TrainingEvent[] {
  return useMemo(() => {
    return events.filter((event) => {
      const matchesQuery =
        !query ||
        event.city.toLowerCase().includes(query.toLowerCase()) ||
        event.country.toLowerCase().includes(query.toLowerCase());

      const matchesActivity =
        !activity ||
        activity === 'All' ||
        event.activities.includes(activity);

      return matchesQuery && matchesActivity;
    });
  }, [events, query, activity]);
}

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


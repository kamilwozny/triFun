import { useMemo } from 'react';
import { TrainingEvent } from '@/types/training';
import { getTodayMidnight } from '@/lib/utils';

export function useTrainingEventsFilter(events: TrainingEvent[], userId?: string) {
  // Get upcoming events
  const upcomingEvents = useMemo(() => {
    const today = getTodayMidnight();
    return events.filter((event) => new Date(event.date) >= today);
  }, [events]);

  // Filter events the user is participating in or created
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

  // Get past events
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

export function useEventFiltering(
  events: TrainingEvent[],
  searchQuery: string,
  selectedActivity: string | null
) {
  return useMemo(() => {
    return events.filter((event) => {
      const matchesSearch = searchQuery
        ? event.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.country.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      const matchesActivity =
        !selectedActivity || selectedActivity === 'All'
          ? true
          : event.activities.includes(selectedActivity);

      return matchesSearch && matchesActivity;
    });
  }, [events, selectedActivity, searchQuery]);
}
import { useMemo } from 'react';
import { TrainingEvent } from '@/types/training';

export function useTrainingEventsFilter(events: TrainingEvent[], userId?: string) {
  // Get upcoming events
  const upcomingEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate >= today;
    });
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
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate < today;
    });
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
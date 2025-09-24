import { useMemo } from 'react';
import { TrainingEvent } from '@/types/training';
import { EventTypeFilters } from '@/components/trainings/EventTypeCheckboxes';
import { SportType } from '@/components/trainings/SportTypeFilters';
import { LocationFilters } from '@/components/trainings/LocationFilters';

export interface AllFilters {
  eventType: EventTypeFilters;
  sports: SportType[];
  location: LocationFilters;
}

export function useAdvancedEventFiltering(
  events: TrainingEvent[],
  filters: AllFilters,
  userId?: string
) {
  return useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return events.filter((event) => {
      // Date-based filtering
      const eventDate = new Date(event.date);
      const isPastEvent = eventDate < today;
      const isUpcomingEvent = eventDate >= today;

      // Check if user is host or attendee
      const isUserHost = event.createdBy === userId;
      const isUserAttendee = event.attendees?.find(
        (attendee) => attendee.attendeeId === userId
      );

      // Event type filtering
      let matchesEventType = false;

      if (filters.eventType.showHostEvents && isUserHost) {
        matchesEventType = true;
      }

      if (
        filters.eventType.showPlannedEvents &&
        isUserAttendee &&
        isUpcomingEvent
      ) {
        matchesEventType = true;
      }

      if (filters.eventType.showPastEvents && isPastEvent) {
        matchesEventType = true;
      }

      // If no event type filters are selected, show all events
      const hasEventTypeFilters =
        filters.eventType.showHostEvents ||
        filters.eventType.showPlannedEvents ||
        filters.eventType.showPastEvents;

      if (!hasEventTypeFilters) {
        matchesEventType = true;
      }

      // Sport type filtering
      const matchesSport =
        filters.sports.length === 0 ||
        filters.sports.some((sport) => event.activities.includes(sport));

      // Location filtering (city search)
      const matchesCity =
        !filters.location.city ||
        event.city
          .toLowerCase()
          .includes(filters.location.city.toLowerCase()) ||
        event.country
          .toLowerCase()
          .includes(filters.location.city.toLowerCase());

      // TODO: Distance filtering would require coordinates and geolocation calculation
      // For now, we'll implement city search only
      const matchesDistance = true; // Placeholder for distance filtering

      return matchesEventType && matchesSport && matchesCity && matchesDistance;
    });
  }, [events, filters, userId]);
}

export function getDefaultFilters(): AllFilters {
  return {
    eventType: {
      showHostEvents: false,
      showPlannedEvents: false,
      showPastEvents: false,
    },
    sports: [],
    location: {
      city: '',
      distanceKm: 25,
    },
  };
}

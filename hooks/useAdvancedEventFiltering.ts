import { useMemo } from 'react';
import { TrainingEvent } from '@/types/training';
import { EventTypeFilters } from '@/components/trainings/EventTypeCheckboxes';
import { SportType } from '@/components/trainings/SportTypeFilters';
import { getTodayMidnight } from '@/lib/utils';

export interface LocationFilters {
  city: string;
  distanceKm: number;
}

export interface AllFilters {
  eventType: EventTypeFilters;
  sports: SportType[];
  location: LocationFilters;
}

interface UserPosition {
  lat: number;
  lng: number;
}

export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function useAdvancedEventFiltering(
  events: TrainingEvent[],
  filters: AllFilters,
  userId?: string,
  userPosition?: UserPosition,
) {
  return useMemo(() => {
    const today = getTodayMidnight();

    // Resolve the reference point for distance filtering:
    // If a city is searched with a radius, use that city's coordinates (from any matching event).
    // Otherwise fall back to the user's GPS position.
    let referencePoint: UserPosition | undefined;
    if (filters.location.city && filters.location.distanceKm > 0) {
      const cityEvent = events.find(
        (e) =>
          e.city.toLowerCase() === filters.location.city.toLowerCase() && e.location,
      );
      if (cityEvent?.location) {
        referencePoint = { lat: cityEvent.location.lat, lng: cityEvent.location.lng };
      }
    } else if (!filters.location.city) {
      referencePoint = userPosition;
    }

    return events.filter((event) => {
      const eventDate = new Date(event.date);
      const isPastEvent = eventDate < today;
      const isUpcomingEvent = eventDate >= today;

      const isUserHost = event.createdBy === userId;
      const isUserAttendee = event.attendees?.find(
        (attendee) => attendee.attendeeId === userId,
      );

      let matchesEventType = false;

      if (filters.eventType.showHostEvents && isUserHost) {
        matchesEventType = true;
      }
      if (filters.eventType.showPlannedEvents && isUserAttendee && isUpcomingEvent) {
        matchesEventType = true;
      }
      if (filters.eventType.showPastEvents && isPastEvent) {
        matchesEventType = true;
      }

      const hasEventTypeFilters =
        filters.eventType.showHostEvents ||
        filters.eventType.showPlannedEvents ||
        filters.eventType.showPastEvents;

      if (!hasEventTypeFilters) {
        matchesEventType = true;
      }

      const matchesSport =
        filters.sports.length === 0 ||
        filters.sports.some((sport) => event.activities.includes(sport));

      // When doing a radius search from a city, distance handles the geo-filtering.
      // Fall back to name-matching only when there's no distance radius set.
      let matchesCity: boolean;
      if (!filters.location.city) {
        matchesCity = true;
      } else if (filters.location.distanceKm > 0 && referencePoint) {
        matchesCity = true; // distance filter covers this
      } else {
        matchesCity =
          event.city.toLowerCase().includes(filters.location.city.toLowerCase()) ||
          event.country.toLowerCase().includes(filters.location.city.toLowerCase());
      }

      let matchesDistance: boolean;
      if (!referencePoint || filters.location.distanceKm === 0 || !event.location) {
        matchesDistance = true;
      } else {
        matchesDistance =
          haversineDistance(
            referencePoint.lat,
            referencePoint.lng,
            event.location.lat,
            event.location.lng,
          ) <= filters.location.distanceKm;
      }

      return matchesEventType && matchesSport && matchesCity && matchesDistance;
    });
  }, [events, filters, userId, userPosition]);
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
      distanceKm: 0,
    },
  };
}

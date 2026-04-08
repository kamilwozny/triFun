'use client';

import { useMemo } from 'react';
import type { LatLng } from 'leaflet';
import { TrainingEvent } from '@/types/training';
import type { GeoPosition } from '@/hooks/useGeolocation';
import MapSkeleton from '../skeletons/MapSkeleton';
import Map from '@/components/map/Map';

interface TrainingMapViewProps {
  userPosition: GeoPosition | null;
  events: TrainingEvent[];
  selectedTraining: string | null;
}

export function TrainingMapView({
  userPosition,
  events,
  selectedTraining,
}: TrainingMapViewProps) {
  const mapMarkers = useMemo(() => {
    return events.map((event) => {
      const position = event.location
        ? ({
            lat: event.location.lat,
            lng: event.location.lng,
          } as LatLng)
        : (() => {
            const [lat, lng] = event.userPosition.split(',').map(Number);
            return { lat, lng } as LatLng;
          })();

      const primaryActivity = event.activities[0]?.toLowerCase() as
        | 'run'
        | 'bike'
        | 'swim';

      return {
        id: event.id,
        position,
        popup: event.name,
        type: primaryActivity,
        selected: selectedTraining === event.id,
        city: event.city,
        country: event.country,
        date: event.date,
        startTime: event.startTime,
        level: event.level,
        activities: event.activities,
        parsedDistances: event.parsedDistances,
      };
    });
  }, [events, selectedTraining]);

  if (!userPosition) {
    return <MapSkeleton />;
  }

  return (
    <Map
      position={userPosition}
      pickPoint={false}
      handleLocation={() => {}}
      events={events}
      markers={mapMarkers}
      className="h-full"
    />
  );
}

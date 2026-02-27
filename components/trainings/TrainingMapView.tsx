'use client';

import { useMemo } from 'react';
import type { LatLng } from 'leaflet';
import { TrainingEvent } from '@/types/training';
import MapSkeleton from '../skeletons/MapSkeleton';
import Map from '@/components/map/Map';

interface TrainingMapViewProps {
  userPosition: LatLng | null;
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
        position,
        popup: event.name,
        details: `${event.city}, ${event.country}`,
        type: primaryActivity,
        selected: selectedTraining === event.id,
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
    />
  );
}

'use client';

import { useMapEvents } from 'react-leaflet';
import type { Location } from './types';

export function LocationPickerController({
  pickPoint,
  handleLocation,
  onLocating,
}: {
  pickPoint: boolean;
  handleLocation?: (location: Location) => void;
  onLocating?: (isLocating: boolean) => void;
}) {
  useMapEvents({
    click: async (e) => {
      if (pickPoint && handleLocation) {
        onLocating?.(true);
        try {
          const response = await fetch(
            `/api/reverse-geocode?lat=${e.latlng.lat}&lng=${e.latlng.lng}`,
          );
          const data = await response.json();
          handleLocation({
            city: data.city || '',
            country: data.country || '',
            position: { lat: e.latlng.lat, lng: e.latlng.lng },
          });
        } catch (error) {
          console.error('Error fetching location details:', error);
        } finally {
          onLocating?.(false);
        }
      }
    },
  });
  return null;
}

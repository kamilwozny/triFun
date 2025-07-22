import { useState, useEffect } from 'react';
import type { LatLng } from 'leaflet';

export function useGeolocation() {
  const [userPosition, setUserPosition] = useState<LatLng | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          } as LatLng);
        },
        (error) => {
          console.error('Error getting geolocation:', error);
        }
      );
    }
  }, []);

  return userPosition;
}
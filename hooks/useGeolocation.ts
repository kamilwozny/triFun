import { useState, useEffect } from 'react';

export interface GeoPosition {
  lat: number;
  lng: number;
}

export function useGeolocation() {
  const [userPosition, setUserPosition] = useState<GeoPosition | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting geolocation:', error);
        }
      );
    }
  }, []);

  return userPosition;
}

'use client';

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

export function CountryBoundsInitializer({
  position,
}: {
  position: L.LatLngExpression;
}) {
  const map = useMap();

  useEffect(() => {
    async function setCountryBounds() {
      if (!map) return;
      map.invalidateSize();
      try {
        const [lat, lng] = Array.isArray(position)
          ? position
          : [(position as { lat: number; lng: number }).lat, (position as { lat: number; lng: number }).lng];

        const response = await fetch(`/api/latlng?lat=${lat}&lng=${lng}`);
        const boundsData = await response.json();

        if (boundsData[0]) {
          const bounds = L.latLngBounds(
            [boundsData[0].boundingbox[0], boundsData[0].boundingbox[2]],
            [boundsData[0].boundingbox[1], boundsData[0].boundingbox[3]],
          );
          map.fitBounds(bounds);
        }
      } catch (error) {
        console.error('Error setting country bounds:', error);
      }
    }

    setCountryBounds();
  }, [map, position]);

  return null;
}

'use client';

import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

export function CountryBoundsInitializer({
  lat,
  lng,
}: {
  lat: number;
  lng: number;
}) {
  const map = useMap();
  const hasFittedRef = useRef(false);

  useEffect(() => {
    if (hasFittedRef.current) return;
    hasFittedRef.current = true;

    async function setCountryBounds() {
      if (!map) return;
      map.invalidateSize();
      try {
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
  }, [map, lat, lng]);

  return null;
}

import { useMap, useMapEvents } from 'react-leaflet';
import {
  LocationMarkerProps,
  MapCursorControllerProps,
  ReverseGeocodeProps,
} from './types';
import { useEffect } from 'react';
import type { NextApiRequest, NextApiResponse } from 'next';

export const LocationMarker = ({
  pickPointMode,
  setPosition,
}: LocationMarkerProps) => {
  useMapEvents({
    click(e) {
      if (pickPointMode) {
        const newPosition = e.latlng;
        setPosition(e.latlng);
      }
    },
  });

  return null;
};

export const MapCursorController = ({
  pickPoint,
}: MapCursorControllerProps) => {
  const map = useMap();

  useEffect(() => {
    if (map) {
      map.getContainer().style.cursor = pickPoint ? 'pointer' : '';
    }
  }, [map, pickPoint]);

  return null;
};

export const ReverseGeocode = ({
  latlng,
  setLocation,
}: ReverseGeocodeProps) => {
  useEffect(() => {
    if (!latlng) return;

    const fetchLocation = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`
        );
        const data = await response.json();

        if (data && data.address) {
          const city =
            data.address.city || data.address.town || data.address.village;
          const country = data.address.country;
          setLocation({ city, country });
        }
      } catch (error) {
        console.error('Error fetching location:', error);
      }
    };

    fetchLocation();
  }, [latlng, setLocation]);

  return null;
};

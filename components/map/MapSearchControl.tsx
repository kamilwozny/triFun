'use client';

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';
import { useTranslation } from 'react-i18next';

export function MapSearchControl() {
  const map = useMap();
  const { t } = useTranslation();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();
    const searchControl = GeoSearchControl({
      provider,
      style: 'bar',
      showMarker: false,
      showPopup: false,
      autoClose: true,
      retainZoomLevel: false,
      animateZoom: true,
      keepResult: false,
      searchLabel: t('searchLocationPlaceholder'),
    });
    map.addControl(searchControl);
    return () => {
      map.removeControl(searchControl);
    };
  }, [map]);

  return null;
}

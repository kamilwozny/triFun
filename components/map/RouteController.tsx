'use client';

import { useState } from 'react';
import { useMap, useMapEvents, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { getOSRMRoute, getElevationGain } from '@/lib/routing';
import type { RouteResult } from './types';
import { startIcon, endIcon } from './MarkerIcon';

export function RouteController({
  onRouteChange,
  onPhaseChange,
  activityColor,
}: {
  onRouteChange: (data: RouteResult) => void;
  onPhaseChange: (phase: 'pick-start' | 'pick-end' | 'routing' | 'done') => void;
  activityColor: string;
}) {
  const [startPoint, setStartPoint] = useState<L.LatLng | null>(null);
  const [endPoint, setEndPoint] = useState<L.LatLng | null>(null);
  const [routePoints, setRoutePoints] = useState<[number, number][]>([]);
  const map = useMap();

  useMapEvents({
    click: async (e) => {
      if (!startPoint) {
        setStartPoint(e.latlng);
        onPhaseChange('pick-end');
        return;
      }
      if (!endPoint) {
        setEndPoint(e.latlng);
        onPhaseChange('routing');

        const result = await getOSRMRoute(
          { lat: startPoint.lat, lng: startPoint.lng },
          { lat: e.latlng.lat, lng: e.latlng.lng },
        );

        if (result) {
          setRoutePoints(result.points);
          const elevationGainM = await getElevationGain(result.points);
          onRouteChange({
            ...result,
            elevationGainM,
            start: { lat: startPoint.lat, lng: startPoint.lng },
            end: { lat: e.latlng.lat, lng: e.latlng.lng },
          });
          const bounds = L.latLngBounds(result.points);
          map.fitBounds(bounds, { padding: [20, 20] });
        }
        onPhaseChange('done');
        return;
      }
      setStartPoint(e.latlng);
      setEndPoint(null);
      setRoutePoints([]);
      onPhaseChange('pick-end');
    },
  });

  return (
    <>
      {startPoint && (
        <Marker position={startPoint} icon={startIcon}>
          <Popup>Start</Popup>
        </Marker>
      )}
      {endPoint && (
        <Marker position={endPoint} icon={endIcon}>
          <Popup>Finish</Popup>
        </Marker>
      )}
      {routePoints.length > 0 && (
        <Polyline
          positions={routePoints}
          pathOptions={{
            color: activityColor,
            weight: 4,
            opacity: 0.85,
            lineCap: 'round',
            lineJoin: 'round',
          }}
        />
      )}
    </>
  );
}

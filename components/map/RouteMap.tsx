'use client';

import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
  useMap,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import L from 'leaflet';
import { useEffect } from 'react';

interface RouteMapProps {
  routeGeoJson: string;
  /** Only used for legacy single-route format. New format derives colors per activity. */
  activityColor?: string;
}

const ACTIVITY_COLORS: Record<string, string> = {
  Run: '#FF2E63',
  Bike: '#9B5DE5',
  Swim: '#00BBF9',
};

const startIcon = L.divIcon({
  html: `<div style="width:12px;height:12px;border-radius:50%;background:#22c55e;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.4)"></div>`,
  className: '',
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

const endIcon = L.divIcon({
  html: `<div style="width:12px;height:12px;border-radius:50%;background:#ef4444;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.4)"></div>`,
  className: '',
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

interface ParsedRoute {
  points: [number, number][];
  color: string;
  label: string;
}

function parseRouteGeoJson(routeGeoJson: string, fallbackColor: string): ParsedRoute[] {
  try {
    const parsed = JSON.parse(routeGeoJson);

    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed) && !parsed.type) {
      return Object.entries(parsed)
        .map(([activity, data]: [string, any]) => {
          try {
            const geo = JSON.parse(data.geoJson);
            const points: [number, number][] = geo.coordinates.map(
              ([lng, lat]: [number, number]) => [lat, lng],
            );
            return {
              points,
              color: ACTIVITY_COLORS[activity] ?? fallbackColor,
              label: activity,
            };
          } catch {
            return null;
          }
        })
        .filter(Boolean) as ParsedRoute[];
    }

    if (parsed.type === 'LineString') {
      const points: [number, number][] = parsed.coordinates.map(
        ([lng, lat]: [number, number]) => [lat, lng],
      );
      return [{ points, color: fallbackColor, label: '' }];
    }

    return [];
  } catch {
    return [];
  }
}

function FitAllBounds({ allPoints }: { allPoints: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (allPoints.length > 1) {
      map.fitBounds(L.latLngBounds(allPoints), { padding: [20, 20] });
    }
  }, [map, allPoints]);
  return null;
}

export default function RouteMap({ routeGeoJson, activityColor = '#9B5DE5' }: RouteMapProps) {
  const routes = parseRouteGeoJson(routeGeoJson, activityColor);
  if (routes.length === 0) return null;

  const allPoints = routes.flatMap((r) => r.points);
  const center = allPoints[0];

  return (
    <MapContainer
      center={center}
      zoom={13}
      scrollWheelZoom={false}
      dragging={false}
      zoomControl={false}
      className="h-64 w-full rounded-xl"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitAllBounds allPoints={allPoints} />

      {routes.map((route, i) => (
        <RouteLayer key={i} route={route} showLabel={routes.length > 1} />
      ))}
    </MapContainer>
  );
}

function RouteLayer({ route, showLabel }: { route: ParsedRoute; showLabel: boolean }) {
  if (route.points.length < 2) return null;
  return (
    <>
      <Polyline
        positions={route.points}
        pathOptions={{
          color: route.color,
          weight: 4,
          opacity: 0.85,
          lineCap: 'round',
          lineJoin: 'round',
        }}
      />
      <Marker position={route.points[0]} icon={startIcon}>
        <Popup>{showLabel ? `${route.label} — Start` : 'Start'}</Popup>
      </Marker>
      <Marker position={route.points[route.points.length - 1]} icon={endIcon}>
        <Popup>{showLabel ? `${route.label} — Finish` : 'Finish'}</Popup>
      </Marker>
    </>
  );
}

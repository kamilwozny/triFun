'use client';

import { useState, useEffect } from 'react';
import { useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';

export function AnimatedPolyline({
  points,
  color,
}: {
  points: [number, number][];
  color: string;
}) {
  const [visibleCount, setVisibleCount] = useState(0);
  const map = useMap();

  useEffect(() => {
    if (points.length === 0) {
      setVisibleCount(0);
      return;
    }
    setVisibleCount(0);

    const totalFrames = Math.min(points.length, 300);
    const chunkSize = Math.ceil(points.length / totalFrames);
    const intervalMs = 1200 / totalFrames;

    let current = 0;
    const interval = setInterval(() => {
      current += chunkSize;
      if (current >= points.length) {
        setVisibleCount(points.length);
        clearInterval(interval);
      } else {
        setVisibleCount(current);
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }, [points]);

  useEffect(() => {
    if (visibleCount === points.length && points.length > 1) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [visibleCount, points, map]);

  if (visibleCount === 0) return null;

  return (
    <Polyline
      positions={points.slice(0, visibleCount)}
      pathOptions={{
        color,
        weight: 4,
        opacity: 0.85,
        lineCap: 'round',
        lineJoin: 'round',
      }}
    />
  );
}

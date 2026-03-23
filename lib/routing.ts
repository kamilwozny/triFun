export interface OSRMRouteResult {
  points: [number, number][];
  distanceKm: number;
  routeGeoJson: string;
}

function samplePoints(
  points: [number, number][],
  n: number,
): [number, number][] {
  if (points.length <= n) return points;
  const step = (points.length - 1) / (n - 1);
  return Array.from({ length: n }, (_, i) => points[Math.round(i * step)]);
}

export async function getOSRMRoute(
  start: { lat: number; lng: number },
  end: { lat: number; lng: number },
  profile: 'foot' | 'bike' = 'foot',
): Promise<OSRMRouteResult | null> {
  try {
    const url = `https://router.project-osrm.org/route/v1/${profile}/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.routes?.length) return null;

    const route = data.routes[0];
    const points: [number, number][] = route.geometry.coordinates.map(
      ([lng, lat]: [number, number]) => [lat, lng],
    );

    return {
      points,
      distanceKm: Math.round((route.distance / 1000) * 100) / 100,
      routeGeoJson: JSON.stringify({
        type: 'LineString',
        coordinates: route.geometry.coordinates,
      }),
    };
  } catch {
    return null;
  }
}

export async function getElevationGain(
  points: [number, number][],
): Promise<number> {
  const sampled = samplePoints(points, 50);
  try {
    const res = await fetch('https://api.open-elevation.com/api/v1/lookup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        locations: sampled.map(([lat, lng]) => ({
          latitude: lat,
          longitude: lng,
        })),
      }),
    });
    if (!res.ok) return 0;
    const data = await res.json();
    const elevations: number[] = data.results.map(
      (r: { elevation: number }) => r.elevation,
    );
    let gain = 0;
    for (let i = 1; i < elevations.length; i++) {
      if (elevations[i] > elevations[i - 1]) {
        gain += elevations[i] - elevations[i - 1];
      }
    }
    return Math.round(gain);
  } catch {
    return 0;
  }
}

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
    const params = new URLSearchParams({
      startLat: String(start.lat),
      startLng: String(start.lng),
      endLat: String(end.lat),
      endLng: String(end.lng),
      profile,
    });
    const res = await fetch(`/api/route?${params.toString()}`);
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

const elevationCache = new Map<string, number>();

function elevationCacheKey(points: [number, number][]): string {
  if (points.length === 0) return '';
  const s = points[0];
  const e = points[points.length - 1];
  const r = (n: number) => n.toFixed(4);
  return `${r(s[0])},${r(s[1])}->${r(e[0])},${r(e[1])}:${points.length}`;
}

export async function getElevationGain(
  points: [number, number][],
): Promise<number> {
  const cacheKey = elevationCacheKey(points);
  if (cacheKey && elevationCache.has(cacheKey)) {
    return elevationCache.get(cacheKey)!;
  }

  const sampled = samplePoints(points, 25);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

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
      signal: controller.signal,
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
    const result = Math.round(gain);
    if (cacheKey) elevationCache.set(cacheKey, result);
    return result;
  } catch {
    return 0;
  } finally {
    clearTimeout(timeout);
  }
}

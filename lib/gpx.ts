export interface GPXData {
  points: [number, number][];
  distanceKm: number;
  elevationGainM: number;
  start: { lat: number; lng: number };
  end: { lat: number; lng: number };
}

function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function parseGPX(gpxText: string): GPXData | null {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(gpxText, 'text/xml');
    const trkpts = Array.from(doc.querySelectorAll('trkpt'));

    if (trkpts.length < 2) return null;

    const points: [number, number][] = trkpts.map((pt) => [
      parseFloat(pt.getAttribute('lat') || '0'),
      parseFloat(pt.getAttribute('lon') || '0'),
    ]);

    let distanceKm = 0;
    let elevationGainM = 0;
    let prevEle: number | null = null;

    for (let i = 0; i < trkpts.length; i++) {
      if (i > 0) {
        distanceKm += haversineKm(
          points[i - 1][0],
          points[i - 1][1],
          points[i][0],
          points[i][1],
        );
      }
      const eleEl = trkpts[i].querySelector('ele');
      if (eleEl) {
        const ele = parseFloat(eleEl.textContent || '0');
        if (prevEle !== null && ele > prevEle) {
          elevationGainM += ele - prevEle;
        }
        prevEle = ele;
      }
    }

    return {
      points,
      distanceKm: Math.round(distanceKm * 100) / 100,
      elevationGainM: Math.round(elevationGainM),
      start: { lat: points[0][0], lng: points[0][1] },
      end: { lat: points[points.length - 1][0], lng: points[points.length - 1][1] },
    };
  } catch {
    return null;
  }
}

export function gpxToGeoJson(points: [number, number][]): string {
  return JSON.stringify({
    type: 'LineString',
    coordinates: points.map(([lat, lng]) => [lng, lat]),
  });
}

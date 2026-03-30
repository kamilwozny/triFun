/**
 * GPX parsing tests.
 * DOMParser is not available in the Node test environment, so we provide a minimal
 * mock implementation that handles the specific DOM surface used by parseGPX:
 *   doc.querySelectorAll('trkpt') → trkpt elements
 *   trkpt.getAttribute('lat' | 'lon')
 *   trkpt.querySelector('ele') → ele element with .textContent
 */

// ─── Minimal DOMParser mock for GPX tests ───────────────────────────────────

interface MockElement {
  tagName: string;
  getAttribute(name: string): string | null;
  querySelector(selector: string): MockElement | null;
  textContent: string;
}

interface MockDocument {
  querySelectorAll(selector: string): MockElement[];
}

function buildMockElement(
  tagName: string,
  attrs: Record<string, string> = {},
  children: MockElement[] = [],
  text = '',
): MockElement {
  return {
    tagName,
    textContent: text,
    getAttribute(name: string) {
      return attrs[name] ?? null;
    },
    querySelector(selector: string) {
      return children.find((c) => c.tagName === selector) ?? null;
    },
  };
}

/**
 * A very small GPX XML parser sufficient for these tests.
 * Returns null for malformed input (simulating browser DOMParser parseError behaviour).
 */
function parseGpxXml(xml: string): MockDocument | null {
  if (!xml || !xml.trim()) return null;

  // Detect parse errors: look for <parsererror> in the XML (browsers do this too)
  // For our purposes: if it contains neither '<trkpt' nor '</gpx>' assume malformed
  if (!xml.includes('trkpt') && !xml.includes('<gpx')) {
    // Return a document with no trkpts (simulates parse error returning empty doc)
    // This triggers the "< 2 trkpts → null" path in parseGPX
    return { querySelectorAll: () => [] };
  }

  const trkpts: MockElement[] = [];
  // Match each <trkpt ...>...</trkpt> block
  const trkptRe = /<trkpt([^>]*)>([\s\S]*?)<\/trkpt>/g;
  let match: RegExpExecArray | null;

  while ((match = trkptRe.exec(xml)) !== null) {
    const attrsStr = match[1];
    const inner = match[2];

    const lat = (attrsStr.match(/lat="([^"]+)"/) ?? [])[1] ?? '';
    const lon = (attrsStr.match(/lon="([^"]+)"/) ?? [])[1] ?? '';

    const eleMatch = inner.match(/<ele>([^<]+)<\/ele>/);
    const eleEl = eleMatch
      ? buildMockElement('ele', {}, [], eleMatch[1].trim())
      : null;

    const children: MockElement[] = eleEl ? [eleEl] : [];
    trkpts.push(buildMockElement('trkpt', { lat, lon }, children));
  }

  return { querySelectorAll: () => trkpts };
}

// Install the mock globally before importing parseGPX
(global as unknown as Record<string, unknown>).DOMParser = class {
  parseFromString(xml: string): MockDocument {
    return parseGpxXml(xml) ?? { querySelectorAll: () => [] };
  }
};

// ─── Tests ───────────────────────────────────────────────────────────────────

import { parseGPX, gpxToGeoJson } from '@/lib/gpx';

/** Helper: build a minimal GPX string with optional elevation on each point. */
function buildGpx(
  points: { lat: number; lon: number; ele?: number }[],
): string {
  const trkpts = points
    .map(
      (p) =>
        `<trkpt lat="${p.lat}" lon="${p.lon}">${
          p.ele !== undefined ? `<ele>${p.ele}</ele>` : ''
        }</trkpt>`,
    )
    .join('\n');
  return `<?xml version="1.0"?><gpx><trk><trkseg>${trkpts}</trkseg></trk></gpx>`;
}

// ─── parseGPX ────────────────────────────────────────────────────────────────

describe('parseGPX', () => {
  it('valid GPX with 3 points → returns GPXData with correct start and end', () => {
    const gpx = buildGpx([
      { lat: 52.2297, lon: 21.0122 },
      { lat: 52.235, lon: 21.015 },
      { lat: 52.24, lon: 21.02 },
    ]);
    const result = parseGPX(gpx);
    expect(result).not.toBeNull();
    expect(result!.start).toEqual({ lat: 52.2297, lng: 21.0122 });
    expect(result!.end).toEqual({ lat: 52.24, lng: 21.02 });
    expect(result!.points).toHaveLength(3);
  });

  it('calculates distance between 2 points (Warsaw area ~1.2 km)', () => {
    const gpx = buildGpx([
      { lat: 52.23, lon: 21.01 },
      { lat: 52.22, lon: 21.01 }, // ~1.1 km south
    ]);
    const result = parseGPX(gpx);
    expect(result).not.toBeNull();
    expect(result!.distanceKm).toBeGreaterThan(1.0);
    expect(result!.distanceKm).toBeLessThan(1.3);
  });

  it('distance is rounded to 2 decimal places', () => {
    const gpx = buildGpx([
      { lat: 52.2297, lon: 21.0122 },
      { lat: 52.235, lon: 21.015 },
    ]);
    const result = parseGPX(gpx);
    expect(result).not.toBeNull();
    const decimalPart = result!.distanceKm.toString().split('.')[1] ?? '';
    expect(decimalPart.length).toBeLessThanOrEqual(2);
  });

  it('elevation gain — ascending points → sums positive changes only', () => {
    const gpx = buildGpx([
      { lat: 52.22, lon: 21.01, ele: 100 },
      { lat: 52.23, lon: 21.01, ele: 150 }, // +50
      { lat: 52.24, lon: 21.01, ele: 130 }, // -20 (descent, not counted)
      { lat: 52.25, lon: 21.01, ele: 180 }, // +50
    ]);
    const result = parseGPX(gpx);
    expect(result).not.toBeNull();
    expect(result!.elevationGainM).toBe(100); // 50 + 50
  });

  it('elevation gain — all descending → 0 gain', () => {
    const gpx = buildGpx([
      { lat: 52.22, lon: 21.01, ele: 300 },
      { lat: 52.23, lon: 21.01, ele: 200 },
      { lat: 52.24, lon: 21.01, ele: 100 },
    ]);
    const result = parseGPX(gpx);
    expect(result).not.toBeNull();
    expect(result!.elevationGainM).toBe(0);
  });

  it('no elevation elements → elevationGainM is 0', () => {
    const gpx = buildGpx([
      { lat: 52.22, lon: 21.01 },
      { lat: 52.23, lon: 21.01 },
    ]);
    const result = parseGPX(gpx);
    expect(result).not.toBeNull();
    expect(result!.elevationGainM).toBe(0);
  });

  it('elevation gain is rounded to whole meters', () => {
    const gpx = buildGpx([
      { lat: 52.22, lon: 21.01, ele: 100.3 },
      { lat: 52.23, lon: 21.01, ele: 100.9 }, // +0.6m gain
    ]);
    const result = parseGPX(gpx);
    expect(result).not.toBeNull();
    expect(Number.isInteger(result!.elevationGainM)).toBe(true);
  });

  it('fewer than 2 track points → returns null', () => {
    const gpx = buildGpx([{ lat: 52.22, lon: 21.01 }]);
    expect(parseGPX(gpx)).toBeNull();
  });

  it('empty string → returns null', () => {
    expect(parseGPX('')).toBeNull();
  });

  it('invalid XML (no trkpt elements) → returns null', () => {
    expect(parseGPX('this is not xml at all')).toBeNull();
  });

  it('returns correct number of points', () => {
    const gpx = buildGpx([
      { lat: 1, lon: 1 },
      { lat: 2, lon: 2 },
      { lat: 3, lon: 3 },
      { lat: 4, lon: 4 },
    ]);
    const result = parseGPX(gpx);
    expect(result!.points).toHaveLength(4);
  });
});

// ─── gpxToGeoJson ─────────────────────────────────────────────────────────────

describe('gpxToGeoJson', () => {
  it('produces a valid JSON string', () => {
    const json = gpxToGeoJson([[52.22, 21.01], [52.23, 21.02]]);
    expect(() => JSON.parse(json)).not.toThrow();
  });

  it('output is a GeoJSON LineString', () => {
    const result = JSON.parse(gpxToGeoJson([[52.22, 21.01]]));
    expect(result.type).toBe('LineString');
    expect(Array.isArray(result.coordinates)).toBe(true);
  });

  it('coordinates are [lng, lat] order (GeoJSON spec — swapped from input)', () => {
    const points: [number, number][] = [[52.22, 21.01]]; // input is [lat, lng]
    const result = JSON.parse(gpxToGeoJson(points));
    // GeoJSON: [longitude, latitude]
    expect(result.coordinates[0]).toEqual([21.01, 52.22]);
  });

  it('2 points → 2 coordinate pairs in output', () => {
    const result = JSON.parse(gpxToGeoJson([[52.22, 21.01], [52.23, 21.02]]));
    expect(result.coordinates).toHaveLength(2);
  });

  it('empty points array → LineString with empty coordinates', () => {
    const result = JSON.parse(gpxToGeoJson([]));
    expect(result.type).toBe('LineString');
    expect(result.coordinates).toEqual([]);
  });
});

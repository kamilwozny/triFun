import { NextRequest, NextResponse } from 'next/server';

export const revalidate = 86400;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const startLat = searchParams.get('startLat');
  const startLng = searchParams.get('startLng');
  const endLat = searchParams.get('endLat');
  const endLng = searchParams.get('endLng');
  const profile = searchParams.get('profile') === 'bike' ? 'bike' : 'foot';

  if (!startLat || !startLng || !endLat || !endLng) {
    return NextResponse.json({ error: 'Missing coordinates' }, { status: 400 });
  }

  const url = `https://router.project-osrm.org/route/v1/${profile}/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;

  try {
    const upstream = await fetch(url, {
      next: { revalidate: 86400 },
    });
    if (!upstream.ok) {
      return NextResponse.json(
        { error: 'Routing failed' },
        { status: upstream.status },
      );
    }
    const data = await upstream.json();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control':
          'public, s-maxage=86400, stale-while-revalidate=604800',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Routing failed' }, { status: 502 });
  }
}

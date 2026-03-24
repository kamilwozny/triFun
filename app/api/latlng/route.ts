import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get('lat') ?? '');
  const lng = parseFloat(searchParams.get('lng') ?? '');

  if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return Response.json({ error: 'Invalid coordinates' }, { status: 400 });
  }

  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
  const response = await fetch(url, {
    headers: { 'User-Agent': 'TriFun (kamil.wozny@edu.uekat.pl)' },
  });
  if (!response.ok) {
    return Response.json([], { status: 200 });
  }
  const data = await response.json();
  if (!data?.address?.country_code) {
    return Response.json([]);
  }
  const countryCode = data.address.country_code;
  const boundsResponse = await fetch(
    `https://nominatim.openstreetmap.org/search?country=${countryCode}&format=json`,
    {
      headers: { 'User-Agent': 'TriFun (kamil.wozny@edu.uekat.pl)' },
    },
  );
  if (!boundsResponse.ok) {
    return Response.json([]);
  }
  const boundsData = await boundsResponse.json();

  return new Response(JSON.stringify(boundsData), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
    },
  });
}

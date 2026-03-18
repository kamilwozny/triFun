import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
  const response = await fetch(url, {
    headers: { 'User-Agent': 'TriFun (kamil.wozny@edu.uekat.pl)' },
  });
  if (!response.ok) {
    return Response.json(
      { error: 'Reverse geocoding failed' },
      { status: 500 },
    );
  }
  const data = await response.json();
  if (!data?.address?.country_code) {
    return Response.json({ error: 'No country code found' }, { status: 400 });
  }
  const countryCode = data.address.country_code;
  const boundsResponse = await fetch(
    `https://nominatim.openstreetmap.org/search?country=${countryCode}&format=json`,
    {
       headers: {
      'User-Agent': 'TriFun (kamil.wozny@edu.uekat.pl)',
    },
    }
  );
  const boundsData = await boundsResponse.json();

  return Response.json(boundsData);
}

import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
    { headers: { 'User-Agent': 'TriFun (kamil.wozny@edu.uekat.pl)' } },
  );

  if (!response.ok) {
    return Response.json({ error: 'Reverse geocoding failed' }, { status: 500 });
  }

  const data = await response.json();
  const address = data?.address ?? {};

  return Response.json({
    city:
      address.city ||
      address.town ||
      address.village ||
      address.suburb ||
      address.municipality ||
      address.county ||
      address.state_district ||
      address.state ||
      '',
    country: address.country || '',
  });
}

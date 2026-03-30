import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get('lat') ?? '');
  const lng = parseFloat(searchParams.get('lng') ?? '');

  if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return Response.json({ error: 'Invalid coordinates' }, { status: 400 });
  }

  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
    { headers: { 'User-Agent': 'TriFun/1.0' } },
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

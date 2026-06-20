import type { SearchResult } from './types';

export async function fetchNearbyEvents(
  lat: number, lon: number, radiusKm: number, textFilter: string
): Promise<SearchResult[]> {
  const apiKey = process.env.TICKETMASTER_API_KEY;
  if (!apiKey) return [];

  const params = new URLSearchParams({
    apikey: apiKey,
    latlong: `${lat},${lon}`,
    radius: String(Math.ceil(radiusKm)),
    unit: 'km',
    size: '20',
    sort: 'distance,asc',
    locale: '*',
    ...(textFilter ? { keyword: textFilter } : {}),
  });

  const res = await fetch(
    `https://app.ticketmaster.com/discovery/v2/events.json?${params}`,
    { next: { revalidate: 300 } }
  );

  if (!res.ok) return [];
  const data = await res.json();

  const events = data._embedded?.events ?? [];

  return events.map((ev: Record<string, unknown>): SearchResult => {
    const venue = ((ev._embedded as Record<string, unknown>)?.venues as Record<string, unknown>[])?.[0] ?? {};
    const venueLoc = (venue.location as Record<string, string>) ?? {};
    const venueAddr = (venue.address as Record<string, string>) ?? {};
    const venueCity = ((venue.city as Record<string, string>)?.name) ?? '';
    const address = [venueAddr.line1, venueCity].filter(Boolean).join(', ') || 'Warszawa';

    const images = (ev.images as { url: string; width: number }[]) ?? [];
    const bestImg = images.sort((a, b) => (b.width ?? 0) - (a.width ?? 0))[0];

    const startDate = ((ev.dates as Record<string, unknown>)?.start as Record<string, string>)?.dateTime
      ?? ((ev.dates as Record<string, unknown>)?.start as Record<string, string>)?.localDate;

    const evLat = parseFloat(venueLoc.latitude ?? String(lat));
    const evLon = parseFloat(venueLoc.longitude ?? String(lon));
    const distance = haversine(lat, lon, evLat, evLon);

    const classifications = (ev.classifications as Record<string, unknown>[]) ?? [];
    const segment = (classifications[0]?.segment as Record<string, string>)?.name ?? 'Wydarzenie';

    return {
      type: 'Event',
      name: String(ev.name ?? 'Wydarzenie'),
      description: String((ev.info as string) ?? (ev.pleaseNote as string) ?? `${segment} w Twojej okolicy`),
      category: segment,
      address,
      distance,
      eventDate: startDate,
      tags: [segment.toLowerCase()],
      image: bestImg?.url,
    };
  });
}

function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

import type { SearchResult } from './types';

const HEADERS = { 'User-Agent': 'PolkaSearch/1.0 (konradfilarski@gmail.com)' };

function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

interface GeoResult { pageid: number; title: string; lat: number; lon: number; dist: number; }
interface Summary { extract?: string; thumbnail?: { source: string }; }

export async function fetchNearbyWikiPlaces(
  lat: number, lon: number, radiusKm: number
): Promise<SearchResult[]> {
  const radiusM = Math.min(Math.round(radiusKm * 1000), 10000);

  const geoParams = new URLSearchParams({
    action: 'query', list: 'geosearch',
    gsradius: String(radiusM),
    gscoord: `${lat}|${lon}`,
    gslimit: '20',
    format: 'json', origin: '*',
  });

  const geoRes = await fetch(
    `https://pl.wikipedia.org/w/api.php?${geoParams}`,
    { headers: HEADERS, next: { revalidate: 3600 } }
  );
  if (!geoRes.ok) return [];
  const geoData = await geoRes.json();
  const hits: GeoResult[] = geoData.query?.geosearch ?? [];
  if (hits.length === 0) return [];

  // Fetch summaries in parallel (max 5 to stay fast)
  const top = hits.slice(0, 5);
  const summaries = await Promise.all(
    top.map(async (h) => {
      try {
        const r = await fetch(
          `https://pl.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(h.title)}`,
          { headers: HEADERS, next: { revalidate: 3600 } }
        );
        if (!r.ok) return null;
        return (await r.json()) as Summary;
      } catch { return null; }
    })
  );

  return top.map((h, i): SearchResult => {
    const s = summaries[i];
    const distance = haversine(lat, lon, h.lat, h.lon);
    return {
      type: 'Business',
      name: h.title,
      description: s?.extract?.slice(0, 180) ?? `Znane miejsce w pobliżu (${distance.toFixed(2)} km)`,
      category: 'Znane miejsce',
      address: `${h.lat.toFixed(4)}°N, ${h.lon.toFixed(4)}°E`,
      distance,
      tags: ['wikipedia', 'atrakcja'],
      image: s?.thumbnail?.source,
    };
  }).sort((a, b) => a.distance - b.distance);
}

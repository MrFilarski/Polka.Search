import { NextRequest, NextResponse } from 'next/server';
import { fetchNearbyPlaces } from '@/lib/nominatim';
import { fetchNearbyWikiPlaces } from '@/lib/wikipedia';
import { fetchNearbyEvents } from '@/lib/ticketmaster';
import { fetchNearbyDeals } from '@/lib/deals';
import { fetchPlacePhoto } from '@/lib/google-places';
import { latestUpdates } from '@/lib/data';
import type { SearchResult } from '@/lib/types';

async function enrichWithPhotos(results: SearchResult[], lat: number, lon: number): Promise<SearchResult[]> {
  // Only fetch Google photos for results that don't already have one
  const photoJobs = results.map(r =>
    r.image ? Promise.resolve(r.image) : fetchPlacePhoto(r.name, lat, lon)
  );
  const photos = await Promise.allSettled(photoJobs);
  return results.map((r, i) => ({
    ...r,
    image: photos[i].status === 'fulfilled' && photos[i].value ? photos[i].value! : r.image,
  }));
}

const DEFAULT_LAT = 52.1741; // Cybernetyki 7D, Warszawa
const DEFAULT_LON = 20.9962;
const DEFAULT_RADIUS = 0.8;

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;
  const lat = parseFloat(p.get('latitude') ?? String(DEFAULT_LAT));
  const lon = parseFloat(p.get('longitude') ?? String(DEFAULT_LON));
  const radius = parseFloat(p.get('radius') ?? String(DEFAULT_RADIUS));
  const query = p.get('query') ?? '';

  // Zniżki — dedykowana zakładka, nie wywołujemy Nominatim
  if (query === 'znizki') {
    const deals = fetchNearbyDeals(lat, lon, radius * 3);
    const results = await enrichWithPhotos(deals, lat, lon);
    return NextResponse.json({ results, latestUpdates });
  }

  const [places, wiki, events] = await Promise.allSettled([
    fetchNearbyPlaces(lat, lon, radius, query),
    query ? Promise.resolve([]) : fetchNearbyWikiPlaces(lat, lon, radius),
    fetchNearbyEvents(lat, lon, radius, query),
  ]);

  const seen = new Set<string>();
  const merged = [
    ...(events.status === 'fulfilled' ? events.value : []),
    ...(places.status === 'fulfilled' ? places.value : []),
    ...(wiki.status === 'fulfilled' ? wiki.value : []),
  ].filter(r => {
    const key = r.name.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).sort((a, b) => a.distance - b.distance);

  const results = await enrichWithPhotos(merged, lat, lon);
  return NextResponse.json({ results, latestUpdates });
}

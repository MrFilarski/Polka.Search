import { Suspense } from 'react';
import type { Locale } from '@/lib/i18n';
import { fetchNearbyPlaces } from '@/lib/nominatim';
import { fetchNearbyWikiPlaces } from '@/lib/wikipedia';
import { fetchNearbyEvents } from '@/lib/ticketmaster';
import { fetchPlacePhoto } from '@/lib/google-places';
import { latestUpdates } from '@/lib/data';
import SearchPage from '@/components/SearchPage';
import type { SearchResult } from '@/lib/types';

async function enrichWithPhotos(results: SearchResult[], lat: number, lon: number): Promise<SearchResult[]> {
  const jobs = results.map(r =>
    r.image ? Promise.resolve(r.image) : fetchPlacePhoto(r.name, lat, lon)
  );
  const photos = await Promise.allSettled(jobs);
  return results.map((r, i) => ({
    ...r,
    image: photos[i].status === 'fulfilled' && photos[i].value ? photos[i].value! : r.image,
  }));
}

// Cybernetyki 7D, Warszawa — Mokotów / Służewiec Południowy
const DEFAULT_LAT = 52.1741;
const DEFAULT_LON = 20.9962;
const DEFAULT_RADIUS = 0.8;

interface Props {
  searchParams: Promise<{ query?: string; latitude?: string; longitude?: string; radius?: string; lang?: string }>;
}

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;
  const locale = (['en', 'pl', 'uk'].includes(params.lang ?? '') ? params.lang : 'pl') as Locale;

  const lat = parseFloat(params.latitude ?? String(DEFAULT_LAT));
  const lon = parseFloat(params.longitude ?? String(DEFAULT_LON));
  const radius = parseFloat(params.radius ?? String(DEFAULT_RADIUS));
  const query = params.query ?? '';

  const [places, wiki, events] = await Promise.allSettled([
    fetchNearbyPlaces(lat, lon, radius, query),
    fetchNearbyWikiPlaces(lat, lon, radius),
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

  const initialResults = await enrichWithPhotos(merged, lat, lon);

  return (
    <Suspense>
      <SearchPage
        initialResults={initialResults}
        initialUpdates={latestUpdates}
        locale={locale}
        defaultLat={lat}
        defaultLon={lon}
        defaultRadius={radius}
      />
    </Suspense>
  );
}

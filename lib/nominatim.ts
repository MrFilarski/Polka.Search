import type { SearchResult } from './types';

const HEADERS = { 'User-Agent': 'PolkaSearch/1.0 (konradfilarski@gmail.com)' };

const CATEGORY_MAP: Record<string, string> = {
  restaurant: 'Restauracja', cafe: 'Kawiarnia', bar: 'Bar', pub: 'Pub',
  fast_food: 'Fast Food', gym: 'Siłownia', fitness_centre: 'Fitness',
  cinema: 'Kino', theatre: 'Teatr', nightclub: 'Klub nocny',
  library: 'Biblioteka', pharmacy: 'Apteka', hospital: 'Szpital',
  hotel: 'Hotel', supermarket: 'Supermarket', marketplace: 'Targ',
  convenience: 'Sklep spożywczy', bakery: 'Piekarnia', clothes: 'Sklep odzieżowy',
  books: 'Księgarnia', electronics: 'Elektronika', hairdresser: 'Fryzjer',
  beauty: 'Salon piękności', florist: 'Kwiaciarnia', museum: 'Muzeum',
  gallery: 'Galeria', bank: 'Bank', atm: 'Bankomat', dentist: 'Dentysta',
  school: 'Szkoła', university: 'Uczelnia', parking: 'Parking',
  fuel: 'Stacja paliw', bicycle: 'Sklep rowerowy', sports: 'Sklep sportowy',
  food_court: 'Food Court', ice_cream: 'Lodziarnia', confectionery: 'Cukiernia',
};

function shortAddress(displayName: string): string {
  const parts = displayName.split(',');
  return parts.slice(0, 3).join(',').trim();
}

function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const SEARCH_TERMS = [
  'restauracja', 'kawiarnia', 'bar', 'pub', 'fast food',
  'sklep', 'apteka', 'gym', 'fryzjer', 'salon',
  'hotel', 'bank', 'parking', 'kino', 'teatr',
  'supermarket', 'piekarnia', 'cukiernia', 'lodziarnia',
];

export async function fetchNearbyPlaces(
  lat: number, lon: number, radiusKm: number, textFilter: string
): Promise<SearchResult[]> {
  const delta = radiusKm / 111;
  const viewbox = `${lon - delta},${lat + delta},${lon + delta},${lat - delta}`;

  const terms = textFilter === 'jedzenie'
    ? ['restauracja', 'kawiarnia', 'fast food', 'bar', 'piekarnia', 'cukiernia', 'lodziarnia']
    : textFilter
    ? [textFilter]
    : SEARCH_TERMS.slice(0, 8);

  const allResults = new Map<string, SearchResult>();

  await Promise.all(
    terms.map(async (term) => {
      const params = new URLSearchParams({
        q: term,
        format: 'json',
        limit: '15',
        bounded: '1',
        viewbox,
        'accept-language': 'pl',
        addressdetails: '1',
      });

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?${params}`,
          { headers: HEADERS, next: { revalidate: 600 } }
        );
        if (!res.ok) return;
        const items: NominatimItem[] = await res.json();

        for (const item of items) {
          if (!item.display_name || allResults.has(item.place_id)) continue;

          const itemLat = parseFloat(item.lat);
          const itemLon = parseFloat(item.lon);
          const distance = haversine(lat, lon, itemLat, itemLon);
          if (distance > radiusKm) continue;

          const typeKey = item.type ?? item.class ?? '';
          const category = CATEGORY_MAP[typeKey] ?? capitalise(typeKey.replace(/_/g, ' '));
          const name = item.namedetails?.name ?? item.display_name.split(',')[0].trim();

          allResults.set(item.place_id, {
            type: 'Business',
            name,
            description: `${category} • ${shortAddress(item.display_name)}`,
            category,
            address: shortAddress(item.display_name),
            distance,
            tags: [typeKey.replace(/_/g, ' ')].filter(Boolean),
            image: undefined,
          });
        }
      } catch {
        // silently skip failed term
      }
    })
  );

  return [...allResults.values()].sort((a, b) => a.distance - b.distance);
}

function capitalise(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : 'Miejsce';
}

interface NominatimItem {
  place_id: string;
  lat: string;
  lon: string;
  display_name: string;
  type?: string;
  class?: string;
  namedetails?: { name?: string };
}

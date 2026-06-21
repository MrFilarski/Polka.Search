import type { SearchResult } from './types';

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

const CATEGORY_MAP: Record<string, string> = {
  restaurant: 'Restauracja', cafe: 'Kawiarnia', bar: 'Bar',
  pub: 'Pub', fast_food: 'Fast Food', food_court: 'Food Court',
  gym: 'Siłownia', fitness_centre: 'Fitness', sports_centre: 'Sport',
  cinema: 'Kino', theatre: 'Teatr', nightclub: 'Klub nocny',
  library: 'Biblioteka', bank: 'Bank', pharmacy: 'Apteka',
  hospital: 'Szpital', clinic: 'Klinika', dentist: 'Dentysta',
  hotel: 'Hotel', hostel: 'Hostel', supermarket: 'Supermarket',
  marketplace: 'Targ', market: 'Targ', convenience: 'Sklep',
  bakery: 'Piekarnia', butcher: 'Rzeźnik', clothes: 'Odzież',
  books: 'Księgarnia', electronics: 'Elektronika', hairdresser: 'Fryzjer',
  beauty: 'Salon piękności', florist: 'Kwiaciarnia', bicycle: 'Rower',
  museum: 'Muzeum', gallery: 'Galeria', place_of_worship: 'Kościół',
  park: 'Park', playground: 'Plac zabaw',
};

function getCategory(tags: Record<string, string>): string {
  for (const key of ['amenity', 'shop', 'leisure', 'tourism']) {
    const val = tags[key];
    if (val && CATEGORY_MAP[val]) return CATEGORY_MAP[val];
    if (val) return val.replace(/_/g, ' ');
  }
  return 'Miejsce';
}

function getTags(tags: Record<string, string>): string[] {
  const out: string[] = [];
  if (tags.cuisine) out.push(...tags.cuisine.split(';').map(s => s.trim()));
  if (tags.amenity) out.push(tags.amenity.replace(/_/g, ' '));
  if (tags.shop) out.push(tags.shop.replace(/_/g, ' '));
  if (tags.leisure) out.push(tags.leisure.replace(/_/g, ' '));
  if (tags['opening_hours']) out.push('otwarte');
  return out.slice(0, 5);
}

function buildAddress(tags: Record<string, string>): string {
  const parts = [];
  if (tags['addr:street']) {
    parts.push(tags['addr:street'] + (tags['addr:housenumber'] ? ' ' + tags['addr:housenumber'] : ''));
  }
  if (tags['addr:city']) parts.push(tags['addr:city']);
  return parts.join(', ') || 'Warsaw';
}

function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function buildQuery(lat: number, lon: number, radiusM: number, filter: string): string {
  const a = `(around:${radiusM},${lat},${lon})`;
  const base = `[out:json][timeout:25];\n(\n`;
  const foot = `);\nout center tags 80;`;

  if (filter === 'jedzenie') return `${base}  node["name"]["amenity"~"restaurant|cafe|bar|pub|fast_food|food_court|ice_cream|bakery|confectionery"]${a};\n  way["name"]["amenity"~"restaurant|cafe|bar|pub|fast_food"]${a};\n${foot}`;
  if (filter === 'bary')    return `${base}  node["name"]["amenity"~"bar|pub|nightclub|cafe"]${a};\n  way["name"]["amenity"~"bar|pub|nightclub"]${a};\n${foot}`;
  if (filter === 'fitness') return `${base}  node["name"]["amenity"~"gym|fitness_centre|sports_centre"]${a};\n  node["name"]["leisure"~"fitness_centre|sports_centre|swimming_pool"]${a};\n${foot}`;
  if (filter === 'kultura') return `${base}  node["name"]["amenity"~"cinema|theatre|arts_centre|library|museum"]${a};\n  node["name"]["tourism"~"museum|gallery|attraction|viewpoint"]${a};\n${foot}`;
  if (filter === 'sklepy')  return `${base}  node["name"]["shop"]${a};\n  way["name"]["shop"]${a};\n${foot}`;

  return `${base}  node["name"]["amenity"~"restaurant|cafe|bar|pub|fast_food|bakery|gym|cinema|theatre|pharmacy|hotel|library|nightclub|museum|dentist|hairdresser|beauty|fitness_centre|sports_centre"]${a};\n  node["name"]["shop"~"supermarket|convenience|clothes|electronics|books|sports|bakery|florist|hairdresser|beauty|optician|bicycle|confectionery"]${a};\n  node["name"]["tourism"~"museum|gallery|attraction|hotel|hostel|viewpoint"]${a};\n  way["name"]["amenity"~"restaurant|cafe|bar|pub|cinema|theatre|museum"]${a};\n${foot}`;
}

export async function fetchNearbyPlaces(
  lat: number, lon: number, radiusKm: number, textFilter: string
): Promise<SearchResult[]> {
  const radiusM = Math.min(radiusKm * 1000, 5000);
  const query = buildQuery(lat, lon, radiusM, textFilter);

  const res = await fetch(OVERPASS_URL, {
    method: 'POST',
    body: 'data=' + encodeURIComponent(query),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    next: { revalidate: 300 },
  });

  if (!res.ok) throw new Error(`Overpass error: ${res.status}`);
  const data = await res.json();

  const seen = new Set<string>();
  const results: SearchResult[] = [];

  for (const el of data.elements ?? []) {
    const tags: Record<string, string> = el.tags ?? {};
    const name: string = tags.name;
    if (!name) continue;

    const elLat: number = el.lat ?? el.center?.lat;
    const elLon: number = el.lon ?? el.center?.lon;
    if (!elLat || !elLon) continue;

    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    const distance = haversine(lat, lon, elLat, elLon);
    if (distance > radiusKm * 1.05) continue;

    const category = getCategory(tags);
    const address = buildAddress(tags);
    const elTags = getTags(tags);

    results.push({
      type: 'Business',
      name,
      description: tags.cuisine ? `${category} · ${tags.cuisine.split(';')[0].trim()}` : category,
      category,
      address,
      distance,
      tags: elTags,
      image: undefined,
      lat: elLat,
      lon: elLon,
      phone: tags.phone ?? tags['contact:phone'],
    });
  }

  return results.sort((a, b) => a.distance - b.distance);
}

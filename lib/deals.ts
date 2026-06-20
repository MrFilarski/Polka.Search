import type { SearchResult } from './types';

// Lokale z okolicy Mokotowa z realistycznymi zniżkami
const DEALS = [
  {
    name: 'Sushi Rock',
    deal: '20% rabatu na zestawy lunchowe 12:00–15:00',
    category: 'Restauracja',
    address: 'Cybernetyki 7C, Warszawa',
    lat: 52.1748, lon: 20.9971, discount: '–20%',
    tags: ['sushi', 'lunch', 'zniżka'],
  },
  {
    name: 'Papa John\'s',
    deal: 'Kup 2 pizze, trzecią dostaniesz gratis',
    category: 'Fast Food',
    address: 'Cybernetyki 7, Warszawa',
    lat: 52.1752, lon: 20.9968, discount: '3 za 2',
    tags: ['pizza', 'gratis', 'zniżka'],
  },
  {
    name: 'Ha Noi 2',
    deal: 'Danie dnia z napojem za 24,90 zł',
    category: 'Fast Food',
    address: 'Cybernetyki 7, Warszawa',
    lat: 52.1750, lon: 20.9965, discount: '24,90 zł',
    tags: ['wietnamska', 'lunch', 'zestaw'],
  },
  {
    name: 'Malatang',
    deal: '-15% przy zamówieniu przez aplikację',
    category: 'Restauracja',
    address: 'Cybernetyki 7, Warszawa',
    lat: 52.1749, lon: 20.9963, discount: '–15%',
    tags: ['azjatycka', 'app', 'zniżka'],
  },
  {
    name: 'Galeria Mokotów',
    deal: 'Parking gratis pierwsze 2 godziny w weekendy',
    category: 'Centrum handlowe',
    address: 'Wołoska 12, Warszawa',
    lat: 52.1796, lon: 21.0003, discount: 'Gratis',
    tags: ['parking', 'weekend', 'galeria'],
  },
  {
    name: 'McDonald\'s',
    deal: 'BigMac za 9,90 zł w aplikacji (co środę)',
    category: 'Fast Food',
    address: 'Wołoska 12, Warszawa',
    lat: 52.1793, lon: 20.9998, discount: '9,90 zł',
    tags: ['burger', 'środa', 'app'],
  },
];

function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function fetchNearbyDeals(
  lat: number, lon: number, radiusKm: number
): SearchResult[] {
  return DEALS
    .map(d => ({
      type: 'Business' as const,
      name: `${d.discount} · ${d.name}`,
      description: d.deal,
      category: d.category,
      address: d.address,
      distance: haversine(lat, lon, d.lat, d.lon),
      tags: d.tags,
      image: undefined,
    }))
    .filter(d => d.distance <= radiusKm)
    .sort((a, b) => a.distance - b.distance);
}

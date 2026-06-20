import type { SearchCriteria, SearchResult } from './types';
import { businesses, events } from './data';

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function matchesText(value: string, filter: string): boolean {
  return !filter || value.toLowerCase().includes(filter);
}

export function search(criteria: SearchCriteria): SearchResult[] {
  const filter = (criteria.query ?? '').trim().toLowerCase();
  const { latitude, longitude, radius } = criteria;
  const results: SearchResult[] = [];

  for (const b of businesses) {
    const matches =
      matchesText(b.name, filter) ||
      matchesText(b.description, filter) ||
      matchesText(b.category, filter) ||
      b.tags.some((t) => t.toLowerCase().includes(filter));
    if (!matches) continue;
    const distance = haversineKm(latitude, longitude, b.location.latitude, b.location.longitude);
    if (distance <= radius) {
      results.push({ type: 'Business', name: b.name, description: b.description, category: b.category, address: b.address, distance, tags: b.tags, image: b.image, lat: b.location.latitude, lon: b.location.longitude });
    }
  }

  const now = new Date();
  for (const e of events) {
    if (new Date(e.startDateTime) < now) continue;
    const matches =
      matchesText(e.name, filter) ||
      matchesText(e.description, filter) ||
      matchesText(e.category, filter) ||
      e.tags.some((t) => t.toLowerCase().includes(filter));
    if (!matches) continue;
    const distance = haversineKm(latitude, longitude, e.location.latitude, e.location.longitude);
    if (distance <= radius) {
      results.push({ type: 'Event', name: e.name, description: e.description, category: e.category, address: e.address, distance, eventDate: e.startDateTime, tags: e.tags, image: e.image, lat: e.location.latitude, lon: e.location.longitude });
    }
  }

  return results.sort((a, b) => a.distance - b.distance);
}

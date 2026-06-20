import type { Business, Event, BusinessUpdate } from './types';

const now = new Date();
const daysFromNow = (d: number) => new Date(now.getTime() + d * 86400000).toISOString();
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600000).toISOString();

export const businesses: Business[] = [
  {
    name: 'Polka Books & Coffee',
    description: 'Local bookstore and cafe with community events. Cozy reading nooks, specialty brews, and weekly author meetups.',
    category: 'Cafe & Bookstore',
    address: '10 Main Street, Warsaw',
    location: { latitude: 52.23, longitude: 21.01 },
    tags: ['books', 'coffee', 'community', 'local'],
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
  },
  {
    name: 'Polka Fitness Studio',
    description: 'Neighborhood gym with classes for all levels. Personal trainers, group yoga, spinning, and more.',
    category: 'Fitness',
    address: '90 Park Avenue, Warsaw',
    location: { latitude: 52.2315, longitude: 21.015 },
    tags: ['gym', 'wellness', 'classes', 'local'],
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80',
  },
  {
    name: 'Polka Farmers Market',
    description: 'Fresh local produce and craft stalls every weekend. Over 40 vendors, seasonal goods, and homemade products.',
    category: 'Market',
    address: '2 Market Square, Warsaw',
    location: { latitude: 52.229, longitude: 21.0145 },
    tags: ['food', 'market', 'weekend', 'community'],
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600&q=80',
  },
  {
    name: 'Neon Ramen Bar',
    description: 'Authentic Japanese ramen with hand-pulled noodles and rich broths. Open late every night.',
    category: 'Restaurant',
    address: '55 Neon Street, Warsaw',
    location: { latitude: 52.2302, longitude: 21.0108 },
    tags: ['ramen', 'japanese', 'food', 'late-night'],
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80',
  },
  {
    name: 'Vinyl & Beans',
    description: 'Record store meets specialty coffee shop. Browse thousands of vinyls while sipping single-origin espresso.',
    category: 'Cafe & Music',
    address: '12 Grove Avenue, Warsaw',
    location: { latitude: 52.2308, longitude: 21.0115 },
    tags: ['vinyl', 'music', 'coffee', 'local'],
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80',
  },
  {
    name: 'Craft & Bloom Florist',
    description: 'Handcrafted bouquets, seasonal arrangements, and floral workshops every Saturday morning.',
    category: 'Florist',
    address: '7 Bloom Lane, Warsaw',
    location: { latitude: 52.2298, longitude: 21.0133 },
    tags: ['flowers', 'gifts', 'workshops', 'local'],
    image: 'https://images.unsplash.com/photo-1487530811015-780f4b768c6d?w=600&q=80',
  },
];

export const events: Event[] = [
  {
    name: 'Polka Street Music Festival',
    description: 'Live music and street performances from local artists. Three stages, food trucks, and family activities.',
    category: 'Music Festival',
    address: '8 Main Street, Warsaw',
    location: { latitude: 52.2295, longitude: 21.0125 },
    startDateTime: daysFromNow(3),
    tags: ['music', 'festival', 'street', 'local'],
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80',
  },
  {
    name: 'Polka Startup Meetup',
    description: 'Networking event for founders, builders, and investors. Lightning talks, pitch session, and open networking.',
    category: 'Networking',
    address: '4 Innovation Avenue, Warsaw',
    location: { latitude: 52.228, longitude: 21.008 },
    startDateTime: daysFromNow(5),
    tags: ['startup', 'networking', 'business', 'local'],
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
  },
  {
    name: 'Polka Weekend Art Walk',
    description: 'Gallery tours and artist meetups in the neighborhood. Meet 20+ local artists and watch live demos.',
    category: 'Art Walk',
    address: '18 Art Lane, Warsaw',
    location: { latitude: 52.232, longitude: 21.013 },
    startDateTime: daysFromNow(2),
    tags: ['art', 'gallery', 'local', 'neighborhood'],
    image: 'https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=600&q=80',
  },
  {
    name: 'Street Food Saturday',
    description: 'Warsaw\'s biggest weekly street food gathering. 30+ vendors, craft beer garden, and live DJ sets.',
    category: 'Food Festival',
    address: '1 Central Park, Warsaw',
    location: { latitude: 52.2292, longitude: 21.011 },
    startDateTime: daysFromNow(1),
    tags: ['food', 'street-food', 'beer', 'weekend'],
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80',
  },
];

const iconFor = (type: string) =>
  type === 'deal' ? '🎯' : type === 'event' ? '📅' : '📰';

export const latestUpdates: BusinessUpdate[] = [
  { businessName: 'Café Artisan', category: 'Coffee', content: 'New summer menu available! Try our fresh iced lattes and refreshing smoothie bowls.', updateType: 'event', icon: iconFor('event'), postedAt: hoursAgo(2), likes: 142 },
  { businessName: 'Pizza Napoli', category: 'Restaurant', content: '50% OFF on all pizzas every Tuesday! Come and enjoy authentic Italian flavors.', updateType: 'deal', icon: iconFor('deal'), postedAt: hoursAgo(4), likes: 89 },
  { businessName: 'City Gym', category: 'Fitness', content: 'New yoga classes starting next week! Sign up now for 3 free trial sessions.', updateType: 'event', icon: iconFor('event'), postedAt: hoursAgo(6), likes: 210 },
  { businessName: 'The Book Corner', category: 'Bookstore', content: 'Best sellers are now 30% off. Find your next favorite book in our curated collection!', updateType: 'news', icon: iconFor('news'), postedAt: hoursAgo(8), likes: 65 },
  { businessName: 'Fresh Market', category: 'Grocery', content: 'Weekend special: Buy 2, Get 1 Free on all organic vegetables. Limited time offer!', updateType: 'deal', icon: iconFor('deal'), postedAt: hoursAgo(10), likes: 178 },
  { businessName: 'Tech Hub', category: 'Electronics', content: 'Grand opening this Saturday! Join us for free tech workshops and exclusive launch discounts.', updateType: 'event', icon: iconFor('event'), postedAt: hoursAgo(12), likes: 312 },
];

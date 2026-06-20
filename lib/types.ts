export interface Location {
  latitude: number;
  longitude: number;
}

export interface Business {
  name: string;
  description: string;
  category: string;
  address: string;
  location: Location;
  tags: string[];
  image?: string;
}

export interface Event {
  name: string;
  description: string;
  category: string;
  address: string;
  location: Location;
  startDateTime: string;
  tags: string[];
  image?: string;
}

export interface SearchResult {
  type: 'Business' | 'Event';
  name: string;
  description: string;
  category: string;
  address: string;
  distance: number;
  eventDate?: string;
  tags: string[];
  image?: string;
}

export interface BusinessUpdate {
  businessName: string;
  category: string;
  content: string;
  updateType: 'deal' | 'event' | 'news';
  icon: string;
  postedAt: string;
  likes: number;
}

export interface SearchCriteria {
  query: string;
  latitude: number;
  longitude: number;
  radius: number;
}

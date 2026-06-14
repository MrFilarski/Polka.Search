package com.polka.search.service;

import com.polka.search.model.Business;
import com.polka.search.model.Event;
import com.polka.search.model.Location;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SearchDataService {

    public List<Business> getBusinesses() {
        return List.of(
            new Business("Polka Books & Coffee", "Local bookstore and cafe with community events.", "Cafe & Bookstore", "10 Main Street, Warsaw", new Location(52.2300, 21.0100), List.of("books", "coffee", "community", "local")),
            new Business("Polka Fitness Studio", "Neighborhood gym with classes for all levels.", "Fitness", "90 Park Avenue, Warsaw", new Location(52.2315, 21.0150), List.of("gym", "wellness", "classes", "local")),
            new Business("Polka Farmers Market", "Fresh local produce and craft stalls every weekend.", "Market", "2 Market Square, Warsaw", new Location(52.2290, 21.0145), List.of("food", "market", "weekend", "community"))
        );
    }

    public List<Event> getEvents() {
        return List.of(
            new Event("Polka Street Music Festival", "Live music and street performances from local artists.", "Music Festival", "8 Main Street, Warsaw", new Location(52.2295, 21.0125), LocalDateTime.now().plusDays(3), List.of("music", "festival", "street", "local")),
            new Event("Polka Startup Meetup", "Networking event for founders, builders, and investors.", "Networking", "4 Innovation Avenue, Warsaw", new Location(52.2280, 21.0080), LocalDateTime.now().plusDays(5), List.of("startup", "networking", "business", "local")),
            new Event("Polka Weekend Art Walk", "Gallery tours and artist meetups in the neighborhood.", "Art Walk", "18 Art Lane, Warsaw", new Location(52.2320, 21.0130), LocalDateTime.now().plusDays(2), List.of("art", "gallery", "local", "neighborhood"))
        );
    }
}

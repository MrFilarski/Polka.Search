package com.polka.search.service;

import com.polka.search.model.Business;
import com.polka.search.model.Event;
import com.polka.search.model.Location;
import com.polka.search.model.SearchCriteria;
import com.polka.search.model.SearchResult;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
public class SearchService {

    public List<SearchResult> search(SearchCriteria criteria, SearchDataService dataService) {
        List<SearchResult> results = new ArrayList<>();
        String filter = criteria.getQuery() == null ? "" : criteria.getQuery().trim().toLowerCase(Locale.ROOT);

        for (Business business : dataService.getBusinesses()) {
            if (matchesBusiness(business, filter, criteria)) {
                double distance = calculateDistance(criteria.getLatitude(), criteria.getLongitude(), business.getLocation());
                if (distance <= criteria.getRadius()) {
                    results.add(new SearchResult(
                        "Business",
                        business.getName(),
                        business.getDescription(),
                        business.getCategory(),
                        business.getAddress(),
                        distance,
                        null,
                        business.getTags()
                    ));
                }
            }
        }

        for (Event event : dataService.getEvents()) {
            if (matchesEvent(event, filter, criteria) && !event.getStartDateTime().isBefore(LocalDateTime.now())) {
                double distance = calculateDistance(criteria.getLatitude(), criteria.getLongitude(), event.getLocation());
                if (distance <= criteria.getRadius()) {
                    results.add(new SearchResult(
                        "Event",
                        event.getName(),
                        event.getDescription(),
                        event.getCategory(),
                        event.getAddress(),
                        distance,
                        event.getStartDateTime(),
                        event.getTags()
                    ));
                }
            }
        }

        results.sort((a, b) -> a.getDistance().compareTo(b.getDistance()));
        return results;
    }

    private boolean matchesBusiness(Business business, String filter, SearchCriteria criteria) {
        return matchesText(business.getName(), filter)
            || matchesText(business.getDescription(), filter)
            || matchesText(business.getCategory(), filter)
            || business.getTags().stream().anyMatch(tag -> tag.toLowerCase(Locale.ROOT).contains(filter));
    }

    private boolean matchesEvent(Event event, String filter, SearchCriteria criteria) {
        return matchesText(event.getName(), filter)
            || matchesText(event.getDescription(), filter)
            || matchesText(event.getCategory(), filter)
            || event.getTags().stream().anyMatch(tag -> tag.toLowerCase(Locale.ROOT).contains(filter));
    }

    private boolean matchesText(String value, String filter) {
        return filter.isEmpty() || (value != null && value.toLowerCase(Locale.ROOT).contains(filter));
    }

    private double calculateDistance(Double searchLatitude, Double searchLongitude, Location location) {
        if (searchLatitude == null || searchLongitude == null) {
            return Double.MAX_VALUE;
        }
        double earthRadiusKm = 6371.0;
        double dLat = Math.toRadians(location.getLatitude() - searchLatitude);
        double dLon = Math.toRadians(location.getLongitude() - searchLongitude);
        double lat1 = Math.toRadians(searchLatitude);
        double lat2 = Math.toRadians(location.getLatitude());

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
            + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return earthRadiusKm * c;
    }
}

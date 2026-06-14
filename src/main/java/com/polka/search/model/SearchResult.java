package com.polka.search.model;

import java.time.LocalDateTime;
import java.util.List;

public class SearchResult {
    private String type;
    private String name;
    private String description;
    private String category;
    private String address;
    private Double distance;
    private LocalDateTime eventDate;
    private List<String> tags;

    public SearchResult(String type, String name, String description, String category, String address, Double distance, LocalDateTime eventDate, List<String> tags) {
        this.type = type;
        this.name = name;
        this.description = description;
        this.category = category;
        this.address = address;
        this.distance = distance;
        this.eventDate = eventDate;
        this.tags = tags;
    }

    public String getType() {
        return type;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public String getCategory() {
        return category;
    }

    public String getAddress() {
        return address;
    }

    public Double getDistance() {
        return distance;
    }

    public LocalDateTime getEventDate() {
        return eventDate;
    }

    public List<String> getTags() {
        return tags;
    }
}

package com.polka.search.model;

import java.time.LocalDateTime;
import java.util.List;

public class Event {
    private final String name;
    private final String description;
    private final String category;
    private final String address;
    private final Location location;
    private final LocalDateTime startDateTime;
    private final List<String> tags;

    public Event(String name, String description, String category, String address, Location location, LocalDateTime startDateTime, List<String> tags) {
        this.name = name;
        this.description = description;
        this.category = category;
        this.address = address;
        this.location = location;
        this.startDateTime = startDateTime;
        this.tags = tags;
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

    public Location getLocation() {
        return location;
    }

    public LocalDateTime getStartDateTime() {
        return startDateTime;
    }

    public List<String> getTags() {
        return tags;
    }
}

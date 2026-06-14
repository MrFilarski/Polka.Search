package com.polka.search.model;

import java.util.List;

public class Business {
    private final String name;
    private final String description;
    private final String category;
    private final String address;
    private final Location location;
    private final List<String> tags;

    public Business(String name, String description, String category, String address, Location location, List<String> tags) {
        this.name = name;
        this.description = description;
        this.category = category;
        this.address = address;
        this.location = location;
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

    public List<String> getTags() {
        return tags;
    }
}

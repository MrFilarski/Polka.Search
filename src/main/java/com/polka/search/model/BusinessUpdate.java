package com.polka.search.model;

import java.time.LocalDateTime;

public class BusinessUpdate {
    private String businessName;
    private String category;
    private String content;
    private String updateType; // "deal", "event", "news"
    private LocalDateTime postedAt;
    private int likes;
    private String icon;

    public BusinessUpdate(String businessName, String category, String content, String updateType, LocalDateTime postedAt, int likes) {
        this.businessName = businessName;
        this.category = category;
        this.content = content;
        this.updateType = updateType;
        this.postedAt = postedAt;
        this.likes = likes;
        this.icon = switch(updateType) {
            case "deal" -> "🎯";
            case "event" -> "📅";
            case "news" -> "📰";
            default -> "✨";
        };
    }

    public String getBusinessName() {
        return businessName;
    }

    public void setBusinessName(String businessName) {
        this.businessName = businessName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getUpdateType() {
        return updateType;
    }

    public void setUpdateType(String updateType) {
        this.updateType = updateType;
    }

    public LocalDateTime getPostedAt() {
        return postedAt;
    }

    public void setPostedAt(LocalDateTime postedAt) {
        this.postedAt = postedAt;
    }

    public int getLikes() {
        return likes;
    }

    public void setLikes(int likes) {
        this.likes = likes;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }
}

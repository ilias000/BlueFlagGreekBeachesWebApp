package com.BlueFlagGreekBeaches.entity;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;

@Entity
public class PointOfInterest
{
    @Id
    @GeneratedValue
    @Column(name = "id", nullable = false)
    private UUID id;

    @Column(name = "timestamp_added", nullable = false)
    private long timestampAdded;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description")
    private String description;

    @Column(name = "latitude", nullable = false)
    private double latitude;

    @Column(name = "longitude", nullable = false)
    private double longitude;

    @Column(name = "keywords")
    private List<String> keywords = new ArrayList<>();

    @ManyToMany
    @JoinTable(name = "point_of_interest_categories",
            joinColumns = @JoinColumn(name = "point_of_interest_id"),
            inverseJoinColumns = @JoinColumn(name = "categories_id"))
    private List<Category> categories = new ArrayList<>();

    public List<Category> getCategories() {return categories;}

    public void setCategories(List<Category> categories) {this.categories = categories;}

    public UUID getId()
    {
        return id;
    }

    public long getTimestampAdded()
    {
        return timestampAdded;
    }

    public void setTimestampAdded(long timestampAdded)
    {
        this.timestampAdded = timestampAdded;
    }

    public String getTitle()
    {
        return title;
    }

    public void setTitle(String title)
    {
        this.title = title;
    }

    public String getDescription()
    {
        return description;
    }

    public void setDescription(String description)
    {
        this.description = description;
    }

    public double getLatitude()
    {
        return latitude;
    }

    public void setLatitude(double latitude)
    {
        this.latitude = latitude;
    }

    public double getLongitude()
    {
        return longitude;
    }

    public void setLongitude(double longitude)
    {
        this.longitude = longitude;
    }

    public List<String> getKeywords()
    {
        return keywords;
    }

    public void setKeywords(List<String> keywords)
    {
        this.keywords = keywords;
    }
}

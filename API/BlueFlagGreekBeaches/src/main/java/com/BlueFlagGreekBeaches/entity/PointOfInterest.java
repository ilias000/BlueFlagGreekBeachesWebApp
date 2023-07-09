package com.BlueFlagGreekBeaches.entity;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class PointOfInterest
{
    @Id
    @GeneratedValue(strategy = GenerationType.UUID) // Instructs that a UUID for the entity should be generated automatically for us by the persistence provider.
    @Column(name = "id", nullable = false)
    private UUID id;

    @Column(name = "timestamp_added", nullable = false)
    private long timestampAdded;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description") // Optional
    private String description;

    @Column(name = "latitude", nullable = false)
    private double latitude;

    @Column(name = "longitude", nullable = false)
    private double longitude;

    @Column(name = "keywords") // Optional
    private List<String> keywords = new ArrayList<>();

    @ManyToMany // Optional
    @JoinTable(name = "point_of_interest_categories",
            joinColumns = @JoinColumn(name = "point_of_interest_id"),
            inverseJoinColumns = @JoinColumn(name = "categories_id"))
    private List<Category> categories = new ArrayList<>();  // When using a List, Hibernate removes all entities from the junction table and inserts the remaining ones. This can cause performance issues. We can easily avoid this problem by using Set.

    public PointOfInterest(long timestampAdded, String title, String description, double latitude, double longitude,
                           List<String> keywords, List<Category> categories)
    {
        this.timestampAdded = timestampAdded;
        this.title = title;
        this.description = description;
        this.latitude = latitude;
        this.longitude = longitude;
        this.keywords = keywords;
        this.categories = categories;
    }
}

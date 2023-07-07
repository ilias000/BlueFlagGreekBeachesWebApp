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
public class SaveSearch
{
    @Id
    @GeneratedValue(strategy = GenerationType.UUID) // Instructs that a UUID for the entity should be generated automatically for us by the persistence provider.
    @Column(name = "id", nullable = false)
    private UUID id;

    @Column(name = "title") // Optional
    private String title;

    @Column(name = "text") // Optional
    private String text;

    @Column(name = "keyword") // Optional
    private List<String> keywords;

    @Column(name = "category_ids") // Optional
    private List<Integer> categoryIds;

    @Column(name = "lat") // Optional
    private double lat;

    @Column(name = "lon") // Optional
    private double lon;

    @Column(name = "km") // Optional
    private int km;

    @ManyToMany @JoinTable(name = "saved_search_users",
            joinColumns = @JoinColumn(name = "saved_search_id"),
            inverseJoinColumns = @JoinColumn(name = "users_id"))
    private List<User> users = new ArrayList<>();

    public SaveSearch(List<String> keywords, List<Integer> categoryIds, double lat, double lon, int km)
    {
        this.keywords = keywords;
        this.categoryIds = categoryIds;
        this.lat = lat;
        this.lon = lon;
        this.km = km;
    }
}

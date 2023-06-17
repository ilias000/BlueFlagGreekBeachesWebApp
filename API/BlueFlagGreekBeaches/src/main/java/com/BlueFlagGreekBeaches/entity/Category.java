package com.BlueFlagGreekBeaches.entity;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;

@Entity
public class Category
{
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false)
    private UUID id;

    @Column(name = "name", nullable = false)
    private String name;

    @ManyToMany(mappedBy = "categories")
    private List<PointOfInterest> pointOfInterests = new ArrayList<>();

    public List<PointOfInterest> getPointOfInterests() {return pointOfInterests;}

    public void setPointOfInterests(List<PointOfInterest> pointOfInterests) {this.pointOfInterests = pointOfInterests;}

    public String getName() {return name;}

    public void setName(String name) {this.name = name;}

    public UUID getId() {return id;}
}

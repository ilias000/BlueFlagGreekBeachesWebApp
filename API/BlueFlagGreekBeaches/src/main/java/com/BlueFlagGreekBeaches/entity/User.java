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
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID) // Instructs that a UUID for the entity should be generated automatically for us by the persistence provider.
    @Column(name = "id", nullable = false)
    private UUID id;

    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "is_admin", nullable = false)
    private Boolean isAdmin = false;

    @ManyToMany(mappedBy = "users")
    private List<SaveSearch> saveSearches = new ArrayList<>();  // When using a List, Hibernate removes all entities from the junction table and inserts the remaining ones. This can cause performance issues. We can easily avoid this problem by using Set.

    public User(String email, String password)
    {
        this.email = email;
        this.password = password;
    }
}
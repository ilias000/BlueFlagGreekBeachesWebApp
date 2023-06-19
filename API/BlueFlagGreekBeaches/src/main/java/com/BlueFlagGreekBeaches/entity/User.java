package com.BlueFlagGreekBeaches.entity;

import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID) // Instructs that a UUID for the entity should be generated automatically for us by the persistence provider.
    private UUID id;

    private String email;

    private String password;

    public User(String email, String password)
    {
        this.email = email;
        this.password = password;
    }
}
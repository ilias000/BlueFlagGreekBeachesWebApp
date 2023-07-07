package com.BlueFlagGreekBeaches.repository;

import java.util.UUID;

import com.BlueFlagGreekBeaches.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, UUID>
{
    boolean existsUserByEmail(String email);
}
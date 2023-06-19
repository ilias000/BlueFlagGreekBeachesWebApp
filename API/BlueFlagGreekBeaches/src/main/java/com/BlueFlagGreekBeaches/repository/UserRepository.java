package com.BlueFlagGreekBeaches.repository;

import java.util.UUID;

import com.BlueFlagGreekBeaches.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, UUID>
{
}
package com.BlueFlagGreekBeaches.repository;

import java.util.UUID;

import com.BlueFlagGreekBeaches.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, UUID>
{
}

package com.BlueFlagGreekBeaches.repository;

import java.util.UUID;

import com.BlueFlagGreekBeaches.entity.PointOfInterest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PointOfInterestRepository extends JpaRepository<PointOfInterest, UUID>
{
}

package com.BlueFlagGreekBeaches.repository;

import java.util.List;
import java.util.UUID;

import com.BlueFlagGreekBeaches.entity.SaveSearch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface SaveSearchRepository extends JpaRepository<SaveSearch, UUID>
{
    @Query("SELECT s FROM SaveSearch s WHERE s.keywords = ?1 AND s.categoryIds = ?2 AND s.lat = ?3 AND s.lon = ?4 AND s.km = ?5")
    SaveSearch findSaveSearch(List<String> keywords, List<Integer> categoryIds, double lat, double lon, int km);
}

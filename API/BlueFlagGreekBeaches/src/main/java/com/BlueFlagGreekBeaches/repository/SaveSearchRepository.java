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
    @Query("SELECT s FROM SaveSearch s WHERE s.title = :title AND s.text = :text AND s.keywords = :keywords AND s.categoryIds = :categoryIds AND s.lat = :lat AND s.lon = :lon AND s.km = :km")
    SaveSearch findSaveSearch(String title, String text, List<String> keywords, List<Integer> categoryIds, double lat, double lon, int km);
    @Query("SELECT s FROM SaveSearch s JOIN s.users u WHERE u.isAdmin = false")
    List<SaveSearch> findAllForNonAdminUsers();

    SaveSearch findByTitle(String title);
}

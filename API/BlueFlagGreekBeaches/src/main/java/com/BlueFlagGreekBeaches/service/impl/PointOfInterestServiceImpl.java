package com.BlueFlagGreekBeaches.service.impl;

import com.BlueFlagGreekBeaches.dto.pointOfInterest.ResponsePointOfInterest;
import com.BlueFlagGreekBeaches.dto.saveSearch.AddSaveSearchDto;
import com.BlueFlagGreekBeaches.dto.saveSearch.GetSaveSearchDto;
import com.BlueFlagGreekBeaches.dto.saveSearch.SaveSearchResponseDto;
import com.BlueFlagGreekBeaches.dto.user.GetUserDto;
import com.BlueFlagGreekBeaches.entity.PointOfInterest;
import com.BlueFlagGreekBeaches.dto.pointOfInterest.SearchFilter;
import com.BlueFlagGreekBeaches.entity.SaveSearch;
import com.BlueFlagGreekBeaches.entity.User;
import com.BlueFlagGreekBeaches.repository.PointOfInterestRepository;
import com.BlueFlagGreekBeaches.repository.SaveSearchRepository;
import com.BlueFlagGreekBeaches.repository.UserRepository;
import com.BlueFlagGreekBeaches.service.PointOfInterestService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PointOfInterestServiceImpl implements PointOfInterestService {

    private final SaveSearchRepository saveSearchRepository;
    private final PointOfInterestRepository pointOfInterestRepository;
    private final EntityManager entityManager;
    private final UserRepository userRepository;

    public PointOfInterestServiceImpl(SaveSearchRepository saveSearchRepository, PointOfInterestRepository pointOfInterestRepository, EntityManager entityManager,
                                      UserRepository userRepository) {
        this.saveSearchRepository = saveSearchRepository;
        this.pointOfInterestRepository = pointOfInterestRepository;
        this.entityManager = entityManager;
        this.userRepository = userRepository;
    }

    public List<ResponsePointOfInterest> searchPointsOfInterest(int start, int count, String text, SearchFilter filters) {
        // Construct the custom query based on the provided criteria
        StringBuilder queryBuilder = new StringBuilder("SELECT p FROM PointOfInterest p WHERE 1 = 1");

        if (text != null && !text.isEmpty()) {
            queryBuilder.append(" AND (p.title LIKE :text OR p.description LIKE :text)");
        }
        if (filters != null) {
            if (filters.getDistance() != null) {
                //https://aaronfrancis.com/2021/efficient-distance-querying-in-my-sql
               queryBuilder.append ("AND  ST_Distance_Sphere(point(longitude, latitude), point(:lon,:lat )) <= :km * 1000");
            }
//            if (filters.getKeywords() != null && !filters.getKeywords().isEmpty()) {
//
//                queryBuilder.append(" AND p.keywords IN :keywordList");
//            }
            if (filters.getCategoryIds() != null && !filters.getCategoryIds().isEmpty()) {
                queryBuilder.append(" AND EXISTS (SELECT cp FROM p.categories cp WHERE cp.categoryId IN :categoryIds)");
            }

        }

       TypedQuery<PointOfInterest> query = entityManager.createQuery(queryBuilder.toString(), PointOfInterest.class);
        if (text != null && !text.isEmpty()) {
            query.setParameter("text", "%" + text + "%");
        }
        if (filters != null) {
            if (filters.getDistance() != null) {
                query.setParameter("lon", filters.getDistance().getLon());
                query.setParameter("lat", filters.getDistance().getLat());
                query.setParameter("km", filters.getDistance().getKm());
            }
//            if (filters.getKeywords() != null && !filters.getKeywords().isEmpty()) {
//                //not working
//                List<String> keywordList = filters.getKeywords();
//                query.setParameter("keywordList", keywordList);
//            }


            if (filters.getCategoryIds() != null && !filters.getCategoryIds().isEmpty()) {
                List<Integer> categoryIds = filters.getCategoryIds();
                query.setParameter("categoryIds", categoryIds);
            }
        }
        queryBuilder.append(" ORDER BY p.title");
        // Apply pagination
         query.setFirstResult(start);
         query.setMaxResults(count);



        List<PointOfInterest> results = query.getResultList();
        List<ResponsePointOfInterest> dtos = convertToDTOs(results);
        return dtos;
    }
    public int getTotalPointsOfInterest(String text, SearchFilter filters) {
        StringBuilder queryBuilder = new StringBuilder("SELECT COUNT(p) FROM PointOfInterest p WHERE 1 = 1 ");

        if (text != null && !text.isEmpty()) {
            queryBuilder.append(" AND (p.title LIKE :text OR p.description LIKE :text)");
        }
        if (filters != null) {
            if (filters.getDistance() != null) {
                queryBuilder.append ("AND  ST_Distance_Sphere(point(longitude, latitude), point(:lon,:lat )) <= :km * 1000");
            }
            if (filters.getCategoryIds() != null && !filters.getCategoryIds().isEmpty()) {
                queryBuilder.append(" AND EXISTS (SELECT cp FROM p.categories cp WHERE cp.categoryId IN :categoryIds)");
            }
        }

        TypedQuery<Long> query = entityManager.createQuery(queryBuilder.toString(), Long.class);
        if (text != null && !text.isEmpty()) {
            query.setParameter("text", "%" + text + "%");
        }
        if (filters != null) {
            if (filters.getDistance() != null) {
                query.setParameter("lon", filters.getDistance().getLon());
                query.setParameter("lat", filters.getDistance().getLat());
                query.setParameter("km", filters.getDistance().getKm());
            }
            if (filters.getCategoryIds() != null && !filters.getCategoryIds().isEmpty()) {
                query.setParameter("categoryIds", filters.getCategoryIds());
            }
        }

        return query.getSingleResult().intValue();
    }

    public ResponseEntity<SaveSearchResponseDto> saveSearch(AddSaveSearchDto addSaveSearchDto, String email)
    {
        if(addSaveSearchDto.title().isEmpty() && addSaveSearchDto.text().isEmpty() && addSaveSearchDto.keywords().isEmpty() && addSaveSearchDto.categoryIds().isEmpty() && addSaveSearchDto.lat() == 0 && addSaveSearchDto.lon() == 0 && addSaveSearchDto.km() == 0)
        {
            return ResponseEntity.badRequest().body(new SaveSearchResponseDto(null, "All fields are empty"));
        }

        User user = userRepository.findByEmail(email);
        if(user == null)
        {
            return ResponseEntity.badRequest().body(new SaveSearchResponseDto(null, "User does not exist"));
        }

        SaveSearch existedSaveSearch = saveSearchRepository.findSaveSearch(addSaveSearchDto.title(), addSaveSearchDto.text(), addSaveSearchDto.keywords(), addSaveSearchDto.categoryIds(), addSaveSearchDto.lat(), addSaveSearchDto.lon(), addSaveSearchDto.km());
        if(existedSaveSearch == null)
        {
            SaveSearch saveSearch = new SaveSearch(addSaveSearchDto.title(), addSaveSearchDto.text(), addSaveSearchDto.keywords(), addSaveSearchDto.categoryIds(), addSaveSearchDto.lat(), addSaveSearchDto.lon(), addSaveSearchDto.km());
            List<User> users = new ArrayList<>();
            return updateUsersSaveSearch(user, saveSearch, users);
        }
        else
        {
            List<User> users = existedSaveSearch.getUsers();
            if(users.contains(user))
            {
                return ResponseEntity.badRequest().body(new SaveSearchResponseDto(null, "Search is already saved for user with email: " + user.getEmail()));
            }
            return updateUsersSaveSearch(user, existedSaveSearch, users);
        }
    }

    private ResponseEntity<SaveSearchResponseDto> updateUsersSaveSearch(User user, SaveSearch existedSaveSearch,
                                                                       List<User> users)
    {
        users.add(user);
        existedSaveSearch.setUsers(users);
        SaveSearch response = saveSearchRepository.save(existedSaveSearch);
        List<GetUserDto> getUserDtoList = response.getUsers().stream().map(u -> new GetUserDto(u.getEmail(), u.getIsAdmin())).toList();
        GetSaveSearchDto getSaveSearchDto = new GetSaveSearchDto(response.getTitle(), response.getText(), response.getKeywords(), response.getCategoryIds(), response.getLat(), response.getLon(), response.getKm(), getUserDtoList);
        return ResponseEntity.ok(new SaveSearchResponseDto(getSaveSearchDto, "Search for user with email: " + user.getEmail() + " saved successfully"));
    }


    private List<ResponsePointOfInterest> convertToDTOs(List<PointOfInterest> results) {

        List<ResponsePointOfInterest> getPointOfIntereDtoList = results.stream().map(pointOfInterest -> new ResponsePointOfInterest(pointOfInterest.getTitle(),pointOfInterest.getDescription(), pointOfInterest.getLatitude(), pointOfInterest.getLongitude())).toList();
        return getPointOfIntereDtoList;
    }

}
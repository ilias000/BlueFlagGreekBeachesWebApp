package com.BlueFlagGreekBeaches.service.impl;

import com.BlueFlagGreekBeaches.dto.pointOfInterest.ResponsePointOfInterest;
import com.BlueFlagGreekBeaches.entity.PointOfInterest;
import com.BlueFlagGreekBeaches.dto.pointOfInterest.SearchFilter;
import com.BlueFlagGreekBeaches.repository.PointOfInterestRepository;
import com.BlueFlagGreekBeaches.service.PointOfInterestService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PointOfInterestServiceImpl implements PointOfInterestService {
    private final PointOfInterestRepository pointOfInterestRepository;
    private final EntityManager entityManager;
    public PointOfInterestServiceImpl(PointOfInterestRepository pointOfInterestRepository,EntityManager entityManager) {
        this.pointOfInterestRepository = pointOfInterestRepository;
        this.entityManager = entityManager;
    }

    public List<ResponsePointOfInterest> searchPointsOfInterest(int start, int count, String text, SearchFilter filters) {
        // Construct the custom query based on the provided criteria
        StringBuilder queryBuilder = new StringBuilder("SELECT p FROM PointOfInterest p WHERE 1 = 1 ");

        if (text != null && !text.isEmpty()) {
            queryBuilder.append(" AND (p.title LIKE :text OR p.description LIKE :text)");
        }
        if (filters != null) {
            if (filters.getDistance() != null) {
                //https://aaronfrancis.com/2021/efficient-distance-querying-in-my-sql
               queryBuilder.append ("AND ( ST_Distance_Sphere(point(longitude, latitude), point(:lon,:lat )) *.000621371192) <= :km");
            }
            if (filters.getKeywords() != null && !filters.getKeywords().isEmpty()) {

                queryBuilder.append(" AND p IN (SELECT p2 FROM PointOfInterest p2 JOIN p2.keywords k WHERE k IN :keywords)");
                //queryBuilder.append(" AND p.keywords  IN :keywords");
            }
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
            if (filters.getKeywords() != null && !filters.getKeywords().isEmpty()) {
                //not working
                List<String> keywordList = filters.getKeywords();
                query.setParameter("keywords", keywordList);
            }


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




    private List<ResponsePointOfInterest> convertToDTOs(List<PointOfInterest> results) {

        List<ResponsePointOfInterest> getPointOfIntereDtoList = results.stream().map(pointOfInterest -> new ResponsePointOfInterest(pointOfInterest.getTitle(),pointOfInterest.getDescription(), pointOfInterest.getLatitude(), pointOfInterest.getLongitude())).toList();
        return getPointOfIntereDtoList;
    }

}
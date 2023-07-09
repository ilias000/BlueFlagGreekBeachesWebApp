package com.BlueFlagGreekBeaches.controller;

import java.util.List;

import com.BlueFlagGreekBeaches.dto.pointOfInterest.ResponsePointOfInterest;
import com.BlueFlagGreekBeaches.dto.pointOfInterest.SearchFilter;
import com.BlueFlagGreekBeaches.dto.pointOfInterest.SearchRequest;
import com.BlueFlagGreekBeaches.dto.pointOfInterest.SearchResponsePoints;
import com.BlueFlagGreekBeaches.dto.saveSearch.AddSaveSearchDto;
import com.BlueFlagGreekBeaches.dto.saveSearch.SaveSearchResponseDto;
import com.BlueFlagGreekBeaches.service.PointOfInterestService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/pois")
public class PointOfInterestController {

    private final PointOfInterestService pointOfInterestService;

    public PointOfInterestController(PointOfInterestService pointOfInterestService)
    {
        this.pointOfInterestService = pointOfInterestService;
    }

    @PostMapping("/search")
    public ResponseEntity<SearchResponsePoints> searchPointsOfInterest(@RequestBody SearchRequest searchRequest) {
        // Extract search criteria from the request body
        int start = searchRequest.getStart();
        int count = searchRequest.getCount();
        String text = searchRequest.getText();
        SearchFilter filters = searchRequest.getFilters();

        // Perform the search using the extracted criteria
        List<ResponsePointOfInterest> points = pointOfInterestService.searchPointsOfInterest(start, count, text, filters);
        int total = pointOfInterestService.getTotalPointsOfInterest(text, filters);
        // Build the response
        SearchResponsePoints response = new SearchResponsePoints();
        response.setStart(start);
        response.setCount(count);
        response.setTotal(total);
        response.setData(points);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/saveSearch")
    public ResponseEntity<SaveSearchResponseDto> saveSearch(@RequestBody AddSaveSearchDto addSaveSearchDto, @RequestParam String email)
    {
        return pointOfInterestService.saveSearch(addSaveSearchDto, email);
    }
}

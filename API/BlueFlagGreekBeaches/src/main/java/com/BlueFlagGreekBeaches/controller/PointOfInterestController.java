package com.BlueFlagGreekBeaches.controller;

import java.util.List;

import com.BlueFlagGreekBeaches.dto.pointOfInterest.ResponsePointOfInterest;
import com.BlueFlagGreekBeaches.dto.pointOfInterest.SearchFilter;
import com.BlueFlagGreekBeaches.dto.pointOfInterest.SearchRequest;
import com.BlueFlagGreekBeaches.dto.pointOfInterest.SearchResponsePoints;
import com.BlueFlagGreekBeaches.dto.saveSearch.AddSaveSearchDto;
import com.BlueFlagGreekBeaches.dto.saveSearch.GetUsersSaveSearchesResponseDto;
import com.BlueFlagGreekBeaches.dto.saveSearch.SaveSearchResponseDto;
import com.BlueFlagGreekBeaches.service.PointOfInterestService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
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

        // Build the response
        SearchResponsePoints response = new SearchResponsePoints();
        response.setStart(start);
        response.setCount(count);
        response.setTotal(points.size());
        response.setData(points);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/saveSearch")
    public ResponseEntity<SaveSearchResponseDto> saveSearch(@RequestBody AddSaveSearchDto addSaveSearchDto, @RequestParam String email)
    {
        return pointOfInterestService.saveSearch(addSaveSearchDto, email);
    }

    @GetMapping("/getUsersSaveSearches")
    public ResponseEntity<GetUsersSaveSearchesResponseDto> getUsersSaveSearches(@RequestParam String email)
    {
        return pointOfInterestService.getUsersSaveSearches(email);
    }

    @DeleteMapping("/deleteSaveSearch")
    public ResponseEntity<String> deleteSaveSearch(@RequestParam String email, @RequestParam String title)
    {
        return pointOfInterestService.deleteSaveSearch(email, title);
    }
}

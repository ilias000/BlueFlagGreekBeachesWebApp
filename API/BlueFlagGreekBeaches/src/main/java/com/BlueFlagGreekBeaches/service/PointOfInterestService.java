package com.BlueFlagGreekBeaches.service;

import com.BlueFlagGreekBeaches.dto.pointOfInterest.ResponsePointOfInterest;
import com.BlueFlagGreekBeaches.dto.pointOfInterest.SearchFilter;
import com.BlueFlagGreekBeaches.dto.saveSearch.AddSaveSearchDto;
import com.BlueFlagGreekBeaches.dto.saveSearch.GetUsersSaveSearchesResponseDto;
import com.BlueFlagGreekBeaches.dto.saveSearch.SaveSearchResponseDto;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface PointOfInterestService {
    List<ResponsePointOfInterest> searchPointsOfInterest(int start, int count, String text, SearchFilter filters);

    ResponseEntity<SaveSearchResponseDto> saveSearch(AddSaveSearchDto addSaveSearchDto, String email);

    ResponseEntity<GetUsersSaveSearchesResponseDto> getUsersSaveSearches(String email);

    ResponseEntity<String> deleteSaveSearch(String email, String title);
}

package com.BlueFlagGreekBeaches.service;

import com.BlueFlagGreekBeaches.dto.imp.ImportCategoryCSVResponseDto;
import com.BlueFlagGreekBeaches.dto.imp.ImportPointsOfInterestCSVResponseDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

public interface ImportService
{
    // Imports points of interest from a CSV file.
    ResponseEntity<ImportPointsOfInterestCSVResponseDto> importPointsOfInterest(@RequestParam("file") MultipartFile file);

    // Imports categories from a CSV file.
    ResponseEntity<ImportCategoryCSVResponseDto> importCategories(@RequestParam("file") MultipartFile file);
}

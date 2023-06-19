package com.BlueFlagGreekBeaches.service;

import com.BlueFlagGreekBeaches.dto.CSVMessageDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

public interface ImportService
{
    ResponseEntity<CSVMessageDto> importPointsOfInterest(@RequestParam("file") MultipartFile file);

    ResponseEntity<CSVMessageDto> importCategories(@RequestParam("file") MultipartFile file);
}

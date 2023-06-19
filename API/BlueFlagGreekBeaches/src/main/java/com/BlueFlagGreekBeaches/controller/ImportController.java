package com.BlueFlagGreekBeaches.controller;

import com.BlueFlagGreekBeaches.dto.CSVMessageDto;
import com.BlueFlagGreekBeaches.service.ImportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/import")
public class ImportController
{
    private final ImportService importService;

    public ImportController(ImportService importService) {this.importService = importService;}

    @PostMapping("/pois")
    public ResponseEntity<CSVMessageDto> importPointsOfInterest(@RequestParam("file") MultipartFile file)
    {
        return importService.importPointsOfInterest(file);
    }

    @PostMapping("categories")
    public ResponseEntity<CSVMessageDto> importCategories(@RequestParam("file") MultipartFile file)
    {
        return importService.importCategories(file);
    }
}
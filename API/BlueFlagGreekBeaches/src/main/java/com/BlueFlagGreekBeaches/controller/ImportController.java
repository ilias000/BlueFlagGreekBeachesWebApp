package com.BlueFlagGreekBeaches.controller;

import com.BlueFlagGreekBeaches.dto.imp.ImportCategoryCSVResponseDto;
import com.BlueFlagGreekBeaches.dto.imp.ImportPointsOfInterestCSVResponseDto;
import com.BlueFlagGreekBeaches.helper.CSVHelper;
import com.BlueFlagGreekBeaches.service.ImportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/import")
public class ImportController
{
    private final ImportService importService;

    public ImportController(ImportService importService) {this.importService = importService;}

    @PostMapping("/pois")
    public ResponseEntity<ImportPointsOfInterestCSVResponseDto> importPointsOfInterest(@RequestParam("file") MultipartFile file)
    {
        if(CSVHelper.hasNotCSVFormat(file)){
            return ResponseEntity.badRequest().body(new ImportPointsOfInterestCSVResponseDto(null, "Please upload a csv file!"));
        }
        return importService.importPointsOfInterest(file);
    }

    @PostMapping("/categories")
    public ResponseEntity<ImportCategoryCSVResponseDto> importCategories(@RequestParam("file") MultipartFile file)
    {
        if(CSVHelper.hasNotCSVFormat(file)){
            return ResponseEntity.badRequest().body(new ImportCategoryCSVResponseDto(null, "Please upload a csv file!"));
        }
        return importService.importCategories(file);
    }


}
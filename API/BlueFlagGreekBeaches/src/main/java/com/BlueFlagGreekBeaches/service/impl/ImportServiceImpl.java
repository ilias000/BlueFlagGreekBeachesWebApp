package com.BlueFlagGreekBeaches.service.impl;

import com.BlueFlagGreekBeaches.dto.CSVMessageDto;
import com.BlueFlagGreekBeaches.service.ImportService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ImportServiceImpl implements ImportService
{
    @Override
    public ResponseEntity<CSVMessageDto> importPointsOfInterest(@RequestParam("file") MultipartFile file)
    {
        String message = "Uploaded the file successfully: " + file.getOriginalFilename();
        return ResponseEntity.status(HttpStatus.OK).body(new CSVMessageDto(message));
    }

    @Override
    public ResponseEntity<CSVMessageDto> importCategories(@RequestParam("file") MultipartFile file)
    {
        String message = "Uploaded the file successfully: " + file.getOriginalFilename();
        return ResponseEntity.status(HttpStatus.OK).body(new CSVMessageDto(message));
    }
}

package com.BlueFlagGreekBeaches.service.impl;

import java.util.List;

import com.BlueFlagGreekBeaches.dto.ImportCategoryCSVResponseDto;
import com.BlueFlagGreekBeaches.dto.GetCategoryDto;
import com.BlueFlagGreekBeaches.entity.Category;
import com.BlueFlagGreekBeaches.helper.CSVHelper;
import com.BlueFlagGreekBeaches.repository.CategoryRepository;
import com.BlueFlagGreekBeaches.service.ImportService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ImportServiceImpl implements ImportService
{
    private final CategoryRepository categoryRepository;

    public ImportServiceImpl(CategoryRepository categoryRepository) {this.categoryRepository = categoryRepository;}

    @Override
    public ResponseEntity<ImportCategoryCSVResponseDto> importPointsOfInterest(@RequestParam("file") MultipartFile file)
    {
        return null;
    }

    @Override
    public ResponseEntity<ImportCategoryCSVResponseDto> importCategories(@RequestParam("file") MultipartFile file)
    {
        List<Category> categories = CSVHelper.csvToAddCategoryDtoList(file).stream().map(addCategoryDto -> new Category(addCategoryDto.name())).toList();
        if(checkCategoriesListForDuplicates(categories)){
            return ResponseEntity.badRequest().body(new ImportCategoryCSVResponseDto(null, "The CSV file contains categories that already exist in the database!"));
        }
        List<Category> response = categoryRepository.saveAll(categories);
        List<GetCategoryDto> getCategoryDtoList = response.stream().map(category -> new GetCategoryDto(category.getName())).toList();
        String message = "Uploaded the file successfully: " + file.getOriginalFilename();
        return ResponseEntity.status(HttpStatus.OK).body(new ImportCategoryCSVResponseDto(getCategoryDtoList, message));
    }

    private boolean checkCategoriesListForDuplicates(List<Category> categories)
    {
        for (Category category : categories)
        {
            if(categoryRepository.existsByName(category.getName())){
                return true;
            }
        }
        return false;
    }
}

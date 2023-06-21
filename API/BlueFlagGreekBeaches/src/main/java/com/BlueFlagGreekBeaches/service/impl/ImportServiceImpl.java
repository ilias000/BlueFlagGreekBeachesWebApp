package com.BlueFlagGreekBeaches.service.impl;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.BlueFlagGreekBeaches.dto.category.AddCategoryDto;
import com.BlueFlagGreekBeaches.dto.category.GetCategoryDto;
import com.BlueFlagGreekBeaches.dto.pointOfInterest.AddPointOfInterestDto;
import com.BlueFlagGreekBeaches.dto.pointOfInterest.GetPointOfInterestDto;
import com.BlueFlagGreekBeaches.dto.imp.ImportCategoryCSVResponseDto;
import com.BlueFlagGreekBeaches.dto.imp.ImportPointsOfInterestCSVResponseDto;
import com.BlueFlagGreekBeaches.entity.Category;
import com.BlueFlagGreekBeaches.entity.PointOfInterest;
import com.BlueFlagGreekBeaches.helper.CSVHelper;
import com.BlueFlagGreekBeaches.repository.CategoryRepository;
import com.BlueFlagGreekBeaches.repository.PointOfInterestRepository;
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
    private final PointOfInterestRepository pointOfInterestRepository;

    public ImportServiceImpl(CategoryRepository categoryRepository, PointOfInterestRepository pointOfInterestRepository)
    {
        this.categoryRepository = categoryRepository;
        this.pointOfInterestRepository = pointOfInterestRepository;
    }

    // Imports points of interest from a CSV file.
    @Override
    public ResponseEntity<ImportPointsOfInterestCSVResponseDto> importPointsOfInterest(@RequestParam("file") MultipartFile file)
    {
        List<AddPointOfInterestDto> addPointOfInterestDtoList = CSVHelper.csvToAddPointOfInterestDtoList(file);

        if(addPointOfInterestDtoListIsNotValid(addPointOfInterestDtoList))
            return ResponseEntity.badRequest().body(new ImportPointsOfInterestCSVResponseDto(null, "The CSV file contains points of interest that are not valid!"));

        long timestampAdded = System.currentTimeMillis() / 1000L;

        List<PointOfInterest> pointsOfInterestList = new ArrayList<>();

        for (AddPointOfInterestDto addPointOfInterestDto : addPointOfInterestDtoList)
        {
            List<Category> categories = getCategoriesFromIds(addPointOfInterestDto.categoriesIds());
            if (categories == null)
                return ResponseEntity.badRequest().body(new ImportPointsOfInterestCSVResponseDto(null, "The CSV file contains points of interest with that does not exist in the database!"));

            PointOfInterest pointOfInterest = new PointOfInterest(timestampAdded ,addPointOfInterestDto.title(),
                                                                  addPointOfInterestDto.description() ,addPointOfInterestDto.latitude(),
                                                                  addPointOfInterestDto.longitude(), addPointOfInterestDto.keywords(),
                                                                  categories);
            pointsOfInterestList.add(pointOfInterest);
        }

        List<String> pointsOfInterestTitlesList = pointsOfInterestList.stream().map(PointOfInterest::getTitle).toList();

        if(stringListHasDuplicates(pointsOfInterestTitlesList))
            return ResponseEntity.badRequest().body(new ImportPointsOfInterestCSVResponseDto(null, "The CSV file contains points of interest with duplicate titles!"));

        if(pointsOfInterestAlreadyExist(pointsOfInterestTitlesList))
            return ResponseEntity.badRequest().body(new ImportPointsOfInterestCSVResponseDto(null, "The CSV file contains points of interest that already exist in the database!"));

        List<PointOfInterest> response = pointOfInterestRepository.saveAll(pointsOfInterestList);
        List<GetPointOfInterestDto> getPointOfInterestDtoList = response.stream().map(pointOfInterest -> new GetPointOfInterestDto(pointOfInterest.getTimestampAdded(), pointOfInterest.getTitle(),
                                                                                                                                   pointOfInterest.getDescription(), pointOfInterest.getLatitude(),
                                                                                                                                   pointOfInterest.getLongitude(), pointOfInterest.getKeywords(),
                                                                                                                                   convertCategoryListToGetCategoryDtoList(pointOfInterest.getCategories()))).toList();
        String message = "Uploaded the file successfully: " + file.getOriginalFilename();
        return ResponseEntity.status(HttpStatus.OK).body(new ImportPointsOfInterestCSVResponseDto(getPointOfInterestDtoList, message));
    }

    // Imports categories from a CSV file.
    @Override
    public ResponseEntity<ImportCategoryCSVResponseDto> importCategories(@RequestParam("file") MultipartFile file)
    {
        List<AddCategoryDto> addCategoryDtoList = CSVHelper.csvToAddCategoryDtoList(file);

        if(addCategoryDtoListIsNotValid(addCategoryDtoList))
            return ResponseEntity.badRequest().body(new ImportCategoryCSVResponseDto(null, "The CSV file contains categories that are not valid!"));

        List<Category> categoriesList = addCategoryDtoList.stream().map(addCategoryDto -> new Category(addCategoryDto.categoryId(), addCategoryDto.name())).toList();
        List<Integer> categoriesIdsList = categoriesList.stream().map(Category::getCategoryId).toList();
        List<String> categoriesNamesList = categoriesList.stream().map(Category::getName).toList();

        if(integerListHasDuplicates(categoriesIdsList))
            return ResponseEntity.badRequest().body(new ImportCategoryCSVResponseDto(null, "The CSV file contains categories with duplicate ids!"));

        if(stringListHasDuplicates(categoriesNamesList))
            return ResponseEntity.badRequest().body(new ImportCategoryCSVResponseDto(null, "The CSV file contains categories with duplicate names!"));

        if(categoriesAlreadyExist(categoriesIdsList, categoriesNamesList))
            return ResponseEntity.badRequest().body(new ImportCategoryCSVResponseDto(null, "The CSV file contains categories that already exist in the database!"));

        List<Category> response = categoryRepository.saveAll(categoriesList);
        List<GetCategoryDto> getCategoryDtoList = response.stream().map(category -> new GetCategoryDto(category.getCategoryId(), category.getName())).toList();
        String message = "Uploaded the file successfully: " + file.getOriginalFilename();
        return ResponseEntity.status(HttpStatus.OK).body(new ImportCategoryCSVResponseDto(getCategoryDtoList, message));
    }

    // Returns an empty list if the categoriesIds list is empty,
    // null if the categoriesIds list contains ids that does not exist in the database and
    // a list of categories if the categoriesIds list contains ids that exist in the database.
    private List<Category> getCategoriesFromIds(List<Integer> categoriesIds)
    {
        if(categoriesIds.isEmpty())
            return new ArrayList<>();

        List<Category> categoriesList = categoryRepository.findByCategoryIdIn(categoriesIds);
        if((long) categoriesIds.size() == (long) categoriesList.size()){
            return categoriesList;
        }
        else {
            return null;
        }
    }

    // Checks if a list of strings contains duplicates.
    private boolean stringListHasDuplicates(List<String> stringList)
    {
        Set<String> stringSet = new HashSet<>(stringList);
        return stringSet.size() != stringList.size();
    }

    // Checks if a list of integers contains duplicates.
    private boolean integerListHasDuplicates(List<Integer> integerList)
    {
        Set<Integer> integerSet = new HashSet<>(integerList);
        return integerSet.size() != integerList.size();
    }

    // Checks if the all the addCategoryDto objects in the list have all the required fields.
    private boolean addCategoryDtoListIsNotValid(List<AddCategoryDto> addCategoryDtoList)
    {
        for(AddCategoryDto addCategoryDto : addCategoryDtoList){
            if(addCategoryDto.categoryId() == -1 || addCategoryDto.name() == null || addCategoryDto.name().equals("") || addCategoryDto.name().equals(" ")){
                return true;
            }
        }
        return false;
    }

    // Checks if the categoriesIds list contains ids that exist in the database or if the categoriesNames list contains names that exist in the database.
    private boolean categoriesAlreadyExist(List<Integer> categoriesIdsList, List<String> categoriesNamesList)
    {
        return !categoryRepository.findByCategoryIdIn(categoriesIdsList).isEmpty() || !categoryRepository.findByNameIn(categoriesNamesList).isEmpty();
    }

    // Checks if the all the addPointOfInterestDto objects in the list have all the required fields.
    private boolean addPointOfInterestDtoListIsNotValid(List<AddPointOfInterestDto> addPointOfInterestDtoList)
    {
        for(AddPointOfInterestDto addPointOfInterestDto : addPointOfInterestDtoList){
            if(addPointOfInterestDto.title() == null || addPointOfInterestDto.title().isEmpty() || addPointOfInterestDto.title().equals(" ") ||
               addPointOfInterestDto.latitude() == 400.0 || addPointOfInterestDto.longitude() == 400.0){
                return true;
            }
        }
        return false;
    }

    private boolean pointsOfInterestAlreadyExist(List<String> pointsOfInterestTitlesList)
    {
        return !pointOfInterestRepository.findByTitleIn(pointsOfInterestTitlesList).isEmpty();
    }

    // Converts a list of categories to a list of getCategoryDto objects.
    private List<GetCategoryDto> convertCategoryListToGetCategoryDtoList(List<Category> categoriesList)
    {
        return categoriesList.stream().map(category -> new GetCategoryDto(category.getCategoryId(), category.getName())).toList();
    }
}

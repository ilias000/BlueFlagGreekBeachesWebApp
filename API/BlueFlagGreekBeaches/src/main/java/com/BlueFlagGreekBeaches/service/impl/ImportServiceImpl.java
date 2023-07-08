package com.BlueFlagGreekBeaches.service.impl;

import java.util.*;

import com.BlueFlagGreekBeaches.entity.User;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.SimpleMailMessage;

import com.BlueFlagGreekBeaches.dto.category.AddCategoryDto;
import com.BlueFlagGreekBeaches.dto.category.GetCategoryDto;
import com.BlueFlagGreekBeaches.dto.pointOfInterest.AddPointOfInterestDto;
import com.BlueFlagGreekBeaches.dto.pointOfInterest.GetPointOfInterestDto;
import com.BlueFlagGreekBeaches.dto.imp.ImportCategoryCSVResponseDto;
import com.BlueFlagGreekBeaches.dto.imp.ImportPointsOfInterestCSVResponseDto;
import com.BlueFlagGreekBeaches.entity.Category;
import com.BlueFlagGreekBeaches.entity.PointOfInterest;
import com.BlueFlagGreekBeaches.entity.SaveSearch;
import com.BlueFlagGreekBeaches.helper.CSVHelper;
import com.BlueFlagGreekBeaches.repository.CategoryRepository;
import com.BlueFlagGreekBeaches.repository.PointOfInterestRepository;
import com.BlueFlagGreekBeaches.repository.SaveSearchRepository;
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
    private final SaveSearchRepository searchRepository;
    private final JavaMailSender javaMailSender;
    public ImportServiceImpl(CategoryRepository categoryRepository, PointOfInterestRepository pointOfInterestRepository,SaveSearchRepository searchRepository,JavaMailSender javaMailSender)
    {
        this.categoryRepository = categoryRepository;
        this.pointOfInterestRepository = pointOfInterestRepository;
        this.searchRepository = searchRepository;
        this.javaMailSender  = javaMailSender;
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
                return ResponseEntity.badRequest().body(new ImportPointsOfInterestCSVResponseDto(null, "The CSV file contains points of interest with categories that does not exist in the database!"));

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
        String message = "Uploaded the file successfully: " + file.getOriginalFilename()+ ".";
        List<SaveSearch> saveSearchList = searchRepository.findAllForNonAdminUsers();
        if ( getPointOfInterestDtoList.size()>0 && saveSearchList.size() >0 )
        {
            List<SaveSearch> matchPointOfInterestsToSearchCriterias =matchPointOfInterestsToSearchCriterias(getPointOfInterestDtoList,saveSearchList);
            if( matchPointOfInterestsToSearchCriterias.size()> 0 )
            {
                List<String> usersInformed = sendMatchingSearchNotifications(matchPointOfInterestsToSearchCriterias);
                if ( usersInformed.size() > 0 )
                {
                    message += " The following emails, received notification";
                    for (String email : usersInformed) {
                        message += " Recipient: " + email;
                    }
                }
                else {
                    message += " No User received notification";
                }

            }
        }
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


    private List<SaveSearch> matchPointOfInterestsToSearchCriterias(List<GetPointOfInterestDto> pointOfInterestDtoList, List<SaveSearch> saveSearchList) {
        List<SaveSearch>  mathcingSearch = new ArrayList<>();
        for (SaveSearch criteria : saveSearchList) {
            System.out.println("Matching criteria: " + criteria.getTitle() + criteria.getUsers() );
            for (GetPointOfInterestDto poi : pointOfInterestDtoList) {
                if (matchesCriteria(poi, criteria)) {
                    mathcingSearch.add(criteria);
                    System.out.println("Match found: PointOfInterest ID = " + poi.description()+ criteria.getTitle() + criteria.getUsers());
                    break;
                }
            }
        }
        return mathcingSearch;
    }

    private boolean matchesCriteria(GetPointOfInterestDto poi, SaveSearch criteria) {
        // Compare poi attributes with criteria attributes
        // Return true if it's a match, false otherwise
        boolean matches = true;

        // Compare text
        if (criteria.getText() != null && !criteria.getText().isEmpty()) {
            matches &= (poi.description().toLowerCase().contains(criteria.getText().toLowerCase())
                    || poi.title().toLowerCase().contains(criteria.getText().toLowerCase()));
        }

        // Compare distance
        if (criteria.getKm() > 0 && criteria.getLat() != 0 && criteria.getLon() != 0 && matches ) {
            matches &= isWithinDistance(poi,criteria.getKm(),criteria.getLat(),criteria.getLon());
        }

        // Compare keywords
        if (criteria.getKeywords() != null && !criteria.getKeywords().isEmpty() && matches ) {
            List<String> poisKeys = poi.keywords();
            List<String> criteriaKeys = criteria.getKeywords();
            List<String> commonWords = new ArrayList<>(poisKeys);
            commonWords.retainAll(criteriaKeys);
            boolean hasCommonKey = !commonWords.isEmpty();
            matches &= hasCommonKey;
        }

        // Compare categoryIds
        if (criteria.getCategoryIds() != null && !criteria.getCategoryIds().isEmpty() && matches ) {
            List<GetCategoryDto> categories = poi.categories();
            List<Integer> categoryIds = categories.stream()
                    .map(GetCategoryDto::categoryId)
                    .toList();
            List<Integer> catIds = criteria.getCategoryIds();
            List<Integer> list1Copy = new ArrayList<>(categoryIds);
        // Retain only the common elements between list1Copy and categoryIds
            list1Copy.retainAll(catIds);

        // Check if there is at least one common number
            boolean hasCommonNumber = !list1Copy.isEmpty();
            matches &= hasCommonNumber;
        }

        return matches;
    }

    private boolean isWithinDistance(GetPointOfInterestDto poi, int km, double lat,double lon) {
         boolean withinDistance = false;
        double R = 6378137; // Earth's mean radius in kilometers

        double dLat = Math.toRadians(lat - poi.latitude());
        double dLon = Math.toRadians(lon - poi.longitude());

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat)) * Math.cos(Math.toRadians(lat))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        double d = (R * c) / 1000;// returns the distance in kilometers
        if (d <= km)
        {
            withinDistance = true;
        }
       return withinDistance;
    }


    private List<String> sendMatchingSearchNotifications(List<SaveSearch> matchPointOfInterestsToSearchCriterias)
    {
        List<String> emailsSend = new ArrayList<>();
        Map<User, List<String>> userTitleMap = new HashMap<>();
        for (SaveSearch saveSearch : matchPointOfInterestsToSearchCriterias) {
            for (User user : saveSearch.getUsers()) {
                userTitleMap.computeIfAbsent(user, k -> new ArrayList<>()).add(saveSearch.getTitle());
            }
        }
        for (Map.Entry<User, List<String>> entry : userTitleMap.entrySet()) {
            User user = entry.getKey();
            List<String> titles = entry.getValue();
            String recipientEmail = user.getEmail();
            String subject = "There are updates on your Searches";
            String emailBody = "The Titles of your searches that have been updated:\n" + String.join("\n", titles);

            boolean successfullySent = sendEmail(recipientEmail, subject, emailBody);
            if(successfullySent)
            {
                emailsSend.add(recipientEmail);
            }
        }
        return emailsSend;
    }

    private boolean sendEmail(String RecipientEmail, String Subject, String EmailBody)
    {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("katrinbnt@gmail.com") ;
        message.setTo(RecipientEmail);
        message.setSubject(Subject);
        message.setText(EmailBody);
        javaMailSender.send(message);
        return true;
    }
}

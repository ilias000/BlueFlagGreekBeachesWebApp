package com.BlueFlagGreekBeaches.helper;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

import com.BlueFlagGreekBeaches.dto.category.AddCategoryDto;
import com.BlueFlagGreekBeaches.dto.pointOfInterest.AddPointOfInterestDto;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.web.multipart.MultipartFile;

public class CSVHelper
{
    public static String TYPE = "text/csv";

    // Checks if a file has not CSV format.
    public static boolean hasNotCSVFormat(MultipartFile file) {
        return !TYPE.equals(file.getContentType());
    }

    // Reads InputStream of a file and returns a list of AddCategoryDto. If categoryId is not an integer, it is set to -1.
    public static List<AddCategoryDto> csvToAddCategoryDtoList(MultipartFile file)
    {
        InputStream inputStream = getInputStream(file);

        try (
            BufferedReader fileReader = new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8));
            CSVParser csvParser = new CSVParser(fileReader, CSVFormat.DEFAULT.builder().setDelimiter('\t').setHeader("categoryId" ,"name").build())
        ) {
            List<AddCategoryDto> addCategoryDtoList = new ArrayList<>();

            Iterable<CSVRecord> csvRecords = csvParser.getRecords();

            for (CSVRecord csvRecord : csvRecords) {
                AddCategoryDto addCategoryDto = new AddCategoryDto(tryParseInt(csvRecord.get("categoryId")),csvRecord.get("name"));
                addCategoryDtoList.add(addCategoryDto);
            }
            return addCategoryDtoList;
        } catch (IOException e) {
            throw new RuntimeException("Fail to parse CSV file: " + e.getMessage());
        }
    }

    // Reads InputStream of a file and returns a list of AddPointOfInterestDto.
    public static List<AddPointOfInterestDto> csvToAddPointOfInterestDtoList(MultipartFile file)
    {
        InputStream inputStream = getInputStream(file);

        try (
            BufferedReader fileReader = new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8));
            CSVParser csvParser = new CSVParser(fileReader, CSVFormat.DEFAULT.builder().setDelimiter('\t').setHeader("title", "description", "latitude", "longitude", "keywords", "categoriesIds").build())
        ) {
            List<AddPointOfInterestDto> addPointOfInterestDtoList = new ArrayList<>();

            Iterable<CSVRecord> csvRecords = csvParser.getRecords();

            for (CSVRecord csvRecord : csvRecords) {
                AddPointOfInterestDto addPointOfInterestDto = new AddPointOfInterestDto(csvRecord.get("title"),
                                                                                        csvRecord.get("description"), tryParseDouble(csvRecord.get("latitude")),
                                                                                        tryParseDouble(csvRecord.get("longitude")),
                                                                                        separateToListOfStrings(csvRecord.get("keywords"), ","),
                                                                                        separateToListOfStrings(csvRecord.get("categoriesIds"), ",").stream().map(Integer::parseInt)
                                                                                                .toList());
                addPointOfInterestDtoList.add(addPointOfInterestDto);
            }
            return addPointOfInterestDtoList;
        } catch (IOException e) {
            throw new RuntimeException("Fail to parse CSV file: " + e.getMessage());
        }
    }


    // Returns the InputStream of a file.
    private static InputStream getInputStream(MultipartFile file)
    {
        try
        {
            return file.getInputStream();
        }
        catch (IOException e)
        {
            throw new RuntimeException("Fail to parse CSV file: " + e.getMessage());
        }
    }

    // Returns an int from a String or -1 if the String is not an int.
    private static int tryParseInt(String value) {
        try {
            return Integer.parseInt(value);
        } catch(NumberFormatException nfe) {
            // Log exception.
            return -1;
        }
    }

    // Returns a double from a String or 400.0 if the String is not a double (Latitude(-90,90) and Longitude(-180,180) does not reach 400.0).
    private static double tryParseDouble(String value) {
        try {
            return Double.parseDouble(value);
        } catch(NumberFormatException nfe) {
            // Log exception.
            return 400.0;
        }
    }

    // Returns a List of Strings from a String seperated with a separator.
    // If the input is null or empty, returns an empty list.
    private static List<String> separateToListOfStrings(String input, String separator)
    {
        List<String> list = new ArrayList<>();

        if (input == null || input.isEmpty() || input.equals(" ")) {
            return list;
        }

        String[] parts = input.split(separator);

        for (String part : parts) {
            list.add(part.trim());
        }

        return list;
    }
}

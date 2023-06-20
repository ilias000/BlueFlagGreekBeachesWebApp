package com.BlueFlagGreekBeaches.helper;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

import com.BlueFlagGreekBeaches.dto.AddCategoryDto;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.web.multipart.MultipartFile;

public class CSVHelper
{
    public static String TYPE = "text/csv";

    // Checks if a file has CSV format or not.
    public static boolean hasCSVFormat(MultipartFile file) {
        return TYPE.equals(file.getContentType());
    }

    // Reads InputStream of a file, return a list of AddCategoryDto.
    public static List<AddCategoryDto> csvToAddCategoryDtoList(MultipartFile file)
    {
        InputStream inputStream;
        try
        {
            inputStream = file.getInputStream();
        }
        catch (IOException e)
        {
            throw new RuntimeException("Fail to parse CSV file: " + e.getMessage());
        }

        try (
            BufferedReader fileReader = new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8));
            CSVParser csvParser = new CSVParser(fileReader, CSVFormat.DEFAULT.builder().setDelimiter('\t').setHeader("name").build())
        ) {
            List<AddCategoryDto> addCategoryDtoList = new ArrayList<>();

            Iterable<CSVRecord> csvRecords = csvParser.getRecords();

            for (CSVRecord csvRecord : csvRecords) {
                AddCategoryDto addCategoryDto = new AddCategoryDto(csvRecord.get("name"));
                addCategoryDtoList.add(addCategoryDto);
            }
            return addCategoryDtoList;
        } catch (IOException e) {
            throw new RuntimeException("Fail to parse CSV file: " + e.getMessage());
        }
    }
}

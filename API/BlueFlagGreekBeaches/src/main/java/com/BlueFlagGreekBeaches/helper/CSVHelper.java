package com.BlueFlagGreekBeaches.helper;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

import com.BlueFlagGreekBeaches.entity.Category;
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

    // Read InputStream of a file, return a list of Categories.
    // public static List<Category> csvToCategories(InputStream is) {
    //     try (BufferedReader fileReader = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8));
    //          CSVParser csvParser = new CSVParser(fileReader,
    //                                              CSVFormat.DEFAULT.withFirstRecordAsHeader().withIgnoreHeaderCase().withTrim());) {
    //
    //         List<Category> tutorials = new ArrayList<Category>();
    //
    //         Iterable<CSVRecord> csvRecords = csvParser.getRecords();
    //
    //         for (CSVRecord csvRecord : csvRecords) {
    //             Category category = new Category(
    //                     csvRecord.get("Title"),
    //                     csvRecord.get("Description"),
    //                     Boolean.parseBoolean(csvRecord.get("Published"))
    //             );
    //
    //             tutorials.add(category);
    //         }
    //
    //         return tutorials;
    //     } catch (IOException e) {
    //         throw new RuntimeException("fail to parse CSV file: " + e.getMessage());
    //     }
    //     catch (IOException e)
    //     {
    //         throw new RuntimeException(e);
    //     }
    // }

}

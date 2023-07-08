package com.BlueFlagGreekBeaches.dto.saveSearch;

import java.util.List;

public record AddSaveSearchDto(String title, String text, List<String> keywords, List<Integer> categoryIds, double lat, double lon, int km) // Private, final fields, getters, equals, hashCode, toString and constructor for all fields.
{
}
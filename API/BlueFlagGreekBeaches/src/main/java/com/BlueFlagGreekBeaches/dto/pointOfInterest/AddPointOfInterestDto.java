package com.BlueFlagGreekBeaches.dto.pointOfInterest;

import java.util.List;

public record AddPointOfInterestDto(String title, String description, double latitude, double longitude, List<String> keywords, List<Integer> categoriesIds) // Private, final fields, getters, equals, hashCode, toString and constructor for all fields.
{
}

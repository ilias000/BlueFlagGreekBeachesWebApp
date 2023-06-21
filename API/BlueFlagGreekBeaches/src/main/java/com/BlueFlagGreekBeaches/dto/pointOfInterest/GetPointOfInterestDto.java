package com.BlueFlagGreekBeaches.dto.pointOfInterest;

import java.util.List;

import com.BlueFlagGreekBeaches.dto.category.GetCategoryDto;

public record GetPointOfInterestDto(long timestampAdded, String title, String description, double latitude, double longitude, List<String> keywords, List<GetCategoryDto> categories) // Private, final fields, getters, equals, hashCode, toString and constructor for all fields.
{
}
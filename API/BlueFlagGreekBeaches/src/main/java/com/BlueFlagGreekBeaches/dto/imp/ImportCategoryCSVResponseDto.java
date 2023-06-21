package com.BlueFlagGreekBeaches.dto.imp;

import java.util.List;

import com.BlueFlagGreekBeaches.dto.category.GetCategoryDto;

public record ImportCategoryCSVResponseDto(List<GetCategoryDto> getCategoryDtoList , String message) // Private, final fields, getters, equals, hashCode, toString and constructor for all fields.
{
}

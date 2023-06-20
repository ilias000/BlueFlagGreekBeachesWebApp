package com.BlueFlagGreekBeaches.dto;

import java.util.List;

public record ImportCategoryCSVResponseDto(List<GetCategoryDto> categoryDtoList ,String message) // Private, final fields, getters, equals, hashCode, toString and constructor for all fields.
{
}

package com.BlueFlagGreekBeaches.dto.saveSearch;

import java.util.List;

public record GetUsersSaveSearchesResponseDto(List<GetSaveSearchDto> getSaveSearchDtoList, String message) // Private, final fields, getters, equals, hashCode, toString and constructor for all fields.
{
}
package com.BlueFlagGreekBeaches.dto.imp;

import java.util.List;

import com.BlueFlagGreekBeaches.dto.pointOfInterest.GetPointOfInterestDto;

public record ImportPointsOfInterestCSVResponseDto(List<GetPointOfInterestDto> getPointOfInterestDtoList, String message ) // Private, final fields, getters, equals, hashCode, toString and constructor for all fields.
{
}

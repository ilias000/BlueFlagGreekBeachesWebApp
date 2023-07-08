package com.BlueFlagGreekBeaches.dto.saveSearch;

import java.util.List;

import com.BlueFlagGreekBeaches.dto.user.GetUserDto;
import com.BlueFlagGreekBeaches.entity.User;

public record GetSaveSearchDto(String title, String text, List<String> keywords, List<Integer> categoryIds, double lat, double lon, int km, List<GetUserDto> users) // Private, final fields, getters, equals, hashCode, toString and constructor for all fields.
{
}
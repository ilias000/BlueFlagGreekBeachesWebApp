package com.BlueFlagGreekBeaches.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
@Getter
@Setter
@NoArgsConstructor

public class SearchFilter {
    private LocationDTO distance;
    private List<String> keywords;
    private List<Integer> categoryIds;

}

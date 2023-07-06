package com.BlueFlagGreekBeaches.dto.pointOfInterest;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class SearchRequest {
    private int start;
    private int count;
    private String text;
    private SearchFilter filters;

 }

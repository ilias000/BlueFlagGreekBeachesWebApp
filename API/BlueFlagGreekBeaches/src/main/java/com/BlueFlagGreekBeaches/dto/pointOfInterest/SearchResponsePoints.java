package com.BlueFlagGreekBeaches.dto.pointOfInterest;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class SearchResponsePoints {
    private int start;
    private int count;
    private int total;
    private List<ResponsePointOfInterest> data;


}

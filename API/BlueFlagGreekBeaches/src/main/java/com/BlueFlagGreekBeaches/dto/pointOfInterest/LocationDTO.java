package com.BlueFlagGreekBeaches.dto.pointOfInterest;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class LocationDTO {
    private double lat;
    private double lon;
    private int km;

}

package com.BlueFlagGreekBeaches.service;

import com.BlueFlagGreekBeaches.dto.pointOfInterest.ResponsePointOfInterest;
import com.BlueFlagGreekBeaches.dto.pointOfInterest.SearchFilter;
import java.util.List;

public interface PointOfInterestService {
         List<ResponsePointOfInterest> searchPointsOfInterest(int start, int count, String text, SearchFilter filters);

}

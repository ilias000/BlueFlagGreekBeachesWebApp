package com.BlueFlagGreekBeaches.service;

import com.BlueFlagGreekBeaches.dto.category.GetCategoryDto;

import java.util.List;

public interface CategoryService {
    List<GetCategoryDto> getAllCategories();
}

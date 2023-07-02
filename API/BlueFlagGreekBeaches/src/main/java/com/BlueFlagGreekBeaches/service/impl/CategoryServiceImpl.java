package com.BlueFlagGreekBeaches.service.impl;

import com.BlueFlagGreekBeaches.dto.category.GetCategoryDto;
import com.BlueFlagGreekBeaches.entity.Category;
import com.BlueFlagGreekBeaches.repository.CategoryRepository;
import com.BlueFlagGreekBeaches.service.CategoryService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository)
    {
        this.categoryRepository = categoryRepository;
    }
    @Override
    public List<GetCategoryDto> getAllCategories() {
       // return (List<GetCategoryDto>) categoryRepository.findAll();
        List<Category> categories = categoryRepository.findAll();
        return categories.stream().map(category -> new GetCategoryDto(category.getCategoryId(), category.getName())).collect(Collectors.toList());
    }

}

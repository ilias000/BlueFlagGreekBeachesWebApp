package com.BlueFlagGreekBeaches.controller;

import com.BlueFlagGreekBeaches.dto.category.GetCategoryDto;
import com.BlueFlagGreekBeaches.service.CategoryService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/category")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService)
    {
        this.categoryService = categoryService;
    }

    @GetMapping("/all")
    public List<GetCategoryDto> getAllCategories() {
        return categoryService.getAllCategories();
    }
}

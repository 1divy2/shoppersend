package com.shoppersend.backend.catalog.controller;

import com.shoppersend.backend.catalog.entity.Category;
import com.shoppersend.backend.catalog.repository.CategoryRepository;
import com.shoppersend.backend.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/catalog/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final com.shoppersend.backend.catalog.repository.CategoryRepository categoryRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<com.shoppersend.backend.catalog.entity.Category>>> getAllCategories() {
        return ResponseEntity.ok(ApiResponse.success(categoryRepository.findAll(), "Categories retrieved successfully"));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ApiResponse<com.shoppersend.backend.catalog.entity.Category>> getCategoryBySlug(@PathVariable String slug) {
        return categoryRepository.findBySlug(slug)
                .map(category -> ResponseEntity.ok(ApiResponse.success(category, "Category retrieved successfully")))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}

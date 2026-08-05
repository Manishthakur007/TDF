package com.foodblog.controller;

import com.foodblog.model.Category;
import com.foodblog.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired private CategoryRepository categoryRepository;

    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(categoryRepository.findAll());
    }

    @GetMapping("/{slug}")
    public ResponseEntity<?> getBySlug(@PathVariable String slug) {
        return categoryRepository.findBySlug(slug)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

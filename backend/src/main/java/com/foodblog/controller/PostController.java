package com.foodblog.controller;

import com.foodblog.dto.PostDTO;
import com.foodblog.model.User;
import com.foodblog.service.PostService;
import com.foodblog.service.LikeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class PostController {

    @Autowired private PostService postService;
    @Autowired private LikeService likeService;

    @GetMapping("/posts")
    public ResponseEntity<?> getPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @AuthenticationPrincipal User currentUser) {
        Long userId = currentUser != null ? currentUser.getId() : null;
        return ResponseEntity.ok(postService.getAllPublished(page, size, category, search, userId));
    }

    @GetMapping("/posts/{slug}")
    public ResponseEntity<?> getPost(@PathVariable String slug,
                                      @AuthenticationPrincipal User currentUser) {
        try {
            return ResponseEntity.ok(postService.getBySlug(slug, currentUser));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/posts/{id}/like")
    public ResponseEntity<?> toggleLike(@PathVariable Long id,
                                         @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(likeService.toggleLike(id, currentUser));
    }
}

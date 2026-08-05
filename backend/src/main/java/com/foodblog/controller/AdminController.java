package com.foodblog.controller;

import com.foodblog.dto.PostDTO;
import com.foodblog.model.Category;
import com.foodblog.model.User;
import com.foodblog.repository.*;
import com.foodblog.service.PostService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired private PostService postService;
    @Autowired private PostRepository postRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private CommentRepository commentRepository;
    @Autowired private LikeRepository likeRepository;
    @Autowired private CategoryRepository categoryRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard() {
        return ResponseEntity.ok(Map.of(
                "totalPosts", postRepository.count(),
                "publishedPosts", postRepository.countByStatus(com.foodblog.model.Post.Status.PUBLISHED),
                "draftPosts", postRepository.countByStatus(com.foodblog.model.Post.Status.DRAFT),
                "totalUsers", userRepository.count(),
                "totalComments", commentRepository.count(),
                "totalLikes", likeRepository.count(),
                "totalCategories", categoryRepository.count()
        ));
    }

    @GetMapping("/posts")
    public ResponseEntity<?> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(postService.getAllAdmin(page, size, currentUser.getId()));
    }

    @PostMapping("/posts")
    public ResponseEntity<?> createPost(@Valid @RequestBody PostDTO.CreateRequest req,
                                         @AuthenticationPrincipal User currentUser) {
        try {
            return ResponseEntity.ok(postService.create(req, currentUser));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/posts/{id}")
    public ResponseEntity<?> updatePost(@PathVariable Long id,
                                         @RequestBody PostDTO.UpdateRequest req,
                                         @AuthenticationPrincipal User currentUser) {
        try {
            return ResponseEntity.ok(postService.update(id, req, currentUser));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/posts/{id}")
    public ResponseEntity<?> deletePost(@PathVariable Long id) {
        try {
            postService.delete(id);
            return ResponseEntity.ok(Map.of("message", "Post deleted"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/users")
    public ResponseEntity<?> getUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PutMapping("/users/{id}/toggle-role")
    public ResponseEntity<?> toggleUserRole(@PathVariable Long id) {
        return userRepository.findById(id).map(user -> {
            user.setRole(user.getRole() == User.Role.ADMIN ? User.Role.USER : User.Role.ADMIN);
            userRepository.save(user);
            return ResponseEntity.ok(Map.of("id", user.getId(), "role", user.getRole().name(), "message", "Role updated"));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id, @AuthenticationPrincipal User currentUser) {
        if (id.equals(currentUser.getId()))
            return ResponseEntity.badRequest().body(Map.of("message", "Cannot delete yourself"));
        if (!userRepository.existsById(id))
            return ResponseEntity.notFound().build();
        userRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "User deleted"));
    }

    // ─── Category CRUD ────────────────────────────────────────────

    @GetMapping("/categories")
    public ResponseEntity<?> getCategories() {
        return ResponseEntity.ok(categoryRepository.findAll());
    }

    @PostMapping("/categories")
    public ResponseEntity<?> createCategory(@RequestBody Map<String, String> body) {
        try {
            Category cat = new Category();
            cat.setName(body.get("name"));
            cat.setSlug(body.get("slug"));
            cat.setDescription(body.get("description"));
            cat.setIcon(body.get("icon"));
            cat.setColor(body.get("color"));
            return ResponseEntity.ok(categoryRepository.save(cat));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Failed to create category: " + e.getMessage()));
        }
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<?> updateCategory(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return categoryRepository.findById(id).map(cat -> {
            if (body.containsKey("name")) cat.setName(body.get("name"));
            if (body.containsKey("slug")) cat.setSlug(body.get("slug"));
            if (body.containsKey("description")) cat.setDescription(body.get("description"));
            if (body.containsKey("icon")) cat.setIcon(body.get("icon"));
            if (body.containsKey("color")) cat.setColor(body.get("color"));
            return ResponseEntity.ok(categoryRepository.save(cat));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        if (!categoryRepository.existsById(id))
            return ResponseEntity.notFound().build();
        categoryRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Category deleted"));
    }
}


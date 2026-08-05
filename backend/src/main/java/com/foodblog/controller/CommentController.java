package com.foodblog.controller;

import com.foodblog.dto.CommentDTO;
import com.foodblog.model.User;
import com.foodblog.service.CommentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class CommentController {

    @Autowired private CommentService commentService;

    @GetMapping("/posts/{postId}/comments")
    public ResponseEntity<?> getComments(@PathVariable Long postId, @AuthenticationPrincipal User currentUser) {
        try {
            return ResponseEntity.ok(commentService.getByPost(postId, currentUser));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/posts/{postId}/comments")
    public ResponseEntity<?> addComment(@PathVariable Long postId,
                                         @Valid @RequestBody CommentDTO.CreateRequest req,
                                         @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(commentService.create(postId, req, currentUser));
    }

    @DeleteMapping("/comments/{id}")
    public ResponseEntity<?> deleteComment(@PathVariable Long id,
                                            @AuthenticationPrincipal User currentUser) {
        try {
            commentService.delete(id, currentUser);
            return ResponseEntity.ok(java.util.Map.of("message", "Comment deleted"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }
}

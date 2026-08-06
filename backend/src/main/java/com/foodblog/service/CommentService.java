package com.foodblog.service;

import com.foodblog.dto.CommentDTO;
import com.foodblog.model.*;
import com.foodblog.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {

    @Autowired private CommentRepository commentRepository;
    @Autowired private PostRepository postRepository;
    @Autowired private UserRepository userRepository;

    public List<CommentDTO.CommentResponse> getByPost(Long postId, User currentUser) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
                
        if (post.getStatus() != Post.Status.PUBLISHED && (currentUser == null || (!currentUser.getRole().equals(User.Role.ADMIN) && !post.getAuthor().getId().equals(currentUser.getId())))) {
            throw new RuntimeException("Cannot view comments on draft post");
        }
        
        return commentRepository.findByPostIdOrderByCreatedAtDesc(postId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public CommentDTO.CommentResponse create(Long postId, CommentDTO.CreateRequest req, User user) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
                
        if (post.getStatus() != Post.Status.PUBLISHED && !user.getRole().equals(User.Role.ADMIN) && !post.getAuthor().getId().equals(user.getId())) {
            throw new RuntimeException("Cannot interact with draft post");
        }
        
        Comment comment = new Comment();
        comment.setPost(post);
        comment.setUser(userRepository.findById(user.getId()).orElse(user));
        comment.setContent(req.getContent());
        return toResponse(commentRepository.save(comment));
    }

    public void delete(Long id, User user) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        if (!comment.getUser().getId().equals(user.getId()) && !user.getRole().equals(User.Role.ADMIN))
            throw new RuntimeException("Unauthorized");
        commentRepository.deleteById(id);
    }

    private CommentDTO.CommentResponse toResponse(Comment comment) {
        CommentDTO.CommentResponse res = new CommentDTO.CommentResponse();
        res.setId(comment.getId());
        res.setContent(comment.getContent());
        res.setCreatedAt(comment.getCreatedAt());
        res.setUpdatedAt(comment.getUpdatedAt());
        CommentDTO.AuthorInfo authorInfo = new CommentDTO.AuthorInfo();
        authorInfo.setId(comment.getUser().getId());
        authorInfo.setUsername(comment.getUser().getUsername());
        authorInfo.setAvatar(comment.getUser().getAvatar());
        res.setUser(authorInfo);
        return res;
    }
}

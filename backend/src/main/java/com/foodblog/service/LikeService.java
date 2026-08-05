package com.foodblog.service;

import com.foodblog.model.*;
import com.foodblog.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class LikeService {

    @Autowired private LikeRepository likeRepository;
    @Autowired private PostRepository postRepository;

    public Map<String, Object> toggleLike(Long postId, User user) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
                
        if (post.getStatus() != Post.Status.PUBLISHED && !user.getRole().equals(User.Role.ADMIN) && !post.getAuthor().getId().equals(user.getId())) {
            throw new RuntimeException("Cannot interact with draft post");
        }
        
        var existing = likeRepository.findByPostIdAndUserId(postId, user.getId());
        boolean liked;
        if (existing.isPresent()) {
            likeRepository.delete(existing.get());
            liked = false;
        } else {
            Like like = new Like();
            like.setPost(post);
            like.setUser(user);
            likeRepository.save(like);
            liked = true;
        }
        long count = likeRepository.countByPostId(postId);
        return Map.of("liked", liked, "likeCount", count);
    }
}

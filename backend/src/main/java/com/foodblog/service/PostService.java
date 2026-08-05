package com.foodblog.service;

import com.foodblog.dto.PostDTO;
import com.foodblog.model.*;
import com.foodblog.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
public class PostService {

    @Autowired private PostRepository postRepository;
    @Autowired private CategoryRepository categoryRepository;
    @Autowired private LikeRepository likeRepository;
    @Autowired private CommentRepository commentRepository;

    public Page<PostDTO.PostResponse> getAllPublished(int page, int size, String category, String search, Long currentUserId) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Post> posts;
        if (search != null && !search.isBlank()) {
            posts = postRepository.searchPublished(search, pageable);
        } else if (category != null && !category.isBlank()) {
            posts = postRepository.findByCategorySlugAndStatus(category, Post.Status.PUBLISHED, pageable);
        } else {
            posts = postRepository.findByStatus(Post.Status.PUBLISHED, pageable);
        }
        return posts.map(p -> toResponse(p, currentUserId));
    }

    public PostDTO.PostResponse getBySlug(String slug, User currentUser) {
        Post post = postRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Post not found"));
                
        if (post.getStatus() != Post.Status.PUBLISHED) {
            if (currentUser == null || (!currentUser.getRole().equals(User.Role.ADMIN) && !post.getAuthor().getId().equals(currentUser.getId()))) {
                throw new RuntimeException("Post not found");
            }
        }
        
        post.setViews(post.getViews() + 1);
        postRepository.save(post);
        Long currentUserId = currentUser != null ? currentUser.getId() : null;
        return toResponse(post, currentUserId);
    }

    @Transactional
    public PostDTO.PostResponse create(PostDTO.CreateRequest req, User author) {
        Category category = categoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        Post post = new Post();
        post.setTitle(req.getTitle());
        post.setSlug(generateSlug(req.getTitle(), null));
        post.setContent(req.getContent());
        post.setExcerpt(req.getExcerpt() != null ? req.getExcerpt() : excerpt(req.getContent()));
        post.setImageUrl(req.getImageUrl());
        post.setAuthor(author);
        post.setCategory(category);
        post.setStatus(Post.Status.valueOf(req.getStatus()));
        return toResponse(postRepository.save(post), author.getId());
    }

    @Transactional
    public PostDTO.PostResponse update(Long id, PostDTO.UpdateRequest req, User user) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        if (req.getTitle() != null) { post.setTitle(req.getTitle()); post.setSlug(generateSlug(req.getTitle(), id)); }
        if (req.getContent() != null) post.setContent(req.getContent());
        if (req.getExcerpt() != null) post.setExcerpt(req.getExcerpt());
        if (req.getImageUrl() != null) post.setImageUrl(req.getImageUrl());
        if (req.getCategoryId() != null)
            post.setCategory(categoryRepository.findById(req.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found")));
        if (req.getStatus() != null) post.setStatus(Post.Status.valueOf(req.getStatus()));
        return toResponse(postRepository.save(post), user.getId());
    }

    public void delete(Long id) {
        postRepository.deleteById(id);
    }

    public Page<PostDTO.PostResponse> getAllAdmin(int page, int size, Long currentUserId) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return postRepository.findAll(pageable).map(p -> toResponse(p, currentUserId));
    }

    public PostDTO.PostResponse toResponse(Post post, Long currentUserId) {
        PostDTO.PostResponse res = new PostDTO.PostResponse();
        res.setId(post.getId());
        res.setTitle(post.getTitle());
        res.setSlug(post.getSlug());
        res.setContent(post.getContent());
        res.setExcerpt(post.getExcerpt());
        res.setImageUrl(post.getImageUrl());
        res.setStatus(post.getStatus().name());
        res.setViews(post.getViews());
        res.setCreatedAt(post.getCreatedAt());
        res.setUpdatedAt(post.getUpdatedAt());
        res.setLikeCount(likeRepository.countByPostId(post.getId()));
        res.setCommentCount(commentRepository.countByPostId(post.getId()));
        res.setLikedByCurrentUser(currentUserId != null && likeRepository.existsByPostIdAndUserId(post.getId(), currentUserId));

        PostDTO.AuthorInfo author = new PostDTO.AuthorInfo();
        author.setId(post.getAuthor().getId());
        author.setUsername(post.getAuthor().getUsername());
        author.setAvatar(post.getAuthor().getAvatar());
        res.setAuthor(author);

        PostDTO.CategoryInfo cat = new PostDTO.CategoryInfo();
        cat.setId(post.getCategory().getId());
        cat.setName(post.getCategory().getName());
        cat.setSlug(post.getCategory().getSlug());
        cat.setIcon(post.getCategory().getIcon());
        cat.setColor(post.getCategory().getColor());
        res.setCategory(cat);

        return res;
    }

    private String generateSlug(String title, Long excludeId) {
        String base = title.toLowerCase().replaceAll("[^a-z0-9\\s-]", "").replaceAll("\\s+", "-").replaceAll("-+", "-").replaceAll("^-|-$", "");
        String slug = base;
        int count = 1;
        while (true) {
            var existing = postRepository.findBySlug(slug);
            if (existing.isEmpty() || (excludeId != null && existing.get().getId().equals(excludeId))) break;
            slug = base + "-" + count++;
        }
        return slug;
    }

    private String excerpt(String content) {
        if (content == null) return "";
        String plain = content.replaceAll("<[^>]*>", "");
        return plain.length() > 160 ? plain.substring(0, 157) + "..." : plain;
    }
}

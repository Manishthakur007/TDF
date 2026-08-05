package com.foodblog.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class PostDTO {

    @Data
    public static class CreateRequest {
        @NotBlank
        private String title;
        @NotBlank
        private String content;
        private String excerpt;
        private String imageUrl;
        @NotNull
        private Long categoryId;
        private String status = "PUBLISHED";
        
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
        public String getExcerpt() { return excerpt; }
        public void setExcerpt(String excerpt) { this.excerpt = excerpt; }
        public String getImageUrl() { return imageUrl; }
        public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
        public Long getCategoryId() { return categoryId; }
        public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }

    @Data
    public static class UpdateRequest {
        private String title;
        private String content;
        private String excerpt;
        private String imageUrl;
        private Long categoryId;
        private String status;
        
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
        public String getExcerpt() { return excerpt; }
        public void setExcerpt(String excerpt) { this.excerpt = excerpt; }
        public String getImageUrl() { return imageUrl; }
        public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
        public Long getCategoryId() { return categoryId; }
        public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }

    @Data
    public static class PostResponse {
        private Long id;
        private String title;
        private String slug;
        private String content;
        private String excerpt;
        private String imageUrl;
        private AuthorInfo author;
        private CategoryInfo category;
        private String status;
        private Integer views;
        private long likeCount;
        private long commentCount;
        private boolean likedByCurrentUser;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getSlug() { return slug; }
        public void setSlug(String slug) { this.slug = slug; }
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
        public String getExcerpt() { return excerpt; }
        public void setExcerpt(String excerpt) { this.excerpt = excerpt; }
        public String getImageUrl() { return imageUrl; }
        public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
        public AuthorInfo getAuthor() { return author; }
        public void setAuthor(AuthorInfo author) { this.author = author; }
        public CategoryInfo getCategory() { return category; }
        public void setCategory(CategoryInfo category) { this.category = category; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public Integer getViews() { return views; }
        public void setViews(Integer views) { this.views = views; }
        public long getLikeCount() { return likeCount; }
        public void setLikeCount(long likeCount) { this.likeCount = likeCount; }
        public long getCommentCount() { return commentCount; }
        public void setCommentCount(long commentCount) { this.commentCount = commentCount; }
        public boolean isLikedByCurrentUser() { return likedByCurrentUser; }
        public void setLikedByCurrentUser(boolean likedByCurrentUser) { this.likedByCurrentUser = likedByCurrentUser; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
        public LocalDateTime getUpdatedAt() { return updatedAt; }
        public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    }

    @Data
    public static class AuthorInfo {
        private Long id;
        private String username;
        private String avatar;
        
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getAvatar() { return avatar; }
        public void setAvatar(String avatar) { this.avatar = avatar; }
    }

    @Data
    public static class CategoryInfo {
        private Long id;
        private String name;
        private String slug;
        private String icon;
        private String color;
        
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getSlug() { return slug; }
        public void setSlug(String slug) { this.slug = slug; }
        public String getIcon() { return icon; }
        public void setIcon(String icon) { this.icon = icon; }
        public String getColor() { return color; }
        public void setColor(String color) { this.color = color; }
    }
}

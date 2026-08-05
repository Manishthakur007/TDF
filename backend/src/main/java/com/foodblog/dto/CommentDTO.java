package com.foodblog.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

public class CommentDTO {

    @Data
    public static class CreateRequest {
        @NotBlank
        private String content;
        
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
    }

    @Data
    public static class CommentResponse {
        private Long id;
        private String content;
        private AuthorInfo user;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
        public AuthorInfo getUser() { return user; }
        public void setUser(AuthorInfo user) { this.user = user; }
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
}

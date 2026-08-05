package com.foodblog.dto;

import lombok.Data;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AuthDTO {

    @Data
    public static class RegisterRequest {
        @NotBlank
        private String username;
        @NotBlank @Email
        private String email;
        @NotBlank @Size(min = 6)
        private String password;
    }

    @Data
    public static class LoginRequest {
        @NotBlank
        private String email;
        @NotBlank
        private String password;
    }

    @Data
    public static class AuthResponse {
        private String token;
        private String type = "Bearer";
        private Long id;
        private String username;
        private String email;
        private String role;
        private String avatar;

        public AuthResponse(String token, Long id, String username, String email, String role, String avatar) {
            this.token = token;
            this.id = id;
            this.username = username;
            this.email = email;
            this.role = role;
            this.avatar = avatar;
        }
    }
}

package com.foodblog.controller;

import com.foodblog.dto.AuthDTO;
import com.foodblog.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody AuthDTO.RegisterRequest req) {
        try {
            return ResponseEntity.ok(authService.register(req));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthDTO.LoginRequest req) {
        try {
            return ResponseEntity.ok(authService.login(req));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", "Invalid email or password"));
        }
    }
}

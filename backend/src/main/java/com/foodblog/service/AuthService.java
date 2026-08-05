package com.foodblog.service;

import com.foodblog.dto.AuthDTO;
import com.foodblog.model.User;
import com.foodblog.repository.UserRepository;
import com.foodblog.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtUtils jwtUtils;

    public AuthDTO.AuthResponse register(AuthDTO.RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail()))
            throw new RuntimeException("Email already in use");
        if (userRepository.existsByUsername(req.getUsername()))
            throw new RuntimeException("Username already taken");

        User user = new User();
        user.setUsername(req.getUsername());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRole(User.Role.USER);
        user.setAvatar("https://api.dicebear.com/7.x/initials/svg?seed=" + req.getUsername());
        userRepository.save(user);

        String token = jwtUtils.generateTokenFromEmail(user.getEmail());
        return new AuthDTO.AuthResponse(token, user.getId(), user.getUsername(),
                user.getEmail(), user.getRole().name(), user.getAvatar());
    }

    public AuthDTO.AuthResponse login(AuthDTO.LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));
        if (!passwordEncoder.matches(req.getPassword(), user.getPassword()))
            throw new BadCredentialsException("Invalid credentials");

        String token = jwtUtils.generateTokenFromEmail(user.getEmail());
        return new AuthDTO.AuthResponse(token, user.getId(), user.getUsername(),
                user.getEmail(), user.getRole().name(), user.getAvatar());
    }
}

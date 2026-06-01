package com.shoppersend.backend.identity.controller;

import com.shoppersend.backend.common.dto.ApiResponse;
import com.shoppersend.backend.identity.dto.AuthResponse;
import com.shoppersend.backend.identity.dto.LoginRequest;
import com.shoppersend.backend.identity.dto.RegisterRequest;
import com.shoppersend.backend.identity.dto.UserDto;
import com.shoppersend.backend.identity.entity.User;
import com.shoppersend.backend.identity.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success(authService.register(request), "User registered successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success(authService.login(request), "Login successful"));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<java.util.Map<String, Object>>> getMe(@AuthenticationPrincipal User currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Not authenticated"));
        }
        UserDto userDto = UserDto.builder()
                .id(currentUser.getId())
                .email(currentUser.getEmail())
                .fullName(currentUser.getFullName())
                .phone(currentUser.getPhone())
                .role(currentUser.getRole().name())
                .createdAt(currentUser.getCreatedAt())
                .build();
        return ResponseEntity.ok(ApiResponse.success(java.util.Map.of("user", userDto), "Current user fetched"));
    }
    
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout() {
        // Simple logout, full implementation requires session invalidation / token blacklisting
        return ResponseEntity.ok(ApiResponse.success(null, "Logged out successfully"));
    }
}

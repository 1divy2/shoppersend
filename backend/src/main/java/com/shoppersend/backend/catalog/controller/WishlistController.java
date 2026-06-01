package com.shoppersend.backend.catalog.controller;

import com.shoppersend.backend.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private Map<String, Object> emptyWishlist() {
        Map<String, Object> wishlist = new HashMap<>();
        wishlist.put("id", java.util.UUID.randomUUID().toString());
        wishlist.put("items", new ArrayList<>());
        return wishlist;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getWishlist() {
        return ResponseEntity.ok(ApiResponse.success(emptyWishlist(), "Wishlist retrieved"));
    }

    @PostMapping("/items")
    public ResponseEntity<ApiResponse<Map<String, Object>>> addItem(@RequestBody Map<String, Object> request) {
        return ResponseEntity.ok(ApiResponse.success(emptyWishlist(), "Item added to wishlist"));
    }

    @DeleteMapping("/items/{productId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> removeItem(@PathVariable String productId) {
        return ResponseEntity.ok(ApiResponse.success(emptyWishlist(), "Item removed from wishlist"));
    }
}

package com.shoppersend.backend.cart.controller;

import com.shoppersend.backend.cart.dto.CartDto;
import com.shoppersend.backend.cart.service.CartService;
import com.shoppersend.backend.common.dto.ApiResponse;
import com.shoppersend.backend.identity.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<ApiResponse<CartDto>> getCart(@AuthenticationPrincipal User user) {
        if (user == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(ApiResponse.success(cartService.getCart(user.getId()), "Cart retrieved"));
    }

    @PostMapping("/items")
    public ResponseEntity<ApiResponse<CartDto>> addItem(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, Object> request) {
        if (user == null) return ResponseEntity.status(401).build();
        
        UUID productId = UUID.fromString((String) request.get("productId"));
        int quantity = request.containsKey("quantity") ? (Integer) request.get("quantity") : 1;
        UUID variantId = request.containsKey("variantId") && request.get("variantId") != null ? 
                UUID.fromString((String) request.get("variantId")) : null;
        String subscriptionFrequency = request.containsKey("subscriptionFrequency") ? 
                (String) request.get("subscriptionFrequency") : null;

        return ResponseEntity.ok(ApiResponse.success(cartService.addItem(user.getId(), productId, variantId, quantity, subscriptionFrequency), "Item added to cart"));
    }

    @PatchMapping("/items/{productId}")
    public ResponseEntity<ApiResponse<CartDto>> updateItem(
            @AuthenticationPrincipal User user,
            @PathVariable String productId, 
            @RequestBody Map<String, Object> request) {
        if (user == null) return ResponseEntity.status(401).build();
        
        UUID prodId = UUID.fromString(productId);
        int quantity = (Integer) request.get("quantity");
        UUID variantId = request.containsKey("variantId") && request.get("variantId") != null ? 
                UUID.fromString((String) request.get("variantId")) : null;

        return ResponseEntity.ok(ApiResponse.success(cartService.updateItemQuantity(user.getId(), prodId, variantId, quantity), "Cart item updated"));
    }

    @DeleteMapping("/items/{productId}")
    public ResponseEntity<ApiResponse<CartDto>> removeItem(
            @AuthenticationPrincipal User user,
            @PathVariable String productId) {
        if (user == null) return ResponseEntity.status(401).build();
        
        return ResponseEntity.ok(ApiResponse.success(cartService.removeItem(user.getId(), UUID.fromString(productId)), "Cart item removed"));
    }

    @PostMapping("/clear")
    public ResponseEntity<ApiResponse<CartDto>> clearCart(@AuthenticationPrincipal User user) {
        if (user == null) return ResponseEntity.status(401).build();
        
        return ResponseEntity.ok(ApiResponse.success(cartService.clearCart(user.getId()), "Cart cleared"));
    }
}

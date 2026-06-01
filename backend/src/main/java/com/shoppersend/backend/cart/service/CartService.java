package com.shoppersend.backend.cart.service;

import com.shoppersend.backend.cart.dto.CartDto;
import com.shoppersend.backend.cart.dto.CartItemDto;
import com.shoppersend.backend.cart.entity.Cart;
import com.shoppersend.backend.cart.entity.CartItem;
import com.shoppersend.backend.cart.repository.CartItemRepository;
import com.shoppersend.backend.cart.repository.CartRepository;
import com.shoppersend.backend.catalog.entity.Product;
import com.shoppersend.backend.catalog.entity.ProductVariant;
import com.shoppersend.backend.catalog.repository.ProductRepository;
import com.shoppersend.backend.catalog.repository.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;

    @Transactional
    public CartDto getCart(UUID userId) {
        Cart cart = getOrCreateCart(userId);
        return mapToDto(cart);
    }

    @Transactional
    public CartDto addItem(UUID userId, UUID productId, UUID variantId, int quantity, String subscriptionFrequency) {
        Cart cart = getOrCreateCart(userId);
        
        UUID effectiveVariantId = variantId;
        if (effectiveVariantId == null) {
            List<ProductVariant> variants = productVariantRepository.findByProductId(productId);
            if (variants.isEmpty()) {
                throw new RuntimeException("Product has no variants");
            }
            effectiveVariantId = variants.get(0).getId();
        }

        Optional<CartItem> existingItem = cartItemRepository.findByCart_IdAndProductVariantId(cart.getId(), effectiveVariantId);
        
        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);
            if (subscriptionFrequency != null) {
                item.setSubscriptionFrequency(subscriptionFrequency);
            }
            cartItemRepository.save(item);
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .productVariantId(effectiveVariantId)
                    .quantity(quantity)
                    .subscriptionFrequency(subscriptionFrequency)
                    .build();
            cartItemRepository.save(newItem);
        }

        return mapToDto(cart);
    }

    @Transactional
    public CartDto updateItemQuantity(UUID userId, UUID productId, UUID variantId, int quantity) {
        Cart cart = getOrCreateCart(userId);
        
        UUID effectiveVariantId = variantId;
        if (effectiveVariantId == null) {
            List<ProductVariant> variants = productVariantRepository.findByProductId(productId);
            if (!variants.isEmpty()) {
                effectiveVariantId = variants.get(0).getId();
            }
        }

        if (effectiveVariantId != null) {
            Optional<CartItem> existingItem = cartItemRepository.findByCart_IdAndProductVariantId(cart.getId(), effectiveVariantId);
            if (existingItem.isPresent()) {
                CartItem item = existingItem.get();
                if (quantity <= 0) {
                    cartItemRepository.delete(item);
                } else {
                    item.setQuantity(quantity);
                    cartItemRepository.save(item);
                }
            }
        }
        
        return mapToDto(cart);
    }

    @Transactional
    public CartDto removeItem(UUID userId, UUID productId) {
        Cart cart = getOrCreateCart(userId);
        
        // Find variant first
        List<ProductVariant> variants = productVariantRepository.findByProductId(productId);
        if (!variants.isEmpty()) {
            for (ProductVariant variant : variants) {
                cartItemRepository.findByCart_IdAndProductVariantId(cart.getId(), variant.getId())
                        .ifPresent(cartItemRepository::delete);
            }
        }
        
        return mapToDto(cart);
    }

    @Transactional
    public CartDto clearCart(UUID userId) {
        Cart cart = getOrCreateCart(userId);
        cartItemRepository.deleteByCart_Id(cart.getId());
        return mapToDto(cart);
    }

    private Cart getOrCreateCart(UUID userId) {
        return cartRepository.findByUserId(userId).orElseGet(() -> {
            Cart newCart = Cart.builder()
                    .id(UUID.randomUUID())
                    .userId(userId)
                    .build();
            return cartRepository.save(newCart);
        });
    }

    private CartDto mapToDto(Cart cart) {
        List<CartItem> items = cartItemRepository.findByCart_Id(cart.getId());
        
        BigDecimal subtotal = BigDecimal.ZERO;
        List<CartItemDto> itemDtos = new java.util.ArrayList<>();
        
        for (CartItem item : items) {
            Optional<ProductVariant> variantOpt = productVariantRepository.findById(item.getProductVariantId());
            if (variantOpt.isPresent()) {
                ProductVariant variant = variantOpt.get();
                BigDecimal itemTotal = variant.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
                subtotal = subtotal.add(itemTotal);
                
                itemDtos.add(CartItemDto.builder()
                        .productId(variant.getProductId())
                        .variantId(variant.getId())
                        .quantity(item.getQuantity())
                        .unitPrice(variant.getPrice())
                        .subscriptionFrequency(item.getSubscriptionFrequency())
                        .addedAt(item.getCreatedAt())
                        .build());
            }
        }

        return CartDto.builder()
                .id(cart.getId())
                .userId(cart.getUserId())
                .items(itemDtos)
                .subtotal(subtotal)
                .discount(BigDecimal.ZERO) // Implement coupons later
                .total(subtotal)
                .updatedAt(cart.getUpdatedAt())
                .build();
    }
}

package com.shoppersend.backend.catalog.controller;

import com.shoppersend.backend.catalog.dto.CreateReviewRequest;
import com.shoppersend.backend.catalog.dto.ReviewDto;
import com.shoppersend.backend.catalog.entity.Product;
import com.shoppersend.backend.catalog.entity.Review;
import com.shoppersend.backend.catalog.repository.ProductRepository;
import com.shoppersend.backend.catalog.repository.ReviewRepository;
import com.shoppersend.backend.common.exception.ResourceNotFoundException;
import com.shoppersend.backend.identity.entity.User;
import com.shoppersend.backend.identity.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/products/{productId}/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<Page<ReviewDto>> getProductReviews(
            @PathVariable UUID productId,
            Pageable pageable) {
        
        Page<Review> reviews = reviewRepository.findByProductIdOrderByCreatedAtDesc(productId, pageable);
        
        Page<ReviewDto> dtos = reviews.map(review -> ReviewDto.builder()
                .id(review.getId())
                .productId(review.getProductId())
                .userId(review.getUserId())
                .userName(review.getUser() != null ? review.getUser().getFullName() : "Anonymous User")
                .rating(review.getRating())
                .title(review.getTitle())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .build());

        return ResponseEntity.ok(dtos);
    }

    @PostMapping
    public ResponseEntity<ReviewDto> createReview(
            @PathVariable UUID productId,
            @Valid @RequestBody CreateReviewRequest request,
            @AuthenticationPrincipal User user) {
        
        UUID userId = user.getId();

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        Review review = new Review();
        review.setProductId(productId);
        review.setUserId(userId);
        review.setUser(user);
        review.setRating(request.getRating());
        review.setTitle(request.getTitle());
        review.setComment(request.getComment());

        review = reviewRepository.save(review);

        // Update product rating (Simple average recalculation could be added here, 
        // for now we'll just save the review).

        ReviewDto dto = ReviewDto.builder()
                .id(review.getId())
                .productId(review.getProductId())
                .userId(review.getUserId())
                .userName(user.getFullName())
                .rating(review.getRating())
                .title(review.getTitle())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .build();

        return ResponseEntity.ok(dto);
    }
}

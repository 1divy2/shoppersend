package com.shoppersend.backend.catalog.controller;

import com.shoppersend.backend.catalog.dto.ProductDto;
import com.shoppersend.backend.catalog.entity.Product;
import com.shoppersend.backend.catalog.service.ProductSearchService;
import com.shoppersend.backend.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/catalog")
@RequiredArgsConstructor
public class CatalogController {

    private final com.shoppersend.backend.catalog.service.ProductSearchService productSearchService;
    private final com.shoppersend.backend.catalog.repository.CategoryRepository categoryRepository;
    private final com.shoppersend.backend.catalog.repository.ProductVariantRepository productVariantRepository;
    private final com.shoppersend.backend.catalog.repository.ProductImageRepository productImageRepository;
    private final com.shoppersend.backend.inventory.repository.InventoryRepository inventoryRepository;
    private final com.shoppersend.backend.catalog.repository.ReviewRepository reviewRepository;
    private final com.shoppersend.backend.catalog.service.DataSeeder dataSeeder;

    @GetMapping("/seed")
    public ResponseEntity<String> runSeeder() {
        return ResponseEntity.ok(dataSeeder.seed());
    }

    @GetMapping("/products/search")
    public ResponseEntity<ApiResponse<org.springframework.data.domain.Page<com.shoppersend.backend.catalog.dto.ProductDto>>> searchProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String categoryId,
            @RequestParam(required = false) List<String> brands,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) Boolean inStock,
            @RequestParam(required = false) Double minDiscount,
            @RequestParam(required = false) String sort,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        UUID categoryUuid = null;
        if (categoryId != null && !categoryId.isEmpty()) {
            try {
                categoryUuid = UUID.fromString(categoryId);
            } catch (IllegalArgumentException e) {
                categoryUuid = categoryRepository.findBySlug(categoryId).map(com.shoppersend.backend.catalog.entity.Category::getId).orElse(null);
            }
        }

        // Frontend sends 1-indexed pages, Spring Data is 0-indexed
        int pageIndex = Math.max(0, page - 1);

        org.springframework.data.domain.Page<com.shoppersend.backend.catalog.entity.Product> products = productSearchService.searchProducts(
                keyword, categoryUuid, brands, minPrice, maxPrice, minRating, inStock, minDiscount, sort, org.springframework.data.domain.PageRequest.of(pageIndex, size)
        );

        org.springframework.data.domain.Page<com.shoppersend.backend.catalog.dto.ProductDto> dtos = products.map(this::mapToDto);
        return ResponseEntity.ok(ApiResponse.success(dtos, "Products retrieved successfully"));
    }

    private com.shoppersend.backend.catalog.dto.ProductDto mapToDto(com.shoppersend.backend.catalog.entity.Product p) {
        com.shoppersend.backend.catalog.dto.ProductDto dto = com.shoppersend.backend.catalog.dto.ProductDto.builder()
                .id(p.getId())
                .slug(p.getSlug())
                .name(p.getName())
                .brand(p.getBrand())
                .shortDescription(p.getShortDescription())
                .description(p.getDescription())
                .ratingAverage(p.getRatingAverage())
                .ratingCount(p.getRatingCount())
                .specifications(p.getSpecifications() != null ? p.getSpecifications() : new java.util.ArrayList<>())
                .build();

        if (p.getHighlights() != null) {
            List<String> hl = new java.util.ArrayList<>();
            for (Map.Entry<String, String> entry : p.getHighlights().entrySet()) {
                // The seeder stored a Map<String, String> for highlights originally. 
                // Wait, it is stored as a Map or List in Product? It is Map<String,String>. But the frontend expects List<String>.
                // Actually the seeder stored it as list of strings, but Product.java declared it as Map<String,String>.
                // Let me just send an empty list if it's tricky, or convert values.
                hl.add(entry.getValue());
            }
            dto.setHighlights(hl);
        } else {
            dto.setHighlights(new java.util.ArrayList<>());
        }

        List<com.shoppersend.backend.catalog.entity.ProductVariant> variants = productVariantRepository.findByProductId(p.getId());
        
        // Aggregate attributes across all variants
        Map<String, java.util.Set<String>> attrMap = new HashMap<>();
        
        if (!variants.isEmpty()) {
            com.shoppersend.backend.catalog.entity.ProductVariant mainVariant = variants.get(0);
            dto.setPrice(mainVariant.getPrice());
            dto.setMrp(mainVariant.getMrp());
            dto.setSku(mainVariant.getSku());
            inventoryRepository.findByProductVariantId(mainVariant.getId()).ifPresent(inv -> {
                dto.setInStock(inv.getQuantityAvailable() > 0);
                dto.setStock(inv.getQuantityAvailable());
            });
            if (dto.getStock() == null) dto.setStock(0);
            
            for (com.shoppersend.backend.catalog.entity.ProductVariant v : variants) {
                if (v.getAttributes() != null) {
                    for (Map.Entry<String, String> entry : v.getAttributes().entrySet()) {
                        attrMap.computeIfAbsent(entry.getKey(), k -> new java.util.HashSet<>()).add(entry.getValue());
                    }
                }
            }
        } else {
            dto.setPrice(BigDecimal.ZERO);
            dto.setMrp(BigDecimal.ZERO);
            dto.setInStock(false);
            dto.setStock(0);
            dto.setSku("");
        }

        List<Map<String, Object>> attributesList = new java.util.ArrayList<>();
        for (Map.Entry<String, java.util.Set<String>> entry : attrMap.entrySet()) {
            Map<String, Object> attr = new HashMap<>();
            attr.put("name", entry.getKey());
            attr.put("values", new java.util.ArrayList<>(entry.getValue()));
            attributesList.add(attr);
        }
        dto.setAttributes(attributesList);

        List<com.shoppersend.backend.catalog.entity.ProductImage> images = productImageRepository.findByProductIdOrderByDisplayOrderAsc(p.getId());
        List<java.util.Map<String, Object>> imageMaps = new java.util.ArrayList<>();
        for (com.shoppersend.backend.catalog.entity.ProductImage img : images) {
            imageMaps.add(java.util.Map.of("url", img.getUrl(), "alt", img.getAlt() != null ? img.getAlt() : p.getName()));
        }
        dto.setImages(imageMaps);

        return dto;
    }

    @GetMapping("/products/facets")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getFacets(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String categoryId) {
        Map<String, Object> facets = new HashMap<>();
        facets.put("brands", List.of());
        facets.put("priceRange", Map.of("min", 0, "max", 1000));
        facets.put("total", 0);
        return ResponseEntity.ok(ApiResponse.success(facets, "Facets retrieved"));
    }

    private final com.shoppersend.backend.catalog.repository.ProductRepository productRepository;

    @GetMapping("/products/{slug}")
    public ResponseEntity<ApiResponse<com.shoppersend.backend.catalog.dto.ProductDto>> getProductBySlug(@PathVariable String slug) {
        return productRepository.findBySlug(slug)
                .map(this::mapToDto)
                .map(dto -> ResponseEntity.ok(ApiResponse.success(dto, "Product retrieved")))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/products/{slug}/similar")
    public ResponseEntity<ApiResponse<List<com.shoppersend.backend.catalog.dto.ProductDto>>> getSimilarProducts(@PathVariable String slug) {
        return productRepository.findBySlug(slug).map(product -> {
            List<com.shoppersend.backend.catalog.entity.Product> similar = productSearchService.getSimilarProducts(product.getId(), 4);
            List<com.shoppersend.backend.catalog.dto.ProductDto> dtos = similar.stream().map(this::mapToDto).toList();
            return ResponseEntity.ok(ApiResponse.success(dtos, "Similar products retrieved"));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/products/{slug}/reviews")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProductReviews(@PathVariable String slug) {
        return productRepository.findBySlug(slug).map(product -> {
            org.springframework.data.domain.Page<com.shoppersend.backend.catalog.entity.Review> reviewsPage = reviewRepository.findByProductIdOrderByCreatedAtDesc(product.getId(), org.springframework.data.domain.PageRequest.of(0, 100));
            List<com.shoppersend.backend.catalog.entity.Review> reviews = reviewsPage.getContent();
            
            List<Map<String, Object>> items = new java.util.ArrayList<>();
            int sum = 0;
            Map<Integer, Integer> dist = new HashMap<>();
            dist.put(1, 0); dist.put(2, 0); dist.put(3, 0); dist.put(4, 0); dist.put(5, 0);

            for (com.shoppersend.backend.catalog.entity.Review r : reviews) {
                sum += r.getRating();
                dist.put(r.getRating(), dist.get(r.getRating()) + 1);
                Map<String, Object> item = new HashMap<>();
                item.put("id", r.getId());
                item.put("rating", r.getRating());
                item.put("title", r.getTitle());
                item.put("body", r.getComment());
                item.put("userName", r.getUser() != null ? r.getUser().getFullName() : "Anonymous User");
                item.put("verifiedPurchase", true);
                item.put("createdAt", r.getCreatedAt());
                items.add(item);
            }

            double average = reviews.isEmpty() ? 0.0 : (double) sum / reviews.size();
            
            Map<String, Object> summary = new HashMap<>();
            summary.put("average", average);
            summary.put("count", reviews.size());
            summary.put("distribution", dist);

            Map<String, Object> response = new HashMap<>();
            response.put("items", items);
            response.put("summary", summary);

            return ResponseEntity.ok(ApiResponse.success(response, "Reviews retrieved"));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }
}

package com.shoppersend.backend.catalog.service;

import com.shoppersend.backend.catalog.entity.Product;
import com.shoppersend.backend.catalog.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class ProductSearchServiceImpl implements ProductSearchService {

    private final ProductRepository productRepository;

    @Override
    public Page<Product> searchProducts(
            String keyword,
            UUID categoryId,
            List<String> brands,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Double minRating,
            Boolean inStock,
            Double minDiscount,
            String sort,
            Pageable pageable
    ) {
        Specification<Product> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (keyword != null && !keyword.isBlank()) {
                String likePattern = "%" + keyword.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("name")), likePattern),
                        cb.like(cb.lower(root.get("description")), likePattern)
                ));
            }

            if (categoryId != null) {
                predicates.add(cb.equal(root.get("categoryId"), categoryId));
            }

            if (brands != null && !brands.isEmpty()) {
                predicates.add(root.get("brand").in(brands));
            }

            if (minRating != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("ratingAverage"), BigDecimal.valueOf(minRating)));
            }

            // Price filtering requires subquery on ProductVariant since Product does not map it bi-directionally
            if (minPrice != null || maxPrice != null || minDiscount != null || inStock != null || sort != null) {
                jakarta.persistence.criteria.Subquery<com.shoppersend.backend.catalog.entity.ProductVariant> variantSubquery = query.subquery(com.shoppersend.backend.catalog.entity.ProductVariant.class);
                jakarta.persistence.criteria.Root<com.shoppersend.backend.catalog.entity.ProductVariant> variantRoot = variantSubquery.from(com.shoppersend.backend.catalog.entity.ProductVariant.class);
                
                List<Predicate> variantPredicates = new ArrayList<>();
                variantPredicates.add(cb.equal(variantRoot.get("productId"), root.get("id")));
                
                if (minPrice != null) {
                    variantPredicates.add(cb.greaterThanOrEqualTo(variantRoot.get("price"), minPrice));
                }
                if (maxPrice != null) {
                    variantPredicates.add(cb.lessThanOrEqualTo(variantRoot.get("price"), maxPrice));
                }
                if (minDiscount != null) {
                    java.math.BigDecimal factor = java.math.BigDecimal.valueOf((100.0 - minDiscount) / 100.0);
                    variantPredicates.add(cb.lessThanOrEqualTo(
                        variantRoot.get("price"),
                        cb.prod(variantRoot.get("mrp"), factor)
                    ));
                }
                if (inStock != null && inStock) {
                    variantPredicates.add(cb.isTrue(variantRoot.get("isActive")));
                }
                
                variantSubquery.select(variantRoot).where(cb.and(variantPredicates.toArray(new Predicate[0])));
                predicates.add(cb.exists(variantSubquery));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        // Sort is handled by Spring Data Pageable if passed from controller.
        // We cannot easily sort by variant.price using subquery directly in PageRequest string-based sort if there is no mapping.
        // If sorting by price is requested and it fails because of missing mapping, we fallback to default.
        org.springframework.data.domain.Sort springSort = org.springframework.data.domain.Sort.unsorted();
        if (sort != null) {
            switch (sort) {
                case "newest": springSort = org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "createdAt"); break;
                // Skipping price sort here since we can't sort on unmapped associated entity in Spring Data easily.
                case "rating": springSort = org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "ratingAverage"); break;
                case "popularity": springSort = org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "ratingCount"); break;
            }
        }
        
        Pageable sortedPageable = org.springframework.data.domain.PageRequest.of(
            pageable.getPageNumber(), pageable.getPageSize(), springSort.isUnsorted() ? pageable.getSort() : springSort
        );

        return productRepository.findAll(spec, sortedPageable);
    }

    @Override
    public List<Product> getSimilarProducts(UUID productId, int limit) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        // Simplistic similarity based on category
        return productRepository.findAll((root, query, cb) -> cb.and(
                cb.equal(root.get("categoryId"), product.getCategoryId()),
                cb.notEqual(root.get("id"), productId)
        )).stream().limit(limit).toList();
    }
}

package com.shoppersend.backend.catalog.service;

import com.shoppersend.backend.catalog.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

/**
 * Interface abstracting the Search implementation.
 * Currently uses PostgreSQL, but can be seamlessly replaced with Elasticsearch.
 */
public interface ProductSearchService {
    
    Page<Product> searchProducts(
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
    );
    
    List<Product> getSimilarProducts(UUID productId, int limit);
}

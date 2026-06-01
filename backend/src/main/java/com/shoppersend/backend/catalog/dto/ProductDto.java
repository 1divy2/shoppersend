package com.shoppersend.backend.catalog.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductDto {
    private UUID id;
    private String slug;
    private String name;
    private String brand;
    private String shortDescription;
    private BigDecimal ratingAverage;
    private Integer ratingCount;
    private BigDecimal price;
    private BigDecimal mrp;
    private boolean inStock;
    private Integer stock;
    private String sku;
    private String description;
    private List<String> highlights;
    private List<java.util.Map<String, Object>> specifications;
    private List<java.util.Map<String, Object>> attributes;
    private List<java.util.Map<String, Object>> images;
    private List<java.util.Map<String, Object>> variants;
}

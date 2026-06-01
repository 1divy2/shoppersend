package com.shoppersend.backend.catalog.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.shoppersend.backend.catalog.entity.*;
import com.shoppersend.backend.catalog.repository.*;
import com.shoppersend.backend.inventory.entity.Inventory;
import com.shoppersend.backend.inventory.repository.InventoryRepository;
import com.shoppersend.backend.identity.entity.User;
import com.shoppersend.backend.identity.entity.UserRole;
import com.shoppersend.backend.identity.repository.UserRepository;
import com.shoppersend.backend.seller.entity.Seller;
import com.shoppersend.backend.seller.repository.SellerRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.math.BigDecimal;
import java.util.*;

@Component
@RequiredArgsConstructor
public class DataSeeder {

    private final UserRepository userRepository;
    private final SellerRepository sellerRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductImageRepository productImageRepository;
    private final InventoryRepository inventoryRepository;
    private final PasswordEncoder passwordEncoder;
    private final ObjectMapper objectMapper;

    @PostConstruct
    @Transactional
    public String seed() {
        if (productRepository.count() > 0) {
            String msg = "Database already seeded.";
            System.out.println(msg);
            return msg;
        }

        try (InputStream is = new ClassPathResource("seed.json").getInputStream()) {
            Map<String, Object> data = objectMapper.readValue(is, new TypeReference<Map<String, Object>>() {});
            List<Map<String, Object>> seedCategories = (List<Map<String, Object>>) data.get("categories");
            List<Map<String, Object>> seedProducts = (List<Map<String, Object>>) data.get("products");

            // Create default user & seller
            User user = userRepository.findByEmail("admin@shoppersend.com").orElseGet(() -> {
                User u = User.builder()
                        .email("admin@shoppersend.com")
                        .fullName("System Admin")
                        .password(passwordEncoder.encode("admin"))
                        .role(UserRole.ADMIN)
                        .status("ACTIVE")
                        .build();
                return userRepository.save(u);
            });

            Seller seller = sellerRepository.findByUserId(user.getId()).orElseGet(() -> {
                Seller s = Seller.builder()
                        .userId(user.getId())
                        .storeName("ShoppersEnd Official")
                        .status("ACTIVE")
                        .build();
                return sellerRepository.save(s);
            });

            // Seed Categories
            Map<String, UUID> categoryIdMap = new HashMap<>();
            for (Map<String, Object> catMap : seedCategories) {
                String idStr = (String) catMap.get("id");
                Category category = categoryRepository.findBySlug(idStr).orElseGet(() -> {
                    Category newCat = Category.builder()
                            .slug(idStr)
                            .name((String) catMap.get("name"))
                            .icon((String) catMap.get("icon"))
                            .imageUrl((String) catMap.get("image"))
                            .isActive(true)
                            .build();
                    return categoryRepository.save(newCat);
                });
                categoryIdMap.put(idStr, category.getId());
            }

            // Seed Products
            for (Map<String, Object> prodMap : seedProducts) {
                String catStr = (String) prodMap.get("categoryId");
                UUID categoryId = categoryIdMap.get(catStr);

                Product product = Product.builder()
                        .sellerId(user.getId())
                        .slug((String) prodMap.get("slug"))
                        .name((String) prodMap.get("name"))
                        .brand((String) prodMap.get("brand"))
                        .shortDescription((String) prodMap.get("shortDescription"))
                        .description((String) prodMap.get("description"))
                        .categoryId(categoryId)
                        .ratingAverage(BigDecimal.valueOf(((Number) prodMap.getOrDefault("rating", 0)).doubleValue()))
                        .ratingCount((Integer) prodMap.getOrDefault("reviews", 0))
                        .status("ACTIVE")
                        .build();

                // Set JSON fields
                if (prodMap.containsKey("highlights")) {
                    List<String> hl = (List<String>) prodMap.get("highlights");
                    Map<String, String> hm = new HashMap<>();
                    for (int i = 0; i < hl.size(); i++) hm.put(String.valueOf(i), hl.get(i));
                    product.setHighlights(hm);
                }

                if (prodMap.containsKey("specifications")) {
                    product.setSpecifications((List<Map<String, Object>>) prodMap.get("specifications"));
                }

                product = productRepository.save(product);

                // Images
                List<Map<String, Object>> images = (List<Map<String, Object>>) prodMap.get("images");
                if (images != null) {
                    for (int i = 0; i < images.size(); i++) {
                        Map<String, Object> imgMap = images.get(i);
                        ProductImage img = ProductImage.builder()
                                .productId(product.getId())
                                .url((String) imgMap.get("url"))
                                .alt((String) imgMap.get("alt"))
                                .displayOrder(i)
                                .build();
                        productImageRepository.save(img);
                    }
                }

                // Default Variant
                ProductVariant variant = ProductVariant.builder()
                        .productId(product.getId())
                        .sku(product.getSlug() + "-DEF")
                        .price(BigDecimal.valueOf(((Number) prodMap.get("price")).doubleValue()))
                        .mrp(BigDecimal.valueOf(((Number) prodMap.get("mrp")).doubleValue()))
                        .isActive(true)
                        .imageUrl(images != null && !images.isEmpty() ? (String) images.get(0).get("url") : null)
                        .build();
                variant = productVariantRepository.save(variant);

                // Inventory
                Inventory inventory = Inventory.builder()
                        .productVariantId(variant.getId())
                        .quantityAvailable((Integer) prodMap.getOrDefault("stock", 100))
                        .quantityReserved(0)
                        .build();
                inventoryRepository.save(inventory);
            }

            String successMsg = "Seed data successfully injected into PostgreSQL.";
            System.out.println(successMsg);
            return successMsg;
        } catch (Exception e) {
            String errMsg = "Seeding failed: " + e.getMessage();
            System.err.println(errMsg);
            e.printStackTrace();
            return errMsg;
        }
    }
}

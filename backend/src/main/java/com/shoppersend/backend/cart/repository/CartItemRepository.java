package com.shoppersend.backend.cart.repository;

import com.shoppersend.backend.cart.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, UUID> {
    List<CartItem> findByCart_Id(UUID cartId);
    Optional<CartItem> findByCart_IdAndProductVariantId(UUID cartId, UUID productVariantId);
    void deleteByCart_Id(UUID cartId);
}

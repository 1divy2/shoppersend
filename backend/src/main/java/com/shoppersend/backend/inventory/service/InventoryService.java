package com.shoppersend.backend.inventory.service;

import com.shoppersend.backend.inventory.entity.Inventory;
import com.shoppersend.backend.inventory.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;

    /**
     * Checks out stock for a given product variant.
     * Utilizes @Version in Inventory entity to provide Optimistic Locking.
     * If two users try to checkout the last item concurrently, one transaction will fail
     * with an ObjectOptimisticLockingFailureException, preventing overselling.
     */
    @Transactional
    public void reserveStock(UUID productVariantId, int quantityToReserve) {
        Inventory inventory = inventoryRepository.findByProductVariantId(productVariantId)
                .orElseThrow(() -> new IllegalArgumentException("Inventory record not found for variant"));

        int unreservedQuantity = inventory.getQuantityAvailable() - inventory.getQuantityReserved();

        if (unreservedQuantity < quantityToReserve) {
            throw new IllegalStateException("Insufficient stock available");
        }

        inventory.setQuantityReserved(inventory.getQuantityReserved() + quantityToReserve);
        inventoryRepository.save(inventory);
        
        log.info("Reserved {} units of product variant {}", quantityToReserve, productVariantId);
    }

    @Transactional
    public void confirmStockCheckout(UUID productVariantId, int quantityToCheckout) {
        Inventory inventory = inventoryRepository.findByProductVariantId(productVariantId)
                .orElseThrow(() -> new IllegalArgumentException("Inventory record not found"));

        if (inventory.getQuantityReserved() < quantityToCheckout) {
            throw new IllegalStateException("Cannot confirm checkout: reserved quantity is less than checkout quantity");
        }

        inventory.setQuantityAvailable(inventory.getQuantityAvailable() - quantityToCheckout);
        inventory.setQuantityReserved(inventory.getQuantityReserved() - quantityToCheckout);
        inventoryRepository.save(inventory);

        log.info("Confirmed checkout of {} units for product variant {}", quantityToCheckout, productVariantId);
    }
}

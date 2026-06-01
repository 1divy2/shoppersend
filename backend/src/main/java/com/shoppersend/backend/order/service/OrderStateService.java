package com.shoppersend.backend.order.service;

import com.shoppersend.backend.order.entity.Order;
import com.shoppersend.backend.order.entity.OrderStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderStateService {

    private final org.springframework.kafka.core.KafkaTemplate<String, Object> kafkaTemplate;

    /**
     * State Machine implementation for Order processing.
     * Enforces valid state transitions according to business rules.
     */
    @Transactional
    public Order transitionState(Order order, OrderStatus newStatus) {
        OrderStatus currentStatus = order.getStatus();

        if (isValidTransition(currentStatus, newStatus)) {
            log.info("Transitioning Order {} from {} to {}", order.getOrderNumber(), currentStatus, newStatus);
            order.setStatus(newStatus);
            
            // Publish Event-Driven Architecture (EDA) Kafka Message
            java.util.Map<String, Object> event = new java.util.HashMap<>();
            event.put("eventType", newStatus.name());
            event.put("userId", order.getUserId().toString());
            event.put("orderNumber", order.getOrderNumber());
            kafkaTemplate.send("order-events", event);
            
            return order;
        } else {
            throw new IllegalStateException(
                    String.format("Invalid order state transition from %s to %s for order %s",
                            currentStatus, newStatus, order.getOrderNumber())
            );
        }
    }

    private boolean isValidTransition(OrderStatus current, OrderStatus next) {
        if (current == next) return true;

        return switch (current) {
            case PENDING_PAYMENT -> next == OrderStatus.PAID || next == OrderStatus.CANCELLED;
            case PAID -> next == OrderStatus.PROCESSING || next == OrderStatus.REFUNDED;
            case PROCESSING -> next == OrderStatus.SHIPPED || next == OrderStatus.CANCELLED;
            case SHIPPED -> next == OrderStatus.DELIVERED || next == OrderStatus.REFUNDED;
            case DELIVERED -> next == OrderStatus.REFUNDED; // Returns process
            case CANCELLED, REFUNDED -> false; // Terminal states
        };
    }
}

package com.shoppersend.backend.order.service;

import com.shoppersend.backend.order.entity.Order;
import com.shoppersend.backend.order.entity.OrderStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.kafka.core.KafkaTemplate;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class OrderStateServiceTest {

    @Mock
    private KafkaTemplate<String, Object> kafkaTemplate;

    @InjectMocks
    private OrderStateService orderStateService;

    private Order order;

    @BeforeEach
    void setUp() {
        order = new Order();
        order.setId(UUID.randomUUID());
        order.setUserId(UUID.randomUUID());
        order.setOrderNumber("ORD-12345");
        order.setStatus(OrderStatus.PENDING_PAYMENT);
    }

    @Test
    void testValidTransition_PendingToPaid() {
        Order updatedOrder = orderStateService.transitionState(order, OrderStatus.PAID);
        
        assertEquals(OrderStatus.PAID, updatedOrder.getStatus());
        verify(kafkaTemplate).send(eq("order-events"), any(java.util.Map.class));
    }

    @Test
    void testInvalidTransition_PendingToShipped() {
        IllegalStateException exception = assertThrows(IllegalStateException.class, () -> {
            orderStateService.transitionState(order, OrderStatus.SHIPPED);
        });

        assertTrue(exception.getMessage().contains("Invalid order state transition"));
    }
}

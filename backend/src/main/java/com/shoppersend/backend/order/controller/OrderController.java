package com.shoppersend.backend.order.controller;

import com.shoppersend.backend.common.dto.ApiResponse;
import com.shoppersend.backend.identity.entity.User;
import com.shoppersend.backend.order.dto.OrderDto;
import com.shoppersend.backend.order.dto.PlaceOrderRequest;
import com.shoppersend.backend.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

import com.shoppersend.backend.order.repository.OrderRepository;
import com.shoppersend.backend.order.entity.Order;
import com.shoppersend.backend.order.entity.OrderStatus;
import com.shoppersend.backend.payment.entity.Payment;
import com.shoppersend.backend.payment.entity.PaymentStatus;
import com.shoppersend.backend.payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderDto>>> getUserOrders(@AuthenticationPrincipal User user) {
        if (user == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(ApiResponse.success(orderService.getUserOrders(user.getId()), "Orders retrieved"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<OrderDto>> placeOrder(
            @AuthenticationPrincipal User user,
            @RequestBody PlaceOrderRequest request) {
        if (user == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(ApiResponse.success(orderService.placeOrder(user.getId(), request), "Order placed"));
    }

    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;

    @PostMapping("/{id}/pay")
    public ResponseEntity<ApiResponse<String>> payOrder(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id) {
        if (user == null) return ResponseEntity.status(401).build();
        
        Order order = orderRepository.findById(id).orElse(null);
        if (order == null || !order.getUserId().equals(user.getId())) {
            return ResponseEntity.notFound().build();
        }
        
        if (order.getStatus() != OrderStatus.PENDING_PAYMENT) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Order is not in PENDING state"));
        }

        // Mock payment logic: 90% success rate
        boolean success = Math.random() > 0.1;
        
        Payment payment = Payment.builder()
                .orderId(order.getId())
                .provider("MOCK_STRIPE")
                .transactionId("txn_mock_" + UUID.randomUUID().toString().substring(0, 8))
                .status(success ? PaymentStatus.CAPTURED : PaymentStatus.FAILED)
                .amount(order.getTotalAmount())
                .currency("INR")
                .build();
                
        paymentRepository.save(payment);
        
        if (success) {
            order.setStatus(OrderStatus.PROCESSING);
            orderRepository.save(order);
            return ResponseEntity.ok(ApiResponse.success("Payment successful", "Success"));
        } else {
            return ResponseEntity.badRequest().body(ApiResponse.error("Payment failed"));
        }
    }
}

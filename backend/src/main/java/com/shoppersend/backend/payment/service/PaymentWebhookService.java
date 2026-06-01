package com.shoppersend.backend.payment.service;

import com.shoppersend.backend.order.entity.Order;
import com.shoppersend.backend.order.entity.OrderStatus;
import com.shoppersend.backend.order.repository.OrderRepository;
import com.shoppersend.backend.order.service.OrderStateService;
import com.shoppersend.backend.payment.entity.Payment;
import com.shoppersend.backend.payment.entity.PaymentStatus;
import com.shoppersend.backend.payment.entity.WebhookEvent;
import com.shoppersend.backend.payment.repository.PaymentRepository;
import com.shoppersend.backend.payment.repository.WebhookEventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentWebhookService {

    private final WebhookEventRepository webhookEventRepository;
    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final OrderStateService orderStateService;

    /**
     * Process an incoming payment webhook idempotently.
     * Webhooks from Stripe/Razorpay can be delivered multiple times.
     * This method ensures we only process 'payment_success' once per event.
     */
    @Transactional
    public void processPaymentSuccessWebhook(String eventId, String provider, String payload, String transactionId) {
        
        // 1. Idempotency Check: Have we already processed this exact event?
        if (webhookEventRepository.existsByEventId(eventId)) {
            log.info("Webhook event {} already processed. Skipping to ensure idempotency.", eventId);
            return; 
        }

        log.info("Processing new webhook event {} from {}", eventId, provider);

        // 2. Process the actual payment success logic
        Payment payment = paymentRepository.findByTransactionId(transactionId)
                .orElseThrow(() -> new IllegalArgumentException("Payment not found for transaction " + transactionId));
        
        if (payment.getStatus() != PaymentStatus.CAPTURED) {
            payment.setStatus(PaymentStatus.CAPTURED);
            paymentRepository.save(payment);

            // Update the associated Order state
            Order order = orderRepository.findById(payment.getOrderId())
                    .orElseThrow(() -> new IllegalArgumentException("Order not found"));
            
            // Uses the State Machine we built in Phase 5
            orderStateService.transitionState(order, OrderStatus.PAID);
            orderRepository.save(order);
        }

        // 3. Record the event to prevent future duplicate processing (Audit Logging)
        WebhookEvent event = WebhookEvent.builder()
                .eventId(eventId)
                .provider(provider)
                .eventType("payment_success")
                .payload(payload)
                .build();
        
        webhookEventRepository.save(event);
        log.info("Successfully processed and recorded webhook event {}", eventId);
    }
}

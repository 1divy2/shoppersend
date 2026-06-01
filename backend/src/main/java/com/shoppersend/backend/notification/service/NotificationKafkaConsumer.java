package com.shoppersend.backend.notification.service;

import com.shoppersend.backend.notification.entity.Notification;
import com.shoppersend.backend.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationKafkaConsumer {

    private final NotificationRepository notificationRepository;

    /**
     * Listens to the Kafka "order-events" topic.
     * Demonstrates Event-Driven Architecture (EDA) decoupling.
     */
    @KafkaListener(topics = "order-events", groupId = "shoppersend-group")
    public void handleOrderEvent(Map<String, Object> event) {
        log.info("Received Kafka order event: {}", event);
        
        try {
            String eventType = (String) event.get("eventType");
            String userIdStr = (String) event.get("userId");
            String orderNumber = (String) event.get("orderNumber");
            
            if (userIdStr == null || orderNumber == null) return;
            
            UUID userId = UUID.fromString(userIdStr);
            String title = "Order Update";
            String message = String.format("Your order %s status has been updated to: %s", orderNumber, eventType);
            
            Notification notification = Notification.builder()
                    .userId(userId)
                    .title(title)
                    .message(message)
                    .build();
                    
            notificationRepository.save(notification);
            log.info("Saved notification for user {}", userId);
            
            // Mock Email Service
            sendMockEmail(userId, title, message);
            
        } catch (Exception e) {
            log.error("Failed to process order event from Kafka", e);
        }
    }
    private void sendMockEmail(UUID userId, String title, String message) {
        log.info("================================================");
        log.info("📧 MOCK EMAIL NOTIFICATION SENT");
        log.info("To: user_{}@example.com", userId);
        log.info("Subject: {}", title);
        log.info("Body: {}", message);
        log.info("================================================");
    }
}

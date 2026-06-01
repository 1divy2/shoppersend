package com.shoppersend.backend.order.dto;

import com.shoppersend.backend.identity.dto.AddressDto;
import com.shoppersend.backend.order.entity.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDto {
    private UUID id;
    private String orderNumber;
    private UUID userId;
    private List<OrderItemDto> items;
    private BigDecimal subtotal;
    private BigDecimal shippingFee;
    private BigDecimal tax;
    private BigDecimal discount;
    private BigDecimal total;
    private OrderStatus status;
    private AddressDto shippingAddress;
    private String paymentMethod;
    private String paymentStatus;
    private LocalDateTime placedAt;
}

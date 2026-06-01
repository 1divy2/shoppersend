package com.shoppersend.backend.order.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class PlaceOrderRequest {
    private UUID addressId;
    private String paymentMethod;
    private String couponCode;
}

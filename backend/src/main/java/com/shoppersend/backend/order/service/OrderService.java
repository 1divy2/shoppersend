package com.shoppersend.backend.order.service;

import com.shoppersend.backend.cart.dto.CartDto;
import com.shoppersend.backend.cart.dto.CartItemDto;
import com.shoppersend.backend.cart.service.CartService;
import com.shoppersend.backend.identity.dto.AddressDto;
import com.shoppersend.backend.identity.entity.Address;
import com.shoppersend.backend.identity.repository.AddressRepository;
import com.shoppersend.backend.order.dto.OrderDto;
import com.shoppersend.backend.order.dto.OrderItemDto;
import com.shoppersend.backend.order.dto.PlaceOrderRequest;
import com.shoppersend.backend.order.entity.Order;
import com.shoppersend.backend.order.entity.OrderItem;
import com.shoppersend.backend.order.entity.OrderStatus;
import com.shoppersend.backend.order.repository.OrderRepository;
import com.shoppersend.backend.catalog.entity.Product;
import com.shoppersend.backend.catalog.entity.ProductImage;
import com.shoppersend.backend.catalog.repository.ProductImageRepository;
import com.shoppersend.backend.catalog.repository.ProductRepository;
import com.shoppersend.backend.catalog.repository.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartService cartService;
    private final AddressRepository addressRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;

    @Transactional
    public OrderDto placeOrder(UUID userId, PlaceOrderRequest request) {
        CartDto cart = cartService.getCart(userId);
        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        Address address = addressRepository.findById(request.getAddressId())
                .orElseThrow(() -> new RuntimeException("Address not found"));
        
        if (!address.getUserId().equals(userId)) {
            throw new RuntimeException("Address belongs to another user");
        }

        BigDecimal subtotal = cart.getSubtotal();
        BigDecimal shippingFee = subtotal.compareTo(BigDecimal.valueOf(999)) >= 0 ? BigDecimal.ZERO : BigDecimal.valueOf(49);
        BigDecimal tax = subtotal.multiply(BigDecimal.valueOf(0.05));
        BigDecimal total = subtotal.add(shippingFee).add(tax);

        Order order = Order.builder()
                .userId(userId)
                .orderNumber("ORD-" + System.currentTimeMillis())
                .status("COD".equalsIgnoreCase(request.getPaymentMethod()) ? OrderStatus.PROCESSING : OrderStatus.PAID)
                .subtotal(subtotal)
                .shippingAmount(shippingFee)
                .taxAmount(tax)
                .totalAmount(total)
                .discount(BigDecimal.ZERO)
                .shippingAddressId(address.getId())
                .paymentMethod(request.getPaymentMethod())
                .paymentStatus("COD".equalsIgnoreCase(request.getPaymentMethod()) ? "PENDING" : "PAID")
                .build();
        
        order = orderRepository.save(order);

        for (CartItemDto item : cart.getItems()) {
            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .productVariantId(item.getVariantId())
                    .quantity(item.getQuantity())
                    .unitPrice(item.getUnitPrice())
                    .build();
            order.getItems().add(orderItem);
        }
        
        order = orderRepository.save(order);
        cartService.clearCart(userId);

        return mapToDto(order, address);
    }

    @Transactional(readOnly = true)
    public List<OrderDto> getUserOrders(UUID userId) {
        return orderRepository.findByUserId(userId).stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .map(o -> {
                    Address a = o.getShippingAddressId() != null ? 
                            addressRepository.findById(o.getShippingAddressId()).orElse(null) : null;
                    return mapToDto(o, a);
                })
                .collect(Collectors.toList());
    }

    private OrderDto mapToDto(Order order, Address address) {
        AddressDto addressDto = null;
        if (address != null) {
            addressDto = AddressDto.builder()
                    .id(address.getId())
                    .userId(address.getUserId())
                    .fullName(address.getFullName())
                    .phone(address.getPhone())
                    .line1(address.getLine1())
                    .line2(address.getLine2())
                    .city(address.getCity())
                    .state(address.getState())
                    .pincode(address.getPincode())
                    .country(address.getCountry())
                    .isDefault(address.getIsDefault())
                    .label(address.getLabel())
                    .build();
        }

        List<OrderItemDto> itemDtos = order.getItems().stream().map(item -> {
            com.shoppersend.backend.catalog.entity.ProductVariant variant = 
                productVariantRepository.findById(item.getProductVariantId()).orElse(null);
            
            String productName = "Unknown Product";
            String productImage = "";
            UUID productId = null;
            
            if (variant != null) {
                productId = variant.getProductId();
                Product product = productRepository.findById(productId).orElse(null);
                if (product != null) {
                    productName = product.getName();
                    List<ProductImage> images = productImageRepository.findByProductIdOrderByDisplayOrderAsc(productId);
                    if (!images.isEmpty()) {
                        productImage = images.get(0).getUrl();
                    }
                }
            }
            
            return OrderItemDto.builder()
                    .productId(productId)
                    .variantId(item.getProductVariantId())
                    .quantity(item.getQuantity())
                    .unitPrice(item.getUnitPrice())
                    .lineTotal(item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                    .productName(productName)
                    .productImage(productImage)
                    .build();
        }).collect(Collectors.toList());

        return OrderDto.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .userId(order.getUserId())
                .items(itemDtos)
                .subtotal(order.getSubtotal())
                .shippingFee(order.getShippingAmount())
                .tax(order.getTaxAmount())
                .discount(order.getDiscount())
                .total(order.getTotalAmount())
                .status(order.getStatus())
                .shippingAddress(addressDto)
                .paymentMethod(order.getPaymentMethod())
                .paymentStatus(order.getPaymentStatus())
                .placedAt(order.getCreatedAt())
                .build();
    }
}

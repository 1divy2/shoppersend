package com.shoppersend.backend.identity.controller;

import com.shoppersend.backend.common.dto.ApiResponse;
import com.shoppersend.backend.identity.dto.AddressDto;
import com.shoppersend.backend.identity.entity.User;
import com.shoppersend.backend.identity.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AddressDto>>> getAddresses(@AuthenticationPrincipal User user) {
        if (user == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(ApiResponse.success(addressService.getAddresses(user.getId()), "Addresses retrieved"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AddressDto>> createAddress(
            @AuthenticationPrincipal User user,
            @RequestBody AddressDto addressDto) {
        if (user == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(ApiResponse.success(addressService.addAddress(user.getId(), addressDto), "Address created"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> removeAddress(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id) {
        if (user == null) return ResponseEntity.status(401).build();
        addressService.deleteAddress(user.getId(), id);
        return ResponseEntity.ok(ApiResponse.success(null, "Address removed"));
    }
}

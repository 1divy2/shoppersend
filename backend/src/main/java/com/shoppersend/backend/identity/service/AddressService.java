package com.shoppersend.backend.identity.service;

import com.shoppersend.backend.identity.dto.AddressDto;
import com.shoppersend.backend.identity.entity.Address;
import com.shoppersend.backend.identity.repository.AddressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AddressService {

    private final AddressRepository addressRepository;

    @Transactional(readOnly = true)
    public List<AddressDto> getAddresses(UUID userId) {
        return addressRepository.findByUserId(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public AddressDto addAddress(UUID userId, AddressDto dto) {
        // If this is the first address, make it default
        List<Address> existing = addressRepository.findByUserId(userId);
        boolean isDefault = existing.isEmpty() || (dto.getIsDefault() != null && dto.getIsDefault());

        if (isDefault) {
            existing.forEach(a -> {
                a.setIsDefault(false);
                addressRepository.save(a);
            });
        }

        Address address = Address.builder()
                .userId(userId)
                .fullName(dto.getFullName())
                .phone(dto.getPhone())
                .line1(dto.getLine1())
                .line2(dto.getLine2())
                .city(dto.getCity())
                .state(dto.getState())
                .pincode(dto.getPincode())
                .country(dto.getCountry())
                .isDefault(isDefault)
                .label(dto.getLabel())
                .build();

        address = addressRepository.save(address);
        return mapToDto(address);
    }

    @Transactional
    public void deleteAddress(UUID userId, UUID addressId) {
        addressRepository.findById(addressId)
                .filter(a -> a.getUserId().equals(userId))
                .ifPresent(addressRepository::delete);
    }

    private AddressDto mapToDto(Address address) {
        return AddressDto.builder()
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
}

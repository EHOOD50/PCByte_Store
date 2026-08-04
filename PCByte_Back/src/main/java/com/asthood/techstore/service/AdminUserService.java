package com.asthood.techstore.service;

import com.asthood.techstore.dto.AdminUserListDTO;
import com.asthood.techstore.model.User;
import com.asthood.techstore.model.UserStatus;
import com.asthood.techstore.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminUserService {

    private final UserRepository userRepository;

    public List<AdminUserListDTO> getUsers() {

        return userRepository
                .findAll()
                .stream()
                .map(this::toListDTO)
                .toList();
    }

    @Transactional
    public AdminUserListDTO updateStatus(
            Long userId,
            UserStatus status
    ) {

        User user =
                userRepository
                        .findById(userId)
                        .orElseThrow(() ->
                                new EntityNotFoundException(
                                        "Usuario no encontrado."
                                ));

        user.setStatus(status);

        return toListDTO(
                userRepository.save(user)
        );
    }

    private AdminUserListDTO toListDTO(
            User user
    ) {

        return AdminUserListDTO
                .builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .status(user.getStatus())
                .emailVerified(user.isEmailVerified())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .orderCount(
                        user.getOrders() == null
                                ? 0
                                : user.getOrders().size()
                )
                .addressCount(
                        user.getAddresses() == null
                                ? 0
                                : user.getAddresses().size()
                )
                .build();
    }
}
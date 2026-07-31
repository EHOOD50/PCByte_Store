package com.asthood.techstore.config;

import com.asthood.techstore.model.User;
import com.asthood.techstore.model.UserRole;
import com.asthood.techstore.model.UserStatus;
import com.asthood.techstore.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.email}")
    private String adminEmail;

    @Value("${admin.password}")
    private String adminPassword;

    public AdminInitializer(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {

        if (userRepository.existsByEmail(adminEmail)) {
            return;
        }

        LocalDateTime now = LocalDateTime.now();

        User admin = User.builder()
                .firstName("Administrador")
                .lastName("PCByte")
                .email(adminEmail.toLowerCase().trim())
                .password(passwordEncoder.encode(adminPassword))
                .status(UserStatus.REGISTRADO)
                .role(UserRole.ADMIN)
                .emailVerifiedAt(now)
                .createdAt(now)
                .updatedAt(now)
                .build();

        userRepository.save(admin);

        System.out.println();
        System.out.println("=========================================");
        System.out.println("Administrador inicial creado.");
        System.out.println("Email: " + adminEmail);
        System.out.println("=========================================");
        System.out.println();
    }
}
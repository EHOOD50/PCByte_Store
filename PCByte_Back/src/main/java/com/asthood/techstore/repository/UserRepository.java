package com.asthood.techstore.repository;

import com.asthood.techstore.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // Este es el que te falta y causa el error de compilación:
    boolean existsByEmail(String email);
    Optional<User> findByEmail(String email);
}
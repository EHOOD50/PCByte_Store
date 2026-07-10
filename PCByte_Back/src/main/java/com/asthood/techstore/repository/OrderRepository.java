package com.asthood.techstore.repository;

import com.asthood.techstore.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByPaymentId(String paymentId);

    // Debe ser UserId (si tu atributo en Order es User) y OrderByIdDesc
    Optional<Order> findFirstByUserIdOrderByIdDesc(Long userId);
}
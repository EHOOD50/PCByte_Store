package com.asthood.techstore.repository;

import com.asthood.techstore.domain.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // 🔍 Buscar por nombre (Usado por el Webhook)
    Optional<Product> findByName(String name);

    Page<Product> findByNameContainingIgnoreCaseAndCategoryNameContainingIgnoreCaseAndBrandNameContainingIgnoreCase(
            String name,
            String categoryName,
            String brandName,
            Pageable pageable);

    // 📉 Descontar stock por ID con validación de cantidad
    @Modifying
    @Transactional
    @Query("UPDATE Product p SET p.stock = p.stock - :quantity WHERE p.id = :productId AND p.stock >= :quantity")
    int decreaseStock(@Param("productId") Long productId, @Param("quantity") Integer quantity);

    // Agrega esto dentro de tu ProductRepository.java
    @Modifying
    @Transactional
    @Query("UPDATE Product p SET p.stock = p.stock - :quantity WHERE p.name = :name AND p.stock >= :quantity")
    int decreaseStockByName(@Param("name") String name, @Param("quantity") Integer quantity);
}

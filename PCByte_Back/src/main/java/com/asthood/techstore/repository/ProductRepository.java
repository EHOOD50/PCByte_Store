package com.asthood.techstore.repository;

import com.asthood.techstore.domain.entity.Product;
import com.asthood.techstore.repository.projection.TopSellingProductProjection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository
        extends JpaRepository<Product, Long> {

    Optional<Product> findByName(
            String name
    );

    Page<Product>
    findByNameContainingIgnoreCaseAndCategoryNameContainingIgnoreCaseAndBrandNameContainingIgnoreCase(
            String name,
            String categoryName,
            String brandName,
            Pageable pageable
    );

    long countByStock(
            Integer stock
    );

    long countByStockLessThanEqual(
            Integer stock
    );

    List<Product>
    findByStockOrderByNameAsc(
            Integer stock,
            Pageable pageable
    );

    List<Product>
    findByStockBetweenOrderByStockAscNameAsc(
            Integer minimumStock,
            Integer maximumStock,
            Pageable pageable
    );

    List<Product>
    findByStockLessThanEqualOrderByStockAscNameAsc(
            Integer stock,
            Pageable pageable
    );

    @Query("""
            SELECT
                p.id AS productId,
                p.name AS name,
                p.imageUrl AS imageUrl,
                SUM(oi.quantity) AS unitsSold,
                SUM(oi.price * oi.quantity) AS revenue,
                p.stock AS currentStock
            FROM OrderItem oi
            JOIN oi.product p
            JOIN oi.order o
            WHERE o.status = com.asthood.techstore.model.OrderStatus.PAGADO
            GROUP BY
                p.id,
                p.name,
                p.imageUrl,
                p.stock
            ORDER BY
                SUM(oi.quantity) DESC,
                SUM(oi.price * oi.quantity) DESC
            """)
    List<TopSellingProductProjection>
    findTopSellingProducts(
            Pageable pageable
    );

    @Modifying
    @Transactional
    @Query("""
            UPDATE Product p
            SET p.stock = p.stock - :quantity
            WHERE p.id = :productId
              AND p.stock >= :quantity
            """)
    int decreaseStock(
            @Param("productId") Long productId,
            @Param("quantity") Integer quantity
    );

    @Modifying
    @Transactional
    @Query("""
            UPDATE Product p
            SET p.stock = p.stock - :quantity
            WHERE p.name = :name
              AND p.stock >= :quantity
            """)
    int decreaseStockByName(
            @Param("name") String name,
            @Param("quantity") Integer quantity
    );
}
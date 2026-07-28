package com.asthood.techstore.repository;

import com.asthood.techstore.model.Order;
import com.asthood.techstore.model.OrderStatus;

import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository
        extends JpaRepository<Order, Long> {

    Optional<Order> findByPaymentId(
            String paymentId
    );

    Optional<Order>
    findFirstByUserIdOrderByIdDesc(
            Long userId
    );

    /*
     * Recupera todas las órdenes de un cliente,
     * mostrando primero las compras más recientes.
     */
    List<Order>
    findByUserIdOrderByCreatedAtDesc(
            Long userId
    );

    long countByStatus(
            OrderStatus status
    );

    long countByStatusIn(
            Collection<OrderStatus> statuses
    );

    long countByStatusAndCreatedAtBefore(
            OrderStatus status,
            LocalDateTime createdAt
    );

    List<Order>
    findByStatusAndCreatedAtBeforeOrderByCreatedAtAsc(
            OrderStatus status,
            LocalDateTime createdAt,
            Pageable pageable
    );

    List<Order>
    findByStatusInOrderByCreatedAtAsc(
            Collection<OrderStatus> statuses,
            Pageable pageable
    );

    @Query("""
            SELECT COALESCE(SUM(o.total), 0)
            FROM Order o
            WHERE o.status = :status
              AND o.createdAt >= :start
              AND o.createdAt < :end
            """)
    BigDecimal sumTotalByStatusAndCreatedAtBetween(
            @Param("status") OrderStatus status,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    @Query("""
            SELECT COALESCE(AVG(o.total), 0)
            FROM Order o
            WHERE o.status = :status
            """)
    BigDecimal averageTotalByStatus(
            @Param("status") OrderStatus status
    );

    @Query("""
            SELECT o
            FROM Order o
            ORDER BY o.createdAt DESC
            """)
    List<Order> findLatestOrders(
            Pageable pageable
    );

    @Query("""
            SELECT FUNCTION('DATE', o.createdAt),
                   COALESCE(SUM(o.total), 0)
            FROM Order o
            WHERE o.status = :status
              AND o.createdAt >= :start
              AND o.createdAt < :end
            GROUP BY FUNCTION('DATE', o.createdAt)
            ORDER BY FUNCTION('DATE', o.createdAt)
            """)
    List<Object[]> findDailySales(
            @Param("status") OrderStatus status,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    /*
     * Recupera y bloquea una orden pendiente que puede
     * reutilizarse para un nuevo intento de pago.
     *
     * También carga los productos de la orden para poder
     * comparar el contenido con el carrito actual.
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            SELECT DISTINCT o
            FROM Order o
            LEFT JOIN FETCH o.orderItems oi
            LEFT JOIN FETCH oi.product
            WHERE o.id = :orderId
              AND LOWER(o.email) = LOWER(:email)
              AND o.status = :status
              AND (
                    o.paymentId IS NULL
                    OR TRIM(o.paymentId) = ''
              )
            """)
    Optional<Order> findReusablePendingOrderForUpdate(
            @Param("orderId") Long orderId,
            @Param("email") String email,
            @Param("status") OrderStatus status
    );

    /*
     * Recupera y bloquea una orden para confirmar el pago
     * y descontar el stock de manera segura.
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            SELECT DISTINCT o
            FROM Order o
            LEFT JOIN FETCH o.orderItems oi
            LEFT JOIN FETCH oi.product
            WHERE o.id = :orderId
            """)
    Optional<Order> findByIdForUpdate(
            @Param("orderId") Long orderId
    );
}
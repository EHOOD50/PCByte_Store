package com.asthood.techstore.service;

import com.asthood.techstore.domain.entity.Product;
import com.asthood.techstore.dto.AdminDashboardDTO;
import com.asthood.techstore.model.AlertAction;
import com.asthood.techstore.model.AlertLevel;
import com.asthood.techstore.model.AlertType;
import com.asthood.techstore.model.Order;
import com.asthood.techstore.model.OrderStatus;
import com.asthood.techstore.repository.OrderRepository;
import com.asthood.techstore.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AlertService {

    private static final int OUT_OF_STOCK = 0;
    private static final int LOW_STOCK_MIN = 1;
    private static final int LOW_STOCK_MAX = 5;

    private static final int MAX_PRODUCT_ALERTS = 5;
    private static final int MAX_ORDER_ALERTS = 5;
    private static final int MAX_DASHBOARD_ALERTS = 10;

    private static final long OLD_PENDING_ORDER_HOURS = 24;
    private static final long PAID_WAITING_PREPARATION_HOURS = 12;

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public List<AdminDashboardDTO.DashboardAlertDTO> getDashboardAlerts() {

        List<AdminDashboardDTO.DashboardAlertDTO> alerts =
                new ArrayList<>();

        alerts.addAll(
                getOutOfStockAlerts()
        );

        alerts.addAll(
                getLowStockAlerts()
        );

        alerts.addAll(
                getOldPendingOrderAlerts()
        );

        alerts.addAll(
                getPaidWaitingPreparationAlerts()
        );

        if (alerts.isEmpty()) {
            alerts.add(
                    buildSuccessAlert()
            );
        }

        return alerts.stream()
                .sorted(
                        Comparator
                                .comparingInt(
                                        this::getPriority
                                )
                                .thenComparing(
                                        AdminDashboardDTO
                                                .DashboardAlertDTO
                                                ::getCreatedAt,
                                        Comparator.nullsLast(
                                                Comparator.reverseOrder()
                                        )
                                )
                )
                .limit(
                        MAX_DASHBOARD_ALERTS
                )
                .toList();
    }

    private List<AdminDashboardDTO.DashboardAlertDTO>
    getOutOfStockAlerts() {

        List<Product> products =
                productRepository
                        .findByStockOrderByNameAsc(
                                OUT_OF_STOCK,
                                PageRequest.of(
                                        0,
                                        MAX_PRODUCT_ALERTS
                                )
                        );

        return products.stream()
                .map(
                        product ->
                                buildProductAlert(
                                        "OUT_OF_STOCK",
                                        AlertLevel.CRITICAL,
                                        "Producto sin stock",
                                        product.getName()
                                                + " no tiene unidades disponibles.",
                                        product
                                )
                )
                .toList();
    }

    private List<AdminDashboardDTO.DashboardAlertDTO>
    getLowStockAlerts() {

        List<Product> products =
                productRepository
                        .findByStockBetweenOrderByStockAscNameAsc(
                                LOW_STOCK_MIN,
                                LOW_STOCK_MAX,
                                PageRequest.of(
                                        0,
                                        MAX_PRODUCT_ALERTS
                                )
                        );

        return products.stream()
                .map(
                        product ->
                                buildProductAlert(
                                        "LOW_STOCK",
                                        AlertLevel.WARNING,
                                        "Stock crítico",
                                        buildLowStockDescription(
                                                product
                                        ),
                                        product
                                )
                )
                .toList();
    }

    private String buildLowStockDescription(
            Product product
    ) {

        int stock =
                product.getStock();

        String unitText =
                stock == 1
                        ? "unidad disponible"
                        : "unidades disponibles";

        return product.getName()
                + " tiene solo "
                + stock
                + " "
                + unitText
                + ".";
    }

    private List<AdminDashboardDTO.DashboardAlertDTO>
    getOldPendingOrderAlerts() {

        LocalDateTime limit =
                LocalDateTime.now()
                        .minusHours(
                                OLD_PENDING_ORDER_HOURS
                        );

        List<Order> orders =
                orderRepository
                        .findByStatusAndCreatedAtBeforeOrderByCreatedAtAsc(
                                OrderStatus.PENDIENTE,
                                limit,
                                PageRequest.of(
                                        0,
                                        MAX_ORDER_ALERTS
                                )
                        );

        return orders.stream()
                .map(
                        order ->
                                buildOrderAlert(
                                        "OLD_PENDING_ORDER",
                                        AlertLevel.CRITICAL,
                                        "Pedido pendiente atrasado",
                                        "El pedido #"
                                                + order.getId()
                                                + " lleva más de "
                                                + OLD_PENDING_ORDER_HOURS
                                                + " horas en estado PENDIENTE.",
                                        order
                                )
                )
                .toList();
    }

    private List<AdminDashboardDTO.DashboardAlertDTO>
    getPaidWaitingPreparationAlerts() {

        LocalDateTime limit =
                LocalDateTime.now()
                        .minusHours(
                                PAID_WAITING_PREPARATION_HOURS
                        );

        List<Order> orders =
                orderRepository
                        .findByStatusAndCreatedAtBeforeOrderByCreatedAtAsc(
                                OrderStatus.PAGADO,
                                limit,
                                PageRequest.of(
                                        0,
                                        MAX_ORDER_ALERTS
                                )
                        );

        return orders.stream()
                .map(
                        order ->
                                buildOrderAlert(
                                        "PAID_WAITING_PREPARATION",
                                        AlertLevel.WARNING,
                                        "Pedido pagado sin preparar",
                                        "El pedido #"
                                                + order.getId()
                                                + " lleva más de "
                                                + PAID_WAITING_PREPARATION_HOURS
                                                + " horas pagado y aún no pasa a PREPARANDO.",
                                        order
                                )
                )
                .toList();
    }

    private AdminDashboardDTO.DashboardAlertDTO
    buildProductAlert(
            String code,
            AlertLevel level,
            String title,
            String description,
            Product product
    ) {

        return AdminDashboardDTO
                .DashboardAlertDTO
                .builder()

                .code(code)

                .type(
                        AlertType.PRODUCT
                )

                .level(level)

                .title(title)

                .description(description)

                .referenceId(
                        product.getId()
                )

                .action(
                        AlertAction.OPEN_PRODUCT
                )

                .createdAt(
                        LocalDateTime.now()
                )

                .build();
    }

    private AdminDashboardDTO.DashboardAlertDTO
    buildOrderAlert(
            String code,
            AlertLevel level,
            String title,
            String description,
            Order order
    ) {

        return AdminDashboardDTO
                .DashboardAlertDTO
                .builder()

                .code(code)

                .type(
                        AlertType.ORDER
                )

                .level(level)

                .title(title)

                .description(description)

                .referenceId(
                        order.getId()
                )

                .action(
                        AlertAction.OPEN_ORDER
                )

                .createdAt(
                        LocalDateTime.now()
                )

                .build();
    }

    private AdminDashboardDTO.DashboardAlertDTO
    buildSuccessAlert() {

        return AdminDashboardDTO
                .DashboardAlertDTO
                .builder()

                .code(
                        "SYSTEM_HEALTHY"
                )

                .type(
                        AlertType.SYSTEM
                )

                .level(
                        AlertLevel.SUCCESS
                )

                .title(
                        "Operación al día"
                )

                .description(
                        "No existen productos agotados, pedidos atrasados ni alertas críticas."
                )

                .referenceId(null)

                .action(
                        AlertAction.NONE
                )

                .createdAt(
                        LocalDateTime.now()
                )

                .build();
    }

    private int getPriority(
            AdminDashboardDTO.DashboardAlertDTO alert
    ) {

        if (alert.getLevel() == null) {
            return 99;
        }

        return switch (
                alert.getLevel()
                ) {
            case CRITICAL -> 0;
            case WARNING -> 1;
            case INFO -> 2;
            case SUCCESS -> 3;
        };
    }
}
package com.asthood.techstore.service;

import com.asthood.techstore.dto.AdminDashboardDTO;
import com.asthood.techstore.model.Order;
import com.asthood.techstore.model.OrderStatus;
import com.asthood.techstore.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.TextStyle;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OrderMetricsService {

    private final OrderRepository orderRepository;

    @Transactional(readOnly = true)
    public BigDecimal getSalesToday() {

        LocalDate today = LocalDate.now();

        return orderRepository.sumTotalByStatusAndCreatedAtBetween(
                OrderStatus.PAGADO,
                today.atStartOfDay(),
                today.plusDays(1).atStartOfDay()
        );
    }

    @Transactional(readOnly = true)
    public BigDecimal getSalesCurrentMonth() {

        LocalDate today = LocalDate.now();

        LocalDate firstDay =
                today.withDayOfMonth(1);

        return orderRepository.sumTotalByStatusAndCreatedAtBetween(
                OrderStatus.PAGADO,
                firstDay.atStartOfDay(),
                firstDay.plusMonths(1).atStartOfDay()
        );
    }

    @Transactional(readOnly = true)
    public BigDecimal getAverageTicket() {

        return orderRepository.averageTotalByStatus(
                OrderStatus.PAGADO
        );
    }

    @Transactional(readOnly = true)
    public Long getPendingOrders() {

        return orderRepository.countByStatus(
                OrderStatus.PENDIENTE
        );
    }

    @Transactional(readOnly = true)
    public Long getPendingShipments() {

        return orderRepository.countByStatus(
                OrderStatus.PAGADO
        )
                + orderRepository.countByStatus(
                OrderStatus.PREPARANDO
        );
    }

    @Transactional(readOnly = true)
    public List<AdminDashboardDTO.LatestOrderDTO>
    getLatestOrders() {

        return orderRepository
                .findLatestOrders(
                        PageRequest.of(0, 5)
                )
                .stream()
                .map(this::toLatestOrderDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AdminDashboardDTO.DailySalesDTO>
    getWeeklySales() {

        LocalDate today = LocalDate.now();
        LocalDate start = today.minusDays(6);

        List<Object[]> results =
                orderRepository.findDailySales(
                        OrderStatus.PAGADO,
                        start.atStartOfDay(),
                        today.plusDays(1).atStartOfDay()
                );

        Map<LocalDate, BigDecimal> sales =
                new HashMap<>();

        for (Object[] row : results) {

            LocalDate date =
                    ((java.sql.Date) row[0]).toLocalDate();

            BigDecimal total =
                    (BigDecimal) row[1];

            sales.put(
                    date,
                    total
            );
        }

        return start
                .datesUntil(
                        today.plusDays(1)
                )
                .map(date ->
                        AdminDashboardDTO
                                .DailySalesDTO
                                .builder()

                                .day(
                                        date.getDayOfWeek()
                                                .getDisplayName(
                                                        TextStyle.SHORT,
                                                        new Locale("es", "CL")
                                                )
                                )

                                .date(
                                        date.toString()
                                )

                                .total(
                                        sales.getOrDefault(
                                                date,
                                                BigDecimal.ZERO
                                        )
                                )

                                .build()
                )
                .toList();
    }

    private AdminDashboardDTO.LatestOrderDTO
    toLatestOrderDTO(
            Order order
    ) {

        return AdminDashboardDTO
                .LatestOrderDTO
                .builder()

                .id(
                        order.getId()
                )

                .customerName(
                        resolveCustomerName(
                                order
                        )
                )

                .total(
                        order.getTotal()
                )

                .status(
                        order.getStatus() != null
                                ? order.getStatus().name()
                                : "SIN_ESTADO"
                )

                .createdAt(
                        order.getCreatedAt()
                )

                .build();
    }

    private String resolveCustomerName(
            Order order
    ) {

        if (order.getFullName() != null &&
                !order.getFullName().isBlank()) {

            return order.getFullName().trim();
        }

        if (order.getUser() != null &&
                order.getUser().getFirstName() != null &&
                !order.getUser().getFirstName().isBlank()) {

            String firstName =
                    order.getUser()
                            .getFirstName()
                            .trim();

            String lastName =
                    order.getUser()
                            .getLastName();

            if (lastName != null &&
                    !lastName.isBlank()) {

                return firstName +
                        " " +
                        lastName.trim();
            }

            return firstName;
        }

        if (order.getEmail() != null &&
                !order.getEmail().isBlank()) {

            return order.getEmail().trim();
        }

        return "Cliente sin identificar";
    }
}
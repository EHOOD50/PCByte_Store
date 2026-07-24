package com.asthood.techstore.service;

import com.asthood.techstore.dto.AdminDashboardDTO;
import com.asthood.techstore.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {

    private static final int LOW_STOCK_LIMIT = 5;

    private final OrderMetricsService orderMetricsService;

    private final ProductMetricsService productMetricsService;

    private final AlertService alertService;

    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public AdminDashboardDTO getDashboard() {

        return AdminDashboardDTO.builder()

                .salesToday(
                        orderMetricsService.getSalesToday()
                )

                .salesCurrentMonth(
                        orderMetricsService.getSalesCurrentMonth()
                )

                .averageTicket(
                        orderMetricsService.getAverageTicket()
                )

                .pendingOrders(
                        orderMetricsService.getPendingOrders()
                )

                .pendingShipments(
                        orderMetricsService.getPendingShipments()
                )

                .lowStockProducts(
                        productRepository.countByStockLessThanEqual(
                                LOW_STOCK_LIMIT
                        )
                )

                .newCustomersToday(
                        null
                )

                .topProduct(
                        productMetricsService.getTopProduct()
                )

                .weeklySales(
                        orderMetricsService.getWeeklySales()
                )

                .latestOrders(
                        orderMetricsService.getLatestOrders()
                )

                .topProducts(
                        productMetricsService.getTopProducts()
                )

                .alerts(
                        alertService.getDashboardAlerts()
                )

                .build();
    }
}
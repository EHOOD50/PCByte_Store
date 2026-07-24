package com.asthood.techstore.dto;

import com.asthood.techstore.model.AlertAction;
import com.asthood.techstore.model.AlertLevel;
import com.asthood.techstore.model.AlertType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardDTO {

    private BigDecimal salesToday;

    private BigDecimal salesCurrentMonth;

    private BigDecimal averageTicket;

    private Long pendingOrders;

    private Long pendingShipments;

    private Long lowStockProducts;

    private Long newCustomersToday;

    private TopProductDTO topProduct;

    private List<DailySalesDTO> weeklySales;

    private List<LatestOrderDTO> latestOrders;

    private List<TopProductDTO> topProducts;

    private List<DashboardAlertDTO> alerts;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DailySalesDTO {

        private String day;

        private String date;

        private BigDecimal total;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LatestOrderDTO {

        private Long id;

        private String customerName;

        private BigDecimal total;

        private String status;

        private LocalDateTime createdAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TopProductDTO {

        private Long productId;

        private String name;

        private String imageUrl;

        private Long unitsSold;

        private BigDecimal revenue;

        private Integer currentStock;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DashboardAlertDTO {

        private String code;

        private AlertType type;

        private AlertLevel level;

        private String title;

        private String description;

        private Long referenceId;

        private AlertAction action;

        private LocalDateTime createdAt;
    }
}
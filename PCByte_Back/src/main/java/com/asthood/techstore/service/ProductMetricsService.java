package com.asthood.techstore.service;

import com.asthood.techstore.dto.AdminDashboardDTO;
import com.asthood.techstore.repository.ProductRepository;
import com.asthood.techstore.repository.projection.TopSellingProductProjection;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductMetricsService {

    private static final int TOP_PRODUCTS_LIMIT = 5;

    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public AdminDashboardDTO.TopProductDTO
    getTopProduct() {

        List<AdminDashboardDTO.TopProductDTO>
                products =
                getTopProducts();

        return products.isEmpty()
                ? null
                : products.get(0);
    }

    @Transactional(readOnly = true)
    public List<AdminDashboardDTO.TopProductDTO>
    getTopProducts() {

        return productRepository
                .findTopSellingProducts(
                        PageRequest.of(
                                0,
                                TOP_PRODUCTS_LIMIT
                        )
                )
                .stream()
                .map(this::toDTO)
                .toList();
    }

    private AdminDashboardDTO.TopProductDTO
    toDTO(
            TopSellingProductProjection product
    ) {

        return AdminDashboardDTO
                .TopProductDTO
                .builder()

                .productId(
                        product.getProductId()
                )

                .name(
                        product.getName()
                )

                .imageUrl(
                        product.getImageUrl()
                )

                .unitsSold(
                        product.getUnitsSold()
                )

                .revenue(
                        product.getRevenue()
                )

                .currentStock(
                        product.getCurrentStock()
                )

                .build();
    }
}
package com.asthood.techstore.repository.projection;

import java.math.BigDecimal;

public interface TopSellingProductProjection {

    Long getProductId();

    String getName();

    String getImageUrl();

    Long getUnitsSold();

    BigDecimal getRevenue();

    Integer getCurrentStock();
}
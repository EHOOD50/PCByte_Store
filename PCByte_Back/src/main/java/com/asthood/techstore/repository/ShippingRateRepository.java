package com.asthood.techstore.repository;

import com.asthood.techstore.model.ShippingRate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShippingRateRepository
        extends JpaRepository<ShippingRate, Long> {

    /*
     * Todas las tarifas activas,
     * ordenadas por prioridad.
     */
    List<ShippingRate> findByActiveTrueOrderByPriorityAsc();

    /*
     * Tarifa específica para una comuna.
     */
    List<ShippingRate>
    findByActiveTrueAndRegionIgnoreCaseAndCityIgnoreCaseOrderByPriorityAsc(
            String region,
            String city
    );

    /*
     * Tarifa general para una región.
     */
    List<ShippingRate>
    findByActiveTrueAndRegionIgnoreCaseAndCityIsNullOrderByPriorityAsc(
            String region
    );

    /*
     * Tarifa nacional.
     */
    List<ShippingRate>
    findByActiveTrueAndRegionIsNullAndCityIsNullOrderByPriorityAsc();

}
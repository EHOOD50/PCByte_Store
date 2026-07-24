package com.asthood.techstore.service;

import com.asthood.techstore.dto.ShippingQuoteDTO;
import com.asthood.techstore.dto.ShippingRateDTO;
import com.asthood.techstore.mapper.ShippingRateMapper;
import com.asthood.techstore.model.ShippingRate;
import com.asthood.techstore.repository.ShippingRateRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ShippingRateService {

    private static final String DEFAULT_SHIPPING_TYPE =
            "HOME_DELIVERY";

    private final ShippingRateRepository shippingRateRepository;

    // =========================================================
    // COTIZAR DESPACHO
    // =========================================================

    /**
     * Busca una tarifa activa usando el siguiente orden:
     *
     * 1. Comuna específica.
     * 2. Región completa.
     * 3. Tarifa nacional.
     *
     * Dentro de cada nivel se respeta la prioridad configurada.
     */
    @Transactional(readOnly = true)
    public ShippingQuoteDTO quote(
            String region,
            String city,
            BigDecimal subtotal,
            String shippingType
    ) {
        String normalizedRegion =
                normalizeNullableText(region);

        String normalizedCity =
                normalizeNullableText(city);

        String normalizedShippingType =
                normalizeShippingType(shippingType);

        BigDecimal safeSubtotal =
                subtotal == null
                        ? BigDecimal.ZERO
                        : subtotal;

        if (safeSubtotal.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException(
                    "El subtotal no puede ser negativo."
            );
        }

        if (normalizedRegion == null) {
            return unavailableQuote(
                    normalizedShippingType,
                    "Debes seleccionar una región para calcular el despacho."
            );
        }

        Optional<ShippingRate> selectedRate =
                findBestRate(
                        normalizedRegion,
                        normalizedCity,
                        normalizedShippingType
                );

        if (selectedRate.isEmpty()) {
            log.info(
                    "No se encontró tarifa para región '{}', comuna '{}' y tipo '{}'.",
                    normalizedRegion,
                    normalizedCity,
                    normalizedShippingType
            );

            return unavailableQuote(
                    normalizedShippingType,
                    "No existe una tarifa disponible para el destino seleccionado."
            );
        }

        return buildQuote(
                selectedRate.get(),
                safeSubtotal
        );
    }

    private Optional<ShippingRate> findBestRate(
            String region,
            String city,
            String shippingType
    ) {
        /*
         * Primera prioridad:
         * tarifa específica para comuna.
         */
        if (city != null) {
            Optional<ShippingRate> cityRate =
                    shippingRateRepository
                            .findByActiveTrueAndRegionIgnoreCaseAndCityIgnoreCaseOrderByPriorityAsc(
                                    region,
                                    city
                            )
                            .stream()
                            .filter(rate ->
                                    matchesShippingType(
                                            rate,
                                            shippingType
                                    )
                            )
                            .findFirst();

            if (cityRate.isPresent()) {
                return cityRate;
            }
        }

        /*
         * Segunda prioridad:
         * tarifa general para la región.
         */
        Optional<ShippingRate> regionRate =
                shippingRateRepository
                        .findByActiveTrueAndRegionIgnoreCaseAndCityIsNullOrderByPriorityAsc(
                                region
                        )
                        .stream()
                        .filter(rate ->
                                matchesShippingType(
                                        rate,
                                        shippingType
                                )
                        )
                        .findFirst();

        if (regionRate.isPresent()) {
            return regionRate;
        }

        /*
         * Tercera prioridad:
         * tarifa nacional.
         */
        return shippingRateRepository
                .findByActiveTrueAndRegionIsNullAndCityIsNullOrderByPriorityAsc()
                .stream()
                .filter(rate ->
                        matchesShippingType(
                                rate,
                                shippingType
                        )
                )
                .findFirst();
    }

    private ShippingQuoteDTO buildQuote(
            ShippingRate rate,
            BigDecimal subtotal
    ) {
        BigDecimal originalPrice =
                rate.getPrice();

        boolean freeShipping =
                rate.getFreeShippingFrom() != null
                        && subtotal.compareTo(
                        rate.getFreeShippingFrom()
                ) >= 0;

        BigDecimal finalCost =
                freeShipping
                        ? BigDecimal.ZERO
                        : originalPrice;

        String message =
                freeShipping
                        ? "Tu compra tiene despacho gratuito."
                        : buildEstimatedDeliveryMessage(rate);

        return ShippingQuoteDTO.builder()
                .shippingRateId(rate.getId())
                .shippingType(rate.getShippingType())
                .label(rate.getName())
                .carrier(rate.getCarrier())
                .originalPrice(originalPrice)
                .cost(finalCost)
                .freeShipping(freeShipping)
                .freeShippingFrom(rate.getFreeShippingFrom())
                .estimatedMinDays(rate.getEstimatedMinDays())
                .estimatedMaxDays(rate.getEstimatedMaxDays())
                .available(true)
                .message(message)
                .build();
    }

    private ShippingQuoteDTO unavailableQuote(
            String shippingType,
            String message
    ) {
        return ShippingQuoteDTO.builder()
                .shippingRateId(null)
                .shippingType(shippingType)
                .label("Despacho no disponible")
                .carrier(null)
                .originalPrice(BigDecimal.ZERO)
                .cost(BigDecimal.ZERO)
                .freeShipping(false)
                .freeShippingFrom(null)
                .estimatedMinDays(null)
                .estimatedMaxDays(null)
                .available(false)
                .message(message)
                .build();
    }

    private String buildEstimatedDeliveryMessage(
            ShippingRate rate
    ) {
        Integer minDays =
                rate.getEstimatedMinDays();

        Integer maxDays =
                rate.getEstimatedMaxDays();

        if (Objects.equals(minDays, maxDays)) {
            return "Entrega estimada en "
                    + minDays
                    + (
                    minDays == 1
                            ? " día hábil."
                            : " días hábiles."
            );
        }

        return "Entrega estimada entre "
                + minDays
                + " y "
                + maxDays
                + " días hábiles.";
    }

    // =========================================================
    // LISTAR TARIFAS PARA ADMINISTRACIÓN
    // =========================================================

    @Transactional(readOnly = true)
    public List<ShippingRateDTO> findAll() {
        return shippingRateRepository
                .findAll()
                .stream()
                .map(ShippingRateMapper::toDTO)
                .toList();
    }

    // =========================================================
    // OBTENER TARIFA POR ID
    // =========================================================

    @Transactional(readOnly = true)
    public ShippingRateDTO findById(
            Long id
    ) {
        return ShippingRateMapper.toDTO(
                findEntityById(id)
        );
    }

    // =========================================================
    // CREAR TARIFA
    // =========================================================

    @Transactional
    public ShippingRateDTO create(
            ShippingRateDTO request
    ) {
        validateRequest(request);

        ShippingRate entity =
                ShippingRateMapper.toEntity(request);

        entity.setId(null);
        entity.setName(
                normalizeRequiredText(
                        request.getName(),
                        "El nombre de la tarifa es obligatorio."
                )
        );
        entity.setRegion(
                normalizeNullableText(
                        request.getRegion()
                )
        );
        entity.setCity(
                normalizeNullableText(
                        request.getCity()
                )
        );
        entity.setShippingType(
                normalizeShippingType(
                        request.getShippingType()
                )
        );
        entity.setCarrier(
                normalizeNullableText(
                        request.getCarrier()
                )
        );
        entity.setActive(
                request.getActive() == null
                        ? true
                        : request.getActive()
        );
        entity.setPriority(
                request.getPriority() == null
                        ? 0
                        : request.getPriority()
        );

        ShippingRate savedRate =
                shippingRateRepository.save(entity);

        log.info(
                "Tarifa de despacho creada: {}",
                savedRate.getId()
        );

        return ShippingRateMapper.toDTO(
                savedRate
        );
    }

    // =========================================================
    // ACTUALIZAR TARIFA
    // =========================================================

    @Transactional
    public ShippingRateDTO update(
            Long id,
            ShippingRateDTO request
    ) {
        validateRequest(request);

        ShippingRate existingRate =
                findEntityById(id);

        existingRate.setName(
                normalizeRequiredText(
                        request.getName(),
                        "El nombre de la tarifa es obligatorio."
                )
        );
        existingRate.setRegion(
                normalizeNullableText(
                        request.getRegion()
                )
        );
        existingRate.setCity(
                normalizeNullableText(
                        request.getCity()
                )
        );
        existingRate.setShippingType(
                normalizeShippingType(
                        request.getShippingType()
                )
        );
        existingRate.setCarrier(
                normalizeNullableText(
                        request.getCarrier()
                )
        );
        existingRate.setPrice(
                request.getPrice()
        );
        existingRate.setFreeShippingFrom(
                request.getFreeShippingFrom()
        );
        existingRate.setEstimatedMinDays(
                request.getEstimatedMinDays()
        );
        existingRate.setEstimatedMaxDays(
                request.getEstimatedMaxDays()
        );
        existingRate.setActive(
                request.getActive() == null
                        ? existingRate.getActive()
                        : request.getActive()
        );
        existingRate.setPriority(
                request.getPriority() == null
                        ? existingRate.getPriority()
                        : request.getPriority()
        );

        ShippingRate updatedRate =
                shippingRateRepository.save(existingRate);

        log.info(
                "Tarifa de despacho actualizada: {}",
                id
        );

        return ShippingRateMapper.toDTO(
                updatedRate
        );
    }

    // =========================================================
    // ACTIVAR O DESACTIVAR
    // =========================================================

    @Transactional
    public ShippingRateDTO changeStatus(
            Long id,
            boolean active
    ) {
        ShippingRate existingRate =
                findEntityById(id);

        existingRate.setActive(active);

        ShippingRate updatedRate =
                shippingRateRepository.save(existingRate);

        log.info(
                "Tarifa de despacho #{} cambió su estado a {}",
                id,
                active
        );

        return ShippingRateMapper.toDTO(
                updatedRate
        );
    }

    // =========================================================
    // ELIMINAR TARIFA
    // =========================================================

    @Transactional
    public void delete(
            Long id
    ) {
        ShippingRate existingRate =
                findEntityById(id);

        shippingRateRepository.delete(
                existingRate
        );

        log.info(
                "Tarifa de despacho eliminada: {}",
                id
        );
    }

    // =========================================================
    // VALIDACIONES
    // =========================================================

    private void validateRequest(
            ShippingRateDTO request
    ) {
        if (request == null) {
            throw new IllegalArgumentException(
                    "Los datos de la tarifa son obligatorios."
            );
        }

        normalizeRequiredText(
                request.getName(),
                "El nombre de la tarifa es obligatorio."
        );

        if (
                request.getPrice() == null
                        || request.getPrice()
                        .compareTo(BigDecimal.ZERO) < 0
        ) {
            throw new IllegalArgumentException(
                    "El precio debe ser igual o mayor que cero."
            );
        }

        if (
                request.getFreeShippingFrom() != null
                        && request.getFreeShippingFrom()
                        .compareTo(BigDecimal.ZERO) < 0
        ) {
            throw new IllegalArgumentException(
                    "El monto de despacho gratuito no puede ser negativo."
            );
        }

        if (
                request.getEstimatedMinDays() == null
                        || request.getEstimatedMinDays() < 0
        ) {
            throw new IllegalArgumentException(
                    "Los días mínimos de entrega deben ser iguales o mayores que cero."
            );
        }

        if (
                request.getEstimatedMaxDays() == null
                        || request.getEstimatedMaxDays()
                        < request.getEstimatedMinDays()
        ) {
            throw new IllegalArgumentException(
                    "Los días máximos deben ser iguales o mayores que los días mínimos."
            );
        }

        if (
                request.getPriority() != null
                        && request.getPriority() < 0
        ) {
            throw new IllegalArgumentException(
                    "La prioridad no puede ser negativa."
            );
        }
    }

    private ShippingRate findEntityById(
            Long id
    ) {
        if (id == null) {
            throw new IllegalArgumentException(
                    "El ID de la tarifa es obligatorio."
            );
        }

        return shippingRateRepository
                .findById(id)
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "Tarifa de despacho no encontrada con ID: "
                                        + id
                        )
                );
    }

    private boolean matchesShippingType(
            ShippingRate rate,
            String shippingType
    ) {
        return rate.getShippingType() != null
                && rate.getShippingType()
                .equalsIgnoreCase(shippingType);
    }

    private String normalizeShippingType(
            String shippingType
    ) {
        String normalized =
                normalizeNullableText(
                        shippingType
                );

        if (normalized == null) {
            return DEFAULT_SHIPPING_TYPE;
        }

        return normalized
                .toUpperCase(Locale.ROOT)
                .replace(' ', '_');
    }

    private String normalizeRequiredText(
            String value,
            String errorMessage
    ) {
        String normalized =
                normalizeNullableText(value);

        if (normalized == null) {
            throw new IllegalArgumentException(
                    errorMessage
            );
        }

        return normalized;
    }

    private String normalizeNullableText(
            String value
    ) {
        if (
                value == null
                        || value.isBlank()
        ) {
            return null;
        }

        return value
                .trim()
                .replaceAll("\\s+", " ");
    }
}
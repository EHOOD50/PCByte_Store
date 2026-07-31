package com.asthood.techstore.service;

import com.asthood.techstore.domain.entity.Product;
import com.asthood.techstore.dto.CartItemDTO;
import com.asthood.techstore.dto.OrderRequestDTO;
import com.asthood.techstore.dto.ShippingQuoteDTO;
import com.asthood.techstore.model.Order;
import com.asthood.techstore.model.OrderItem;
import com.asthood.techstore.model.OrderStatus;
import com.asthood.techstore.model.User;
import com.asthood.techstore.model.UserStatus;
import com.asthood.techstore.repository.OrderRepository;
import com.asthood.techstore.repository.ProductRepository;
import com.asthood.techstore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderCheckoutService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ShippingRateService shippingRateService;

    // =========================================================
    // PREPARAR ORDEN
    // =========================================================

    @Transactional
    public Order prepareOrder(
            OrderRequestDTO orderRequest
    ) {
        validateOrderRequest(
                orderRequest
        );

        String fullName =
                normalizeName(
                        orderRequest
                                .getPayer()
                                .getName()
                );

        String[] separatedName =
                separateName(
                        fullName
                );

        String firstName =
                separatedName[0];

        String lastName =
                separatedName[1];

        String email =
                normalizeEmail(
                        orderRequest
                                .getPayer()
                                .getEmail()
                );

        PreparedItems preparedItems =
                prepareItems(
                        orderRequest.getItems()
                );

        /*
         * Conserva temporalmente la compatibilidad con el
         * PaymentService actual.
         *
         * Los nombres y precios recibidos desde React son
         * reemplazados por los valores oficiales de la BD.
         */
        synchronizeRequestItems(
                orderRequest.getItems(),
                preparedItems.items()
        );

        PreparedShipping preparedShipping =
                prepareShipping(
                        orderRequest,
                        preparedItems.subtotal()
                );

        Order reusableOrder =
                findReusablePendingOrder(
                        orderRequest,
                        email,
                        preparedItems,
                        preparedShipping
                );

        if (reusableOrder != null) {
            log.info(
                    "Reutilizando la orden pendiente #{} por un total de {}.",
                    reusableOrder.getId(),
                    reusableOrder.getTotal()
            );

            return reusableOrder;
        }

        User orderUser =
                findOrCreateUser(
                        email,
                        firstName,
                        lastName,
                        orderRequest
                );

        Order newOrder =
                createNewOrder(
                        orderRequest,
                        orderUser,
                        fullName,
                        email,
                        preparedItems,
                        preparedShipping
                );

        log.info(
                "Nueva orden #{} creada. Subtotal: {}, despacho: {}, total: {}.",
                newOrder.getId(),
                newOrder.getSubtotal(),
                newOrder.getShippingCost(),
                newOrder.getTotal()
        );

        return newOrder;
    }

    // =========================================================
    // DESPACHO
    // =========================================================

    private PreparedShipping prepareShipping(
            OrderRequestDTO orderRequest,
            BigDecimal subtotal
    ) {
        String region =
                normalizeRequired(
                        orderRequest
                                .getPayer()
                                .getRegion(),
                        "La región de entrega es obligatoria."
                );

        String city =
                normalizeRequired(
                        orderRequest
                                .getPayer()
                                .getCity(),
                        "La comuna de entrega es obligatoria."
                );

        String shippingType =
                normalizeShippingType(
                        orderRequest.getShippingMethod()
                );

        ShippingQuoteDTO quote =
                shippingRateService.quote(
                        region,
                        city,
                        subtotal,
                        shippingType
                );

        if (
                quote == null
                        || !Boolean.TRUE.equals(
                        quote.getAvailable()
                )
        ) {
            String message =
                    quote != null
                            && quote.getMessage() != null
                            && !quote.getMessage().isBlank()
                            ? quote.getMessage()
                            : "No existe una tarifa de despacho disponible.";

            throw new IllegalArgumentException(
                    message
            );
        }

        BigDecimal shippingCost =
                quote.getCost() == null
                        ? BigDecimal.ZERO
                        : quote.getCost();

        if (
                shippingCost.compareTo(
                        BigDecimal.ZERO
                ) < 0
        ) {
            throw new IllegalStateException(
                    "La tarifa de despacho contiene un costo inválido."
            );
        }

        BigDecimal total =
                subtotal.add(
                        shippingCost
                );

        return new PreparedShipping(
                quote.getShippingRateId(),
                quote.getShippingType(),
                quote.getLabel(),
                quote.getCarrier(),
                shippingCost,
                Boolean.TRUE.equals(
                        quote.getFreeShipping()
                ),
                quote.getEstimatedMinDays(),
                quote.getEstimatedMaxDays(),
                total
        );
    }

    private String normalizeShippingType(
            String shippingMethod
    ) {
        if (
                shippingMethod == null
                        || shippingMethod.isBlank()
        ) {
            throw new IllegalArgumentException(
                    "Debes seleccionar un método de despacho."
            );
        }

        return shippingMethod
                .trim()
                .toUpperCase(
                        Locale.ROOT
                )
                .replace(
                        ' ',
                        '_'
                );
    }

    // =========================================================
    // REUTILIZAR ORDEN PENDIENTE
    // =========================================================

    private Order findReusablePendingOrder(
            OrderRequestDTO orderRequest,
            String email,
            PreparedItems preparedItems,
            PreparedShipping preparedShipping
    ) {
        Long pendingOrderId =
                orderRequest.getPendingOrderId();

        if (pendingOrderId == null) {
            return null;
        }

        Order pendingOrder =
                orderRepository
                        .findReusablePendingOrderForUpdate(
                                pendingOrderId,
                                email,
                                OrderStatus.PENDIENTE
                        )
                        .orElse(null);

        if (pendingOrder == null) {
            log.info(
                    "La orden #{} no existe, no pertenece al comprador o ya no está pendiente.",
                    pendingOrderId
            );

            return null;
        }

        updatePendingOrder(
                pendingOrder,
                orderRequest,
                email,
                preparedItems,
                preparedShipping
        );

        return orderRepository.save(
                pendingOrder
        );
    }

    private void updatePendingOrder(
            Order pendingOrder,
            OrderRequestDTO orderRequest,
            String email,
            PreparedItems preparedItems,
            PreparedShipping preparedShipping
    ) {
        if (
                pendingOrder.getStatus()
                        != OrderStatus.PENDIENTE
        ) {
            throw new IllegalStateException(
                    "Solo se pueden modificar órdenes pendientes."
            );
        }

        String fullName =
                normalizeName(
                        orderRequest
                                .getPayer()
                                .getName()
                );

        updateContactSnapshot(
                pendingOrder,
                orderRequest,
                fullName,
                email
        );

        replaceOrderItems(
                pendingOrder,
                preparedItems.items()
        );

        applyFinancialSnapshot(
                pendingOrder,
                preparedItems.subtotal(),
                preparedShipping
        );
    }

    // =========================================================
    // CREAR NUEVA ORDEN
    // =========================================================

    private Order createNewOrder(
            OrderRequestDTO orderRequest,
            User orderUser,
            String fullName,
            String email,
            PreparedItems preparedItems,
            PreparedShipping preparedShipping
    ) {
        Order newOrder =
                Order.builder()
                        .user(
                                orderUser
                        )
                        .fullName(
                                fullName
                        )
                        .email(
                                email
                        )
                        .phone(
                                normalizeOptional(
                                        orderRequest
                                                .getPayer()
                                                .getPhone()
                                )
                        )
                        .street(
                                normalizeRequired(
                                        orderRequest
                                                .getPayer()
                                                .getStreet(),
                                        "La calle de entrega es obligatoria."
                                )
                        )
                        .number(
                                normalizeRequired(
                                        orderRequest
                                                .getPayer()
                                                .getNumber(),
                                        "El número de la dirección es obligatorio."
                                )
                        )
                        .apartment(
                                normalizeOptional(
                                        orderRequest
                                                .getPayer()
                                                .getApartment()
                                )
                        )
                        .city(
                                normalizeRequired(
                                        orderRequest
                                                .getPayer()
                                                .getCity(),
                                        "La comuna de entrega es obligatoria."
                                )
                        )
                        .region(
                                normalizeRequired(
                                        orderRequest
                                                .getPayer()
                                                .getRegion(),
                                        "La región de entrega es obligatoria."
                                )
                        )
                        .extraInfo(
                                normalizeOptional(
                                        orderRequest
                                                .getPayer()
                                                .getExtraInfo()
                                )
                        )
                        .status(
                                OrderStatus.PENDIENTE
                        )
                        .subtotal(
                                preparedItems.subtotal()
                        )
                        .shippingCost(
                                preparedShipping.shippingCost()
                        )
                        .total(
                                preparedShipping.total()
                        )
                        .shippingRateId(
                                preparedShipping.shippingRateId()
                        )
                        .shippingType(
                                preparedShipping.shippingType()
                        )
                        .shippingLabel(
                                preparedShipping.shippingLabel()
                        )
                        .shippingCarrier(
                                preparedShipping.shippingCarrier()
                        )
                        .shippingFree(
                                preparedShipping.shippingFree()
                        )
                        .estimatedMinDays(
                                preparedShipping.estimatedMinDays()
                        )
                        .estimatedMaxDays(
                                preparedShipping.estimatedMaxDays()
                        )
                        .build();

        addPreparedItems(
                newOrder,
                preparedItems.items()
        );

        return orderRepository.save(
                newOrder
        );
    }

    // =========================================================
    // SNAPSHOT DE CONTACTO
    // =========================================================

    private void updateContactSnapshot(
            Order order,
            OrderRequestDTO orderRequest,
            String fullName,
            String email
    ) {
        order.setFullName(
                fullName
        );

        order.setEmail(
                email
        );

        order.setPhone(
                normalizeOptional(
                        orderRequest
                                .getPayer()
                                .getPhone()
                )
        );

        order.setStreet(
                normalizeRequired(
                        orderRequest
                                .getPayer()
                                .getStreet(),
                        "La calle de entrega es obligatoria."
                )
        );

        order.setNumber(
                normalizeRequired(
                        orderRequest
                                .getPayer()
                                .getNumber(),
                        "El número de la dirección es obligatorio."
                )
        );

        order.setApartment(
                normalizeOptional(
                        orderRequest
                                .getPayer()
                                .getApartment()
                )
        );

        order.setCity(
                normalizeRequired(
                        orderRequest
                                .getPayer()
                                .getCity(),
                        "La comuna de entrega es obligatoria."
                )
        );

        order.setRegion(
                normalizeRequired(
                        orderRequest
                                .getPayer()
                                .getRegion(),
                        "La región de entrega es obligatoria."
                )
        );

        order.setExtraInfo(
                normalizeOptional(
                        orderRequest
                                .getPayer()
                                .getExtraInfo()
                )
        );
    }

    // =========================================================
    // SNAPSHOT FINANCIERO Y DE DESPACHO
    // =========================================================

    private void applyFinancialSnapshot(
            Order order,
            BigDecimal subtotal,
            PreparedShipping preparedShipping
    ) {
        order.setSubtotal(
                subtotal
        );

        order.setShippingCost(
                preparedShipping.shippingCost()
        );

        order.setTotal(
                preparedShipping.total()
        );

        order.setShippingRateId(
                preparedShipping.shippingRateId()
        );

        order.setShippingType(
                preparedShipping.shippingType()
        );

        order.setShippingLabel(
                preparedShipping.shippingLabel()
        );

        order.setShippingCarrier(
                preparedShipping.shippingCarrier()
        );

        order.setShippingFree(
                preparedShipping.shippingFree()
        );

        order.setEstimatedMinDays(
                preparedShipping.estimatedMinDays()
        );

        order.setEstimatedMaxDays(
                preparedShipping.estimatedMaxDays()
        );
    }

    // =========================================================
    // PRODUCTOS
    // =========================================================

    private PreparedItems prepareItems(
            List<CartItemDTO> requestedItems
    ) {
        Map<Long, Integer> quantities =
                new LinkedHashMap<>();

        for (
                CartItemDTO requestedItem
                : requestedItems
        ) {
            validateCartItem(
                    requestedItem
            );

            quantities.merge(
                    requestedItem.getProductId(),
                    requestedItem.getQuantity(),
                    Integer::sum
            );
        }

        List<PreparedItem> preparedItems =
                quantities
                        .entrySet()
                        .stream()
                        .map(entry ->
                                prepareItem(
                                        entry.getKey(),
                                        entry.getValue()
                                )
                        )
                        .toList();

        BigDecimal subtotal =
                preparedItems
                        .stream()
                        .map(item ->
                                item.unitPrice()
                                        .multiply(
                                                BigDecimal.valueOf(
                                                        item.quantity()
                                                )
                                        )
                        )
                        .reduce(
                                BigDecimal.ZERO,
                                BigDecimal::add
                        );

        if (
                subtotal.compareTo(
                        BigDecimal.ZERO
                ) <= 0
        ) {
            throw new IllegalArgumentException(
                    "El subtotal de la orden debe ser mayor que cero."
            );
        }

        return new PreparedItems(
                preparedItems,
                subtotal
        );
    }

    private PreparedItem prepareItem(
            Long productId,
            Integer quantity
    ) {
        Product product =
                productRepository
                        .findById(
                                productId
                        )
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "El producto con ID "
                                                + productId
                                                + " no existe."
                                )
                        );

        if (
                product.getStock() == null
                        || product.getStock() < quantity
        ) {
            throw new IllegalArgumentException(
                    "Stock insuficiente para el producto: "
                            + product.getName()
            );
        }

        BigDecimal unitPrice =
                product.getPrice();

        if (
                unitPrice == null
                        || unitPrice.compareTo(
                        BigDecimal.ZERO
                ) <= 0
        ) {
            throw new IllegalArgumentException(
                    "El producto "
                            + product.getName()
                            + " no tiene un precio válido."
            );
        }

        return new PreparedItem(
                product,
                quantity,
                unitPrice
        );
    }

    private void synchronizeRequestItems(
            List<CartItemDTO> requestedItems,
            List<PreparedItem> preparedItems
    ) {
        Map<Long, PreparedItem> preparedByProductId =
                new LinkedHashMap<>();

        for (
                PreparedItem preparedItem
                : preparedItems
        ) {
            preparedByProductId.put(
                    preparedItem
                            .product()
                            .getId(),
                    preparedItem
            );
        }

        for (
                CartItemDTO requestedItem
                : requestedItems
        ) {
            PreparedItem preparedItem =
                    preparedByProductId.get(
                            requestedItem.getProductId()
                    );

            if (preparedItem == null) {
                throw new IllegalStateException(
                        "No se pudo preparar el producto con ID "
                                + requestedItem.getProductId()
                                + "."
                );
            }

            requestedItem.setName(
                    preparedItem
                            .product()
                            .getName()
            );

            requestedItem.setPrice(
                    preparedItem.unitPrice()
            );
        }
    }

    private void replaceOrderItems(
            Order order,
            List<PreparedItem> preparedItems
    ) {
        if (
                order.getOrderItems() == null
        ) {
            throw new IllegalStateException(
                    "La colección de productos de la orden no está inicializada."
            );
        }

        order.getOrderItems().clear();

        addPreparedItems(
                order,
                preparedItems
        );
    }

    private void addPreparedItems(
            Order order,
            List<PreparedItem> preparedItems
    ) {
        for (
                PreparedItem preparedItem
                : preparedItems
        ) {
            OrderItem orderItem =
                    OrderItem.builder()
                            .product(
                                    preparedItem.product()
                            )
                            .quantity(
                                    preparedItem.quantity()
                            )
                            .price(
                                    preparedItem.unitPrice()
                            )
                            .build();

            order.addOrderItem(
                    orderItem
            );
        }
    }

    // =========================================================
    // USUARIO
    // =========================================================

    private User findOrCreateUser(
            String email,
            String firstName,
            String lastName,
            OrderRequestDTO orderRequest
    ) {
        return userRepository
                .findByEmail(
                        email
                )
                .map(user ->
                        updateExistingUser(
                                user,
                                firstName,
                                lastName,
                                orderRequest
                        )
                )
                .orElseGet(() ->
                        createGuestUser(
                                email,
                                firstName,
                                lastName,
                                orderRequest
                        )
                );
    }

    private User updateExistingUser(
            User user,
            String firstName,
            String lastName,
            OrderRequestDTO orderRequest
    ) {
        user.setFirstName(
                firstName
        );

        user.setLastName(
                lastName
        );

        user.setPhone(
                normalizeOptional(
                        orderRequest
                                .getPayer()
                                .getPhone()
                )
        );

        return userRepository.save(
                user
        );
    }

    private User createGuestUser(
            String email,
            String firstName,
            String lastName,
            OrderRequestDTO orderRequest
    ) {
        User guestUser =
                User.builder()
                        .email(
                                email
                        )
                        .firstName(
                                firstName
                        )
                        .lastName(
                                lastName
                        )
                        .phone(
                                normalizeOptional(
                                        orderRequest
                                                .getPayer()
                                                .getPhone()
                                )
                        )
                        .status(
                                UserStatus.INVITADO
                        )
                        .build();

        return userRepository.save(
                guestUser
        );
    }

    // =========================================================
    // VALIDACIONES
    // =========================================================

    private void validateOrderRequest(
            OrderRequestDTO orderRequest
    ) {
        if (
                orderRequest == null
        ) {
            throw new IllegalArgumentException(
                    "La solicitud de compra es obligatoria."
            );
        }

        if (
                orderRequest.getPayer() == null
        ) {
            throw new IllegalArgumentException(
                    "Los datos del comprador son obligatorios."
            );
        }

        normalizeRequired(
                orderRequest
                        .getPayer()
                        .getEmail(),
                "El correo del comprador es obligatorio."
        );

        if (
                orderRequest.getItems() == null
                        || orderRequest
                        .getItems()
                        .isEmpty()
        ) {
            throw new IllegalArgumentException(
                    "La orden debe contener al menos un producto."
            );
        }

        normalizeRequired(
                orderRequest.getShippingMethod(),
                "Debes seleccionar un método de despacho."
        );
    }

    private void validateCartItem(
            CartItemDTO item
    ) {
        if (
                item == null
        ) {
            throw new IllegalArgumentException(
                    "La orden contiene un producto inválido."
            );
        }

        if (
                item.getProductId() == null
        ) {
            throw new IllegalArgumentException(
                    "Todos los productos deben contener un ID."
            );
        }

        if (
                item.getQuantity() == null
                        || item.getQuantity() <= 0
        ) {
            throw new IllegalArgumentException(
                    "La cantidad del producto debe ser mayor que cero."
            );
        }
    }

    // =========================================================
    // UTILIDADES
    // =========================================================

    private String normalizeName(
            String name
    ) {
        if (
                name == null
                        || name.isBlank()
        ) {
            return "Invitado";
        }

        return name
                .trim()
                .replaceAll(
                        "\\s+",
                        " "
                );
    }

    private String normalizeEmail(
            String email
    ) {
        return normalizeRequired(
                email,
                "El correo del comprador es obligatorio."
        )
                .toLowerCase(
                        Locale.ROOT
                );
    }

    private String normalizeRequired(
            String value,
            String errorMessage
    ) {
        String normalized =
                normalizeOptional(
                        value
                );

        if (
                normalized == null
        ) {
            throw new IllegalArgumentException(
                    errorMessage
            );
        }

        return normalized;
    }

    private String normalizeOptional(
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
                .replaceAll(
                        "\\s+",
                        " "
                );
    }

    private String[] separateName(
            String fullName
    ) {
        int firstSpaceIndex =
                fullName.indexOf(
                        " "
                );

        if (
                firstSpaceIndex < 0
        ) {
            return new String[]{
                    fullName,
                    ""
            };
        }

        String firstName =
                fullName
                        .substring(
                                0,
                                firstSpaceIndex
                        )
                        .trim();

        String lastName =
                fullName
                        .substring(
                                firstSpaceIndex + 1
                        )
                        .trim();

        return new String[]{
                firstName,
                lastName
        };
    }

    // =========================================================
    // ESTRUCTURAS INTERNAS
    // =========================================================

    private record PreparedItem(
            Product product,
            Integer quantity,
            BigDecimal unitPrice
    ) {
    }

    private record PreparedItems(
            List<PreparedItem> items,
            BigDecimal subtotal
    ) {
    }

    private record PreparedShipping(
            Long shippingRateId,
            String shippingType,
            String shippingLabel,
            String shippingCarrier,
            BigDecimal shippingCost,
            Boolean shippingFree,
            Integer estimatedMinDays,
            Integer estimatedMaxDays,
            BigDecimal total
    ) {
    }
}
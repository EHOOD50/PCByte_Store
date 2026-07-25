package com.asthood.techstore.service;

import com.asthood.techstore.domain.entity.Product;
import com.asthood.techstore.dto.CartItemDTO;
import com.asthood.techstore.dto.OrderRequestDTO;
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
import java.util.Map;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderCheckoutService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional
    public Order prepareOrder(
            OrderRequestDTO orderRequest
    ) {
        validateOrderRequest(orderRequest);

        String fullName = normalizeName(
                orderRequest
                        .getPayer()
                        .getName()
        );

        String[] separatedName =
                separateName(fullName);

        String firstName =
                separatedName[0];

        String lastName =
                separatedName[1];

        String email = normalizeEmail(
                orderRequest
                        .getPayer()
                        .getEmail()
        );

        PreparedItems preparedItems =
                prepareItems(
                        orderRequest.getItems()
                );

        /*
         * Actualiza los DTO del carrito con el nombre y
         * precio oficiales de la base de datos.
         *
         * PaymentService utilizará estos valores para
         * construir la preferencia de Mercado Pago.
         */
        synchronizeRequestItems(
                orderRequest.getItems(),
                preparedItems.items()
        );

        Order reusableOrder =
                findReusablePendingOrder(
                        orderRequest,
                        email,
                        preparedItems
                );

        if (reusableOrder != null) {
            log.info(
                    "Reutilizando la orden pendiente #{} para un nuevo intento de pago.",
                    reusableOrder.getId()
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
                        preparedItems
                );

        log.info(
                "Nueva orden #{} creada para el checkout.",
                newOrder.getId()
        );

        return newOrder;
    }

    // =========================================================
    // REUTILIZACIÓN DE ORDEN PENDIENTE
    // =========================================================

    private Order findReusablePendingOrder(
            OrderRequestDTO orderRequest,
            String email,
            PreparedItems preparedItems
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
                    "La orden #{} no puede reutilizarse. Se creará una nueva.",
                    pendingOrderId
            );

            return null;
        }

        if (
                !sameAddress(
                        pendingOrder,
                        orderRequest
                )
        ) {
            log.info(
                    "La dirección de la orden #{} cambió. Se creará una nueva.",
                    pendingOrderId
            );

            return null;
        }

        if (
                !sameItems(
                        pendingOrder,
                        preparedItems.quantities()
                )
        ) {
            log.info(
                    "Los productos de la orden #{} cambiaron. Se creará una nueva.",
                    pendingOrderId
            );

            return null;
        }

        if (
                pendingOrder.getTotal() == null
                        || pendingOrder
                        .getTotal()
                        .compareTo(
                                preparedItems.total()
                        ) != 0
        ) {
            log.info(
                    "El total de la orden #{} cambió. Total anterior: {}, total actual: {}.",
                    pendingOrderId,
                    pendingOrder.getTotal(),
                    preparedItems.total()
            );

            return null;
        }

        return pendingOrder;
    }

    private boolean sameItems(
            Order order,
            Map<Long, Integer> requestedQuantities
    ) {
        List<OrderItem> orderItems =
                order.getOrderItems();

        if (
                orderItems == null
                        || orderItems.isEmpty()
        ) {
            return false;
        }

        Map<Long, Integer> existingQuantities =
                new LinkedHashMap<>();

        for (OrderItem item : orderItems) {
            if (
                    item == null
                            || item.getProduct() == null
                            || item.getProduct().getId() == null
                            || item.getQuantity() == null
            ) {
                return false;
            }

            existingQuantities.merge(
                    item.getProduct().getId(),
                    item.getQuantity(),
                    Integer::sum
            );
        }

        return existingQuantities.equals(
                requestedQuantities
        );
    }

    private boolean sameAddress(
            Order order,
            OrderRequestDTO request
    ) {
        return sameText(
                order.getStreet(),
                request.getPayer().getStreet()
        )
                && sameText(
                order.getNumber(),
                request.getPayer().getNumber()
        )
                && sameText(
                order.getApartment(),
                request.getPayer().getApartment()
        )
                && sameText(
                order.getCity(),
                request.getPayer().getCity()
        )
                && sameText(
                order.getRegion(),
                request.getPayer().getRegion()
        )
                && sameText(
                order.getExtraInfo(),
                request.getPayer().getExtraInfo()
        );
    }

    // =========================================================
    // CREACIÓN DE ORDEN
    // =========================================================

    private Order createNewOrder(
            OrderRequestDTO orderRequest,
            User orderUser,
            String fullName,
            String email,
            PreparedItems preparedItems
    ) {
        Order newOrder =
                Order.builder()
                        .user(orderUser)
                        .fullName(fullName)
                        .email(email)
                        .phone(
                                normalizeOptional(
                                        orderRequest
                                                .getPayer()
                                                .getPhone()
                                )
                        )
                        .street(
                                normalizeOptional(
                                        orderRequest
                                                .getPayer()
                                                .getStreet()
                                )
                        )
                        .number(
                                normalizeOptional(
                                        orderRequest
                                                .getPayer()
                                                .getNumber()
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
                                normalizeOptional(
                                        orderRequest
                                                .getPayer()
                                                .getCity()
                                )
                        )
                        .region(
                                normalizeOptional(
                                        orderRequest
                                                .getPayer()
                                                .getRegion()
                                )
                        )
                        .extraInfo(
                                normalizeOptional(
                                        orderRequest
                                                .getPayer()
                                                .getExtraInfo()
                                )
                        )
                        .total(
                                preparedItems.total()
                        )
                        .status(
                                OrderStatus.PENDIENTE
                        )
                        .build();

        for (
                PreparedItem preparedItem
                : preparedItems.items()
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

            newOrder.addOrderItem(
                    orderItem
            );
        }

        return orderRepository.save(
                newOrder
        );
    }

    // =========================================================
    // PRODUCTOS Y TOTAL
    // =========================================================

    private PreparedItems prepareItems(
            List<CartItemDTO> requestedItems
    ) {
        Map<Long, Integer> quantities =
                new LinkedHashMap<>();

        for (CartItemDTO requestedItem : requestedItems) {
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

        BigDecimal total =
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

        return new PreparedItems(
                preparedItems,
                quantities,
                total
        );
    }

    private PreparedItem prepareItem(
            Long productId,
            Integer quantity
    ) {
        Product product =
                productRepository
                        .findById(productId)
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
        Map<Long, PreparedItem> preparedItemsByProductId =
                new LinkedHashMap<>();

        for (PreparedItem preparedItem : preparedItems) {
            preparedItemsByProductId.put(
                    preparedItem.product().getId(),
                    preparedItem
            );
        }

        for (CartItemDTO requestedItem : requestedItems) {
            PreparedItem preparedItem =
                    preparedItemsByProductId.get(
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
                .findByEmail(email)
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
        log.info(
                "Actualizando usuario existente: {}",
                user.getEmail()
        );

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
        log.info(
                "Creando usuario invitado: {}",
                email
        );

        User guestUser =
                User.builder()
                        .email(email)
                        .firstName(firstName)
                        .lastName(lastName)
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
        if (orderRequest == null) {
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

        if (
                orderRequest
                        .getPayer()
                        .getEmail() == null
                        || orderRequest
                        .getPayer()
                        .getEmail()
                        .isBlank()
        ) {
            throw new IllegalArgumentException(
                    "El correo del comprador es obligatorio."
            );
        }

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
    }

    private void validateCartItem(
            CartItemDTO item
    ) {
        if (item == null) {
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
        return email
                .trim()
                .toLowerCase();
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

    private String normalizeComparison(
            String value
    ) {
        String normalized =
                normalizeOptional(value);

        return normalized == null
                ? ""
                : normalized.toLowerCase();
    }

    private boolean sameText(
            String firstValue,
            String secondValue
    ) {
        return Objects.equals(
                normalizeComparison(
                        firstValue
                ),
                normalizeComparison(
                        secondValue
                )
        );
    }

    private String[] separateName(
            String fullName
    ) {
        int firstSpaceIndex =
                fullName.indexOf(" ");

        if (firstSpaceIndex < 0) {
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

    private record PreparedItem(
            Product product,
            Integer quantity,
            BigDecimal unitPrice
    ) {
    }

    private record PreparedItems(
            List<PreparedItem> items,
            Map<Long, Integer> quantities,
            BigDecimal total
    ) {
    }
}
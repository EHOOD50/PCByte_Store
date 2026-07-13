package com.asthood.techstore.service;

import com.asthood.techstore.domain.entity.Brand;
import com.asthood.techstore.domain.entity.Category;
import com.asthood.techstore.domain.entity.Product;
import com.asthood.techstore.dto.CartItemDTO;
import com.asthood.techstore.dto.ProductCreateDTO;
import com.asthood.techstore.dto.ProductDTO;
import com.asthood.techstore.exception.ProductNotFoundException;
import com.asthood.techstore.mapper.ProductMapper;
import com.asthood.techstore.repository.BrandRepository;
import com.asthood.techstore.repository.CategoryRepository;
import com.asthood.techstore.repository.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ProductService {

    private static final String INTERNAL_CODE_PREFIX = "PCB-";

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;

    public ProductService(
            ProductRepository productRepository,
            CategoryRepository categoryRepository,
            BrandRepository brandRepository
    ) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.brandRepository = brandRepository;
    }

    // --- DESCONTAR STOCK DESPUÉS DE UNA COMPRA ---
    @Transactional
    public void updateStockAfterPurchase(List<CartItemDTO> items) {
        for (CartItemDTO item : items) {
            int updatedRows = productRepository.decreaseStockByName(
                    item.getName(),
                    item.getQuantity()
            );

            if (updatedRows == 0) {
                System.err.println(
                        "No se pudo descontar stock para: " + item.getName()
                );
            }
        }
    }

    // --- CREAR ---
    @Transactional
    public ProductDTO create(ProductCreateDTO dto) {
        Category category = findCategoryById(dto.getCategoryId());
        Brand brand = findBrandById(dto.getBrandId());

        Product product = ProductMapper.toEntity(dto);

        product.setCategory(category);
        product.setBrand(brand);

        /*
         * Primer guardado:
         * PostgreSQL genera el ID mediante BIGSERIAL/IDENTITY.
         */
        Product savedProduct = productRepository.save(product);

        /*
         * Con el ID definitivo generamos el código interno estable:
         * PCB-000001, PCB-000002, etc.
         */
        if (savedProduct.getInternalCode() == null) {
            savedProduct.setInternalCode(
                    generateInternalCode(savedProduct.getId())
            );
        }

        Product productWithInternalCode =
                productRepository.save(savedProduct);

        return ProductMapper.toDTO(productWithInternalCode);
    }

    // --- BUSCAR POR ID ---
    @Transactional(readOnly = true)
    public ProductDTO findById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));

        return ProductMapper.toDTO(product);
    }

    // --- ACTUALIZAR ---
    @Transactional
    public ProductDTO update(Long id, ProductCreateDTO dto) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));

        existing.setSku(dto.getSku());
        existing.setMpn(dto.getMpn());

        existing.setName(dto.getName());
        existing.setDescription(dto.getDescription());
        existing.setSpecifications(dto.getSpecifications());
        existing.setWarranty(dto.getWarranty());

        existing.setPrice(dto.getPrice());
        existing.setStock(dto.getStock());
        existing.setImageUrl(dto.getImageUrl());

        /*
         * Solo modificamos active cuando el frontend envía un valor.
         * Si llega null, conservamos el estado actual.
         */
        if (dto.getActive() != null) {
            existing.setActive(dto.getActive());
        }

        Category category = findCategoryById(dto.getCategoryId());
        existing.setCategory(category);

        /*
         * Si brandId llega null, se elimina la asociación con la marca.
         */
        Brand brand = findBrandById(dto.getBrandId());
        existing.setBrand(brand);

        /*
         * El internalCode no se modifica durante una actualización.
         * Es un identificador interno permanente de PCByte.
         */
        Product updatedProduct = productRepository.save(existing);

        return ProductMapper.toDTO(updatedProduct);
    }

    // --- ELIMINAR ---
    @Transactional
    public void deleteById(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ProductNotFoundException(id);
        }

        productRepository.deleteById(id);
    }

    // --- LISTAR CON FILTROS Y PAGINACIÓN ---
    @Transactional(readOnly = true)
    public Page<ProductDTO> findAllFiltered(
            int page,
            int size,
            String sortBy,
            String direction,
            String name,
            String category
    ) {
        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        String productName = name != null ? name : "";
        String categoryName = category != null ? category : "";
        String brandName = "";

        Page<Product> productPage;

        if (
                !productName.isEmpty()
                        || !categoryName.isEmpty()
                        || !brandName.isEmpty()
        ) {
            productPage = productRepository
                    .findByNameContainingIgnoreCaseAndCategoryNameContainingIgnoreCaseAndBrandNameContainingIgnoreCase(
                            productName,
                            categoryName,
                            brandName,
                            pageable
                    );
        } else {
            productPage = productRepository.findAll(pageable);
        }

        return productPage.map(ProductMapper::toDTO);
    }

    // --- ACTUALIZACIÓN PARCIAL ---
    @Transactional
    public ProductDTO patch(
            Long id,
            BigDecimal price,
            Integer stock
    ) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));

        if (price != null) {
            product.setPrice(price);
        }

        if (stock != null) {
            product.setStock(stock);
        }

        return ProductMapper.toDTO(
                productRepository.save(product)
        );
    }

    // --- MÉTODOS AUXILIARES ---

    private Category findCategoryById(Long categoryId) {
        if (categoryId == null) {
            throw new EntityNotFoundException(
                    "La categoría es obligatoria"
            );
        }

        return categoryRepository.findById(categoryId)
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "Categoría no encontrada con ID: "
                                        + categoryId
                        )
                );
    }

    private Brand findBrandById(Long brandId) {
        if (brandId == null) {
            return null;
        }

        return brandRepository.findById(brandId)
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "Marca no encontrada con ID: "
                                        + brandId
                        )
                );
    }

    private String generateInternalCode(Long productId) {
        return INTERNAL_CODE_PREFIX
                + String.format("%06d", productId);
    }
}
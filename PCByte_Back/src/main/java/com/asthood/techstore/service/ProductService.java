package com.asthood.techstore.service;

import com.asthood.techstore.domain.entity.Brand;
import com.asthood.techstore.domain.entity.Category;
import com.asthood.techstore.domain.entity.Product;
import com.asthood.techstore.dto.CartItemDTO; // ✨ Asegúrate de importar tu DTO
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

    // ✨ NUEVO: Lógica para descontar stock tras la compra exitosa
    @Transactional
    public void updateStockAfterPurchase(List<CartItemDTO> items) {
        for (CartItemDTO item : items) {
            // Usamos el método que creamos en el Repository Paso 1
            int updatedRows = productRepository.decreaseStockByName(item.getName(), item.getQuantity());

            if (updatedRows == 0) {
                // Opcional: Loggear si un producto no pudo descontar stock (por falta de stock o nombre incorrecto)
                System.err.println("No se pudo descontar stock para: " + item.getName());
            }
        }
    }

    // --- CREAR ---
    @Transactional
    public ProductDTO create(ProductCreateDTO dto) {
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new EntityNotFoundException("Categoría no encontrada con ID: " + dto.getCategoryId()));

        Brand brand = null;

        if (dto.getBrandId() != null) {
            brand = brandRepository.findById(dto.getBrandId())
                    .orElseThrow(() ->
                            new EntityNotFoundException(
                                    "Marca no encontrada con ID: " + dto.getBrandId()
                            )
                    );
        }

        Product product = ProductMapper.toEntity(dto);
        product.setImageUrl(dto.getImageUrl());
        product.setCategory(category);
        product.setBrand(brand);

        return ProductMapper.toDTO(productRepository.save(product));
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

        existing.setName(dto.getName());
        existing.setDescription(dto.getDescription());
        existing.setPrice(dto.getPrice());
        existing.setStock(dto.getStock());
        existing.setImageUrl(dto.getImageUrl());

        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new EntityNotFoundException("Categoría no encontrada"));
            existing.setCategory(category);
        }

        if (dto.getBrandId() != null) {
            Brand brand = brandRepository.findById(dto.getBrandId())
                    .orElseThrow(() ->
                            new EntityNotFoundException("Marca no encontrada")
                    );

            existing.setBrand(brand);
        }

        return ProductMapper.toDTO(productRepository.save(existing));
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
    public Page<ProductDTO> findAllFiltered(int page, int size, String sortBy, String direction,
                                            String name, String category) {

        Sort sort = direction.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() :
                Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Product> productPage;

        String productName = name != null ? name : "";
        String categoryName = category != null ? category : "";
        String brandName = "";

        if (!productName.isEmpty() || !categoryName.isEmpty() || !brandName.isEmpty()) {

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

    // --- ACTUALIZACIÓN PARCIAL (PATCH) ---
    @Transactional
    public ProductDTO patch(Long id, BigDecimal price, Integer stock) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));

        if (price != null) product.setPrice(price);
        if (stock != null) product.setStock(stock);

        return ProductMapper.toDTO(productRepository.save(product));
    }
}
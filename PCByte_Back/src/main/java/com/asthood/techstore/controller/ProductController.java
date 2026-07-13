package com.asthood.techstore.controller;

import com.asthood.techstore.dto.CartItemDTO;
import com.asthood.techstore.dto.ProductCreateDTO;
import com.asthood.techstore.dto.ProductDTO;
import com.asthood.techstore.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping("/update-stock")
    public ResponseEntity<Void> updateStock(
            @RequestBody List<CartItemDTO> items
    ) {
        productService.updateStockAfterPurchase(items);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                productService.findById(id)
        );
    }

    @GetMapping
    public ResponseEntity<?> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "100") int size
    ) {
        return ResponseEntity.ok(
                productService.findAllFiltered(
                        page,
                        size,
                        "id",
                        "asc",
                        null,
                        null
                )
        );
    }

    @PostMapping
    public ResponseEntity<ProductDTO> create(
            @Valid @RequestBody ProductCreateDTO dto
    ) {
        return new ResponseEntity<>(
                productService.create(dto),
                HttpStatus.CREATED
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody ProductCreateDTO dto
    ) {
        return ResponseEntity.ok(
                productService.update(id, dto)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id
    ) {
        productService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
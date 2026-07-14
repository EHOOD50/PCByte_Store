package com.asthood.techstore.controller;

import com.asthood.techstore.dto.CategoryDTO;
import com.asthood.techstore.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(
            CategoryService categoryService
    ) {
        this.categoryService = categoryService;
    }

    // --- LISTAR TODAS ---
    @GetMapping
    public ResponseEntity<List<CategoryDTO>> getAll() {
        return ResponseEntity.ok(
                categoryService.findAll()
        );
    }

    // --- BUSCAR POR ID ---
    @GetMapping("/{id}")
    public ResponseEntity<CategoryDTO> getById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                categoryService.findById(id)
        );
    }

    // --- CREAR ---
    @PostMapping
    public ResponseEntity<CategoryDTO> create(
            @Valid @RequestBody CategoryDTO dto
    ) {
        return new ResponseEntity<>(
                categoryService.create(dto),
                HttpStatus.CREATED
        );
    }

    // --- ACTUALIZAR ---
    @PutMapping("/{id}")
    public ResponseEntity<CategoryDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody CategoryDTO dto
    ) {
        return ResponseEntity.ok(
                categoryService.update(id, dto)
        );
    }

    // --- ELIMINAR ---
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id
    ) {
        categoryService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
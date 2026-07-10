package com.asthood.techstore.controller;

import com.asthood.techstore.domain.entity.Category;
import com.asthood.techstore.repository.CategoryRepository;
import com.asthood.techstore.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*") // Para que React pueda conectarse
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    // ESTE ES EL QUE TE FALTA:
    @PostMapping
    public ResponseEntity<Category> createCategory(@RequestBody Category category) {
        // Aquí llamamos al método .save() que acabamos de crear arriba
        Category savedCategory = categoryService.save(category);
        return new ResponseEntity<>(savedCategory, HttpStatus.CREATED);
    }

    // El que ya tienes (probablemente)
    @GetMapping
    public List<Category> getAllCategories() {
        return categoryService.findAll();
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteById(id); // Asegúrate de que tu service tenga deleteById
        return ResponseEntity.noContent().build();
    }
}
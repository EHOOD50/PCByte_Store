package com.asthood.techstore.service;

import com.asthood.techstore.domain.entity.Category;
import com.asthood.techstore.dto.CategoryDTO;
import com.asthood.techstore.mapper.CategoryMapper;
import com.asthood.techstore.repository.CategoryRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(
            CategoryRepository categoryRepository
    ) {
        this.categoryRepository = categoryRepository;
    }

    // =========================
    // LISTAR TODAS
    // =========================

    @Transactional(readOnly = true)
    public List<CategoryDTO> findAll() {
        return categoryRepository.findAll()
                .stream()
                .map(CategoryMapper::toDTO)
                .toList();
    }

    // =========================
    // BUSCAR POR ID
    // =========================

    @Transactional(readOnly = true)
    public CategoryDTO findById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "Categoría no encontrada con ID: " + id
                        )
                );

        return CategoryMapper.toDTO(category);
    }

    // =========================
    // CREAR
    // =========================

    public CategoryDTO create(CategoryDTO dto) {
        String categoryName = normalizeName(dto.getName());

        if (
                categoryRepository.existsByNameIgnoreCase(
                        categoryName
                )
        ) {
            throw new IllegalArgumentException(
                    "Ya existe una categoría con ese nombre."
            );
        }

        Category category = new Category();
        category.setName(categoryName);

        return CategoryMapper.toDTO(
                categoryRepository.save(category)
        );
    }

    // =========================
    // ACTUALIZAR
    // =========================

    public CategoryDTO update(
            Long id,
            CategoryDTO dto
    ) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "Categoría no encontrada con ID: " + id
                        )
                );

        String categoryName = normalizeName(dto.getName());

        boolean nameChanged =
                !category.getName()
                        .equalsIgnoreCase(categoryName);

        if (
                nameChanged &&
                        categoryRepository.existsByNameIgnoreCase(
                                categoryName
                        )
        ) {
            throw new IllegalArgumentException(
                    "Ya existe una categoría con ese nombre."
            );
        }

        category.setName(categoryName);

        return CategoryMapper.toDTO(
                categoryRepository.save(category)
        );
    }

    // =========================
    // ELIMINAR
    // =========================

    public void deleteById(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new EntityNotFoundException(
                    "Categoría no encontrada con ID: " + id
            );
        }

        categoryRepository.deleteById(id);
    }

    // =========================
    // MÉTODOS AUXILIARES
    // =========================

    private String normalizeName(String name) {
        if (name == null) {
            return "";
        }

        return name
                .trim()
                .replaceAll("\\s+", " ");
    }
}
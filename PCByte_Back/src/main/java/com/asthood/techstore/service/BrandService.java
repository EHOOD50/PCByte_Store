package com.asthood.techstore.service;

import com.asthood.techstore.domain.entity.Brand;
import com.asthood.techstore.dto.BrandDTO;
import com.asthood.techstore.mapper.BrandMapper;
import com.asthood.techstore.repository.BrandRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BrandService {

    private final BrandRepository brandRepository;

    public BrandService(
            BrandRepository brandRepository
    ) {
        this.brandRepository = brandRepository;
    }

    // ============================
    // LISTAR TODAS LAS MARCAS
    // ============================

    @Transactional(readOnly = true)
    public List<BrandDTO> findAll() {
        return brandRepository.findAll()
                .stream()
                .map(BrandMapper::toDTO)
                .toList();
    }

    // ============================
    // BUSCAR POR ID
    // ============================

    @Transactional(readOnly = true)
    public BrandDTO findById(Long id) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "Marca no encontrada con ID: " + id
                        )
                );

        return BrandMapper.toDTO(brand);
    }

    // ============================
    // CREAR
    // ============================

    @Transactional
    public BrandDTO create(BrandDTO dto) {
        String brandName =
                normalizeName(dto.getName());

        if (
                brandRepository.existsByNameIgnoreCase(
                        brandName
                )
        ) {
            throw new IllegalArgumentException(
                    "La marca ya existe."
            );
        }

        Brand brand =
                BrandMapper.toEntity(dto);

        brand.setName(brandName);

        brand.setActive(
                dto.getActive() != null
                        ? dto.getActive()
                        : true
        );

        return BrandMapper.toDTO(
                brandRepository.save(brand)
        );
    }

    // ============================
    // ACTUALIZAR
    // ============================

    @Transactional
    public BrandDTO update(
            Long id,
            BrandDTO dto
    ) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "Marca no encontrada con ID: " + id
                        )
                );

        String brandName =
                normalizeName(dto.getName());

        boolean nameChanged =
                !brand.getName()
                        .equalsIgnoreCase(brandName);

        if (
                nameChanged &&
                        brandRepository.existsByNameIgnoreCase(
                                brandName
                        )
        ) {
            throw new IllegalArgumentException(
                    "La marca ya existe."
            );
        }

        brand.setName(brandName);
        brand.setLogoUrl(
                normalizeOptionalText(dto.getLogoUrl())
        );
        brand.setWebsite(
                normalizeOptionalText(dto.getWebsite())
        );

        if (dto.getActive() != null) {
            brand.setActive(dto.getActive());
        }

        return BrandMapper.toDTO(
                brandRepository.save(brand)
        );
    }

    // ============================
    // ELIMINAR
    // ============================

    @Transactional
    public void delete(Long id) {
        if (!brandRepository.existsById(id)) {
            throw new EntityNotFoundException(
                    "Marca no encontrada con ID: " + id
            );
        }

        brandRepository.deleteById(id);
    }

    // ============================
    // MÉTODOS AUXILIARES
    // ============================

    private String normalizeName(String name) {
        if (name == null) {
            return "";
        }

        return name
                .trim()
                .replaceAll("\\s+", " ");
    }

    private String normalizeOptionalText(String value) {
        if (value == null) {
            return null;
        }

        String normalized = value.trim();

        return normalized.isEmpty()
                ? null
                : normalized;
    }
}
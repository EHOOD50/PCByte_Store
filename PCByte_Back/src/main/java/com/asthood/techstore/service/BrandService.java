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

    public BrandService(BrandRepository brandRepository) {
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
                        new EntityNotFoundException("Marca no encontrada"));

        return BrandMapper.toDTO(brand);
    }

    // ============================
    // CREAR
    // ============================

    @Transactional
    public BrandDTO create(BrandDTO dto) {

        if (brandRepository.existsByNameIgnoreCase(dto.getName())) {
            throw new IllegalArgumentException("La marca ya existe.");
        }

        Brand brand = BrandMapper.toEntity(dto);

        return BrandMapper.toDTO(
                brandRepository.save(brand)
        );
    }

    // ============================
    // ACTUALIZAR
    // ============================

    @Transactional
    public BrandDTO update(Long id, BrandDTO dto) {

        Brand brand = brandRepository.findById(id)
                .orElseThrow(() ->
                        new EntityNotFoundException("Marca no encontrada"));

        brand.setName(dto.getName());
        brand.setLogoUrl(dto.getLogoUrl());
        brand.setWebsite(dto.getWebsite());
        brand.setActive(dto.getActive());

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
            throw new EntityNotFoundException("Marca no encontrada.");
        }

        brandRepository.deleteById(id);
    }
}
package com.asthood.techstore.repository;


import com.asthood.techstore.model.GlobalConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GlobalConfigRepository extends JpaRepository<GlobalConfig, String> {
    // JpaRepository ya incluye findById, save, etc.
}
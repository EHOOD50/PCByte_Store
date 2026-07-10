package com.asthood.techstore.repository;

import com.asthood.techstore.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {
    // Para buscar todas las direcciones de un usuario específico
    List<Address> findByUserId(Long userId);
}

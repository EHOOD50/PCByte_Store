package com.asthood.techstore.repository;

import com.asthood.techstore.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AddressRepository
        extends JpaRepository<Address, Long> {

    /*
     * Mantiene un orden estable por ID.
     *
     * Cambiar la dirección principal no modifica
     * la posición visual de las direcciones.
     */
    List<Address> findByUserIdOrderByIdAsc(
            Long userId
    );

    Optional<Address> findByUserIdAndIsDefaultTrue(
            Long userId
    );

    Optional<Address> findByIdAndUserId(
            Long addressId,
            Long userId
    );

    Optional<Address> findFirstByUserIdOrderByIdAsc(
            Long userId
    );
}
package com.asthood.techstore.repository;

import com.asthood.techstore.model.VerificationPurpose;
import com.asthood.techstore.model.VerificationToken;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface VerificationTokenRepository
        extends JpaRepository<
        VerificationToken,
        Long
        > {

    /*
     * Obtiene y bloquea un token largo durante su consumo.
     *
     * Se utiliza para verificaciones donde el token posee
     * suficiente entropía para identificar por sí mismo
     * la solicitud.
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<VerificationToken>
    findByTokenHash(
            String tokenHash
    );

    /*
     * Obtiene y bloquea el código activo correspondiente
     * a un correo y propósito determinados.
     *
     * Este método está pensado especialmente para códigos
     * cortos como los utilizados durante el checkout invitado.
     *
     * El correo forma parte de la búsqueda porque un código
     * numérico de 6 dígitos no debe actuar como identificador
     * global por sí solo.
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<VerificationToken>
    findFirstByEmailIgnoreCaseAndPurposeAndTokenHashAndUsedAtIsNullAndInvalidatedAtIsNullOrderByCreatedAtDesc(
            String email,
            VerificationPurpose purpose,
            String tokenHash
    );

    /*
     * Obtiene todos los tokens no usados ni invalidados
     * para un correo y propósito.
     *
     * Puede incluir tokens vencidos, porque también deben
     * invalidarse antes de emitir uno nuevo.
     */
    List<VerificationToken>
    findAllByEmailIgnoreCaseAndPurposeAndUsedAtIsNullAndInvalidatedAtIsNull(
            String email,
            VerificationPurpose purpose
    );

    /*
     * Busca la solicitud más reciente para aplicar
     * el tiempo mínimo entre reenvíos.
     */
    Optional<VerificationToken>
    findTopByEmailIgnoreCaseAndPurposeOrderByCreatedAtDesc(
            String email,
            VerificationPurpose purpose
    );

    /*
     * Cuenta todas las solicitudes recientes, incluyendo
     * aquellas posteriormente invalidadas o utilizadas.
     *
     * Esto evita saltarse el límite solicitando e
     * invalidando tokens sucesivamente.
     */
    long countByEmailIgnoreCaseAndPurposeAndCreatedAtAfter(
            String email,
            VerificationPurpose purpose,
            LocalDateTime createdAfter
    );
    /*
     * Comprueba si existe una verificación de correo
     * consumida correctamente después de una fecha determinada.
     *
     * Se utiliza para autorizar el checkout invitado sin
     * depender del estado de una cuenta registrada.
     */
    boolean existsByEmailIgnoreCaseAndPurposeAndUsedAtIsNotNullAndUsedAtAfter(
            String email,
            VerificationPurpose purpose,
            LocalDateTime usedAfter
    );
    /*
     * Obtiene tokens asociados a un usuario concreto.
     */
    List<VerificationToken>
    findAllByUserIdAndPurposeAndUsedAtIsNullAndInvalidatedAtIsNull(
            Long userId,
            VerificationPurpose purpose
    );

    /*
     * Será utilizado por la limpieza automática de tokens.
     */
    List<VerificationToken>
    findAllByExpiresAtBefore(
            LocalDateTime dateTime
    );
}
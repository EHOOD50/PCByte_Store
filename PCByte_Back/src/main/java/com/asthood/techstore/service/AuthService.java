package com.asthood.techstore.service;

import com.asthood.techstore.dto.ChangePasswordDTO;
import com.asthood.techstore.dto.EmailVerificationResponseDTO;
import com.asthood.techstore.dto.RegisterRequestDTO;
import com.asthood.techstore.dto.UpdateProfileDTO;
import com.asthood.techstore.dto.UserAuthResponseDTO;
import com.asthood.techstore.event.EmailVerificationRequestedEvent;
import com.asthood.techstore.exception.VerificationTokenErrorCode;
import com.asthood.techstore.exception.VerificationTokenException;
import com.asthood.techstore.model.Address;
import com.asthood.techstore.model.User;
import com.asthood.techstore.model.UserStatus;
import com.asthood.techstore.model.VerificationPurpose;
import com.asthood.techstore.model.VerificationToken;
import com.asthood.techstore.repository.UserRepository;
import com.asthood.techstore.service.identity.IssuedVerificationToken;
import com.asthood.techstore.service.identity.VerificationTokenService;
import com.asthood.techstore.util.PhoneNumberUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Locale;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final VerificationTokenService
            verificationTokenService;

    private final ApplicationEventPublisher
            applicationEventPublisher;

    private final Clock applicationClock;

    /*
     * Registra una cuenta nueva o prepara una cuenta invitada
     * para convertirse en cuenta registrada.
     *
     * La cuenta no queda activa inmediatamente.
     * Permanece en EMAIL_PENDIENTE_VERIFICACION hasta que
     * el cliente utilice correctamente el enlace enviado.
     */
    @Transactional
    public UserAuthResponseDTO register(
            RegisterRequestDTO request
    ) {
        return register(
                request,
                null
        );
    }

    /*
     * Sobrecarga que permite registrar también la IP desde
     * la cual se solicitó la creación de la cuenta.
     *
     * La IP nunca se almacena directamente: el servicio
     * de tokens conserva únicamente su hash.
     */
    @Transactional
    public UserAuthResponseDTO register(
            RegisterRequestDTO request,
            String requestIp
    ) {
        validateRegisterRequest(
                request
        );

        String normalizedEmail =
                normalizeEmail(
                        request.getEmail()
                );

        String firstName =
                normalizeText(
                        request.getFirstName()
                );

        String lastName =
                normalizeText(
                        request.getLastName()
                );

        User user =
                userRepository
                        .findByEmail(
                                normalizedEmail
                        )
                        .map(
                                existingUser ->
                                        prepareExistingUserForRegistration(
                                                existingUser,
                                                request,
                                                firstName,
                                                lastName
                                        )
                        )
                        .orElseGet(
                                () ->
                                        createPendingUser(
                                                request,
                                                normalizedEmail,
                                                firstName,
                                                lastName
                                        )
                        );

        addMainAddressIfPresent(
                user,
                request
        );

        User savedUser =
                userRepository.saveAndFlush(
                        user
                );

        IssuedVerificationToken issuedToken =
                verificationTokenService
                        .issueToken(
                                savedUser,
                                savedUser.getEmail(),
                                resolveRegistrationPurpose(
                                        savedUser
                                ),
                                requestIp
                        );

        publishVerificationEmailEvent(
                savedUser,
                issuedToken
        );

        return toResponseDTO(
                savedUser
        );
    }

    /*
     * Reenvía el correo de verificación para una cuenta
     * que todavía se encuentra pendiente.
     *
     * La respuesta externa debería ser genérica para evitar
     * revelar si un correo existe en la base de datos.
     */
    @Transactional
    public void resendVerification(
            String email,
            String requestIp
    ) {
        String normalizedEmail =
                normalizeEmail(
                        email
                );

        User user =
                userRepository
                        .findByEmail(
                                normalizedEmail
                        )
                        .orElse(null);

        /*
         * No revelamos públicamente que el correo
         * no está registrado.
         */
        if (user == null) {
            return;
        }

        if (user.isRegistered()) {
            /*
             * También evitamos revelar mediante el endpoint
             * público que existe una cuenta activa.
             */
            return;
        }

        if (
                !user.isEmailVerificationPending()
        ) {
            return;
        }

        IssuedVerificationToken issuedToken =
                verificationTokenService
                        .issueToken(
                                user,
                                user.getEmail(),
                                VerificationPurpose
                                        .EMAIL_VERIFICATION,
                                requestIp
                        );

        publishVerificationEmailEvent(
                user,
                issuedToken
        );
    }

    /*
     * Consume el token recibido por correo y activa
     * definitivamente la cuenta.
     */
    @Transactional
    public EmailVerificationResponseDTO verifyEmail(
            String rawToken
    ) {
        VerificationToken verificationToken =
                verificationTokenService
                        .consumeToken(
                                rawToken,
                                VerificationPurpose
                                        .EMAIL_VERIFICATION
                        );

        User user =
                verificationToken
                        .getUser();

        if (user == null) {
            throw new VerificationTokenException(
                    VerificationTokenErrorCode
                            .USER_NOT_FOUND
            );
        }

        if (user.isRegistered()) {
            throw new VerificationTokenException(
                    VerificationTokenErrorCode
                            .ACCOUNT_ALREADY_ACTIVE
            );
        }

        if (
                !user.isEmailVerificationPending()
        ) {
            throw new VerificationTokenException(
                    VerificationTokenErrorCode
                            .ACCOUNT_NOT_PENDING
            );
        }

        String tokenEmail =
                normalizeEmail(
                        verificationToken
                                .getEmail()
                );

        String userEmail =
                normalizeEmail(
                        user.getEmail()
                );

        if (
                !tokenEmail.equals(
                        userEmail
                )
        ) {
            throw new VerificationTokenException(
                    VerificationTokenErrorCode
                            .TOKEN_INVALID
            );
        }

        user.verifyEmail(
                now()
        );

        User savedUser =
                userRepository.save(
                        user
                );

        return EmailVerificationResponseDTO
                .builder()
                .verified(true)
                .message(
                        "Tu correo fue verificado correctamente. Ya puedes iniciar sesión."
                )
                .status(
                        savedUser.getStatus()
                )
                .build();
    }

    /*
     * Obtiene los datos de una cuenta autenticada y activa.
     */
    @Transactional(readOnly = true)
    public UserAuthResponseDTO getAuthenticatedUser(
            String email
    ) {
        User user =
                findRegisteredUserByEmail(
                        email
                );

        return toResponseDTO(
                user
        );
    }

    /*
     * Actualiza solamente los datos personales permitidos.
     *
     * El correo, la contraseña y el estado de la cuenta
     * no se modifican mediante esta operación.
     */
    @Transactional
    public UserAuthResponseDTO updateProfile(
            String email,
            UpdateProfileDTO request
    ) {
        validateUpdateProfileRequest(
                request
        );

        User user =
                findRegisteredUserByEmail(
                        email
                );

        user.setFirstName(
                normalizeText(
                        request.getFirstName()
                )
        );

        user.setLastName(
                normalizeText(
                        request.getLastName()
                )
        );

        user.setPhone(
                normalizePhone(
                        request.getPhone()
                )
        );

        User savedUser =
                userRepository.save(
                        user
                );

        return toResponseDTO(
                savedUser
        );
    }

    /*
     * Cambia la contraseña de una cuenta autenticada.
     */
    @Transactional
    public void changePassword(
            String email,
            ChangePasswordDTO request
    ) {
        validateChangePasswordRequest(
                request
        );

        User user =
                findRegisteredUserByEmail(
                        email
                );

        boolean currentPasswordMatches =
                passwordEncoder.matches(
                        request.getCurrentPassword(),
                        user.getPassword()
                );

        if (!currentPasswordMatches) {
            throw new IllegalArgumentException(
                    "La contraseña actual es incorrecta."
            );
        }

        if (
                !request
                        .getNewPassword()
                        .equals(
                                request.getConfirmPassword()
                        )
        ) {
            throw new IllegalArgumentException(
                    "La nueva contraseña y su confirmación no coinciden."
            );
        }

        boolean samePassword =
                passwordEncoder.matches(
                        request.getNewPassword(),
                        user.getPassword()
                );

        if (samePassword) {
            throw new IllegalArgumentException(
                    "La nueva contraseña debe ser diferente de la actual."
            );
        }

        user.setPassword(
                passwordEncoder.encode(
                        request.getNewPassword()
                )
        );

        userRepository.save(
                user
        );
    }

    /*
     * Prepara una cuenta existente para el proceso
     * de registro.
     *
     * Escenarios admitidos:
     *
     * - INVITADO:
     *   conserva pedidos y relaciones existentes;
     *   pasa a EMAIL_PENDIENTE_VERIFICACION.
     *
     * - EMAIL_PENDIENTE_VERIFICACION:
     *   actualiza sus datos y genera un nuevo enlace.
     *
     * - REGISTRADO:
     *   no permite registrar nuevamente el mismo correo.
     *
     * - BLOQUEADO:
     *   tampoco permite utilizar el registro público.
     */
    private User prepareExistingUserForRegistration(
            User existingUser,
            RegisterRequestDTO request,
            String firstName,
            String lastName
    ) {
        if (existingUser.isRegistered()) {
            throw new VerificationTokenException(
                    VerificationTokenErrorCode
                            .ACCOUNT_ALREADY_ACTIVE,
                    "Ya existe una cuenta activa con este correo."
            );
        }

        if (
                existingUser.getStatus() ==
                        UserStatus.BLOQUEADO
        ) {
            throw new IllegalStateException(
                    "No fue posible completar el registro de esta cuenta."
            );
        }

        existingUser.setFirstName(
                firstName
        );

        existingUser.setLastName(
                lastName
        );

        existingUser.setPhone(
                normalizePhone(
                        request.getPhone()
                )
        );

        existingUser.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        existingUser
                .markEmailVerificationPending();

        if (
                existingUser.getAddresses() ==
                        null
        ) {
            existingUser.setAddresses(
                    new ArrayList<>()
            );
        }

        if (
                existingUser.getOrders() ==
                        null
        ) {
            existingUser.setOrders(
                    new ArrayList<>()
            );
        }

        return existingUser;
    }

    /*
     * Crea una cuenta nueva pendiente de verificación.
     */
    private User createPendingUser(
            RegisterRequestDTO request,
            String normalizedEmail,
            String firstName,
            String lastName
    ) {
        return User.builder()
                .firstName(
                        firstName
                )
                .lastName(
                        lastName
                )
                .email(
                        normalizedEmail
                )
                .password(
                        passwordEncoder.encode(
                                request.getPassword()
                        )
                )
                .phone(
                        normalizePhone(
                                request.getPhone()
                        )
                )
                .status(
                        UserStatus
                                .EMAIL_PENDIENTE_VERIFICACION
                )
                .emailVerifiedAt(
                        null
                )
                .addresses(
                        new ArrayList<>()
                )
                .orders(
                        new ArrayList<>()
                )
                .build();
    }

    /*
     * Publica el evento que será procesado solamente
     * después del commit correcto de la transacción.
     */
    private void publishVerificationEmailEvent(
            User user,
            IssuedVerificationToken issuedToken
    ) {
        EmailVerificationRequestedEvent event =
                new EmailVerificationRequestedEvent(
                        user.getFirstName(),
                        issuedToken.email(),
                        issuedToken.rawToken(),
                        issuedToken.expiresAt()
                );

        applicationEventPublisher
                .publishEvent(
                        event
                );
    }

    /*
     * Actualmente las cuentas invitadas y las cuentas
     * nuevas utilizan el mismo enlace de activación.
     *
     * GUEST_ACCOUNT_CONVERSION queda reservado para el
     * flujo especial de conversión inmediata posterior
     * al checkout.
     */
    private VerificationPurpose resolveRegistrationPurpose(
            User user
    ) {
        return VerificationPurpose
                .EMAIL_VERIFICATION;
    }

    private User findRegisteredUserByEmail(
            String email
    ) {
        if (
                email == null ||
                        email.isBlank()
        ) {
            throw new IllegalArgumentException(
                    "El correo del usuario autenticado es obligatorio."
            );
        }

        String normalizedEmail =
                normalizeEmail(
                        email
                );

        User user =
                userRepository
                        .findByEmail(
                                normalizedEmail
                        )
                        .orElseThrow(
                                () ->
                                        new IllegalArgumentException(
                                                "Usuario no encontrado."
                                        )
                        );

        if (!user.isRegistered()) {
            if (
                    user.isEmailVerificationPending()
            ) {
                throw new IllegalStateException(
                        "La cuenta aún requiere verificar su correo electrónico."
                );
            }

            if (
                    user.getStatus() ==
                            UserStatus.BLOQUEADO
            ) {
                throw new IllegalStateException(
                        "La cuenta se encuentra bloqueada."
                );
            }

            throw new IllegalArgumentException(
                    "El usuario no tiene una cuenta registrada."
            );
        }

        if (
                !user.isEmailVerified()
        ) {
            throw new IllegalStateException(
                    "El correo de la cuenta todavía no ha sido verificado."
            );
        }

        return user;
    }

    /*
     * Agrega la dirección proporcionada durante el registro.
     *
     * Si la misma dirección ya está asociada al usuario,
     * no crea un duplicado.
     */
    private void addMainAddressIfPresent(
            User user,
            RegisterRequestDTO request
    ) {
        if (
                request.getStreet() == null ||
                        request.getStreet()
                                .isBlank()
        ) {
            return;
        }

        if (
                user.getAddresses() ==
                        null
        ) {
            user.setAddresses(
                    new ArrayList<>()
            );
        }

        String street =
                normalizeText(
                        request.getStreet()
                );

        String number =
                normalizeNullableText(
                        request.getNumber()
                );

        String apartment =
                normalizeNullableText(
                        request.getApartment()
                );

        String city =
                normalizeNullableText(
                        request.getCity()
                );

        String region =
                normalizeNullableText(
                        request.getRegion()
                );

        boolean addressAlreadyExists =
                user.getAddresses()
                        .stream()
                        .anyMatch(
                                existingAddress ->
                                        sameNormalizedValue(
                                                existingAddress
                                                        .getStreet(),
                                                street
                                        ) &&
                                                sameNormalizedValue(
                                                        existingAddress
                                                                .getNumber(),
                                                        number
                                                ) &&
                                                sameNormalizedValue(
                                                        existingAddress
                                                                .getApartment(),
                                                        apartment
                                                ) &&
                                                sameNormalizedValue(
                                                        existingAddress
                                                                .getCity(),
                                                        city
                                                ) &&
                                                sameNormalizedValue(
                                                        existingAddress
                                                                .getRegion(),
                                                        region
                                                )
                        );

        if (addressAlreadyExists) {
            return;
        }

        user.getAddresses()
                .forEach(
                        address ->
                                address.setDefault(
                                        false
                                )
                );

        Address address =
                Address.builder()
                        .label(
                                request.getAddressLabel() ==
                                        null ||
                                        request.getAddressLabel()
                                                .isBlank()
                                        ? "Principal"
                                        : normalizeText(
                                        request.getAddressLabel()
                                )
                        )
                        .street(
                                street
                        )
                        .number(
                                number
                        )
                        .apartment(
                                apartment
                        )
                        .city(
                                city
                        )
                        .region(
                                region
                        )
                        .extraInfo(
                                normalizeNullableText(
                                        request.getExtraInfo()
                                )
                        )
                        .isDefault(
                                true
                        )
                        .user(
                                user
                        )
                        .build();

        user.getAddresses()
                .add(
                        address
                );
    }

    private boolean sameNormalizedValue(
            String firstValue,
            String secondValue
    ) {
        String normalizedFirst =
                normalizeNullableText(
                        firstValue
                );

        String normalizedSecond =
                normalizeNullableText(
                        secondValue
                );

        return Objects.equals(
                normalizedFirst,
                normalizedSecond
        );
    }

    private UserAuthResponseDTO toResponseDTO(
            User user
    ) {
        return UserAuthResponseDTO
                .builder()
                .id(
                        user.getId()
                )
                .firstName(
                        user.getFirstName()
                )
                .lastName(
                        user.getLastName()
                )
                .email(
                        user.getEmail()
                )
                .phone(
                        user.getPhone()
                )
                .status(
                        user.getStatus()
                )
                .role(
                        user.getRole()
                )
                .build();
    }
    private void validateRegisterRequest(
            RegisterRequestDTO request
    ) {
        if (request == null) {
            throw new IllegalArgumentException(
                    "Los datos de registro son obligatorios."
            );
        }

        if (
                request.getFirstName() ==
                        null ||
                        request.getFirstName()
                                .isBlank()
        ) {
            throw new IllegalArgumentException(
                    "El nombre es obligatorio."
            );
        }

        if (
                request.getLastName() ==
                        null ||
                        request.getLastName()
                                .isBlank()
        ) {
            throw new IllegalArgumentException(
                    "El apellido es obligatorio."
            );
        }

        if (
                request.getEmail() ==
                        null ||
                        request.getEmail()
                                .isBlank()
        ) {
            throw new IllegalArgumentException(
                    "El correo es obligatorio."
            );
        }

        if (
                request.getPassword() ==
                        null ||
                        request.getPassword()
                                .isBlank()
        ) {
            throw new IllegalArgumentException(
                    "La contraseña es obligatoria."
            );
        }

        validatePasswordLength(
                request.getPassword(),
                "La contraseña debe contener entre 8 y 72 caracteres."
        );

        normalizePhone(
                request.getPhone()
        );
    }

    private void validateUpdateProfileRequest(
            UpdateProfileDTO request
    ) {
        if (request == null) {
            throw new IllegalArgumentException(
                    "Los datos del perfil son obligatorios."
            );
        }

        if (
                request.getFirstName() ==
                        null ||
                        request.getFirstName()
                                .isBlank()
        ) {
            throw new IllegalArgumentException(
                    "El nombre es obligatorio."
            );
        }

        if (
                request.getLastName() ==
                        null ||
                        request.getLastName()
                                .isBlank()
        ) {
            throw new IllegalArgumentException(
                    "El apellido es obligatorio."
            );
        }

        normalizePhone(
                request.getPhone()
        );
    }

    private void validateChangePasswordRequest(
            ChangePasswordDTO request
    ) {
        if (request == null) {
            throw new IllegalArgumentException(
                    "Los datos para cambiar la contraseña son obligatorios."
            );
        }

        if (
                request.getCurrentPassword() ==
                        null ||
                        request.getCurrentPassword()
                                .isBlank()
        ) {
            throw new IllegalArgumentException(
                    "La contraseña actual es obligatoria."
            );
        }

        if (
                request.getNewPassword() ==
                        null ||
                        request.getNewPassword()
                                .isBlank()
        ) {
            throw new IllegalArgumentException(
                    "La nueva contraseña es obligatoria."
            );
        }

        if (
                request.getConfirmPassword() ==
                        null ||
                        request.getConfirmPassword()
                                .isBlank()
        ) {
            throw new IllegalArgumentException(
                    "Debes confirmar la nueva contraseña."
            );
        }

        validatePasswordLength(
                request.getCurrentPassword(),
                "La contraseña actual debe contener entre 8 y 72 caracteres."
        );

        validatePasswordLength(
                request.getNewPassword(),
                "La nueva contraseña debe contener entre 8 y 72 caracteres."
        );

        validatePasswordLength(
                request.getConfirmPassword(),
                "La confirmación debe contener entre 8 y 72 caracteres."
        );
    }

    private void validatePasswordLength(
            String password,
            String message
    ) {
        if (
                password.length() < 8 ||
                        password.length() > 72
        ) {
            throw new IllegalArgumentException(
                    message
            );
        }
    }

    private String normalizeEmail(
            String email
    ) {
        if (
                email == null ||
                        email.isBlank()
        ) {
            throw new IllegalArgumentException(
                    "El correo es obligatorio."
            );
        }

        return email
                .trim()
                .toLowerCase(
                        Locale.ROOT
                );
    }

    private String normalizeText(
            String value
    ) {
        return value
                .trim()
                .replaceAll(
                        "\\s+",
                        " "
                );
    }

    private String normalizeNullableText(
            String value
    ) {
        if (
                value == null ||
                        value.isBlank()
        ) {
            return null;
        }

        return normalizeText(
                value
        );
    }

    private String normalizePhone(
            String phone
    ) {
        if (
                phone == null ||
                        phone.isBlank()
        ) {
            return null;
        }

        if (
                !PhoneNumberUtils.isValid(
                        phone
                )
        ) {
            throw new IllegalArgumentException(
                    "El teléfono no tiene un formato válido."
            );
        }

        return PhoneNumberUtils.normalize(
                phone
        );
    }

    private LocalDateTime now() {
        return LocalDateTime.now(
                applicationClock
        );
    }
}
package com.asthood.techstore.config;

import com.asthood.techstore.model.UserRole;
import com.asthood.techstore.model.UserStatus;
import com.asthood.techstore.repository.UserRepository;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.Locale;

@Configuration
public class SecurityConfig {

    /*
     * Permite utilizar contraseñas codificadas con el prefijo
     * correspondiente, por ejemplo:
     *
     * {bcrypt}
     * {noop}
     *
     * Las nuevas contraseñas se codifican mediante bcrypt.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return PasswordEncoderFactories
                .createDelegatingPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http
                /*
                 * Configuración CORS centralizada.
                 */
                .cors(
                        cors ->
                                cors.configurationSource(
                                        corsConfigurationSource()
                                )
                )

                /*
                 * La API es REST y no utiliza sesiones
                 * ni formularios tradicionales del servidor.
                 */
                .csrf(
                        AbstractHttpConfigurer::disable
                )

                /*
                 * La autenticación utiliza HTTP Basic.
                 *
                 * Se personaliza la respuesta para evitar que
                 * el navegador muestre su cuadro automático
                 * de usuario y contraseña.
                 */
                .httpBasic(
                        basic ->
                                basic.authenticationEntryPoint(
                                        (
                                                request,
                                                response,
                                                authException
                                        ) ->
                                                response.sendError(
                                                        HttpServletResponse
                                                                .SC_UNAUTHORIZED,
                                                        "No fue posible autenticar la solicitud."
                                                )
                                )
                )

                /*
                 * Cada solicitud protegida debe incluir
                 * sus credenciales.
                 */
                .sessionManagement(
                        session ->
                                session.sessionCreationPolicy(
                                        SessionCreationPolicy
                                                .STATELESS
                                )
                )

                .authorizeHttpRequests(
                        authorization ->
                                authorization

                                        /*
                                         * Solicitudes preflight del navegador.
                                         */
                                        .requestMatchers(
                                                HttpMethod.OPTIONS,
                                                "/**"
                                        )
                                        .permitAll()

                                        /*
                                         * Catálogo público.
                                         */
                                        .requestMatchers(
                                                HttpMethod.GET,
                                                "/api/products/**",
                                                "/api/categories/**"
                                        )
                                        .permitAll()

                                        /*
                                         * Flujo público de pagos.
                                         */
                                        .requestMatchers(
                                                "/api/payments/**"
                                        )
                                        .permitAll()

                                        /*
                                         * Registro y verificación de correo.
                                         */
                                        .requestMatchers(
                                                HttpMethod.POST,
                                                "/api/auth/register",
                                                "/api/auth/resend-verification"
                                        )
                                        .permitAll()

                                        .requestMatchers(
                                                HttpMethod.GET,
                                                "/api/auth/verify-email"
                                        )
                                        .permitAll()

                                        /*
                                         * Login de clientes y administradores.
                                         *
                                         * Spring Security valida primero las
                                         * credenciales almacenadas en la base
                                         * de datos.
                                         */
                                        .requestMatchers(
                                                HttpMethod.POST,
                                                "/api/auth/login"
                                        )
                                        .authenticated()

                                        /*
                                         * Operaciones privadas de clientes.
                                         */
                                        .requestMatchers(
                                                HttpMethod.GET,
                                                "/api/auth/profile"
                                        )
                                        .hasRole("USER")

                                        .requestMatchers(
                                                HttpMethod.PUT,
                                                "/api/auth/profile",
                                                "/api/auth/change-password"
                                        )
                                        .hasRole("USER")

                                        /*
                                         * Toda la API administrativa requiere
                                         * una cuenta real con rol ADMIN.
                                         */
                                        .requestMatchers(
                                                "/api/admin/**"
                                        )
                                        .hasRole("ADMIN")

                                        /*
                                         * Gestión privada de direcciones.
                                         */
                                        .requestMatchers(
                                                HttpMethod.GET,
                                                "/api/addresses",
                                                "/api/addresses/**"
                                        )
                                        .hasRole("USER")

                                        .requestMatchers(
                                                HttpMethod.POST,
                                                "/api/addresses"
                                        )
                                        .hasRole("USER")

                                        .requestMatchers(
                                                HttpMethod.PUT,
                                                "/api/addresses/**"
                                        )
                                        .hasRole("USER")

                                        .requestMatchers(
                                                HttpMethod.PATCH,
                                                "/api/addresses/**"
                                        )
                                        .hasRole("USER")

                                        .requestMatchers(
                                                HttpMethod.DELETE,
                                                "/api/addresses/**"
                                        )
                                        .hasRole("USER")

                                        /*
                                         * Conservamos temporalmente públicas
                                         * las rutas restantes para no alterar
                                         * otros flujos del proyecto.
                                         */
                                        .anyRequest()
                                        .permitAll()
                );

        return http.build();
    }

    /*
     * Resuelve desde la base de datos las credenciales
     * de clientes y administradores.
     *
     * El permiso de Spring Security se obtiene directamente
     * desde UserRole:
     *
     * USER  -> ROLE_USER
     * ADMIN -> ROLE_ADMIN
     */
    @Bean
    public UserDetailsService userDetailsService(
            UserRepository userRepository
    ) {
        return username -> {
            String normalizedEmail =
                    username
                            .trim()
                            .toLowerCase(
                                    Locale.ROOT
                            );

            com.asthood.techstore.model.User account =
                    userRepository
                            .findByEmail(
                                    normalizedEmail
                            )
                            .orElseThrow(
                                    () ->
                                            new UsernameNotFoundException(
                                                    "Usuario no encontrado."
                                            )
                            );

            if (
                    account.getStatus() ==
                            UserStatus
                                    .EMAIL_PENDIENTE_VERIFICACION
            ) {
                throw new UsernameNotFoundException(
                        "La cuenta requiere verificar su correo."
                );
            }

            if (
                    account.getStatus() ==
                            UserStatus.BLOQUEADO
            ) {
                throw new UsernameNotFoundException(
                        "La cuenta se encuentra bloqueada."
                );
            }

            if (
                    account.getStatus() !=
                            UserStatus.REGISTRADO ||
                            !account.isEmailVerified() ||
                            account.getPassword() == null ||
                            account.getPassword().isBlank()
            ) {
                throw new UsernameNotFoundException(
                        "El usuario no tiene una cuenta activa."
                );
            }

            UserRole role =
                    account.getRole();

            if (role == null) {
                throw new UsernameNotFoundException(
                        "La cuenta no tiene un rol válido."
                );
            }

            return User
                    .withUsername(
                            account.getEmail()
                    )
                    .password(
                            account.getPassword()
                    )
                    .roles(
                            role.name()
                    )
                    .build();
        };
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration =
                new CorsConfiguration();

        configuration.setAllowedOrigins(
                Arrays.asList(
                        "http://192.168.100.226:5173",
                        "http://localhost:5173"
                )
        );

        configuration.setAllowedMethods(
                Arrays.asList(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS",
                        "PATCH"
                )
        );

        configuration.setAllowedHeaders(
                Arrays.asList(
                        "Authorization",
                        "Content-Type",
                        "Accept",
                        "ngrok-skip-browser-warning",
                        "X-Requested-With"
                )
        );

        configuration.setAllowCredentials(
                true
        );

        configuration.setExposedHeaders(
                Arrays.asList(
                        "Authorization"
                )
        );

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }
}
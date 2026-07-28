package com.asthood.techstore.config;

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

@Configuration
public class SecurityConfig {

    /*
     * Permite utilizar contraseñas codificadas con el prefijo
     * correspondiente, por ejemplo:
     *
     * {bcrypt}
     * {noop}
     *
     * El acceso administrativo temporal todavía utiliza
     * {noop}, pero será reemplazado en el sprint administrativo.
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
                 * Evita que el navegador muestre el cuadro
                 * automático de usuario y contraseña.
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
                 * La autenticación actual es stateless.
                 *
                 * Cada solicitud protegida debe incluir
                 * sus credenciales Basic.
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
                                         * Permite las solicitudes preflight
                                         * enviadas por el navegador.
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
                                         *
                                         * Conservamos la configuración actual
                                         * para no romper checkout ni webhook.
                                         */
                                        .requestMatchers(
                                                "/api/payments/**"
                                        )
                                        .permitAll()

                                        /*
                                         * Registro y verificación de correo.
                                         *
                                         * Estos endpoints deben funcionar antes
                                         * de que exista una sesión autenticada.
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
                                         * Login mediante HTTP Basic.
                                         *
                                         * Spring Security debe autenticar las
                                         * credenciales antes de ejecutar el
                                         * controlador.
                                         */
                                        .requestMatchers(
                                                HttpMethod.POST,
                                                "/api/auth/login"
                                        )
                                        .authenticated()

                                        /*
                                         * Operaciones privadas de la cuenta.
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
                                         * Panel administrativo temporal.
                                         */
                                        .requestMatchers(
                                                "/api/admin/**"
                                        )
                                        .hasRole("ADMIN")

                                        /*
                                         * Conservamos públicas las demás rutas
                                         * existentes para no modificar todavía
                                         * otros flujos del proyecto.
                                         *
                                         * Posteriormente revisaremos cada grupo
                                         * de endpoints y aplicaremos permisos
                                         * específicos.
                                         */
                                        .anyRequest()
                                        .permitAll()
                );

        return http.build();
    }

    /*
     * Resuelve las credenciales utilizadas por HTTP Basic.
     *
     * Mientras continúe pendiente el sprint administrativo,
     * se conserva el acceso temporal admin / 1234.
     */
    @Bean
    public UserDetailsService userDetailsService(
            UserRepository userRepository
    ) {
        return email -> {
            if ("admin".equals(email)) {
                return User
                        .withUsername("admin")
                        .password("{noop}1234")
                        .roles("ADMIN")
                        .build();
            }

            com.asthood.techstore.model.User customer =
                    userRepository
                            .findByEmail(
                                    email
                            )
                            .orElseThrow(
                                    () ->
                                            new UsernameNotFoundException(
                                                    "Usuario no encontrado."
                                            )
                            );

            if (
                    customer.getStatus() ==
                            UserStatus
                                    .EMAIL_PENDIENTE_VERIFICACION
            ) {
                throw new UsernameNotFoundException(
                        "La cuenta requiere verificar su correo."
                );
            }

            if (
                    customer.getStatus() ==
                            UserStatus.BLOQUEADO
            ) {
                throw new UsernameNotFoundException(
                        "La cuenta se encuentra bloqueada."
                );
            }

            if (
                    customer.getStatus() !=
                            UserStatus.REGISTRADO ||
                            !customer.isEmailVerified() ||
                            customer.getPassword() == null ||
                            customer.getPassword().isBlank()
            ) {
                throw new UsernameNotFoundException(
                        "El usuario no tiene una cuenta activa."
                );
            }

            return User
                    .withUsername(
                            customer.getEmail()
                    )
                    .password(
                            customer.getPassword()
                    )
                    .roles("USER")
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
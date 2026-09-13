package com.prepverse.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.prepverse.security.CustomUserDetailsService;
import com.prepverse.security.JwtAuthFilter;
import com.prepverse.security.JwtUtil;
import com.prepverse.security.RateLimitFilter;

/**
 * Stateless JWT security: only auth/health/leaderboard/docs are public,
 * everything else (including AI mentor + compiler, which cost quota/money)
 * requires a valid "Authorization: Bearer &lt;jwt&gt;" header.
 * RateLimitFilter additionally throttles brute-force and quota abuse.
 * Method security (@PreAuthorize) guards the /api/admin/** controllers.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    /**
     * Filters are declared as @Beans here (instead of @Component on the filter
     * classes) so each runs only once, inside the Spring Security chain -
     * Spring Boot would otherwise also auto-register them with the servlet
     * container and run them twice per request.
     *
     * <p>NOTE: the filters are taken as parameters of filterChain() below,
     * NOT constructor-injected into this class - this class defines those
     * @Beans, so constructor injection would be a circular reference and
     * Spring would fail to boot (BeanCurrentlyInCreationException).
     */
    @Bean
    public JwtAuthFilter jwtAuthFilter(JwtUtil jwtUtil, CustomUserDetailsService userDetailsService) {
        return new JwtAuthFilter(jwtUtil, userDetailsService);
    }

    @Bean
    public RateLimitFilter rateLimitFilter() {
        return new RateLimitFilter();
    }

    @Bean
    public SecurityFilterChain filterChain(
        HttpSecurity http,
        JwtAuthFilter jwtAuthFilter,
        RateLimitFilter rateLimitFilter
    ) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults())
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/api/auth/**",
                    "/api/health",
                    "/api/leaderboard",
                    "/swagger-ui.html",
                    "/swagger-ui/**",
                    "/v3/api-docs/**",
                    "/error",
                    "/actuator/health",
                    "/actuator/info"
                ).permitAll()
                .requestMatchers("/actuator/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .exceptionHandling(e -> e.authenticationEntryPoint((request, response, ex) -> {
                response.setStatus(401);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\":\"Unauthorized - valid JWT token required\"}");
            }))
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .addFilterAfter(rateLimitFilter, JwtAuthFilter.class);
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
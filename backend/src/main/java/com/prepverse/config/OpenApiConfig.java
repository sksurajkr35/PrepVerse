package com.prepverse.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Swagger / OpenAPI setup. Browse the live API docs at
 * http://localhost:8080/swagger-ui.html (no extra controller needed).
 * The "Authorize" button accepts a JWT from POST /api/auth/login.
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI prepverseOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("PrepVerse API")
                .version("1.0.0")
                .description("PrepVerse Java backend - auth, progress tracking, "
                    + "real code execution and AI mentor."))
            .addSecurityItem(new SecurityRequirement().addList("bearer-jwt"))
            .components(new Components().addSecuritySchemes("bearer-jwt",
                new SecurityScheme()
                    .type(SecurityScheme.Type.HTTP)
                    .scheme("bearer")
                    .bearerFormat("JWT")));
    }
}

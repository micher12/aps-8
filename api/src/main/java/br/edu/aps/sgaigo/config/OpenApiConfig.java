package br.edu.aps.sgaigo.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
		info = @Info(title = "SGAI-Go API", version = "v1",
				description = "Sistema de Gestão Ambiental Integrado — Goiás (ISO 14001)"),
		security = @SecurityRequirement(name = "bearerAuth"))
@SecurityScheme(
		name = "bearerAuth",
		type = SecuritySchemeType.HTTP,
		scheme = "bearer",
		bearerFormat = "JWT")
public class OpenApiConfig {
}

package br.edu.aps.sgaigo.security;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

	private final JwtAuthenticationFilter jwtFilter;

	public SecurityConfig(JwtAuthenticationFilter jwtFilter) {
		this.jwtFilter = jwtFilter;
	}

	@Bean
	SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		AuthenticationEntryPoint naoAutenticado = (req, res, ex) -> {
			res.setStatus(HttpStatus.UNAUTHORIZED.value());
			res.setContentType("application/json;charset=UTF-8");
			res.getWriter().write("{\"sucesso\":false,\"erro\":{\"codigo\":\"NAO_AUTENTICADO\",\"mensagem\":\"Token ausente ou inválido\"}}");
		};
		http
				.csrf(csrf -> csrf.disable())
				.sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.cors(cors -> {})
				.authorizeHttpRequests(auth -> auth
						.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
						.requestMatchers("/api/v1/auth/**", "/ws/**", "/swagger-ui/**",
								"/swagger-ui.html", "/v3/api-docs/**").permitAll()
						.anyRequest().authenticated())
				.exceptionHandling(h -> h.authenticationEntryPoint(naoAutenticado))
				.headers(h -> h.frameOptions(f -> f.disable()))
				.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
				.addFilterAfter(new RateLimitFilter(), JwtAuthenticationFilter.class);
		return http.build();
	}

	@Bean
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

}

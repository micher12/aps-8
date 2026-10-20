package br.edu.aps.sgaigo.security;

import java.io.IOException;
import java.time.Duration;

import org.springframework.http.MediaType;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Rate limiting (Bucket4j): 60 req/min por usuário autenticado e 200/min por IP
 * (plano §7). No login o limite é mais rígido (anti brute-force). Excedeu →
 * 429 + header Retry-After com os segundos restantes.
 */
public class RateLimitFilter extends OncePerRequestFilter {

	private static final int LIMITE_USUARIO = 60;
	private static final int LIMITE_IP = 200;
	private static final int LIMITE_LOGIN = 10;

	private final Cache<String, Bucket> buckets = Caffeine.newBuilder()
			.maximumSize(50_000)
			.expireAfterAccess(Duration.ofHours(1))
			.build();

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
			throws ServletException, IOException {
		if ("OPTIONS".equalsIgnoreCase(request.getMethod()) || request.getRequestURI().startsWith("/ws")) {
			chain.doFilter(request, response);
			return;
		}

		String chave = chave(request);
		Bucket bucket = buckets.get(chave, this::novoBucket);
		ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);
		if (probe.isConsumed()) {
			chain.doFilter(request, response);
			return;
		}

		long segundos = Math.max(1, Duration.ofNanos(probe.getNanosToWaitForRefill()).toSeconds());
		response.setStatus(429);
		response.setHeader("Retry-After", String.valueOf(segundos));
		response.setContentType(MediaType.APPLICATION_JSON_VALUE);
		response.setCharacterEncoding("UTF-8");
		response.getWriter().write("{\"sucesso\":false,\"erro\":{\"codigo\":\"RATE_LIMIT\","
				+ "\"mensagem\":\"Muitas requisições. Aguarde " + segundos + "s.\"}}");
	}

	private String chave(HttpServletRequest request) {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if (auth != null && auth.isAuthenticated() && !(auth instanceof AnonymousAuthenticationToken)) {
			return "usuario:" + auth.getName();
		}
		String ip = ipCliente(request);
		if (request.getRequestURI().endsWith("/auth/login")) {
			return "login:" + ip;
		}
		return "ip:" + ip;
	}

	private Bucket novoBucket(String chave) {
		int capacidade = chave.startsWith("usuario:") ? LIMITE_USUARIO
				: chave.startsWith("login:") ? LIMITE_LOGIN : LIMITE_IP;
		return Bucket.builder()
				.addLimit(Bandwidth.builder()
						.capacity(capacidade)
						.refillGreedy(capacidade, Duration.ofMinutes(1))
						.build())
				.build();
	}

	private static String ipCliente(HttpServletRequest request) {
		String encaminhado = request.getHeader("X-Forwarded-For");
		if (encaminhado != null && !encaminhado.isBlank()) {
			return encaminhado.split(",")[0].trim();
		}
		return request.getRemoteAddr();
	}
}

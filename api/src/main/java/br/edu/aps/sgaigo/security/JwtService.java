package br.edu.aps.sgaigo.security;

import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Date;

import javax.crypto.SecretKey;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import br.edu.aps.sgaigo.model.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

	private static final Logger log = LoggerFactory.getLogger(JwtService.class);

	private final SecretKey key;
	private final long expirationMs;

	public JwtService(@Value("${sgaigo.jwt.secret:}") String secret,
			@Value("${sgaigo.jwt.expiration-ms}") long expirationMs) {
		if (secret == null || secret.isBlank()) {
			// Sem segredo configurado: chave aleatória por boot (nada de default previsível em produção).
			byte[] aleatoria = new byte[48];
			new SecureRandom().nextBytes(aleatoria);
			this.key = Keys.hmacShaKeyFor(aleatoria);
			log.warn("JWT_SECRET não configurado — usando chave aleatória; os tokens serão invalidados "
					+ "a cada reinício. Defina JWT_SECRET em produção.");
		} else {
			this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
		}
		this.expirationMs = expirationMs;
	}

	public String gerarToken(Usuario usuario) {
		return Jwts.builder()
				.subject(usuario.getEmail())
				.claim("perfil", usuario.getPerfil().name())
				.claim("nome", usuario.getNome())
				.issuedAt(new Date())
				.expiration(new Date(System.currentTimeMillis() + expirationMs))
				.signWith(key)
				.compact();
	}

	public Claims validar(String token) {
		return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
	}
}

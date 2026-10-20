package br.edu.aps.sgaigo.security;

import java.time.Duration;
import java.time.Instant;

import org.springframework.stereotype.Component;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import com.github.benmanes.caffeine.cache.Expiry;

/**
 * Denylist de tokens revogados (logout). Em memória (adequado à instância única);
 * cada entrada expira junto com a validade do próprio token — sem crescimento indefinido.
 */
@Component
public class TokenDenylist {

	private final Cache<String, Instant> revogados = Caffeine.newBuilder()
			.maximumSize(10_000)
			.expireAfter(new Expiry<String, Instant>() {

				@Override
				public long expireAfterCreate(String token, Instant expiraEm, long currentTime) {
					return Math.max(Duration.between(Instant.now(), expiraEm).toNanos(), 0);
				}

				@Override
				public long expireAfterUpdate(String token, Instant expiraEm, long currentTime, long currentDuration) {
					return expireAfterCreate(token, expiraEm, currentTime);
				}

				@Override
				public long expireAfterRead(String token, Instant expiraEm, long currentTime, long currentDuration) {
					return currentDuration;
				}
			})
			.build();

	public void revogar(String token, Instant expiraEm) {
		revogados.put(token, expiraEm);
	}

	public boolean contem(String token) {
		return revogados.getIfPresent(token) != null;
	}
}

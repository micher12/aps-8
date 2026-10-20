package br.edu.aps.sgaigo.config;

import java.time.Duration;

import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.caffeine.CaffeineCache;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.github.benmanes.caffeine.cache.Caffeine;

@Configuration
public class CacheConfig {

	@Bean
	CacheManager cacheManager() {
		CaffeineCacheManager manager = new CaffeineCacheManager("municipios", "cnpj",
				"qualidade-ar", "ibge-coordenadas", "queimadas", "dashboard") {
			@Override
			protected Cache createCaffeineCache(String name) {
				Duration ttl = switch (name) {
					case "municipios" -> Duration.ofHours(24);
					case "cnpj" -> Duration.ofDays(7);
					case "qualidade-ar" -> Duration.ofHours(1);
					case "ibge-coordenadas" -> Duration.ofHours(24);
					case "queimadas" -> Duration.ofMinutes(30);
					case "dashboard" -> Duration.ofSeconds(60);
					default -> Duration.ofMinutes(10);
				};
				return new CaffeineCache(name,
						Caffeine.newBuilder().expireAfterWrite(ttl).maximumSize(10_000).build());
			}
		};
		return manager;
	}
}

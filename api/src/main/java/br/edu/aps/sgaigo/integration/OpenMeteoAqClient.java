package br.edu.aps.sgaigo.integration;

import java.net.http.HttpClient;
import java.time.Duration;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Cliente da Open-Meteo Air Quality API — gratuita, sem chave.
 * As coordenadas vêm do código IBGE via {@link IbgeLocalidadesClient} (cache de 24h).
 * Cache de 1h por município (TTL em CacheConfig) com sync: em miss concorrente,
 * apenas uma thread consulta o serviço externo e as demais aguardam o valor cacheado.
 * Falhas lançam exceção de propósito — resultado de erro NÃO entra no cache.
 * O fallback (dadosIndisponiveis=true) fica em {@link QualidadeArClient}.
 */
@Component
public class OpenMeteoAqClient {

	private final IbgeLocalidadesClient localidades;
	private final RestClient rest;

	public OpenMeteoAqClient(IbgeLocalidadesClient localidades) {
		this.localidades = localidades;
		HttpClient httpClient = HttpClient.newBuilder()
				.connectTimeout(Duration.ofSeconds(5))
				.build();
		JdkClientHttpRequestFactory factory = new JdkClientHttpRequestFactory(httpClient);
		factory.setReadTimeout(Duration.ofSeconds(10));
		this.rest = RestClient.builder()
				.baseUrl("https://air-quality-api.open-meteo.com/v1")
				.requestFactory(factory)
				.build();
	}

	@Cacheable(value = "qualidade-ar", key = "#codigoIbge", sync = true)
	public QualidadeArClient.QualidadeArResponse buscarPorMunicipio(Integer codigoIbge) {
		IbgeLocalidadesClient.Coordenadas coord = localidades.coordenadas(codigoIbge);

		OpenMeteoAqResponse res = rest.get()
				.uri(uri -> uri.path("/air-quality")
						.queryParam("latitude", coord.latitude())
						.queryParam("longitude", coord.longitude())
						.queryParam("current", "pm2_5,pm10,carbon_monoxide,ozone")
						.build())
				.retrieve()
				.body(OpenMeteoAqResponse.class);

		return toDomain(res, codigoIbge);
	}

	private QualidadeArClient.QualidadeArResponse toDomain(OpenMeteoAqResponse res, Integer codigoIbge) {
		OpenMeteoAqResponse.Current c = res != null ? res.current() : null;
		if (c == null || c.pm25() == null) {
			throw new IllegalStateException("Open-Meteo respondeu sem dados atuais (current)");
		}
		String classificacao = c.pm25() <= 12 ? "BOA"
				: c.pm25() <= 35 ? "MODERADA"
				: c.pm25() <= 55 ? "RUIM" : "MUITO_RUIM";
		return new QualidadeArClient.QualidadeArResponse(codigoIbge, c.pm25(), c.pm10(), c.co(), c.o3(),
				classificacao, false);
	}

	@JsonIgnoreProperties(ignoreUnknown = true)
	public record OpenMeteoAqResponse(Current current) {

		@JsonIgnoreProperties(ignoreUnknown = true)
		public record Current(@JsonProperty("pm2_5") Double pm25, @JsonProperty("pm10") Double pm10,
				@JsonProperty("carbon_monoxide") Double co, @JsonProperty("ozone") Double o3) {}
	}
}

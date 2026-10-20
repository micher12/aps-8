package br.edu.aps.sgaigo.integration;

import java.io.InputStream;
import java.net.http.HttpClient;
import java.security.KeyStore;
import java.security.SecureRandom;
import java.security.cert.CertificateException;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.text.Normalizer;
import java.time.Duration;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.TrustManagerFactory;
import javax.net.ssl.X509TrustManager;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import tools.jackson.databind.JsonNode;

/**
 * Resolve as coordenadas (lat/lon) de um município pelo código IBGE:
 * IBGE Localidades (código → nome/UF) e Open-Meteo Geocoding (nome/UF → coordenadas).
 * Cache de 24h (TTL em CacheConfig) com sync — coordenadas são praticamente estáticas.
 * Código inexistente ou município não localizado lançam exceção (não cacheada).
 */
@Component
public class IbgeLocalidadesClient {

	private static final String IBGE = "https://servicodados.ibge.gov.br/api/v1/localidades";
	private static final String GEOCODING = "https://geocoding-api.open-meteo.com/v1";

	private final RestClient ibge;
	private final RestClient geocoding;

	public IbgeLocalidadesClient() {
		this.ibge = cliente(IBGE, sslContextComCadeiaIbge());
		this.geocoding = cliente(GEOCODING, null);
	}

	@Cacheable(value = "ibge-coordenadas", key = "#codigoIbge", sync = true)
	public Coordenadas coordenadas(Integer codigoIbge) {
		// JsonNode porque o IBGE devolve [] (array) para código inexistente e objeto para válido
		JsonNode municipio = ibge.get()
				.uri("/municipios/{codigo}", codigoIbge)
				.retrieve()
				.body(JsonNode.class);
		if (municipio == null || !municipio.isObject() || municipio.path("nome").isMissingNode()) {
			throw new IllegalStateException("Código IBGE não encontrado: " + codigoIbge);
		}
		String nome = municipio.path("nome").asString();
		String uf = municipio.path("microrregiao").path("mesorregiao").path("UF").path("nome").asString();

		GeocodingResponse geo = geocoding.get()
				.uri(uri -> uri.path("/search")
						.queryParam("name", nome)
						.queryParam("count", 10)
						.queryParam("language", "pt")
						.queryParam("format", "json")
						.queryParam("countryCode", "BR")
						.build())
				.retrieve()
				.body(GeocodingResponse.class);
		return escolher(geo, nome, uf);
	}

	/** Cidade homônima pode existir em outra UF — prioriza resultado cuja admin1 casa com a UF. */
	private static Coordenadas escolher(GeocodingResponse geo, String nome, String uf) {
		List<GeocodingResponse.Resultado> validos = geo == null || geo.results() == null ? List.of()
				: geo.results().stream().filter(r -> r.latitude() != null && r.longitude() != null).toList();
		Optional<GeocodingResponse.Resultado> match = validos.stream()
				.filter(r -> iguais(r.admin1(), uf))
				.findFirst()
				.or(() -> validos.size() == 1 ? Optional.of(validos.get(0)) : Optional.empty());
		return match.map(r -> new Coordenadas(r.latitude(), r.longitude()))
				.orElseThrow(() -> new IllegalStateException("Geocoding sem correspondência para " + nome + "/" + uf));
	}

	private static boolean iguais(String a, String b) {
		return normalizar(a).equals(normalizar(b));
	}

	private static String normalizar(String s) {
		if (s == null) return "";
		return Normalizer.normalize(s, Normalizer.Form.NFD).replaceAll("\\p{M}", "").trim().toLowerCase();
	}

	private static RestClient cliente(String baseUrl, SSLContext ssl) {
		HttpClient.Builder builder = HttpClient.newBuilder()
				.connectTimeout(Duration.ofSeconds(5));
		if (ssl != null) {
			builder.sslContext(ssl);
		}
		JdkClientHttpRequestFactory factory = new JdkClientHttpRequestFactory(builder.build());
		factory.setReadTimeout(Duration.ofSeconds(10));
		return RestClient.builder().baseUrl(baseUrl).requestFactory(factory).build();
	}

	/**
	 * O servicodados.ibge.gov.br envia apenas o certificado-folha (cadeia incompleta) e a JVM
	 * não busca o intermediário via AIA — por isso o intermediário Sectigo da cadeia do IBGE é
	 * embutido como trust anchor adicional, somado ao truststore padrão da JVM (cacerts).
	 */
	private static SSLContext sslContextComCadeiaIbge() {
		try {
			TrustManagerFactory padrao = TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm());
			padrao.init((KeyStore) null);
			X509TrustManager extra = trustManagerDoRecurso("/certs/SectigoPublicServerAuthenticationCADVR36.crt");
			SSLContext ctx = SSLContext.getInstance("TLS");
			ctx.init(null, new TrustManager[]{compor(primeiroX509(padrao), extra)}, new SecureRandom());
			return ctx;
		} catch (Exception e) {
			throw new IllegalStateException("Falha ao montar SSLContext com a cadeia do IBGE", e);
		}
	}

	private static X509TrustManager trustManagerDoRecurso(String recurso) throws Exception {
		CertificateFactory cf = CertificateFactory.getInstance("X.509");
		try (InputStream in = IbgeLocalidadesClient.class.getResourceAsStream(recurso)) {
			if (in == null) {
				throw new IllegalStateException("Certificado não encontrado no classpath: " + recurso);
			}
			KeyStore ks = KeyStore.getInstance(KeyStore.getDefaultType());
			ks.load(null, null);
			ks.setCertificateEntry("intermediario", cf.generateCertificate(in));
			TrustManagerFactory tmf = TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm());
			tmf.init(ks);
			return primeiroX509(tmf);
		}
	}

	private static X509TrustManager primeiroX509(TrustManagerFactory tmf) {
		for (TrustManager tm : tmf.getTrustManagers()) {
			if (tm instanceof X509TrustManager x509) {
				return x509;
			}
		}
		throw new IllegalStateException("X509TrustManager não disponível");
	}

	private static X509TrustManager compor(X509TrustManager principal, X509TrustManager extra) {
		return new X509TrustManager() {
			@Override
			public void checkClientTrusted(X509Certificate[] chain, String authType) throws CertificateException {
				principal.checkClientTrusted(chain, authType);
			}

			@Override
			public void checkServerTrusted(X509Certificate[] chain, String authType) throws CertificateException {
				try {
					principal.checkServerTrusted(chain, authType);
				} catch (CertificateException e) {
					extra.checkServerTrusted(chain, authType);
				}
			}

			@Override
			public X509Certificate[] getAcceptedIssuers() {
				X509Certificate[] a = principal.getAcceptedIssuers();
				X509Certificate[] b = extra.getAcceptedIssuers();
				X509Certificate[] todos = Arrays.copyOf(a, a.length + b.length);
				System.arraycopy(b, 0, todos, a.length, b.length);
				return todos;
			}
		};
	}

	public record Coordenadas(double latitude, double longitude) {}

	@JsonIgnoreProperties(ignoreUnknown = true)
	public record GeocodingResponse(List<Resultado> results) {

		@JsonIgnoreProperties(ignoreUnknown = true)
		public record Resultado(String name, Double latitude, Double longitude, String admin1) {}
	}
}

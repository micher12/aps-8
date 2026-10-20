package br.edu.aps.sgaigo.integration;

import java.time.Duration;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import br.edu.aps.sgaigo.exception.RecursoNaoEncontradoException;
import br.edu.aps.sgaigo.exception.RegraNegocioException;

/**
 * Cliente da BrasilAPI (consulta CNPJ) — gratuita, sem chave.
 * Cache de 7 dias.
 */
@Component
public class CnpjClient {

	private final RestClient rest;

	public CnpjClient() {
		SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
		factory.setConnectTimeout(Duration.ofSeconds(5));
		factory.setReadTimeout(Duration.ofSeconds(10));
		this.rest = RestClient.builder().baseUrl("https://brasilapi.com.br/api").requestFactory(factory).build();
	}

	@Cacheable(value = "cnpj", key = "#cnpj", unless = "#result == null")
	public CnpjResponse buscar(String cnpj) {
		String limpo = cnpj.replaceAll("\\D", "");
		if (limpo.length() != 14) {
			throw new RegraNegocioException("CNPJ deve ter 14 dígitos");
		}
		return rest.get()
				.uri("/cnpj/v1/{cnpj}", limpo)
				.retrieve()
				.onStatus(HttpStatusCode::is4xxClientError, (req, res) -> {
					throw new RecursoNaoEncontradoException("CNPJ não encontrado");
				})
				.body(CnpjResponse.class);
	}

	public record CnpjResponse(String cnpj,
			@com.fasterxml.jackson.annotation.JsonProperty("razao_social") String razaoSocial,
			@com.fasterxml.jackson.annotation.JsonProperty("nome_fantasia") String nomeFantasia,
			@com.fasterxml.jackson.annotation.JsonProperty("descricao_situacao_cadastral") String descricaoSituacaoCadastral,
			String municipio,
			@com.fasterxml.jackson.annotation.JsonProperty("codigo_municipio_ibge") Integer codigoMunicipioIbge,
			String logradouro, String bairro, String cep) {}
}

package br.edu.aps.sgaigo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.edu.aps.sgaigo.dto.ApiResponse;
import br.edu.aps.sgaigo.integration.CnpjClient;
import br.edu.aps.sgaigo.integration.QualidadeArClient;
import br.edu.aps.sgaigo.integration.QueimadasClient;

@RestController
@RequestMapping("/api/v1/integracoes")
public class IntegracaoController {

	private final CnpjClient cnpjClient;
	private final QualidadeArClient qualidadeAr;
	private final QueimadasClient queimadas;

	public IntegracaoController(CnpjClient cnpjClient, QualidadeArClient qualidadeAr,
			QueimadasClient queimadas) {
		this.cnpjClient = cnpjClient;
		this.qualidadeAr = qualidadeAr;
		this.queimadas = queimadas;
	}

	@GetMapping("/cnpj/{cnpj}")
	public ApiResponse<CnpjClient.CnpjResponse> cnpj(@PathVariable String cnpj) {
		return ApiResponse.ok(cnpjClient.buscar(cnpj));
	}

	@GetMapping("/qualidade-ar")
	public ApiResponse<QualidadeArClient.QualidadeArResponse> qualidadeAr(
			@RequestParam Integer municipio) {
		return ApiResponse.ok(qualidadeAr.buscarPorMunicipio(municipio));
	}

	@GetMapping("/queimadas")
	public ApiResponse<QueimadasClient.QueimadasResponse> queimadas() {
		return ApiResponse.ok(queimadas.focos());
	}
}

package br.edu.aps.sgaigo.controller;

import java.text.Normalizer;

import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.edu.aps.sgaigo.service.AuditoriaService;
import br.edu.aps.sgaigo.service.RelatorioService;

@RestController
@RequestMapping("/api/v1/relatorios")
public class RelatorioController {

	private final RelatorioService service;
	private final AuditoriaService auditoria;

	public RelatorioController(RelatorioService service, AuditoriaService auditoria) {
		this.service = service;
		this.auditoria = auditoria;
	}

	@PostMapping("/residuos")
	@PreAuthorize("hasAnyRole('ADMIN','GESTOR','CONSULTOR')")
	public ResponseEntity<byte[]> residuos(@RequestParam(required = false) Long organizacaoId,
			@RequestParam(defaultValue = "csv") String formato) {
		byte[] dados = service.gerarCsvResiduos(organizacaoId);
		auditoria.registrar("relatorio", "GERAR", "Resíduos CSV");
		return download(dados, "relatorio_residuos.csv", "text/csv");
	}

	@PostMapping("/indicadores")
	@PreAuthorize("hasAnyRole('ADMIN','GESTOR','CONSULTOR')")
	public ResponseEntity<byte[]> indicadores(@RequestParam(required = false) Long organizacaoId) {
		byte[] dados = service.gerarCsvMonitoramentos(organizacaoId);
		auditoria.registrar("relatorio", "GERAR", "Indicadores CSV");
		return download(dados, "relatorio_indicadores.csv", "text/csv");
	}

	@PostMapping("/conformidade")
	@PreAuthorize("hasAnyRole('ADMIN','GESTOR','CONSULTOR')")
	public ResponseEntity<byte[]> conformidade(@RequestParam(required = false) Long organizacaoId) throws Exception {
		byte[] dados = service.gerarPdfLicencas(organizacaoId);
		auditoria.registrar("relatorio", "GERAR", "Licenças PDF");
		return download(dados, "relatorio_licencas.pdf", MediaType.APPLICATION_PDF_VALUE);
	}

	@PostMapping("/integrado")
	@PreAuthorize("hasAnyRole('ADMIN','GESTOR','CONSULTOR')")
	public ResponseEntity<byte[]> integrado(@RequestParam(required = false) Long organizacaoId) throws Exception {
		byte[] dados = service.gerarPdfIntegrado(organizacaoId);
		auditoria.registrar("relatorio", "GERAR", "Ambiental Integrado PDF");
		return download(dados, "relatorio_integrado.pdf", MediaType.APPLICATION_PDF_VALUE);
	}

	private ResponseEntity<byte[]> download(byte[] dados, String nome, String tipo) {
		return ResponseEntity.ok()
				.header(HttpHeaders.CONTENT_DISPOSITION,
						ContentDisposition.attachment().filename(nome).build().toString())
				.contentLength(dados.length)
				.contentType("text/csv".equals(tipo)
						? MediaType.parseMediaType("text/csv;charset=UTF-8")
						: MediaType.APPLICATION_PDF)
				.body(dados);
	}
}

package br.edu.aps.sgaigo.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import br.edu.aps.sgaigo.dto.ApiResponse;
import br.edu.aps.sgaigo.dto.LicencaRequest;
import br.edu.aps.sgaigo.dto.LicencaRequest.LicencaResponse;
import br.edu.aps.sgaigo.service.AuditoriaService;
import br.edu.aps.sgaigo.service.LicencaService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/licencas")
public class LicencaController {

	private final LicencaService service;
	private final AuditoriaService auditoria;

	public LicencaController(LicencaService service, AuditoriaService auditoria) {
		this.service = service;
		this.auditoria = auditoria;
	}

	@GetMapping
	public ApiResponse<List<LicencaResponse>> listar() {
		return ApiResponse.ok(service.listar());
	}

	@GetMapping("/vencendo")
	public ApiResponse<List<LicencaResponse>> vencendo(@RequestParam(defaultValue = "30") int dias) {
		return ApiResponse.ok(service.vencendo(dias));
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	@PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
	public ApiResponse<LicencaResponse> criar(@Valid @RequestBody LicencaRequest req) {
		auditoria.registrar("licenca", "CRIAR", "Licença " + req.numero());
		return ApiResponse.ok(service.criar(req));
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
	public ApiResponse<LicencaResponse> atualizar(@PathVariable Long id,
			@Valid @RequestBody LicencaRequest req) {
		auditoria.registrar("licenca", "ATUALIZAR", "Licença id=" + id);
		return ApiResponse.ok(service.atualizar(id, req));
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ApiResponse<Void> remover(@PathVariable Long id) {
		service.remover(id);
		auditoria.registrar("licenca", "REMOVER", "Licença id=" + id);
		return ApiResponse.ok(null);
	}
}

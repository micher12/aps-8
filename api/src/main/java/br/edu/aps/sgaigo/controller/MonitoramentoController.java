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
import br.edu.aps.sgaigo.dto.MonitoramentoRequest;
import br.edu.aps.sgaigo.dto.MonitoramentoRequest.MonitoramentoResponse;
import br.edu.aps.sgaigo.service.AuditoriaService;
import br.edu.aps.sgaigo.service.MonitoramentoService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/monitoramentos")
public class MonitoramentoController {

	private final MonitoramentoService service;
	private final AuditoriaService auditoria;

	public MonitoramentoController(MonitoramentoService service, AuditoriaService auditoria) {
		this.service = service;
		this.auditoria = auditoria;
	}

	@GetMapping
	public ApiResponse<List<MonitoramentoResponse>> listar(@RequestParam(required = false) Long organizacaoId) {
		return ApiResponse.ok(service.listar(organizacaoId));
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	@PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
	public ApiResponse<MonitoramentoResponse> criar(@Valid @RequestBody MonitoramentoRequest req) {
		auditoria.registrar("monitoramento", "CRIAR", "Medição " + req.tipo());
		return ApiResponse.ok(service.criar(req));
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
	public ApiResponse<MonitoramentoResponse> atualizar(@PathVariable Long id,
			@Valid @RequestBody MonitoramentoRequest req) {
		auditoria.registrar("monitoramento", "ATUALIZAR", "Medição id=" + id);
		return ApiResponse.ok(service.atualizar(id, req));
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
	public ApiResponse<Void> remover(@PathVariable Long id) {
		service.remover(id);
		auditoria.registrar("monitoramento", "REMOVER", "Medição id=" + id);
		return ApiResponse.ok(null);
	}
}

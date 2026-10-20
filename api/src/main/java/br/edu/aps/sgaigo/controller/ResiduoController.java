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
import br.edu.aps.sgaigo.dto.ResiduoRequest;
import br.edu.aps.sgaigo.dto.ResiduoRequest.ResiduoResponse;
import br.edu.aps.sgaigo.service.AuditoriaService;
import br.edu.aps.sgaigo.service.ResiduoService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/residuos")
public class ResiduoController {

	private final ResiduoService service;
	private final AuditoriaService auditoria;

	public ResiduoController(ResiduoService service, AuditoriaService auditoria) {
		this.service = service;
		this.auditoria = auditoria;
	}

	@GetMapping
	public ApiResponse<List<ResiduoResponse>> listar(@RequestParam(required = false) Long organizacaoId) {
		return ApiResponse.ok(service.listar(organizacaoId));
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	@PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
	public ApiResponse<ResiduoResponse> criar(@Valid @RequestBody ResiduoRequest req) {
		ResiduoResponse criado = service.criar(req);
		auditoria.registrar("residuo", "CRIAR", "Resíduo " + criado.tipo());
		return ApiResponse.ok(criado);
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
	public ApiResponse<ResiduoResponse> atualizar(@PathVariable Long id,
			@Valid @RequestBody ResiduoRequest req) {
		auditoria.registrar("residuo", "ATUALIZAR", "Resíduo id=" + id);
		return ApiResponse.ok(service.atualizar(id, req));
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
	public ApiResponse<Void> remover(@PathVariable Long id) {
		service.remover(id);
		auditoria.registrar("residuo", "REMOVER", "Resíduo id=" + id);
		return ApiResponse.ok(null);
	}
}

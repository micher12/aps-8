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
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import br.edu.aps.sgaigo.dto.ApiResponse;
import br.edu.aps.sgaigo.dto.OrganizacaoRequest;
import br.edu.aps.sgaigo.dto.OrganizacaoResponse;
import br.edu.aps.sgaigo.service.AuditoriaService;
import br.edu.aps.sgaigo.service.OrganizacaoService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/organizacoes")
public class OrganizacaoController {

	private final OrganizacaoService service;
	private final AuditoriaService auditoria;

	public OrganizacaoController(OrganizacaoService service, AuditoriaService auditoria) {
		this.service = service;
		this.auditoria = auditoria;
	}

	@GetMapping
	public ApiResponse<List<OrganizacaoResponse>> listar() {
		return ApiResponse.ok(service.listarAtivas());
	}

	@GetMapping("/{id}")
	public ApiResponse<OrganizacaoResponse> buscar(@PathVariable Long id) {
		return ApiResponse.ok(service.buscar(id));
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	@PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
	public ApiResponse<OrganizacaoResponse> criar(@Valid @RequestBody OrganizacaoRequest req) {
		OrganizacaoResponse criada = service.criar(req);
		auditoria.registrar("organizacao", "CRIAR", "Organização " + criada.razaoSocial());
		return ApiResponse.ok(criada);
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
	public ApiResponse<OrganizacaoResponse> atualizar(@PathVariable Long id,
			@Valid @RequestBody OrganizacaoRequest req) {
		auditoria.registrar("organizacao", "ATUALIZAR", "Organização id=" + id);
		return ApiResponse.ok(service.atualizar(id, req));
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ApiResponse<Void> remover(@PathVariable Long id) {
		service.remover(id);
		auditoria.registrar("organizacao", "REMOVER", "Organização id=" + id);
		return ApiResponse.ok(null);
	}
}

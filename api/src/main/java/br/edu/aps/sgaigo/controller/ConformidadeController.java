package br.edu.aps.sgaigo.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import br.edu.aps.sgaigo.dto.ApiResponse;
import br.edu.aps.sgaigo.dto.ConformidadeDtos.*;
import br.edu.aps.sgaigo.service.AuditoriaService;
import br.edu.aps.sgaigo.service.ConformidadeService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1")
public class ConformidadeController {

	private final ConformidadeService service;
	private final AuditoriaService auditoria;

	public ConformidadeController(ConformidadeService service, AuditoriaService auditoria) {
		this.service = service;
		this.auditoria = auditoria;
	}

	// ---- Aspectos ----
	@GetMapping("/aspectos")
	public ApiResponse<List<AspectoResponse>> aspectos(@RequestParam(required = false) Long organizacaoId) {
		return ApiResponse.ok(service.listarAspectos(organizacaoId));
	}

	@PostMapping("/aspectos")
	@ResponseStatus(HttpStatus.CREATED)
	@PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
	public ApiResponse<AspectoResponse> criarAspecto(@Valid @RequestBody AspectoRequest req) {
		return ApiResponse.ok(service.criarAspecto(req));
	}

	@DeleteMapping("/aspectos/{id}")
	@PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
	public ApiResponse<Void> removerAspecto(@PathVariable Long id) {
		service.removerAspecto(id);
		return ApiResponse.ok(null);
	}

	// ---- Não conformidades ----
	@GetMapping("/nao-conformidades")
	public ApiResponse<List<NcResponse>> ncs(@RequestParam(required = false) Long organizacaoId) {
		return ApiResponse.ok(service.listarNcs(organizacaoId));
	}

	@PostMapping("/nao-conformidades")
	@ResponseStatus(HttpStatus.CREATED)
	@PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
	public ApiResponse<NcResponse> criarNc(@Valid @RequestBody NcRequest req) {
		auditoria.registrar("nao_conformidade", "CRIAR", "NC: " + req.descricao());
		return ApiResponse.ok(service.criarNc(req));
	}

	@PutMapping("/nao-conformidades/{id}/status/{status}")
	@PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
	public ApiResponse<NcResponse> mudarStatus(@PathVariable Long id, @PathVariable String status) {
		return ApiResponse.ok(service.mudarStatusNc(id, status));
	}

	@DeleteMapping("/nao-conformidades/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ApiResponse<Void> removerNc(@PathVariable Long id) {
		service.removerNc(id);
		return ApiResponse.ok(null);
	}

	// ---- Ações corretivas ----
	@GetMapping("/acoes-corretivas")
	public ApiResponse<List<AcaoResponse>> acoes(@RequestParam Long naoConformidadeId) {
		return ApiResponse.ok(service.listarAcoes(naoConformidadeId));
	}

	@PostMapping("/acoes-corretivas")
	@ResponseStatus(HttpStatus.CREATED)
	@PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
	public ApiResponse<AcaoResponse> criarAcao(@Valid @RequestBody AcaoRequest req) {
		return ApiResponse.ok(service.criarAcao(req));
	}

	@DeleteMapping("/acoes-corretivas/{id}")
	@PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
	public ApiResponse<Void> removerAcao(@PathVariable Long id) {
		service.removerAcao(id);
		return ApiResponse.ok(null);
	}

	// ---- Stakeholders ----
	@GetMapping("/stakeholders")
	public ApiResponse<List<StakeholderResponse>> stakeholders(@RequestParam(required = false) Long organizacaoId) {
		return ApiResponse.ok(service.listarStakeholders(organizacaoId));
	}

	@PostMapping("/stakeholders")
	@ResponseStatus(HttpStatus.CREATED)
	@PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
	public ApiResponse<StakeholderResponse> criarStakeholder(@Valid @RequestBody StakeholderRequest req) {
		return ApiResponse.ok(service.criarStakeholder(req));
	}

	@DeleteMapping("/stakeholders/{id}")
	@PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
	public ApiResponse<Void> removerStakeholder(@PathVariable Long id) {
		service.removerStakeholder(id);
		return ApiResponse.ok(null);
	}
}

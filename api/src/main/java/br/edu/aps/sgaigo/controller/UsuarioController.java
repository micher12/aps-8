package br.edu.aps.sgaigo.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.edu.aps.sgaigo.dto.ApiError;
import br.edu.aps.sgaigo.dto.ApiResponse;
import br.edu.aps.sgaigo.dto.UsuarioAdminRequest;
import br.edu.aps.sgaigo.dto.UsuarioResponse;
import br.edu.aps.sgaigo.repository.UsuarioRepository;
import br.edu.aps.sgaigo.service.UsuarioService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/usuarios")
public class UsuarioController {

	private final UsuarioRepository usuarios;
	private final UsuarioService service;

	public UsuarioController(UsuarioRepository usuarios, UsuarioService service) {
		this.usuarios = usuarios;
		this.service = service;
	}

	@GetMapping
	@PreAuthorize("hasRole('ADMIN')")
	public ApiResponse<List<UsuarioResponse>> listar() {
		return ApiResponse.ok(usuarios.findAll().stream().map(UsuarioResponse::de).toList());
	}

	@PostMapping
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> criar(@Valid @RequestBody UsuarioAdminRequest.Criar req) {
		if (usuarios.findByEmail(req.email().toLowerCase()).isPresent()) {
			return ResponseEntity.status(HttpStatus.CONFLICT)
					.body(ApiError.de("EMAIL_JA_CADASTRADO", "E-mail já cadastrado"));
		}
		return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(service.criarComoAdmin(req)));
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ApiResponse<UsuarioResponse> atualizar(@PathVariable Long id,
			@Valid @RequestBody UsuarioAdminRequest.Atualizar req) {
		return ApiResponse.ok(service.atualizar(id, req, emailExecutor()));
	}

	@PatchMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ApiResponse<UsuarioResponse> alterarStatus(@PathVariable Long id,
			@Valid @RequestBody UsuarioAdminRequest.Status req) {
		return ApiResponse.ok(service.alterarStatus(id, req.ativo(), emailExecutor()));
	}

	/** E-mail do ADMIN autenticado (principal do JWT) — usado nas travas de autogestão. */
	private static String emailExecutor() {
		var auth = SecurityContextHolder.getContext().getAuthentication();
		return auth != null ? auth.getName() : "";
	}
}

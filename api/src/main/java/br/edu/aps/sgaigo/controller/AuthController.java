package br.edu.aps.sgaigo.controller;

import br.edu.aps.sgaigo.dto.ApiResponse;
import br.edu.aps.sgaigo.dto.UsuarioResponse;
import br.edu.aps.sgaigo.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.edu.aps.sgaigo.dto.LoginRequest;
import br.edu.aps.sgaigo.dto.LoginResponse;
import br.edu.aps.sgaigo.model.Usuario;
import br.edu.aps.sgaigo.repository.UsuarioRepository;
import br.edu.aps.sgaigo.security.JwtService;
import br.edu.aps.sgaigo.security.TokenDenylist;
import br.edu.aps.sgaigo.service.AuditoriaService;
import io.jsonwebtoken.Claims;
import jakarta.validation.Valid;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

	private final UsuarioRepository usuarios;
	private final PasswordEncoder encoder;
	private final JwtService jwt;
	private final AuditoriaService auditoria;
	private final UsuarioService usuarioService;
	private final TokenDenylist denylist;

	public AuthController(UsuarioRepository usuarios, PasswordEncoder encoder, JwtService jwt,
			AuditoriaService auditoria, UsuarioService usuarioService, TokenDenylist denylist) {
		this.usuarios = usuarios;
		this.encoder = encoder;
		this.jwt = jwt;
		this.auditoria = auditoria;
		this.usuarioService = usuarioService;
		this.denylist = denylist;
	}

	@PostMapping("/login")
	public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
		Usuario usuario = usuarios.findByEmail(req.email().toLowerCase())
				.filter(Usuario::isAtivo)
				.orElse(null);
		if (usuario == null || !encoder.matches(req.senha(), usuario.getSenhaHash())) {
			return ResponseEntity.status(401).body(
					br.edu.aps.sgaigo.dto.ApiError.de("CREDENCIAIS_INVALIDAS", "E-mail ou senha incorretos"));
		}
		auditoria.registrar(usuario.getEmail(), "auth", "LOGIN", "Login efetuado");
		return ResponseEntity.ok(LoginResponse.ok(jwt.gerarToken(usuario), usuario));
	}

	/**
	 * Criação de conta restrita a ADMIN (o autocadastro público foi removido).
	 * A gestão de usuários do painel usa /api/v1/usuarios.
	 */
	@PostMapping("/register")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> register(@Valid @RequestBody LoginRequest req) {
		Optional<Usuario> existente = usuarios.findByEmail(req.email().toLowerCase());
		if (existente.isPresent()) {
			return ResponseEntity.status(409).body(
					br.edu.aps.sgaigo.dto.ApiError.de("USUARIO_CADASTRADO", "Conta já cadastrada."));
		}
		UsuarioResponse novo = usuarioService.criarUsuario(req);
		return ResponseEntity.status(201).body(ApiResponse.ok(novo));
	}

	/** Revoga o token atual (denylist) — o front limpa o cookie junto. */
	@PostMapping("/logout")
	public ResponseEntity<ApiResponse<Void>> logout(
			@RequestHeader(value = "Authorization", required = false) String header) {
		if (header != null && header.startsWith("Bearer ")) {
			String token = header.substring(7);
			try {
				Claims claims = jwt.validar(token);
				denylist.revogar(token, claims.getExpiration().toInstant());
				auditoria.registrar(claims.getSubject(), "auth", "LOGOUT", "Sessão encerrada");
			} catch (Exception ignored) {
				// token já inválido/expirado — logout idempotente
			}
		}
		return ResponseEntity.ok(ApiResponse.ok(null));
	}
}

package br.edu.aps.sgaigo.security;

import java.io.IOException;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import br.edu.aps.sgaigo.repository.UsuarioRepository;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private final JwtService jwtService;
	private final UsuarioRepository usuarios;
	private final TokenDenylist denylist;

	public JwtAuthenticationFilter(JwtService jwtService, UsuarioRepository usuarios, TokenDenylist denylist) {
		this.jwtService = jwtService;
		this.usuarios = usuarios;
		this.denylist = denylist;
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
			throws ServletException, IOException {
		String header = request.getHeader("Authorization");
		if (header != null && header.startsWith("Bearer ")) {
			String token = header.substring(7);
			if (!denylist.contem(token)) {
				try {
					Claims claims = jwtService.validar(token);
					// Recarrega o usuário no banco: perfil e situação (ativo) sempre atuais,
					// e tokens revogados no logout deixam de valer imediatamente.
					usuarios.findByEmail(claims.getSubject())
							.filter(br.edu.aps.sgaigo.model.Usuario::isAtivo)
							.ifPresent(usuario -> {
								var auth = new UsernamePasswordAuthenticationToken(usuario.getEmail(), null,
										List.of(new SimpleGrantedAuthority("ROLE_" + usuario.getPerfil().name())));
								SecurityContextHolder.getContext().setAuthentication(auth);
							});
				} catch (Exception ignored) {
					// token inválido ou expirado → segue sem autenticação
				}
			}
		}
		chain.doFilter(request, response);
	}
}

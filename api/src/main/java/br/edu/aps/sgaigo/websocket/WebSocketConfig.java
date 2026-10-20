package br.edu.aps.sgaigo.websocket;

import java.security.Principal;
import java.util.List;
import java.util.Map;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessagingException;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.server.HandshakeInterceptor;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

import br.edu.aps.sgaigo.model.Usuario;
import br.edu.aps.sgaigo.repository.UsuarioRepository;
import br.edu.aps.sgaigo.security.JwtService;
import br.edu.aps.sgaigo.security.TokenDenylist;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.Cookie;

/**
 * STOMP sobre SockJS com autenticação JWT.
 * Duas rotas de autenticação:
 * 1. Navegador: cookie httpOnly `sgaigo_token` (mesma origem via rewrite do Next) lido no handshake;
 * 2. Clientes externos: header `Authorization: Bearer` no frame CONNECT.
 * Assinatura só é aceita autenticada e restrita aos tópicos /topic/* publicados pela aplicação.
 */
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

	private final JwtService jwt;
	private final TokenDenylist denylist;
	private final UsuarioRepository usuarios;

	public WebSocketConfig(JwtService jwt, TokenDenylist denylist, UsuarioRepository usuarios) {
		this.jwt = jwt;
		this.denylist = denylist;
		this.usuarios = usuarios;
	}

	@Override
	public void configureMessageBroker(MessageBrokerRegistry registry) {
		registry.enableSimpleBroker("/topic");
		registry.setApplicationDestinationPrefixes("/app");
	}

	@Override
	public void registerStompEndpoints(StompEndpointRegistry registry) {
		registry.addEndpoint("/ws")
				.setAllowedOriginPatterns("http://localhost:3000", "https://*.ngrok-free.app")
				.addInterceptors(new JwtHandshakeInterceptor())
				.setHandshakeHandler(new PrincipalDoHandshake())
				.withSockJS();
	}

	@Override
	public void configureClientInboundChannel(ChannelRegistration registration) {
		registration.interceptors(new ChannelInterceptor() {
			@Override
			public Message<?> preSend(Message<?> message, MessageChannel channel) {
				StompHeaderAccessor acc = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
				if (acc == null || acc.getCommand() == null) {
					return message;
				}
				if (StompCommand.CONNECT.equals(acc.getCommand())) {
					if (acc.getUser() == null) {
						acc.setUser(principalDaSessao(acc));
					}
					if (acc.getUser() == null) {
						// Sem cookie no handshake: exige Bearer no próprio frame CONNECT
						Principal viaHeader = autenticar(extrairBearer(acc.getFirstNativeHeader("Authorization")));
						if (viaHeader == null) {
							throw new MessagingException("Não autenticado");
						}
						acc.setUser(viaHeader);
					}
				} else if (StompCommand.SUBSCRIBE.equals(acc.getCommand())) {
					if (acc.getUser() == null) {
						throw new MessagingException("Não autenticado");
					}
					String destino = acc.getDestination();
					if (destino == null || !destinoPermitido(destino)) {
						throw new MessagingException("Destino não permitido: " + destino);
					}
				}
				return message;
			}
		});
	}

	private static Principal principalDaSessao(StompHeaderAccessor acc) {
		Map<String, Object> atributos = acc.getSessionAttributes();
		if (atributos == null) {
			return null;
		}
		Object usuario = atributos.get("usuario");
		return usuario instanceof Principal principal ? principal : null;
	}

	private static String extrairBearer(String header) {
		return header != null && header.startsWith("Bearer ") ? header.substring(7) : null;
	}

	/** Valida token + usuário ativo no banco; retorna o Principal ou null. */
	private Principal autenticar(String token) {
		if (token == null || token.isBlank() || denylist.contem(token)) {
			return null;
		}
		try {
			Claims claims = jwt.validar(token);
			Usuario usuario = usuarios.findByEmail(claims.getSubject())
					.filter(Usuario::isAtivo)
					.orElse(null);
			if (usuario == null) {
				return null;
			}
			return new UsernamePasswordAuthenticationToken(usuario.getEmail(), null,
					List.of(new SimpleGrantedAuthority("ROLE_" + usuario.getPerfil().name())));
		} catch (Exception e) {
			return null;
		}
	}

	/** Allowlist dos destinos publicados pela aplicação. */
	private static boolean destinoPermitido(String destino) {
		return destino.equals("/topic/alertas")
				|| destino.equals("/topic/qualidade-ar")
				|| destino.equals("/topic/queimadas")
				|| destino.matches("/topic/monitoramentos/\\d+");
	}

	private class JwtHandshakeInterceptor implements HandshakeInterceptor {

		@Override
		public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
				WebSocketHandler wsHandler, Map<String, Object> attributes) {
			String token = tokenDoCookie(request);
			if (token == null) {
				token = extrairBearer(request.getHeaders().getFirst("Authorization"));
			}
			if (token == null) {
				// Handshake sem credenciais é permitido apenas para quem apresentará o
				// Bearer no frame CONNECT; sem autenticação o CONNECT é rejeitado adiante.
				return true;
			}
			Principal principal = autenticar(token);
			if (principal == null) {
				return false; // token presente e inválido → rejeita o próprio handshake
			}
			attributes.put("usuario", principal);
			return true;
		}

		@Override
		public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
				WebSocketHandler wsHandler, Exception exception) {
			// nada a fazer
		}

		private String tokenDoCookie(ServerHttpRequest request) {
			if (request instanceof ServletServerHttpRequest servlet) {
				Cookie[] cookies = servlet.getServletRequest().getCookies();
				if (cookies != null) {
					for (Cookie cookie : cookies) {
						if ("sgaigo_token".equals(cookie.getName())) {
							return cookie.getValue();
						}
					}
				}
			}
			return null;
		}
	}

	/** Propaga o usuário autenticado no handshake para o Principal da sessão STOMP. */
	private static class PrincipalDoHandshake extends DefaultHandshakeHandler {
		@Override
		protected Principal determineUser(ServerHttpRequest request, WebSocketHandler wsHandler,
				Map<String, Object> attributes) {
			Object usuario = attributes.get("usuario");
			return usuario instanceof Principal principal ? principal : null;
		}
	}
}

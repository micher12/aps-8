package br.edu.aps.sgaigo.dto;

import br.edu.aps.sgaigo.model.Usuario;

public record LoginResponse(boolean sucesso, String token, UsuarioInfo usuario) {

	public record UsuarioInfo(Long id, String nome, String email, String perfil) {

		public static UsuarioInfo de(Usuario u) {
			return new UsuarioInfo(u.getId(), u.getNome(), u.getEmail(), u.getPerfil().name());
		}
	}

	public static LoginResponse ok(String token, Usuario usuario) {
		return new LoginResponse(true, token, UsuarioInfo.de(usuario));
	}
}

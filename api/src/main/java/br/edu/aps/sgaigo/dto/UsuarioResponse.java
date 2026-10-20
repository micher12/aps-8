package br.edu.aps.sgaigo.dto;

import br.edu.aps.sgaigo.model.Usuario;

public record UsuarioResponse(Long id, String nome, String email, String perfil, boolean ativo) {

	public static UsuarioResponse de(Usuario u) {
		return new UsuarioResponse(u.getId(), u.getNome(), u.getEmail(), u.getPerfil().name(), u.isAtivo());
	}
}

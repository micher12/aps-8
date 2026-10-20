package br.edu.aps.sgaigo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import br.edu.aps.sgaigo.model.Usuario;

/** DTOs de gestão de usuários (uso restrito ao perfil ADMIN). */
public final class UsuarioAdminRequest {

	private UsuarioAdminRequest() {}

	public record Criar(@NotBlank @Size(max = 120) String nome,
			@NotBlank @Email @Size(max = 150) String email,
			@NotBlank @Size(min = 6, max = 72) String senha,
			@NotNull Usuario.Perfil perfil) {}

	public record Atualizar(@NotBlank @Size(max = 120) String nome,
			@NotNull Usuario.Perfil perfil) {}

	public record Status(@NotNull Boolean ativo) {}
}

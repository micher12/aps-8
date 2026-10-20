package br.edu.aps.sgaigo.dto;

import java.util.Map;

/** Envelope padrão de erro da API. */
public record ApiError(boolean sucesso, Erro erro) {

	public record Erro(String codigo, String mensagem, Map<String, String> detalhes) {}

	public static ApiError de(String codigo, String mensagem) {
		return new ApiError(false, new Erro(codigo, mensagem, null));
	}

	public static ApiError de(String codigo, String mensagem, Map<String, String> detalhes) {
		return new ApiError(false, new Erro(codigo, mensagem, detalhes));
	}
}

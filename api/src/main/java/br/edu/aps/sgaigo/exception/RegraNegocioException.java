package br.edu.aps.sgaigo.exception;

/** Regra de negócio violada (422). */
public class RegraNegocioException extends RuntimeException {

	public RegraNegocioException(String mensagem) {
		super(mensagem);
	}
}

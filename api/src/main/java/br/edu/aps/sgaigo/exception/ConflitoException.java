package br.edu.aps.sgaigo.exception;

/** Recurso em conflito com o estado atual (ex.: CNPJ já cadastrado) → 409. */
public class ConflitoException extends RuntimeException {

	public ConflitoException(String mensagem) {
		super(mensagem);
	}
}

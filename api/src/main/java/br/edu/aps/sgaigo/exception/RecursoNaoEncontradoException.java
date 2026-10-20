package br.edu.aps.sgaigo.exception;

/** Recurso não encontrado (404). */
public class RecursoNaoEncontradoException extends RuntimeException {

	public RecursoNaoEncontradoException(String mensagem) {
		super(mensagem);
	}
}

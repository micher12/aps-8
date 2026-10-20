package br.edu.aps.sgaigo.exception;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import br.edu.aps.sgaigo.dto.ApiError;

@RestControllerAdvice
public class GlobalExceptionHandler {

	private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

	@ExceptionHandler(RecursoNaoEncontradoException.class)
	public ResponseEntity<ApiError> naoEncontrado(RecursoNaoEncontradoException ex) {
		return ResponseEntity.status(HttpStatus.NOT_FOUND)
				.body(ApiError.de("NAO_ENCONTRADO", ex.getMessage()));
	}

	@ExceptionHandler(RegraNegocioException.class)
	public ResponseEntity<ApiError> regraNegocio(RegraNegocioException ex) {
		return ResponseEntity.status(HttpStatus.UNPROCESSABLE_CONTENT)
				.body(ApiError.de("REGRA_NEGOCIO", ex.getMessage()));
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ApiError> validacao(MethodArgumentNotValidException ex) {
		Map<String, String> detalhes = new HashMap<>();
		ex.getBindingResult().getFieldErrors()
				.forEach(f -> detalhes.putIfAbsent(f.getField(), f.getDefaultMessage()));
		return ResponseEntity.status(HttpStatus.UNPROCESSABLE_CONTENT)
				.body(ApiError.de("VALIDACAO", "Dados inválidos", detalhes));
	}

	@ExceptionHandler(ConflitoException.class)
	public ResponseEntity<ApiError> conflito(ConflitoException ex) {
		return ResponseEntity.status(HttpStatus.CONFLICT)
				.body(ApiError.de("CONFLITO", ex.getMessage()));
	}

	@ExceptionHandler(DataIntegrityViolationException.class)
	public ResponseEntity<ApiError> integridade(DataIntegrityViolationException ex) {
		log.warn("Violação de integridade: {}", ex.getMostSpecificCause().getMessage());
		return ResponseEntity.status(HttpStatus.CONFLICT)
				.body(ApiError.de("CONFLITO_DADOS", "Operação conflita com dados existentes"));
	}

	@ExceptionHandler(HttpMessageNotReadableException.class)
	public ResponseEntity<ApiError> jsonInvalido(HttpMessageNotReadableException ex) {
		return ResponseEntity.status(HttpStatus.BAD_REQUEST)
				.body(ApiError.de("JSON_INVALIDO", "Corpo da requisição inválido ou campo com tipo incorreto"));
	}

	@ExceptionHandler(MethodArgumentTypeMismatchException.class)
	public ResponseEntity<ApiError> parametroInvalido(MethodArgumentTypeMismatchException ex) {
		return ResponseEntity.status(HttpStatus.BAD_REQUEST)
				.body(ApiError.de("PARAMETRO_INVALIDO", "Parâmetro inválido: " + ex.getName()));
	}

	@ExceptionHandler(IllegalArgumentException.class)
	public ResponseEntity<ApiError> argumentoInvalido(IllegalArgumentException ex) {
		return ResponseEntity.status(HttpStatus.BAD_REQUEST)
				.body(ApiError.de("REQUISICAO_INVALIDA", ex.getMessage() != null ? ex.getMessage() : "Requisição inválida"));
	}

	@ExceptionHandler(NoResourceFoundException.class)
	public ResponseEntity<ApiError> rotaNaoEncontrada(NoResourceFoundException ex) {
		return ResponseEntity.status(HttpStatus.NOT_FOUND)
				.body(ApiError.de("NAO_ENCONTRADO", "Rota não encontrada"));
	}

	@ExceptionHandler(AccessDeniedException.class)
	public ResponseEntity<ApiError> acessoNegado(AccessDeniedException ex) {
		return ResponseEntity.status(HttpStatus.FORBIDDEN)
				.body(ApiError.de("ACESSO_NEGADO", "Sem permissão para esta operação"));
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<ApiError> inesperado(Exception ex) {
		log.error("Erro inesperado", ex);
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body(ApiError.de("ERRO_INTERNO", "Ocorreu um erro inesperado"));
	}
}

package br.edu.aps.sgaigo.dto;

import org.springframework.data.domain.Page;

/** Envelope padrão de resposta da API. */
public record ApiResponse<T>(boolean sucesso, T dados, PaginacaoMeta paginacao) {

	public static <T> ApiResponse<T> ok(T dados) {
		return new ApiResponse<>(true, dados, null);
	}

	public static <T> ApiResponse<T> ok(T dados, PaginacaoMeta paginacao) {
		return new ApiResponse<>(true, dados, paginacao);
	}

	public record PaginacaoMeta(int pagina, int porPagina, long total, int totalPaginas) {

		public static PaginacaoMeta de(Page<?> page) {
			return new PaginacaoMeta(page.getNumber() + 1, page.getSize(),
					page.getTotalElements(), page.getTotalPages());
		}
	}
}

package br.edu.aps.sgaigo.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import br.edu.aps.sgaigo.model.LicencaAmbiental;

public record LicencaRequest(
		@NotNull Long organizacaoId,
		@NotBlank String numero,
		@NotBlank String tipo,
		String orgaoEmissor,
		@NotNull LocalDate dataEmissao,
		@NotNull LocalDate dataValidade,
		String observacao) {

	public record LicencaResponse(Long id, Long organizacaoId, String numero, String tipo,
			String orgaoEmissor, LocalDate dataEmissao, LocalDate dataValidade,
			long diasParaVencimento, boolean vencida, String observacao) {

		public static LicencaResponse de(LicencaAmbiental l) {
			return new LicencaResponse(l.getId(), l.getOrganizacao().getId(), l.getNumero(),
					l.getTipo(), l.getOrgaoEmissor(), l.getDataEmissao(), l.getDataValidade(),
					l.diasParaVencimento(), l.vencida(), l.getObservacao());
		}
	}
}

package br.edu.aps.sgaigo.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import br.edu.aps.sgaigo.model.Residuo;
import br.edu.aps.sgaigo.model.Residuo.Classe;

public record ResiduoRequest(
		@NotNull Long organizacaoId,
		@NotBlank String tipo,
		@NotNull Classe classe,
		@NotNull @DecimalMin(value = "0.01", message = "deve ser maior que zero") BigDecimal quantidade,
		String unidade,
		@NotBlank String destinacao,
		String destinatario,
		LocalDate dataRegistro) {

	public record ResiduoResponse(Long id, Long organizacaoId, String tipo, String classe,
			BigDecimal quantidade, String unidade, String destinacao, String destinatario,
			LocalDate dataRegistro) {

		public static ResiduoResponse de(Residuo r) {
			return new ResiduoResponse(r.getId(), r.getOrganizacao().getId(), r.getTipo(),
					r.getClasse().name(), r.getQuantidade(), r.getUnidade(), r.getDestinacao(),
					r.getDestinatario(), r.getDataRegistro());
		}
	}
}

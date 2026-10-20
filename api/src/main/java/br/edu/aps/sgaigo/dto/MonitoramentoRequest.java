package br.edu.aps.sgaigo.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import br.edu.aps.sgaigo.model.Monitoramento;
import br.edu.aps.sgaigo.model.Monitoramento.Tipo;

public record MonitoramentoRequest(
		@NotNull Long organizacaoId,
		@NotNull Tipo tipo,
		@NotNull @DecimalMin(value = "0", message = "não pode ser negativo") BigDecimal valor,
		String unidade,
		@NotNull LocalDate dataMedicao,
		String observacao) {

	public record MonitoramentoResponse(Long id, Long organizacaoId, String tipo, BigDecimal valor,
			String unidade, LocalDate dataMedicao, String observacao) {

		public static MonitoramentoResponse de(Monitoramento m) {
			return new MonitoramentoResponse(m.getId(), m.getOrganizacao().getId(), m.getTipo().name(),
					m.getValor(), m.getUnidade(), m.getDataMedicao(), m.getObservacao());
		}
	}
}

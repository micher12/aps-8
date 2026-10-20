package br.edu.aps.sgaigo.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import br.edu.aps.sgaigo.model.AcaoCorretiva;
import br.edu.aps.sgaigo.model.AspectoImpacto;
import br.edu.aps.sgaigo.model.NaoConformidade;
import br.edu.aps.sgaigo.model.Stakeholder;

/** DTOs dos módulos de conformidade, aspectos e stakeholders. */
public final class ConformidadeDtos {

	private ConformidadeDtos() {}

	public record AspectoRequest(@NotNull Long organizacaoId, @NotBlank String descricao,
			@NotNull AspectoImpacto.Tipo tipo, @NotBlank String impacto,
			@Min(1) @Max(5) short frequencia, @Min(1) @Max(5) short gravidade,
			@Min(1) @Max(5) short probabilidade) {}

	public record AspectoResponse(Long id, Long organizacaoId, String descricao, String tipo,
			String impacto, short frequencia, short gravidade, short probabilidade,
			int grauSignificancia) {

		public static AspectoResponse de(AspectoImpacto a) {
			return new AspectoResponse(a.getId(), a.getOrganizacao().getId(), a.getDescricao(),
					a.getTipo().name(), a.getImpacto(), a.getFrequencia(), a.getGravidade(),
					a.getProbabilidade(), a.grauSignificancia());
		}
	}

	public record NcRequest(@NotNull Long organizacaoId, @NotBlank String descricao, String origem,
			@NotNull NaoConformidade.Gravidade gravidade) {}

	public record NcResponse(Long id, Long organizacaoId, String descricao, String origem,
			String gravidade, String status, java.time.LocalDate dataAbertura) {

		public static NcResponse de(NaoConformidade n) {
			return new NcResponse(n.getId(), n.getOrganizacao().getId(), n.getDescricao(),
					n.getOrigem(), n.getGravidade().name(), n.getStatus().name(), n.getDataAbertura());
		}
	}

	public record AcaoRequest(@NotNull Long naoConformidadeId, @NotBlank String descricao,
			@NotBlank String responsavel, java.time.LocalDate prazo, String status) {}

	public record AcaoResponse(Long id, Long naoConformidadeId, String descricao, String responsavel,
			java.time.LocalDate prazo, String status) {

		public static AcaoResponse de(AcaoCorretiva a) {
			return new AcaoResponse(a.getId(), a.getNaoConformidade().getId(), a.getDescricao(),
					a.getResponsavel(), a.getPrazo(), a.getStatus().name());
		}
	}

	public record StakeholderRequest(@NotNull Long organizacaoId, @NotBlank String nome,
			@NotNull Stakeholder.Categoria categoria, String contato) {}

	public record StakeholderResponse(Long id, Long organizacaoId, String nome, String categoria,
			String contato) {

		public static StakeholderResponse de(Stakeholder s) {
			return new StakeholderResponse(s.getId(), s.getOrganizacao().getId(), s.getNome(),
					s.getCategoria().name(), s.getContato());
		}
	}
}

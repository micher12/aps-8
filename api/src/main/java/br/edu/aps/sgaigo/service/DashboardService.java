package br.edu.aps.sgaigo.service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import br.edu.aps.sgaigo.dto.OrganizacaoResponse;
import br.edu.aps.sgaigo.model.Monitoramento;
import br.edu.aps.sgaigo.model.NaoConformidade;
import br.edu.aps.sgaigo.repository.LicencaRepository;
import br.edu.aps.sgaigo.repository.MonitoramentoRepository;
import br.edu.aps.sgaigo.repository.NaoConformidadeRepository;

/**
 * Monta o resumo do dashboard em UMA consulta agregada (endpoint L4).
 * Cache de 60s no cache "dashboard" (configurado em CacheConfig).
 */
@Service
public class DashboardService {

	private final MonitoramentoRepository monitoramentos;
	private final LicencaRepository licencas;
	private final NaoConformidadeRepository ncs;
	private final OrganizacaoService organizacoes;

	public DashboardService(MonitoramentoRepository monitoramentos, LicencaRepository licencas,
			NaoConformidadeRepository ncs, OrganizacaoService organizacoes) {
		this.monitoramentos = monitoramentos;
		this.licencas = licencas;
		this.ncs = ncs;
		this.organizacoes = organizacoes;
	}

	@Cacheable(value = "dashboard", key = "#organizacaoId == null ? 'todas' : #organizacaoId")
	public DashboardResumo resumo(Long organizacaoId) {
		List<Monitoramento> medidas = organizacaoId != null
				? monitoramentos.findByOrganizacaoIdOrderByDataMedicao(organizacaoId)
				: monitoramentos.findAll();

		DashboardResumo r = new DashboardResumo();
		r.totalOrganizacoes = organizacaoId != null ? 1 : organizacoes.listarAtivas().size();

		YearMonth atual = YearMonth.now();
		r.consumoAguaMes = somarPorTipoNoMes(medidas, Monitoramento.Tipo.AGUA, atual);
		r.consumoEnergiaMes = somarPorTipoNoMes(medidas, Monitoramento.Tipo.ENERGIA, atual);
		r.emissaoCo2Mes = somarPorTipoNoMes(medidas, Monitoramento.Tipo.CO2, atual);

		r.historicoMensal = montarHistorico(medidas);
		r.licencasVencendo = licencas.findByDataValidadeLessThanEqual(LocalDate.now().plusDays(30)).size();
		r.ncsAbertas = ncs.countByStatus(NaoConformidade.Status.ABERTA)
				+ ncs.countByStatus(NaoConformidade.Status.EM_TRATAMENTO);
		return r;
	}

	private double somarPorTipoNoMes(List<Monitoramento> lista, Monitoramento.Tipo tipo, YearMonth mes) {
		return lista.stream()
				.filter(m -> m.getTipo() == tipo && YearMonth.from(m.getDataMedicao()).equals(mes))
				.map(m -> m.getValor().doubleValue())
				.reduce(0.0, Double::sum);
	}

	private List<Map<String, Object>> montarHistorico(List<Monitoramento> lista) {
		return lista.stream()
				.collect(Collectors.groupingBy(m -> YearMonth.from(m.getDataMedicao()).toString()
						+ "|" + m.getTipo(),
						Collectors.mapping(m -> m.getValor().doubleValue(), Collectors.summingDouble(v -> v))))
				.entrySet().stream()
				.map(e -> {
					String[] part = e.getKey().split("\\|");
					return Map.of("mes", (Object) part[0], "tipo", part[1], "valor", e.getValue());
				})
				.sorted((a, b) -> ((String) a.get("mes")).compareTo((String) b.get("mes")))
				.toList();
	}

	public static class DashboardResumo {
		public int totalOrganizacoes;
		public double consumoAguaMes;
		public double consumoEnergiaMes;
		public double emissaoCo2Mes;
		public int licencasVencendo;
		public long ncsAbertas;
		public List<Map<String, Object>> historicoMensal;
	}
}

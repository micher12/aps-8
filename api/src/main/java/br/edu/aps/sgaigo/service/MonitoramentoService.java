package br.edu.aps.sgaigo.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.edu.aps.sgaigo.dto.MonitoramentoRequest;
import br.edu.aps.sgaigo.dto.MonitoramentoRequest.MonitoramentoResponse;
import br.edu.aps.sgaigo.exception.RecursoNaoEncontradoException;
import br.edu.aps.sgaigo.model.Monitoramento;
import br.edu.aps.sgaigo.model.Organizacao;
import br.edu.aps.sgaigo.repository.MonitoramentoRepository;

@Service
public class MonitoramentoService {

	private final MonitoramentoRepository monitoramentos;
	private final OrganizacaoService organizacoes;
	private final RealtimePublisher publisher;

	public MonitoramentoService(MonitoramentoRepository monitoramentos, OrganizacaoService organizacoes,
			RealtimePublisher publisher) {
		this.monitoramentos = monitoramentos;
		this.organizacoes = organizacoes;
		this.publisher = publisher;
	}

	public List<MonitoramentoResponse> listar(Long organizacaoId) {
		if (organizacaoId == null) {
			return monitoramentos.findAll().stream().map(MonitoramentoResponse::de).toList();
		}
		return monitoramentos.findByOrganizacaoIdOrderByDataMedicao(organizacaoId).stream()
				.map(MonitoramentoResponse::de).toList();
	}

	@Transactional
	public MonitoramentoResponse criar(MonitoramentoRequest req) {
		Monitoramento m = new Monitoramento();
		aplicar(m, req);
		m = monitoramentos.save(m);
		publisher.publicarMonitoramento(m); // canal /topic/monitoramentos/{orgId}
		return MonitoramentoResponse.de(m);
	}

	@Transactional
	public MonitoramentoResponse atualizar(Long id, MonitoramentoRequest req) {
		Monitoramento m = obter(id);
		aplicar(m, req);
		return MonitoramentoResponse.de(monitoramentos.save(m));
	}

	@Transactional
	public void remover(Long id) {
		monitoramentos.delete(obter(id));
	}

	private Monitoramento obter(Long id) {
		return monitoramentos.findById(id)
				.orElseThrow(() -> new RecursoNaoEncontradoException("Medição não encontrada"));
	}

	private void aplicar(Monitoramento m, MonitoramentoRequest req) {
		Organizacao org = organizacoes.obter(req.organizacaoId());
		m.setOrganizacao(org);
		m.setTipo(req.tipo());
		m.setValor(req.valor());
		// Unidade em branco quebrava o NOT NULL do banco (500) — deriva do tipo quando ausente
		String unidade = req.unidade() != null && !req.unidade().isBlank()
				? req.unidade()
				: unidadePadrao(req.tipo());
		m.setUnidade(unidade);
		m.setDataMedicao(req.dataMedicao());
		m.setObservacao(req.observacao());
	}

	private static String unidadePadrao(Monitoramento.Tipo tipo) {
		return switch (tipo) {
			case AGUA -> "m³";
			case ENERGIA -> "kWh";
			case CO2 -> "tCO2e";
		};
	}
}

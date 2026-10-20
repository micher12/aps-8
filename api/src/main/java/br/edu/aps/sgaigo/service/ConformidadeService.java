package br.edu.aps.sgaigo.service;

import java.time.LocalDate;
import java.util.EnumSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.edu.aps.sgaigo.dto.ConformidadeDtos.AcaoRequest;
import br.edu.aps.sgaigo.dto.ConformidadeDtos.AcaoResponse;
import br.edu.aps.sgaigo.dto.ConformidadeDtos.AspectoRequest;
import br.edu.aps.sgaigo.dto.ConformidadeDtos.AspectoResponse;
import br.edu.aps.sgaigo.dto.ConformidadeDtos.NcRequest;
import br.edu.aps.sgaigo.dto.ConformidadeDtos.NcResponse;
import br.edu.aps.sgaigo.dto.ConformidadeDtos.StakeholderRequest;
import br.edu.aps.sgaigo.dto.ConformidadeDtos.StakeholderResponse;
import br.edu.aps.sgaigo.exception.RecursoNaoEncontradoException;
import br.edu.aps.sgaigo.exception.RegraNegocioException;
import br.edu.aps.sgaigo.model.AcaoCorretiva;
import br.edu.aps.sgaigo.model.AspectoImpacto;
import br.edu.aps.sgaigo.model.NaoConformidade;
import br.edu.aps.sgaigo.model.Stakeholder;
import br.edu.aps.sgaigo.repository.AcaoCorretivaRepository;
import br.edu.aps.sgaigo.repository.AspectoRepository;
import br.edu.aps.sgaigo.repository.NaoConformidadeRepository;
import br.edu.aps.sgaigo.repository.StakeholderRepository;

@Service
public class ConformidadeService {

	/** Fluxo de status da NC: ABERTA → EM_TRATAMENTO → RESOLVIDA (sem retroceder). */
	private static final Map<NaoConformidade.Status, Set<NaoConformidade.Status>> TRANSICOES_NC = Map.of(
			NaoConformidade.Status.ABERTA, EnumSet.of(NaoConformidade.Status.EM_TRATAMENTO),
			NaoConformidade.Status.EM_TRATAMENTO, EnumSet.of(NaoConformidade.Status.RESOLVIDA),
			NaoConformidade.Status.RESOLVIDA, EnumSet.noneOf(NaoConformidade.Status.class));

	private final AspectoRepository aspectos;
	private final NaoConformidadeRepository ncs;
	private final AcaoCorretivaRepository acoes;
	private final StakeholderRepository stakeholders;
	private final OrganizacaoService organizacoes;
	private final RealtimePublisher publisher;

	public ConformidadeService(AspectoRepository aspectos, NaoConformidadeRepository ncs,
			AcaoCorretivaRepository acoes, StakeholderRepository stakeholders,
			OrganizacaoService organizacoes, RealtimePublisher publisher) {
		this.aspectos = aspectos;
		this.ncs = ncs;
		this.acoes = acoes;
		this.stakeholders = stakeholders;
		this.organizacoes = organizacoes;
		this.publisher = publisher;
	}

	// ---- Aspectos e impactos ----
	public List<AspectoResponse> listarAspectos(Long organizacaoId) {
		var base = organizacaoId != null ? aspectos.findByOrganizacaoId(organizacaoId) : aspectos.findAll();
		return base.stream().map(AspectoResponse::de).toList();
	}

	@Transactional
	public AspectoResponse criarAspecto(AspectoRequest req) {
		AspectoImpacto a = new AspectoImpacto();
		a.setOrganizacao(organizacoes.obter(req.organizacaoId()));
		a.setDescricao(req.descricao());
		a.setTipo(req.tipo());
		a.setImpacto(req.impacto());
		a.setFrequencia(req.frequencia());
		a.setGravidade(req.gravidade());
		a.setProbabilidade(req.probabilidade());
		return AspectoResponse.de(aspectos.save(a));
	}

	@Transactional
	public void removerAspecto(Long id) {
		aspectos.deleteById(id);
	}

	// ---- Não conformidades ----
	public List<NcResponse> listarNcs(Long organizacaoId) {
		var base = organizacaoId != null ? ncs.findByOrganizacaoId(organizacaoId) : ncs.findAll();
		return base.stream().map(NcResponse::de).toList();
	}

	@Transactional
	public NcResponse criarNc(NcRequest req) {
		NaoConformidade n = new NaoConformidade();
		n.setOrganizacao(organizacoes.obter(req.organizacaoId()));
		n.setDescricao(req.descricao());
		if (req.origem() != null && !req.origem().isBlank()) n.setOrigem(req.origem());
		n.setGravidade(req.gravidade());
		NaoConformidade salva = ncs.save(n);
		if (salva.getGravidade().ordinal() >= NaoConformidade.Gravidade.ALTA.ordinal()) {
			publisher.publicarAlerta("NAO_CONFORMIDADE",
					"NC " + salva.getGravidade() + ": " + salva.getDescricao(), req.organizacaoId());
		}
		return NcResponse.de(salva);
	}

	@Transactional
	public NcResponse mudarStatusNc(Long id, String status) {
		NaoConformidade n = obter(id);
		NaoConformidade.Status novo = parseStatusNc(status);
		if (!TRANSICOES_NC.get(n.getStatus()).contains(novo)) {
			throw new RegraNegocioException(
					"Transição de status inválida: " + n.getStatus() + " → " + novo);
		}
		n.setStatus(novo);
		return NcResponse.de(ncs.save(n));
	}

	private static NaoConformidade.Status parseStatusNc(String status) {
		try {
			return NaoConformidade.Status.valueOf(status.trim().toUpperCase());
		} catch (Exception e) {
			throw new RegraNegocioException(
					"Status inválido: " + status + ". Valores aceitos: ABERTA, EM_TRATAMENTO, RESOLVIDA");
		}
	}

	@Transactional
	public void removerNc(Long id) {
		ncs.delete(obter(id));
	}

	// ---- Ações corretivas ----
	public List<AcaoResponse> listarAcoes(Long naoConformidadeId) {
		return acoes.findByNaoConformidadeId(naoConformidadeId).stream().map(AcaoResponse::de).toList();
	}

	@Transactional
	public AcaoResponse criarAcao(AcaoRequest req) {
		NaoConformidade nc = obter(req.naoConformidadeId());
		if (nc.getStatus() == NaoConformidade.Status.RESOLVIDA) {
			throw new RegraNegocioException("Não é permitido criar ações corretivas para NC já resolvida");
		}
		if (req.prazo() != null && req.prazo().isBefore(LocalDate.now())) {
			throw new RegraNegocioException("O prazo da ação corretiva não pode estar no passado");
		}
		AcaoCorretiva a = new AcaoCorretiva();
		a.setNaoConformidade(nc);
		a.setDescricao(req.descricao());
		a.setResponsavel(req.responsavel());
		a.setPrazo(req.prazo());
		if (req.status() != null && !req.status().isBlank()) {
			a.setStatus(parseStatusAcao(req.status()));
		}
		return AcaoResponse.de(acoes.save(a));
	}

	private static AcaoCorretiva.Status parseStatusAcao(String status) {
		try {
			return AcaoCorretiva.Status.valueOf(status.trim().toUpperCase());
		} catch (Exception e) {
			throw new RegraNegocioException(
					"Status de ação inválido: " + status + ". Valores aceitos: PENDENTE, EM_ANDAMENTO, CONCLUIDA");
		}
	}

	@Transactional
	public void removerAcao(Long id) {
		acoes.deleteById(id);
	}

	// ---- Stakeholders ----
	public List<StakeholderResponse> listarStakeholders(Long organizacaoId) {
		var base = organizacaoId != null ? stakeholders.findByOrganizacaoId(organizacaoId) : stakeholders.findAll();
		return base.stream().map(StakeholderResponse::de).toList();
	}

	@Transactional
	public StakeholderResponse criarStakeholder(StakeholderRequest req) {
		Stakeholder s = new Stakeholder();
		s.setOrganizacao(organizacoes.obter(req.organizacaoId()));
		s.setNome(req.nome());
		s.setCategoria(req.categoria());
		s.setContato(req.contato());
		return StakeholderResponse.de(stakeholders.save(s));
	}

	@Transactional
	public void removerStakeholder(Long id) {
		stakeholders.deleteById(id);
	}

	private NaoConformidade obter(Long id) {
		return ncs.findById(id)
				.orElseThrow(() -> new RecursoNaoEncontradoException("Não conformidade não encontrada"));
	}
}

package br.edu.aps.sgaigo.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import br.edu.aps.sgaigo.dto.LicencaRequest;
import br.edu.aps.sgaigo.dto.LicencaRequest.LicencaResponse;
import br.edu.aps.sgaigo.exception.RecursoNaoEncontradoException;
import br.edu.aps.sgaigo.model.LicencaAmbiental;
import br.edu.aps.sgaigo.model.Organizacao;
import br.edu.aps.sgaigo.repository.LicencaRepository;

@Service
public class LicencaService {

	private final LicencaRepository licencas;
	private final OrganizacaoService organizacoes;

	public LicencaService(LicencaRepository licencas, OrganizacaoService organizacoes) {
		this.licencas = licencas;
		this.organizacoes = organizacoes;
	}

	public List<LicencaResponse> listar() {
		return licencas.findAll().stream().map(LicencaResponse::de).toList();
	}

	/** Licenças vencidas ou vencendo em até N dias. */
	public List<LicencaResponse> vencendo(int dias) {
		return licencas.findByDataValidadeLessThanEqual(LocalDate.now().plusDays(dias)).stream()
				.map(LicencaResponse::de).toList();
	}

	public LicencaResponse criar(LicencaRequest req) {
		LicencaAmbiental l = new LicencaAmbiental();
		aplicar(l, req);
		return LicencaResponse.de(licencas.save(l));
	}

	public LicencaResponse atualizar(Long id, LicencaRequest req) {
		LicencaAmbiental l = obter(id);
		aplicar(l, req);
		return LicencaResponse.de(licencas.save(l));
	}

	public void remover(Long id) {
		licencas.delete(obter(id));
	}

	private LicencaAmbiental obter(Long id) {
		return licencas.findById(id)
				.orElseThrow(() -> new RecursoNaoEncontradoException("Licença não encontrada"));
	}

	private void aplicar(LicencaAmbiental l, LicencaRequest req) {
		Organizacao org = organizacoes.obter(req.organizacaoId());
		l.setOrganizacao(org);
		l.setNumero(req.numero());
		l.setTipo(req.tipo());
		if (req.orgaoEmissor() != null && !req.orgaoEmissor().isBlank()) l.setOrgaoEmissor(req.orgaoEmissor());
		l.setDataEmissao(req.dataEmissao());
		l.setDataValidade(req.dataValidade());
		l.setObservacao(req.observacao());
	}
}

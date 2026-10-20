package br.edu.aps.sgaigo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import br.edu.aps.sgaigo.dto.ResiduoRequest;
import br.edu.aps.sgaigo.dto.ResiduoRequest.ResiduoResponse;
import br.edu.aps.sgaigo.exception.RecursoNaoEncontradoException;
import br.edu.aps.sgaigo.model.Organizacao;
import br.edu.aps.sgaigo.model.Residuo;
import br.edu.aps.sgaigo.repository.ResiduoRepository;

@Service
public class ResiduoService {

	private final ResiduoRepository residuos;
	private final OrganizacaoService organizacoes;

	public ResiduoService(ResiduoRepository residuos, OrganizacaoService organizacoes) {
		this.residuos = residuos;
		this.organizacoes = organizacoes;
	}

	public List<ResiduoResponse> listar(Long organizacaoId) {
		List<Residuo> base = organizacaoId != null
				? residuos.findByOrganizacaoId(organizacaoId)
				: residuos.findAll();
		return base.stream().map(ResiduoResponse::de).toList();
	}

	public ResiduoResponse criar(ResiduoRequest req) {
		Residuo r = new Residuo();
		aplicar(r, req);
		return ResiduoResponse.de(residuos.save(r));
	}

	public ResiduoResponse atualizar(Long id, ResiduoRequest req) {
		Residuo r = obter(id);
		aplicar(r, req);
		return ResiduoResponse.de(residuos.save(r));
	}

	public void remover(Long id) {
		residuos.delete(obter(id));
	}

	private Residuo obter(Long id) {
		return residuos.findById(id)
				.orElseThrow(() -> new RecursoNaoEncontradoException("Resíduo não encontrado"));
	}

	private void aplicar(Residuo r, ResiduoRequest req) {
		Organizacao org = organizacoes.obter(req.organizacaoId());
		r.setOrganizacao(org);
		r.setTipo(req.tipo());
		r.setClasse(req.classe());
		r.setQuantidade(req.quantidade());
		if (req.unidade() != null && !req.unidade().isBlank()) r.setUnidade(req.unidade());
		r.setDestinacao(req.destinacao());
		r.setDestinatario(req.destinatario());
		if (req.dataRegistro() != null) r.setDataRegistro(req.dataRegistro());
	}
}

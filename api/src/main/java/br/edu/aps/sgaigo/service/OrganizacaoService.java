package br.edu.aps.sgaigo.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.edu.aps.sgaigo.dto.OrganizacaoRequest;
import br.edu.aps.sgaigo.dto.OrganizacaoResponse;
import br.edu.aps.sgaigo.exception.ConflitoException;
import br.edu.aps.sgaigo.exception.RecursoNaoEncontradoException;
import br.edu.aps.sgaigo.exception.RegraNegocioException;
import br.edu.aps.sgaigo.model.MunicipioGo;
import br.edu.aps.sgaigo.model.Organizacao;
import br.edu.aps.sgaigo.repository.MunicipioRepository;
import br.edu.aps.sgaigo.repository.OrganizacaoRepository;

@Service
public class OrganizacaoService {

	private final OrganizacaoRepository organizacoes;
	private final MunicipioRepository municipios;

	public OrganizacaoService(OrganizacaoRepository organizacoes, MunicipioRepository municipios) {
		this.organizacoes = organizacoes;
		this.municipios = municipios;
	}

	@Transactional(readOnly = true)
	public List<OrganizacaoResponse> listarAtivas() {
		return organizacoes.findByAtivoTrue().stream().map(OrganizacaoResponse::de).toList();
	}

	@Transactional(readOnly = true)
	public OrganizacaoResponse buscar(Long id) {
		return OrganizacaoResponse.de(obter(id));
	}

	@Transactional(readOnly = true)
	public Organizacao obter(Long id) {
		return organizacoes.findById(id)
				.orElseThrow(() -> new RecursoNaoEncontradoException("Organização não encontrada"));
	}

	@Transactional
	public OrganizacaoResponse criar(OrganizacaoRequest req) {
		Organizacao o = new Organizacao();
		aplicar(o, req);
		return OrganizacaoResponse.de(organizacoes.save(o));
	}

	@Transactional
	public OrganizacaoResponse atualizar(Long id, OrganizacaoRequest req) {
		Organizacao o = obter(id);
		aplicar(o, req);
		return OrganizacaoResponse.de(organizacoes.save(o));
	}

	@Transactional
	public void remover(Long id) {
		Organizacao o = obter(id);
		o.setAtivo(false); // soft delete — preserva histórico e integridade
		organizacoes.save(o);
	}

	private void aplicar(Organizacao o, OrganizacaoRequest req) {
		o.setRazaoSocial(req.razaoSocial());
		String cnpj = req.cnpj() != null && !req.cnpj().isBlank() ? req.cnpj().replaceAll("\\D", "") : null;
		if (cnpj != null && !cnpj.equals(o.getCnpj())) {
			// Valida dígitos verificadores apenas quando o CNPJ muda (bases legadas aceitas como estão)
			validarCnpj(cnpj);
			organizacoes.findByCnpj(cnpj)
					.filter(existente -> !existente.getId().equals(o.getId()))
					.ifPresent(existente -> {
						throw new ConflitoException("Já existe organização cadastrada com este CNPJ");
					});
		}
		o.setCnpj(cnpj);
		o.setSetor(req.setor());
		o.setPorte(req.porte());
		// municipioId nulo desvincula o município (permite limpar no formulário)
		MunicipioGo municipio = req.municipioId() != null
				? municipios.findById(req.municipioId())
						.orElseThrow(() -> new RecursoNaoEncontradoException("Município não encontrado"))
				: null;
		o.setMunicipio(municipio);
		o.setLogradouro(req.logradouro());
		o.setCep(req.cep());
		o.setLatitude(req.latitude());
		o.setLongitude(req.longitude());
	}

	private static void validarCnpj(String cnpj) {
		if (cnpj.length() != 14 || cnpj.chars().distinct().count() == 1) {
			throw new RegraNegocioException("CNPJ inválido");
		}
		int[] pesos1 = { 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 };
		int[] pesos2 = { 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 };
		if (cnpj.charAt(12) - '0' != digitoVerificador(cnpj, pesos1)
				|| cnpj.charAt(13) - '0' != digitoVerificador(cnpj, pesos2)) {
			throw new RegraNegocioException("CNPJ inválido: dígitos verificadores não conferem");
		}
	}

	private static int digitoVerificador(String cnpj, int[] pesos) {
		int soma = 0;
		for (int i = 0; i < pesos.length; i++) {
			soma += (cnpj.charAt(i) - '0') * pesos[i];
		}
		int resto = soma % 11;
		return resto < 2 ? 0 : 11 - resto;
	}
}

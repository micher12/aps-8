package br.edu.aps.sgaigo.dto;

import br.edu.aps.sgaigo.model.Organizacao;

public record OrganizacaoResponse(Long id, String razaoSocial, String cnpj, String setor,
		String porte, Integer municipioId, String municipioNome, String logradouro, String cep,
		Double latitude, Double longitude) {

	public static OrganizacaoResponse de(Organizacao o) {
		return new OrganizacaoResponse(o.getId(), o.getRazaoSocial(), o.getCnpj(), o.getSetor(),
				o.getPorte() != null ? o.getPorte().name() : null,
				o.getMunicipio() != null ? o.getMunicipio().getCodigoIbge() : null,
				o.getMunicipio() != null ? o.getMunicipio().getNome() : null,
				o.getLogradouro(), o.getCep(), o.getLatitude(), o.getLongitude());
	}
}

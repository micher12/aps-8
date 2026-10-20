package br.edu.aps.sgaigo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import br.edu.aps.sgaigo.model.Organizacao.Porte;

public record OrganizacaoRequest(
		@NotBlank @Size(max = 200) String razaoSocial,
		@Pattern(regexp = "\\d{14}", message = "CNPJ com 14 dígitos") String cnpj,
		@Size(max = 80) String setor,
		Porte porte,
		Integer municipioId,
		@Size(max = 200) String logradouro,
		@Pattern(regexp = "\\d{8}", message = "CEP com 8 dígitos") String cep,
		Double latitude,
		Double longitude) {
}

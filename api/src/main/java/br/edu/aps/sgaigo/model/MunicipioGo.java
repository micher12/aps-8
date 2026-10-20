package br.edu.aps.sgaigo.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "municipios_go")
public class MunicipioGo {

	@Id
	@Column(name = "codigo_ibge")
	private Integer codigoIbge;

	@Column(nullable = false, length = 100)
	private String nome;

	public MunicipioGo() {
	}

	public Integer getCodigoIbge() {
		return codigoIbge;
	}

	public void setCodigoIbge(Integer codigoIbge) {
		this.codigoIbge = codigoIbge;
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}
}

package br.edu.aps.sgaigo.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "organizacoes")
public class Organizacao {

	public enum Porte { MEI, ME, EPP, MEDIO, GRANDE }

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "razao_social", nullable = false, length = 200)
	private String razaoSocial;

	@Column(unique = true, length = 14)
	private String cnpj;

	@Column(length = 80)
	private String setor;

	@Enumerated(EnumType.STRING)
	@Column(length = 20)
	private Porte porte;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "municipio_id")
	private MunicipioGo municipio;

	@Column(length = 200)
	private String logradouro;

	@Column(length = 8)
	private String cep;

	private Double latitude;
	private Double longitude;

	@Column(nullable = false)
	private boolean ativo = true;

	@Column(name = "criado_em", nullable = false, updatable = false)
	private LocalDateTime criadoEm;

	@PrePersist
	void prePersist() {
		this.criadoEm = LocalDateTime.now();
	}

	public Organizacao() {}

	public Long getId() { return id; }
	public void setId(Long id) { this.id = id; }
	public String getRazaoSocial() { return razaoSocial; }
	public void setRazaoSocial(String razaoSocial) { this.razaoSocial = razaoSocial; }
	public String getCnpj() { return cnpj; }
	public void setCnpj(String cnpj) { this.cnpj = cnpj; }
	public String getSetor() { return setor; }
	public void setSetor(String setor) { this.setor = setor; }
	public Porte getPorte() { return porte; }
	public void setPorte(Porte porte) { this.porte = porte; }
	public MunicipioGo getMunicipio() { return municipio; }
	public void setMunicipio(MunicipioGo municipio) { this.municipio = municipio; }
	public String getLogradouro() { return logradouro; }
	public void setLogradouro(String logradouro) { this.logradouro = logradouro; }
	public String getCep() { return cep; }
	public void setCep(String cep) { this.cep = cep; }
	public Double getLatitude() { return latitude; }
	public void setLatitude(Double latitude) { this.latitude = latitude; }
	public Double getLongitude() { return longitude; }
	public void setLongitude(Double longitude) { this.longitude = longitude; }
	public boolean isAtivo() { return ativo; }
	public void setAtivo(boolean ativo) { this.ativo = ativo; }
	public LocalDateTime getCriadoEm() { return criadoEm; }
}

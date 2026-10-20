package br.edu.aps.sgaigo.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "licencas_ambientais")
public class LicencaAmbiental {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "organizacao_id", nullable = false)
	private Organizacao organizacao;

	@Column(nullable = false, length = 40)
	private String numero;

	@Column(nullable = false, length = 40)
	private String tipo;

	@Column(name = "orgao_emissor", nullable = false, length = 120)
	private String orgaoEmissor = "SEMAD-GO";

	@Column(name = "data_emissao", nullable = false)
	private LocalDate dataEmissao;

	@Column(name = "data_validade", nullable = false)
	private LocalDate dataValidade;

	@Column(columnDefinition = "TEXT")
	private String observacao;

	@Column(name = "criado_em", nullable = false, updatable = false)
	private LocalDateTime criadoEm;

	@PrePersist
	void prePersist() {
		this.criadoEm = LocalDateTime.now();
	}

	public LicencaAmbiental() {}

	/** Dias até a validade (negativo se já está vencida). */
	public long diasParaVencimento() {
		return ChronoUnit.DAYS.between(LocalDate.now(), dataValidade);
	}

	public boolean vencida() {
		return diasParaVencimento() < 0;
	}

	public Long getId() { return id; }
	public void setId(Long id) { this.id = id; }
	public Organizacao getOrganizacao() { return organizacao; }
	public void setOrganizacao(Organizacao organizacao) { this.organizacao = organizacao; }
	public String getNumero() { return numero; }
	public void setNumero(String numero) { this.numero = numero; }
	public String getTipo() { return tipo; }
	public void setTipo(String tipo) { this.tipo = tipo; }
	public String getOrgaoEmissor() { return orgaoEmissor; }
	public void setOrgaoEmissor(String orgaoEmissor) { this.orgaoEmissor = orgaoEmissor; }
	public LocalDate getDataEmissao() { return dataEmissao; }
	public void setDataEmissao(LocalDate dataEmissao) { this.dataEmissao = dataEmissao; }
	public LocalDate getDataValidade() { return dataValidade; }
	public void setDataValidade(LocalDate dataValidade) { this.dataValidade = dataValidade; }
	public String getObservacao() { return observacao; }
	public void setObservacao(String observacao) { this.observacao = observacao; }
	public LocalDateTime getCriadoEm() { return criadoEm; }
}

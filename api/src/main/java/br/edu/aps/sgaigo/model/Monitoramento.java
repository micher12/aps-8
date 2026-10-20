package br.edu.aps.sgaigo.model;

import java.math.BigDecimal;
import java.time.LocalDate;
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
@Table(name = "monitoramentos")
public class Monitoramento {

	public enum Tipo { AGUA, ENERGIA, CO2 }

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "organizacao_id", nullable = false)
	private Organizacao organizacao;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 20)
	private Tipo tipo;

	@Column(nullable = false, precision = 14, scale = 3)
	private BigDecimal valor;

	@Column(nullable = false, length = 12)
	private String unidade;

	@Column(name = "data_medicao", nullable = false)
	private LocalDate dataMedicao;

	@Column(length = 300)
	private String observacao;

	@Column(name = "criado_em", nullable = false, updatable = false)
	private LocalDateTime criadoEm;

	@PrePersist
	void prePersist() {
		this.criadoEm = LocalDateTime.now();
	}

	public Monitoramento() {}

	public Long getId() { return id; }
	public void setId(Long id) { this.id = id; }
	public Organizacao getOrganizacao() { return organizacao; }
	public void setOrganizacao(Organizacao organizacao) { this.organizacao = organizacao; }
	public Tipo getTipo() { return tipo; }
	public void setTipo(Tipo tipo) { this.tipo = tipo; }
	public BigDecimal getValor() { return valor; }
	public void setValor(BigDecimal valor) { this.valor = valor; }
	public String getUnidade() { return unidade; }
	public void setUnidade(String unidade) { this.unidade = unidade; }
	public LocalDate getDataMedicao() { return dataMedicao; }
	public void setDataMedicao(LocalDate dataMedicao) { this.dataMedicao = dataMedicao; }
	public String getObservacao() { return observacao; }
	public void setObservacao(String observacao) { this.observacao = observacao; }
	public LocalDateTime getCriadoEm() { return criadoEm; }
}

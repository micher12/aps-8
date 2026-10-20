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
@Table(name = "aspectos_impactos")
public class AspectoImpacto {

	public enum Tipo { RESIDUO, EFLUENTE, EMISSAO, CONSUMO_AGUA, CONSUMO_ENERGIA, SOLO, RUIDO, OUTRO }

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "organizacao_id", nullable = false)
	private Organizacao organizacao;

	@Column(nullable = false, length = 300)
	private String descricao;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 30)
	private Tipo tipo;

	@Column(nullable = false, length = 300)
	private String impacto;

	@Column(nullable = false)
	private short frequencia;

	@Column(nullable = false)
	private short gravidade;

	@Column(nullable = false)
	private short probabilidade;

	@Column(name = "criado_em", nullable = false, updatable = false)
	private LocalDateTime criadoEm;

	@PrePersist
	void prePersist() {
		this.criadoEm = LocalDateTime.now();
	}

	public AspectoImpacto() {}

	/** Grau de significância (critério ISO 14001): frequência × gravidade × probabilidade. */
	public int grauSignificancia() {
		return frequencia * gravidade * probabilidade;
	}

	public Long getId() { return id; }
	public void setId(Long id) { this.id = id; }
	public Organizacao getOrganizacao() { return organizacao; }
	public void setOrganizacao(Organizacao organizacao) { this.organizacao = organizacao; }
	public String getDescricao() { return descricao; }
	public void setDescricao(String descricao) { this.descricao = descricao; }
	public Tipo getTipo() { return tipo; }
	public void setTipo(Tipo tipo) { this.tipo = tipo; }
	public String getImpacto() { return impacto; }
	public void setImpacto(String impacto) { this.impacto = impacto; }
	public short getFrequencia() { return frequencia; }
	public void setFrequencia(short frequencia) { this.frequencia = frequencia; }
	public short getGravidade() { return gravidade; }
	public void setGravidade(short gravidade) { this.gravidade = gravidade; }
	public short getProbabilidade() { return probabilidade; }
	public void setProbabilidade(short probabilidade) { this.probabilidade = probabilidade; }
	public LocalDateTime getCriadoEm() { return criadoEm; }
}

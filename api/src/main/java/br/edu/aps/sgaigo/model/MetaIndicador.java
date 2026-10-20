package br.edu.aps.sgaigo.model;

import java.math.BigDecimal;

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
import jakarta.persistence.Table;

@Entity
@Table(name = "metas_indicadores")
public class MetaIndicador {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "organizacao_id", nullable = false)
	private Organizacao organizacao;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 20)
	private Monitoramento.Tipo tipo;

	@Column(name = "meta_mensal", nullable = false, precision = 14, scale = 3)
	private BigDecimal metaMensal;

	@Column(nullable = false)
	private short ano;

	public MetaIndicador() {}

	public Long getId() { return id; }
	public void setId(Long id) { this.id = id; }
	public Organizacao getOrganizacao() { return organizacao; }
	public void setOrganizacao(Organizacao organizacao) { this.organizacao = organizacao; }
	public Monitoramento.Tipo getTipo() { return tipo; }
	public void setTipo(Monitoramento.Tipo tipo) { this.tipo = tipo; }
	public BigDecimal getMetaMensal() { return metaMensal; }
	public void setMetaMensal(BigDecimal metaMensal) { this.metaMensal = metaMensal; }
	public short getAno() { return ano; }
	public void setAno(short ano) { this.ano = ano; }
}

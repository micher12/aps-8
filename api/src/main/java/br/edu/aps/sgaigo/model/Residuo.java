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
@Table(name = "residuos")
public class Residuo {

	public enum Classe { PERIGOSO, NAO_PERIGOSO, INFECTANTE }

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "organizacao_id", nullable = false)
	private Organizacao organizacao;

	@Column(nullable = false, length = 120)
	private String tipo;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 20)
	private Classe classe;

	@Column(nullable = false, precision = 12, scale = 2)
	private BigDecimal quantidade;

	@Column(nullable = false, length = 10)
	private String unidade = "kg";

	@Column(nullable = false, length = 120)
	private String destinacao;

	@Column(length = 200)
	private String destinatario;

	@Column(name = "data_registro", nullable = false)
	private LocalDate dataRegistro = LocalDate.now();

	@Column(name = "criado_em", nullable = false, updatable = false)
	private LocalDateTime criadoEm;

	@PrePersist
	void prePersist() {
		this.criadoEm = LocalDateTime.now();
	}

	public Residuo() {}

	public Long getId() { return id; }
	public void setId(Long id) { this.id = id; }
	public Organizacao getOrganizacao() { return organizacao; }
	public void setOrganizacao(Organizacao organizacao) { this.organizacao = organizacao; }
	public String getTipo() { return tipo; }
	public void setTipo(String tipo) { this.tipo = tipo; }
	public Classe getClasse() { return classe; }
	public void setClasse(Classe classe) { this.classe = classe; }
	public BigDecimal getQuantidade() { return quantidade; }
	public void setQuantidade(BigDecimal quantidade) { this.quantidade = quantidade; }
	public String getUnidade() { return unidade; }
	public void setUnidade(String unidade) { this.unidade = unidade; }
	public String getDestinacao() { return destinacao; }
	public void setDestinacao(String destinacao) { this.destinacao = destinacao; }
	public String getDestinatario() { return destinatario; }
	public void setDestinatario(String destinatario) { this.destinatario = destinatario; }
	public LocalDate getDataRegistro() { return dataRegistro; }
	public void setDataRegistro(LocalDate dataRegistro) { this.dataRegistro = dataRegistro; }
	public LocalDateTime getCriadoEm() { return criadoEm; }
}

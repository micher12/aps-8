package br.edu.aps.sgaigo.model;

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
@Table(name = "nao_conformidades")
public class NaoConformidade {

	public enum Gravidade { BAIXA, MEDIA, ALTA, CRITICA }
	public enum Status { ABERTA, EM_TRATAMENTO, RESOLVIDA }

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "organizacao_id", nullable = false)
	private Organizacao organizacao;

	@Column(nullable = false, length = 400)
	private String descricao;

	@Column(nullable = false, length = 40)
	private String origem = "AUDITORIA_INTERNA";

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 15)
	private Gravidade gravidade;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 20)
	private Status status = Status.ABERTA;

	@Column(name = "data_abertura", nullable = false)
	private LocalDate dataAbertura = LocalDate.now();

	@Column(name = "criado_em", nullable = false, updatable = false)
	private LocalDateTime criadoEm;

	@PrePersist
	void prePersist() {
		this.criadoEm = LocalDateTime.now();
	}

	public NaoConformidade() {}

	public Long getId() { return id; }
	public void setId(Long id) { this.id = id; }
	public Organizacao getOrganizacao() { return organizacao; }
	public void setOrganizacao(Organizacao organizacao) { this.organizacao = organizacao; }
	public String getDescricao() { return descricao; }
	public void setDescricao(String descricao) { this.descricao = descricao; }
	public String getOrigem() { return origem; }
	public void setOrigem(String origem) { this.origem = origem; }
	public Gravidade getGravidade() { return gravidade; }
	public void setGravidade(Gravidade gravidade) { this.gravidade = gravidade; }
	public Status getStatus() { return status; }
	public void setStatus(Status status) { this.status = status; }
	public LocalDate getDataAbertura() { return dataAbertura; }
	public void setDataAbertura(LocalDate dataAbertura) { this.dataAbertura = dataAbertura; }
	public LocalDateTime getCriadoEm() { return criadoEm; }
}

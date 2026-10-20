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
@Table(name = "acoes_corretivas")
public class AcaoCorretiva {

	public enum Status { PENDENTE, EM_ANDAMENTO, CONCLUIDA }

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "nao_conformidade_id", nullable = false)
	private NaoConformidade naoConformidade;

	@Column(nullable = false, length = 400)
	private String descricao;

	@Column(nullable = false, length = 120)
	private String responsavel;

	private LocalDate prazo;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 20)
	private Status status = Status.PENDENTE;

	@Column(name = "criado_em", nullable = false, updatable = false)
	private LocalDateTime criadoEm;

	@PrePersist
	void prePersist() {
		this.criadoEm = LocalDateTime.now();
	}

	public AcaoCorretiva() {}

	public Long getId() { return id; }
	public void setId(Long id) { this.id = id; }
	public NaoConformidade getNaoConformidade() { return naoConformidade; }
	public void setNaoConformidade(NaoConformidade naoConformidade) { this.naoConformidade = naoConformidade; }
	public String getDescricao() { return descricao; }
	public void setDescricao(String descricao) { this.descricao = descricao; }
	public String getResponsavel() { return responsavel; }
	public void setResponsavel(String responsavel) { this.responsavel = responsavel; }
	public LocalDate getPrazo() { return prazo; }
	public void setPrazo(LocalDate prazo) { this.prazo = prazo; }
	public Status getStatus() { return status; }
	public void setStatus(Status status) { this.status = status; }
	public LocalDateTime getCriadoEm() { return criadoEm; }
}

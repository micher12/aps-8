package br.edu.aps.sgaigo.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "logs_auditoria")
public class LogAuditoria {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(length = 150)
	private String usuario;

	@Column(nullable = false, length = 60)
	private String entidade;

	@Column(nullable = false, length = 10)
	private String acao;

	@Column(length = 400)
	private String descricao;

	@Column(name = "criado_em", nullable = false, updatable = false)
	private LocalDateTime criadoEm;

	@PrePersist
	void prePersist() {
		this.criadoEm = LocalDateTime.now();
	}

	public LogAuditoria() {}

	public LogAuditoria(String usuario, String entidade, String acao, String descricao) {
		this.usuario = usuario;
		this.entidade = entidade;
		this.acao = acao;
		this.descricao = descricao;
	}

	public Long getId() { return id; }
	public String getUsuario() { return usuario; }
	public String getEntidade() { return entidade; }
	public String getAcao() { return acao; }
	public String getDescricao() { return descricao; }
	public LocalDateTime getCriadoEm() { return criadoEm; }
}

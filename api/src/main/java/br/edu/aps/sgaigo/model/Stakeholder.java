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
@Table(name = "stakeholders")
public class Stakeholder {

	public enum Categoria { COLABORADOR, FORNECEDOR, COMUNIDADE, ORGAO_PUBLICO, INVESTIDOR, OUTRO }

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "organizacao_id", nullable = false)
	private Organizacao organizacao;

	@Column(nullable = false, length = 150)
	private String nome;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 30)
	private Categoria categoria;

	@Column(length = 150)
	private String contato;

	@Column(name = "criado_em", nullable = false, updatable = false)
	private LocalDateTime criadoEm;

	@PrePersist
	void prePersist() {
		this.criadoEm = LocalDateTime.now();
	}

	public Stakeholder() {}

	public Long getId() { return id; }
	public void setId(Long id) { this.id = id; }
	public Organizacao getOrganizacao() { return organizacao; }
	public void setOrganizacao(Organizacao organizacao) { this.organizacao = organizacao; }
	public String getNome() { return nome; }
	public void setNome(String nome) { this.nome = nome; }
	public Categoria getCategoria() { return categoria; }
	public void setCategoria(Categoria categoria) { this.categoria = categoria; }
	public String getContato() { return contato; }
	public void setContato(String contato) { this.contato = contato; }
	public LocalDateTime getCriadoEm() { return criadoEm; }
}

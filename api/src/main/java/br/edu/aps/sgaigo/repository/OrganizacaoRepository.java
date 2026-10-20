package br.edu.aps.sgaigo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import br.edu.aps.sgaigo.model.Organizacao;

public interface OrganizacaoRepository extends JpaRepository<Organizacao, Long> {

	@EntityGraph(attributePaths = "municipio")
	List<Organizacao> findByAtivoTrue();

	@EntityGraph(attributePaths = "municipio")
	Optional<Organizacao> findById(Long id);

	Optional<Organizacao> findByCnpj(String cnpj);
}

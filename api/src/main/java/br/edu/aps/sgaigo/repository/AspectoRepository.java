package br.edu.aps.sgaigo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.edu.aps.sgaigo.model.AspectoImpacto;

public interface AspectoRepository extends JpaRepository<AspectoImpacto, Long> {

	List<AspectoImpacto> findByOrganizacaoId(Long organizacaoId);
}

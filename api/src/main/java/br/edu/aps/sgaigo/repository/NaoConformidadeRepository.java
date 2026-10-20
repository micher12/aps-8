package br.edu.aps.sgaigo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.edu.aps.sgaigo.model.AspectoImpacto;
import br.edu.aps.sgaigo.model.NaoConformidade;

public interface NaoConformidadeRepository extends JpaRepository<NaoConformidade, Long> {

	List<NaoConformidade> findByOrganizacaoId(Long organizacaoId);

	long countByStatus(NaoConformidade.Status status);
}

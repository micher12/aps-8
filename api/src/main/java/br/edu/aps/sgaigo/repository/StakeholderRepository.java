package br.edu.aps.sgaigo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.edu.aps.sgaigo.model.Stakeholder;

public interface StakeholderRepository extends JpaRepository<Stakeholder, Long> {

	List<Stakeholder> findByOrganizacaoId(Long organizacaoId);
}

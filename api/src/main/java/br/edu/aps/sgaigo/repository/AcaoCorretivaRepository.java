package br.edu.aps.sgaigo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.edu.aps.sgaigo.model.AcaoCorretiva;

public interface AcaoCorretivaRepository extends JpaRepository<AcaoCorretiva, Long> {

	List<AcaoCorretiva> findByNaoConformidadeId(Long naoConformidadeId);
}

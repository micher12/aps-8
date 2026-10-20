package br.edu.aps.sgaigo.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.edu.aps.sgaigo.model.LicencaAmbiental;

public interface LicencaRepository extends JpaRepository<LicencaAmbiental, Long> {

	List<LicencaAmbiental> findByOrganizacaoId(Long organizacaoId);

	List<LicencaAmbiental> findByDataValidadeLessThanEqual(LocalDate limite);
}

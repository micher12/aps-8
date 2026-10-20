package br.edu.aps.sgaigo.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import br.edu.aps.sgaigo.model.Residuo;

public interface ResiduoRepository extends JpaRepository<Residuo, Long> {

	Page<Residuo> findByOrganizacaoId(Long organizacaoId, Pageable pageable);

	List<Residuo> findByOrganizacaoId(Long organizacaoId);
}

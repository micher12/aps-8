package br.edu.aps.sgaigo.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import br.edu.aps.sgaigo.model.Monitoramento;

public interface MonitoramentoRepository extends JpaRepository<Monitoramento, Long> {

	Page<Monitoramento> findByOrganizacaoId(Long organizacaoId, Pageable pageable);

	List<Monitoramento> findByOrganizacaoIdOrderByDataMedicao(Long organizacaoId);

	List<Monitoramento> findTopByOrganizacaoIdOrderByDataMedicaoDesc(Long organizacaoId, org.springframework.data.domain.Pageable p);
}

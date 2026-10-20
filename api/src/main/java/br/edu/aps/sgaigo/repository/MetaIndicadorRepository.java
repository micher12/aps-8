package br.edu.aps.sgaigo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.edu.aps.sgaigo.model.MetaIndicador;
import br.edu.aps.sgaigo.model.Monitoramento.Tipo;

public interface MetaIndicadorRepository extends JpaRepository<MetaIndicador, Long> {

	List<MetaIndicador> findByOrganizacaoIdAndAno(Long organizacaoId, short ano);

	MetaIndicador findByOrganizacaoIdAndTipoAndAno(Long organizacaoId, Tipo tipo, short ano);
}

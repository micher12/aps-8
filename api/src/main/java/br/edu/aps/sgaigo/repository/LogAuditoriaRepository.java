package br.edu.aps.sgaigo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.edu.aps.sgaigo.model.LogAuditoria;

public interface LogAuditoriaRepository extends JpaRepository<LogAuditoria, Long> {
}

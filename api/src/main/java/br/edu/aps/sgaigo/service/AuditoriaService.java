package br.edu.aps.sgaigo.service;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import br.edu.aps.sgaigo.model.LogAuditoria;
import br.edu.aps.sgaigo.repository.LogAuditoriaRepository;

@Service
public class AuditoriaService {

	private final LogAuditoriaRepository logs;

	public AuditoriaService(LogAuditoriaRepository logs) {
		this.logs = logs;
	}

	public void registrar(String entidade, String acao, String descricao) {
		String usuario = usuarioAtual();
		registrar(usuario, entidade, acao, descricao);
	}

	public void registrar(String usuario, String entidade, String acao, String descricao) {
		logs.save(new LogAuditoria(usuario, entidade, acao, descricao));
	}

	private String usuarioAtual() {
		var auth = SecurityContextHolder.getContext().getAuthentication();
		return auth != null && auth.isAuthenticated() ? auth.getName() : "sistema";
	}
}

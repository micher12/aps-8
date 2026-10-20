package br.edu.aps.sgaigo.service;

import br.edu.aps.sgaigo.model.Monitoramento;

/**
 * Abstração de publicação de eventos em tempo real (DIP).
 * Implementada por WebSocketBroadcaster no pacote websocket.
 */
public interface RealtimePublisher {

	void publicarMonitoramento(Monitoramento m);

	void publicarAlerta(String tipo, String mensagem, Long organizacaoId);

	void publicarQualidadeAr(Integer codigoIbge, Double pm25, String classificacao);

	void publicarQueimadas(int totalFocos);
}

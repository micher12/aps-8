package br.edu.aps.sgaigo.websocket;

import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import br.edu.aps.sgaigo.model.Monitoramento;
import br.edu.aps.sgaigo.service.RealtimePublisher;

@Component
public class WebSocketBroadcaster implements RealtimePublisher {

	private final SimpMessagingTemplate messaging;

	public WebSocketBroadcaster(SimpMessagingTemplate messaging) {
		this.messaging = messaging;
	}

	@Override
	public void publicarMonitoramento(Monitoramento m) {
		Map<String, Object> payload = Map.of("tipo", "NOVA_MEDICAO",
				"organizacaoId", m.getOrganizacao().getId(),
				"tipoMedicao", m.getTipo().name(),
				"valor", m.getValor(),
				"unidade", m.getUnidade(),
				"dataMedicao", m.getDataMedicao().toString(),
				"timestamp", LocalDateTime.now().toString());
		messaging.convertAndSend("/topic/monitoramentos/" + m.getOrganizacao().getId(), (Object) payload);
	}

	@Override
	public void publicarAlerta(String tipo, String mensagem, Long organizacaoId) {
		java.util.Map<String, Object> payload = new java.util.HashMap<>();
		payload.put("tipo", tipo);
		payload.put("mensagem", mensagem);
		payload.put("timestamp", LocalDateTime.now().toString());
		if (organizacaoId != null) payload.put("organizacaoId", organizacaoId);
		messaging.convertAndSend("/topic/alertas", (Object) payload);
	}

	@Override
	public void publicarQualidadeAr(Integer codigoIbge, Double pm25, String classificacao) {
		Map<String, Object> payload = Map.of(
				"codigoIbge", codigoIbge,
				"pm25", pm25,
				"classificacao", classificacao,
				"timestamp", LocalDateTime.now().toString());
		messaging.convertAndSend("/topic/qualidade-ar", (Object) payload);
	}

	@Override
	public void publicarQueimadas(int totalFocos) {
		Map<String, Object> payload = Map.of(
				"totalFocos", totalFocos,
				"timestamp", LocalDateTime.now().toString());
		messaging.convertAndSend("/topic/queimadas", (Object) payload);
	}
}

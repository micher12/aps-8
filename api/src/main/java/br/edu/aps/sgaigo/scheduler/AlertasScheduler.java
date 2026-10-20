package br.edu.aps.sgaigo.scheduler;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import br.edu.aps.sgaigo.integration.QualidadeArClient;
import br.edu.aps.sgaigo.integration.QueimadasClient;
import br.edu.aps.sgaigo.model.LicencaAmbiental;
import br.edu.aps.sgaigo.repository.LicencaRepository;
import br.edu.aps.sgaigo.service.RealtimePublisher;

/**
 * Jobs agendados (SRP: apenas orquestram; a regra permanece nos services).
 * Todos publicam nos canais WebSocket descritos na seção 8 do plano.
 */
@Component
public class AlertasScheduler {

    private static final Logger log = LoggerFactory.getLogger(AlertasScheduler.class);

    private final LicencaRepository licencas;
    private final QualidadeArClient qualidadeAr;
    private final QueimadasClient queimadas;
    private final RealtimePublisher publisher;

    /** Snapshot das queimadas é guardado in-memory; o backend pode ser reiniciado sem assalto. */
    private final Set<String> focosConhecidos = ConcurrentHashMap.newKeySet();

    public AlertasScheduler(LicencaRepository licencas, QualidadeArClient qualidadeAr,
            QueimadasClient queimadas, RealtimePublisher publisher) {
        this.licencas = licencas;
        this.qualidadeAr = qualidadeAr;
        this.queimadas = queimadas;
        this.publisher = publisher;
    }

    /** Alertas diários de licenças vencidas/vencendo em 30 dias → /topic/alertas. */
    @Scheduled(cron = "0 0 8 * * *")
    public void verificarLicencas() {
        List<LicencaAmbiental> criticas = licencas
                .findByDataValidadeLessThanEqual(LocalDate.now().plusDays(30));
        for (LicencaAmbiental l : criticas) {
            String status = l.vencida() ? "VENCIDA" : "VENCENDO";
            publisher.publicarAlerta("LICENCA",
                    status + " (" + Math.abs(l.diasParaVencimento()) + "d): " + l.getNumero(),
                    l.getOrganizacao().getId());
        }
        log.info("Scheduler licenças: {} alerta(s) publicado(s)", criticas.size());
    }

    /** Qualidade do ar atualizada a cada hora → /topic/qualidade-ar. */
    @Scheduled(fixedRate = 3_600_000, initialDelay = 60_000)
    public void verificarQualidadeAr() {
        var resultado = qualidadeAr.buscarPorMunicipio(5208707); // Goiânia
        if (!resultado.dadosIndisponiveis()) {
            publisher.publicarQualidadeAr(resultado.codigoIbge(), resultado.pm25(), resultado.classificacao());
            log.debug("Qualidade do ar publicada (Goiânia): PM2.5={}", resultado.pm25());
        }
    }

    /**
     * Focos de queimadas em GO a cada 30 min → /topic/queimadas.
     * Primeira execução: registra sem notificar (a mapa já está completo); depois só dispara
     * quando chegam focos NOVOS (delta) — evita redundância do polling do satellite.
     */
    @Scheduled(fixedRate = 1_800_000, initialDelay = 120_000)
    public void verificarQueimadas() {
        var resultado = queimadas.focos();
        if (resultado.dadosIndisponiveis()) return;

        Set<String> agora = new HashSet<>();
        for (var f : resultado.focos()) {
            agora.add(QueimadasClient.chaveFoco(f));
        }

        int novos = (int) agora.stream().filter(chave -> !focosConhecidos.contains(chave)).count();
        focosConhecidos.clear();
        focosConhecidos.addAll(agora);

        publisher.publicarQueimadas(resultado.total());
        if (novos > 0 && !focosConhecidos.isEmpty() && resultado.total() > 0) {
            publisher.publicarAlerta("QUEIMADAS",
                    novos + " novo(s) foco(s) de queimada em GO", null);
            log.info("Queimadas: {} foco(s) novo(s) nas últimas 30min", novos);
        }
    }
}

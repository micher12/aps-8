package br.edu.aps.sgaigo.integration;

import java.net.URI;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

/**
 * Cliente da NASA FIRMS — focos de queimadas do VIIRS (em tempo quase real).
 * Gratuito (MAP_KEY em firms.modaps.eosdis.nasa.gov).
 * Estratégia: consulta o endpoint de área já com o bbox de Goiás na URL
 * (bbox literal via URI.create: evita que o RestClient recodifique as vírgulas —
 * era a origem do 400 "Invalid area") e refiltra localmente por segurança.
 */
@Component
public class QueimadasClient {

    private static final Logger log = LoggerFactory.getLogger(QueimadasClient.class);

    /** Bounding box do estado de Goiás (west, south, east, north) — cobre o estado inteiro. */
    private static final double GO_WEST = -53.5;
    private static final double GO_SOUTH = -19.5;
    private static final double GO_EAST = -45.7;
    private static final double GO_NORTH = -12.3;
    private static final String GO_BBOX = GO_WEST + "," + GO_SOUTH + "," + GO_EAST + "," + GO_NORTH;

    private static final String FONTE = "VIIRS_SNPP_NRT";

    private final RestClient rest;
    private final String mapKey;

    public QueimadasClient(@Value("${sgaigo.firms-map-key:}") String mapKey) {
        this.mapKey = mapKey;
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(Duration.ofSeconds(5));
        factory.setReadTimeout(Duration.ofSeconds(20));
        this.rest = RestClient.builder().requestFactory(factory).build();
    }

    @Cacheable(value = "queimadas", key = "'goias-cerrado'",
            unless = "#result != null && #result.dadosIndisponiveis()")
    public QueimadasResponse focos() {
        if (mapKey == null || mapKey.isBlank()) {
            log.debug("MAP_KEY da FIRMS não configurada; retornando fallback vazio");
            return QueimadasResponse.indisponivel();
        }
        try {

            String csv = rest.get()
                    .uri(URI.create("https://firms.modaps.eosdis.nasa.gov/api/area/csv/"
                            + mapKey + "/" + FONTE + "/" + GO_BBOX + "/1"))
                    .retrieve()
                    .body(String.class);
            List<FocoQueimada> noGoias = parsear(csv);
            log.info("FIRMS: {} foco(s) dentro de Goiás", noGoias.size());
            return new QueimadasResponse(noGoias, false);
        } catch (Exception e) {
            log.warn("Falha ao consultar NASA FIRMS: {}", e.getMessage());
            return QueimadasResponse.indisponivel();
        }
    }

    /**
     * Header VIIRS_SNPP_NRT: latitude,longitude,bright_ti4,scan,track,acq_date,acq_time,
     * satellite,instrument,confidence,version,bright_ti5,frp,daynight
     */
    private List<FocoQueimada> parsear(String csv) {
        List<FocoQueimada> focos = new ArrayList<>();
        if (csv == null || csv.isBlank()) return focos;
        String[] linhas = csv.split("\n");
        for (int i = 1; i < linhas.length; i++) {
            String[] c = linhas[i].trim().split(",");
            if (c.length < 13) continue;
            try {
                double lat = Double.parseDouble(c[0]);
                double lon = Double.parseDouble(c[1]);
                if (lat < GO_SOUTH || lat > GO_NORTH || lon < GO_WEST || lon > GO_EAST) continue;
                String hora = c[6].trim().replaceAll("\\D", "");
                hora = String.format("%4s", hora).replace(' ', '0'); // "512" -> "0512"
                String dataHora = c[5] + "T" + hora.substring(0, 2) + ":" + hora.substring(2);
                focos.add(new FocoQueimada(lat, lon, c[12], c[7], dataHora));
            } catch (Exception ignored) {
                // linha malformada — ignora
            }
        }
        return focos;
    }

    public static String chaveFoco(FocoQueimada f) {
        return f.latitude() + "|" + f.longitude() + "|" + f.dataHora();
    }

    public record FocoQueimada(Double latitude, Double longitude, String brilho, String satelite,
            String dataHora) {}

    public record QueimadasResponse(List<FocoQueimada> focos, boolean dadosIndisponiveis) {
        public int total() {
            return focos != null ? focos.size() : 0;
        }

        public static QueimadasResponse indisponivel() {
            return new QueimadasResponse(List.of(), true);
        }
    }
}

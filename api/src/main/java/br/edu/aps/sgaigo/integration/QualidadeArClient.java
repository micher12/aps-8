package br.edu.aps.sgaigo.integration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * Fachada de qualidade do ar por município com fallback resiliente.
 * Respostas válidas ficam em cache de 1h em {@link OpenMeteoAqClient};
 * falhas NÃO são cacheadas — a próxima requisição tenta novamente e, se o
 * serviço externo continuar fora, retorna dadosIndisponiveis=true.
 */
@Component
public class QualidadeArClient {

	private static final Logger log = LoggerFactory.getLogger(QualidadeArClient.class);

	private final OpenMeteoAqClient openMeteo;

	public QualidadeArClient(OpenMeteoAqClient openMeteo) {
		this.openMeteo = openMeteo;
	}

	public QualidadeArResponse buscarPorMunicipio(Integer codigoIbge) {
		try {
			return openMeteo.buscarPorMunicipio(codigoIbge);
		} catch (Exception e) {
			log.warn("Falha ao obter qualidade do ar para município {}: {}", codigoIbge, causaRaiz(e));
			return indisponivel(codigoIbge);
		}
	}

	/** Em sync o cache embrulha a exceção (ValueRetrievalException); desembrulha p/ log útil. */
	private static String causaRaiz(Throwable e) {
		Throwable raiz = e;
		while (raiz.getCause() != null) {
			raiz = raiz.getCause();
		}
		return raiz.getMessage() != null ? raiz.getMessage() : e.toString();
	}

	private QualidadeArResponse indisponivel(Integer codigoIbge) {
		return new QualidadeArResponse(codigoIbge, null, null, null, null, "INDISPONIVEL", true);
	}

	public record QualidadeArResponse(Integer codigoIbge, Double pm25, Double pm10, Double co,
			Double o3, String classificacao, boolean dadosIndisponiveis) {}
}

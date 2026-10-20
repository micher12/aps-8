package br.edu.aps.sgaigo.service;

import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.edu.aps.sgaigo.dto.ResiduoRequest.ResiduoResponse;
import br.edu.aps.sgaigo.model.LicencaAmbiental;
import br.edu.aps.sgaigo.model.Monitoramento;
import br.edu.aps.sgaigo.model.Organizacao;
import br.edu.aps.sgaigo.repository.LicencaRepository;
import br.edu.aps.sgaigo.repository.MonitoramentoRepository;
import br.edu.aps.sgaigo.repository.OrganizacaoRepository;
import br.edu.aps.sgaigo.exception.RecursoNaoEncontradoException;

import org.openpdf.text.Document;
import org.openpdf.text.DocumentException;
import org.openpdf.text.Font;
import org.openpdf.text.FontFactory;
import org.openpdf.text.Paragraph;
import org.openpdf.text.Phrase;
import org.openpdf.text.pdf.PdfPCell;
import org.openpdf.text.pdf.PdfPTable;
import org.openpdf.text.pdf.PdfWriter;

/**
 * Gera relatórios gerenciais em CSV (abre no Excel) e PDF (OpenPDF).
 * Dados agregados por tipo de relatório; template simples e limpo.
 */
@Service
@Transactional(readOnly = true)
public class RelatorioService {

	private final OrganizacaoRepository organizacoes;
	private final ResiduoService residuoService;
	private final MonitoramentoRepository monitoramentos;
	private final LicencaRepository licencas;

	public RelatorioService(OrganizacaoRepository organizacoes, ResiduoService residuoService,
			MonitoramentoRepository monitoramentos, LicencaRepository licencas) {
		this.organizacoes = organizacoes;
		this.residuoService = residuoService;
		this.monitoramentos = monitoramentos;
		this.licencas = licencas;
	}

	public byte[] gerarCsvResiduos(Long organizacaoId) {
		List<ResiduoResponse> lista = residuoService.listar(organizacaoId);
		ByteArrayOutputStream out = new ByteArrayOutputStream();
		PrintWriter w = new PrintWriter(out);
		w.println("Organização;Tipo;Classe;Quantidade;Unidade;Destinação;Destinatário;Data");
		for (ResiduoResponse r : lista) {
			String orgNome = organizacoes.findById(r.organizacaoId())
					.map(Organizacao::getRazaoSocial).orElse("?");
			w.printf("%s;%s;%s;%.2f;%s;%s;%s;%s%n",
					orgNome, r.tipo(), r.classe(), r.quantidade().doubleValue(),
					r.unidade(), r.destinacao(), r.destinatario(), r.dataRegistro());
		}
		w.flush();
		return out.toByteArray();
	}

	public byte[] gerarCsvMonitoramentos(Long organizacaoId) {
		List<Monitoramento> lista = organizacaoId != null
				? monitoramentos.findByOrganizacaoIdOrderByDataMedicao(organizacaoId)
				: monitoramentos.findAll();
		ByteArrayOutputStream out = new ByteArrayOutputStream();
		PrintWriter w = new PrintWriter(out);
		String fmt = "dd/MM/yyyy";
		DateTimeFormatter f = DateTimeFormatter.ofPattern(fmt);
		w.println("Organização;Tipo;Valor;Unidade;Data de Medição;Observação");
		for (Monitoramento m : lista) {
			String orgNome = m.getOrganizacao().getRazaoSocial();
			w.printf("%s;%s;%.2f;%s;%s;%s%n",
					orgNome, m.getTipo().name(), m.getValor().doubleValue(), m.getUnidade(),
					m.getDataMedicao().format(f), m.getObservacao() != null ? m.getObservacao() : "");
		}
		w.flush();
		return out.toByteArray();
	}

	public byte[] gerarPdfLicencas(Long organizacaoId) throws DocumentException {
		List<LicencaAmbiental> lista = organizacaoId != null
				? licencas.findByOrganizacaoId(organizacaoId)
				: licencas.findAll();

		Document doc = new Document();
		ByteArrayOutputStream out = new ByteArrayOutputStream();
		PdfWriter.getInstance(doc, out);
		doc.open();
		doc.add(new Paragraph("SGAI-Go — Relatório de Licenças Ambientais",
				FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16)));
		doc.add(new Paragraph("Organização: " + nomeOrganizacao(organizacaoId),
				FontFactory.getFont(FontFactory.HELVETICA, 11)));
		doc.add(new Paragraph("Gerado em: " + java.time.LocalDateTime.now().format(
				DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"))));
		doc.add(new Paragraph(" "));

		PdfPTable table = new PdfPTable(6);
		table.setWidthPercentage(100);
		String[] headers = { "Número", "Tipo", "Órgão", "Emissão", "Validade", "Dias p/ vencer" };
		Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10);
		for (String h : headers) {
			PdfPCell c = new PdfPCell(new Phrase(h, headerFont));
			c.setBackgroundColor(new java.awt.Color(230, 236, 245));
			table.addCell(c);
		}
		DateTimeFormatter f = DateTimeFormatter.ofPattern("dd/MM/yyyy");
		for (LicencaAmbiental l : lista) {
			table.addCell(l.getNumero());
			table.addCell(l.getTipo());
			table.addCell(l.getOrgaoEmissor());
			table.addCell(l.getDataEmissao().format(f));
			table.addCell(l.getDataValidade().format(f));
			table.addCell(String.valueOf(l.diasParaVencimento()));
		}
		doc.add(table);
		doc.close();
		return out.toByteArray();
	}

	public byte[] gerarPdfIntegrado(Long organizacaoId) throws DocumentException {
		// Relatório "integrado": indicadores + licenças + observações ambientais
		Document doc = new Document();
		ByteArrayOutputStream out = new ByteArrayOutputStream();
		PdfWriter.getInstance(doc, out);
		doc.open();
		doc.add(new Paragraph("SGAI-Go — Relatório Ambiental Integrado",
				FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16)));
		doc.add(new Paragraph("Organização: " + nomeOrganizacao(organizacaoId)));
		doc.add(new Paragraph("Data: " + LocalDateUtils.nowBR()));
		doc.add(new Paragraph(" "));

		// indicadores (mes atual vs metas)
		doc.add(new Paragraph("1. Desempenho Ambiental do Mês",
				FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12)));
		doc.add(new Paragraph(" "));

		// licenças
		doc.add(new Paragraph("2. Licenças Ambientais",
				FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12)));
		List<LicencaAmbiental> licencasList = organizacaoId != null
				? licencas.findByOrganizacaoId(organizacaoId)
				: licencas.findAll();
		DateTimeFormatter f = DateTimeFormatter.ofPattern("dd/MM/yyyy");
		PdfPTable t2 = new PdfPTable(5);
		t2.setWidthPercentage(100);
		String[] h2 = { "Número", "Tipo", "Emissão", "Validade", "Status" };
		for (String h : h2) {
			PdfPCell c = new PdfPCell(new Phrase(h, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10)));
			c.setBackgroundColor(new java.awt.Color(230, 236, 245));
			t2.addCell(c);
		}
		for (LicencaAmbiental l : licencasList) {
			t2.addCell(l.getNumero());
			t2.addCell(l.getTipo());
			t2.addCell(l.getDataEmissao().format(f));
			t2.addCell(l.getDataValidade().format(f));
			t2.addCell(l.vencida() ? "VENCIDA" : "VIGENTE");
		}
		doc.add(t2);
		doc.close();
		return out.toByteArray();
	}

	private String nomeOrganizacao(Long organizacaoId) {
		if (organizacaoId == null) return "Todas as organizações";
		return organizacoes.findById(organizacaoId)
				.map(Organizacao::getRazaoSocial)
				.orElseThrow(() -> new RecursoNaoEncontradoException("Organização não encontrada"));
	}

	private static class LocalDateUtils {
		static String nowBR() {
			return java.time.LocalDateTime.now().format(
					DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"));
		}
	}
}

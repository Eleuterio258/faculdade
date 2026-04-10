package com.construction.gestao.service;

import com.construction.gestao.model.*;
import com.construction.gestao.repository.*;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ExportService {
    
    private final ReportService reportService;
    private final ObraRepository obraRepository;
    private final CustoRepository custoRepository;
    private final MaterialRepository materialRepository;
    private final PresencaRepository presencaRepository;
    
    @Transactional(readOnly = true)
    public ByteArrayInputStream exportObraRelatorioToPDF(Long obraId) {
        Map<String, Object> relatorio = reportService.gerarRelatorioObra(obraId);
        Obra obra = (Obra) relatorio.get("obra");
        
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(out);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);
        
        try {
            // Title
            Paragraph title = new Paragraph("Relatório da Obra: " + obra.getNome())
                    .setBold()
                    .setFontSize(18)
                    .setTextAlignment(TextAlignment.CENTER);
            document.add(title);
            
            // Section: General Data
            document.add(new Paragraph("Dados Gerais")
                    .setBold()
                    .setFontSize(14)
                    .setFontColor(ColorConstants.BLUE)
                    .setMarginTop(20));
            
            Table dadosTable = new Table(2);
            dadosTable.addCell(new com.itextpdf.layout.element.Cell().add(new Paragraph("Nome:")).setBold());
            dadosTable.addCell(new com.itextpdf.layout.element.Cell().add(new Paragraph(obra.getNome())));
            dadosTable.addCell(new com.itextpdf.layout.element.Cell().add(new Paragraph("Status:")).setBold());
            dadosTable.addCell(new com.itextpdf.layout.element.Cell().add(new Paragraph(obra.getStatus().toString())));
            dadosTable.addCell(new com.itextpdf.layout.element.Cell().add(new Paragraph("Início:")).setBold());
            dadosTable.addCell(new com.itextpdf.layout.element.Cell().add(new Paragraph(obra.getDataInicio().toString())));
            dadosTable.addCell(new com.itextpdf.layout.element.Cell().add(new Paragraph("Término Previsto:")).setBold());
            dadosTable.addCell(new com.itextpdf.layout.element.Cell().add(new Paragraph(obra.getDataFimPrevista() != null ? obra.getDataFimPrevista().toString() : "N/A")));
            dadosTable.addCell(new com.itextpdf.layout.element.Cell().add(new Paragraph("Orçamento:")).setBold());
            dadosTable.addCell(new com.itextpdf.layout.element.Cell().add(new Paragraph(formatMoney(obra.getOrcamentoPrevisto()))));
            dadosTable.addCell(new com.itextpdf.layout.element.Cell().add(new Paragraph("Custo Realizado:")).setBold());
            dadosTable.addCell(new com.itextpdf.layout.element.Cell().add(new Paragraph(formatMoney(obra.getCustoRealizado()))));
            dadosTable.addCell(new com.itextpdf.layout.element.Cell().add(new Paragraph("Progresso:")).setBold());
            dadosTable.addCell(new com.itextpdf.layout.element.Cell().add(new Paragraph(obra.getPercentualConclusao() + "%")));
            
            document.add(dadosTable);
            
            // Section: Financial
            Map<String, Object> financas = (Map<String, Object>) relatorio.get("financas");
            document.add(new Paragraph("Resumo Financeiro")
                    .setBold()
                    .setFontSize(14)
                    .setFontColor(ColorConstants.BLUE)
                    .setMarginTop(20));
            
            Table financasTable = new Table(2);
            financasTable.addCell(new com.itextpdf.layout.element.Cell().add(new Paragraph("Orçamento Previsto:")).setBold());
            financasTable.addCell(new com.itextpdf.layout.element.Cell().add(new Paragraph(formatMoney((BigDecimal) financas.get("orcamentoPrevisto")))));
            financasTable.addCell(new com.itextpdf.layout.element.Cell().add(new Paragraph("Custo Realizado:")).setBold());
            financasTable.addCell(new com.itextpdf.layout.element.Cell().add(new Paragraph(formatMoney((BigDecimal) financas.get("custoRealizado")))));
            financasTable.addCell(new com.itextpdf.layout.element.Cell().add(new Paragraph("Desvio:")).setBold());
            financasTable.addCell(new com.itextpdf.layout.element.Cell().add(new Paragraph(formatMoney((BigDecimal) financas.get("desvio")))));
            
            document.add(financasTable);
            
            // Section: Materials
            Map<String, Object> materiais = (Map<String, Object>) relatorio.get("materiais");
            document.add(new Paragraph("Resumo de Materiais")
                    .setBold()
                    .setFontSize(14)
                    .setFontColor(ColorConstants.BLUE)
                    .setMarginTop(20));
            
            Table materiaisTable = new Table(2);
            materiaisTable.addCell(new com.itextpdf.layout.element.Cell().add(new Paragraph("Total de Materiais:")).setBold());
            materiaisTable.addCell(new com.itextpdf.layout.element.Cell().add(new Paragraph(materiais.get("totalMateriais").toString())));
            materiaisTable.addCell(new com.itextpdf.layout.element.Cell().add(new Paragraph("Stock Crítico:")).setBold());
            materiaisTable.addCell(new com.itextpdf.layout.element.Cell().add(new Paragraph(materiais.get("materiaisStockCritico").toString())));
            materiaisTable.addCell(new com.itextpdf.layout.element.Cell().add(new Paragraph("Valor Total em Stock:")).setBold());
            materiaisTable.addCell(new com.itextpdf.layout.element.Cell().add(new Paragraph(formatMoney((BigDecimal) materiais.get("valorTotalStock")))));
            
            document.add(materiaisTable);
            
            // Section: Occurrences
            Map<String, Object> ocorrencias = (Map<String, Object>) relatorio.get("ocorrencias");
            document.add(new Paragraph("Ocorrências")
                    .setBold()
                    .setFontSize(14)
                    .setFontColor(ColorConstants.BLUE)
                    .setMarginTop(20));
            
            Table ocorrenciasTable = new Table(2);
            ocorrenciasTable.addCell(new com.itextpdf.layout.element.Cell().add(new Paragraph("Total:")).setBold());
            ocorrenciasTable.addCell(new com.itextpdf.layout.element.Cell().add(new Paragraph(ocorrencias.get("totalOcorrencias").toString())));
            ocorrenciasTable.addCell(new com.itextpdf.layout.element.Cell().add(new Paragraph("Abertas:")).setBold());
            ocorrenciasTable.addCell(new com.itextpdf.layout.element.Cell().add(new Paragraph(ocorrencias.get("abertas").toString())));
            ocorrenciasTable.addCell(new com.itextpdf.layout.element.Cell().add(new Paragraph("Em Resolução:")).setBold());
            ocorrenciasTable.addCell(new com.itextpdf.layout.element.Cell().add(new Paragraph(ocorrencias.get("emAnalise").toString())));
            ocorrenciasTable.addCell(new com.itextpdf.layout.element.Cell().add(new Paragraph("Resolvidas:")).setBold());
            ocorrenciasTable.addCell(new com.itextpdf.layout.element.Cell().add(new Paragraph(ocorrencias.get("resolvidas").toString())));
            
            document.add(ocorrenciasTable);
            
            document.close();
            return new ByteArrayInputStream(out.toByteArray());
        } catch (Exception e) {
            throw new RuntimeException("Erro ao gerar PDF: " + e.getMessage(), e);
        }
    }
    
    @Transactional(readOnly = true)
    public ByteArrayInputStream exportCustosToExcel(Long obraId) {
        Obra obra = obraRepository.findById(obraId)
                .orElseThrow(() -> new RuntimeException("Obra não encontrada"));
        
        List<Custo> custos = custoRepository.findByObra(obra);
        
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        
        try (Workbook workbook = new XSSFWorkbook()) {
            org.apache.poi.ss.usermodel.Sheet sheet = workbook.createSheet("Custos da Obra");
            
            // Header
            Row headerRow = sheet.createRow(0);
            String[] headers = {"ID", "Descrição", "Tipo", "Valor", "Data", "Observações", "Responsável"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                CellStyle style = workbook.createCellStyle();
                Font font = workbook.createFont();
                font.setBold(true);
                style.setFont(font);
                cell.setCellStyle(style);
            }
            
            // Data
            int rowNum = 1;
            for (Custo custo : custos) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(custo.getId());
                row.createCell(1).setCellValue(custo.getDescricao());
                row.createCell(2).setCellValue(custo.getTipo().toString());
                row.createCell(3).setCellValue(custo.getValor().doubleValue());
                row.createCell(4).setCellValue(custo.getData().toString());
                row.createCell(5).setCellValue(custo.getObservacoes() != null ? custo.getObservacoes() : "");
                row.createCell(6).setCellValue(custo.getResponsavel() != null ? custo.getResponsavel().getNome() : "");
            }
            
            // Auto-size columns
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }
            
            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (IOException e) {
            throw new RuntimeException("Erro ao gerar Excel: " + e.getMessage(), e);
        }
    }
    
    @Transactional(readOnly = true)
    public ByteArrayInputStream exportMateriaisToExcel(Long obraId) {
        Obra obra = obraRepository.findById(obraId)
                .orElseThrow(() -> new RuntimeException("Obra não encontrada"));
        
        List<Material> materiais = materialRepository.findByObra(obra);
        
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        
        try (Workbook workbook = new XSSFWorkbook()) {
            org.apache.poi.ss.usermodel.Sheet sheet = workbook.createSheet("Materiais");
            
            Row headerRow = sheet.createRow(0);
            String[] headers = {"ID", "Nome", "Descrição", "Unidade", "Qtd. Stock", "Qtd. Mínima", "Preço Unitário", "Valor Total", "Stock Crítico"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                CellStyle style = workbook.createCellStyle();
                Font font = workbook.createFont();
                font.setBold(true);
                style.setFont(font);
                cell.setCellStyle(style);
            }
            
            int rowNum = 1;
            for (Material material : materiais) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(material.getId());
                row.createCell(1).setCellValue(material.getNome());
                row.createCell(2).setCellValue(material.getDescricao() != null ? material.getDescricao() : "");
                row.createCell(3).setCellValue(material.getUnidade());
                row.createCell(4).setCellValue(material.getQuantidadeEstoque().doubleValue());
                row.createCell(5).setCellValue(material.getQuantidadeMinima().doubleValue());
                row.createCell(6).setCellValue(material.getPrecoUnitario() != null ? material.getPrecoUnitario().doubleValue() : 0.0);
                
                BigDecimal valorTotal = material.getQuantidadeEstoque().multiply(
                        material.getPrecoUnitario() != null ? material.getPrecoUnitario() : BigDecimal.ZERO);
                row.createCell(7).setCellValue(valorTotal.doubleValue());
                
                boolean stockCritico = material.getQuantidadeEstoque().compareTo(material.getQuantidadeMinima()) <= 0;
                row.createCell(8).setCellValue(stockCritico ? "SIM" : "NÃO");
            }
            
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }
            
            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (IOException e) {
            throw new RuntimeException("Erro ao gerar Excel: " + e.getMessage(), e);
        }
    }
    
    @Transactional(readOnly = true)
    public ByteArrayInputStream exportPresencasToExcel(LocalDate inicio, LocalDate fim) {
        List<Presenca> presencas = presencaRepository.findByDataBetween(inicio, fim);
        
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        
        try (Workbook workbook = new XSSFWorkbook()) {
            org.apache.poi.ss.usermodel.Sheet sheet = workbook.createSheet("Presenças");
            
            Row headerRow = sheet.createRow(0);
            String[] headers = {"ID", "Equipa", "Trabalhador", "Data", "Horas Trabalhadas", "Presente", "Observações"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                CellStyle style = workbook.createCellStyle();
                Font font = workbook.createFont();
                font.setBold(true);
                style.setFont(font);
                cell.setCellStyle(style);
            }
            
            int rowNum = 1;
            for (Presenca presenca : presencas) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(presenca.getId());
                row.createCell(1).setCellValue(presenca.getEquipa().getNome());
                row.createCell(2).setCellValue(presenca.getTrabalhador().getNome());
                row.createCell(3).setCellValue(presenca.getData().toString());
                row.createCell(4).setCellValue(presenca.getHorasTrabalhadas() != null ? presenca.getHorasTrabalhadas() : 0);
                row.createCell(5).setCellValue(presenca.getPresente() ? "SIM" : "NÃO");
                row.createCell(6).setCellValue(presenca.getObservacoes() != null ? presenca.getObservacoes() : "");
            }
            
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }
            
            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (IOException e) {
            throw new RuntimeException("Erro ao gerar Excel: " + e.getMessage(), e);
        }
    }
    
    private String formatMoney(BigDecimal value) {
        if (value == null) return "N/A";
        return String.format("R$ %,10.2f", value);
    }
}

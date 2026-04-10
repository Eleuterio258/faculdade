package com.construction.gestao.controller;

import com.construction.gestao.service.ExportService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/export")
@RequiredArgsConstructor
public class ExportController {
    
    private final ExportService exportService;
    
    @GetMapping("/obra/{obraId}/pdf")
    @PreAuthorize("hasAnyRole('EMPREITEIRO', 'ENGENHEIRO', 'GESTOR_MATERIAIS', 'TECNICO_OBRA')")
    public ResponseEntity<byte[]> exportObraRelatorioPDF(@PathVariable Long obraId) {
        byte[] pdfContent = exportService.exportObraRelatorioToPDF(obraId).readAllBytes();
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "relatorio_obra_" + obraId + ".pdf");
        
        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfContent);
    }
    
    @GetMapping("/obra/{obraId}/custos/excel")
    @PreAuthorize("hasAnyRole('EMPREITEIRO', 'ENGENHEIRO')")
    public ResponseEntity<byte[]> exportCustosExcel(@PathVariable Long obraId) {
        byte[] excelContent = exportService.exportCustosToExcel(obraId).readAllBytes();
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
        headers.setContentDispositionFormData("attachment", "custos_obra_" + obraId + ".xlsx");
        
        return ResponseEntity.ok()
                .headers(headers)
                .body(excelContent);
    }
    
    @GetMapping("/obra/{obraId}/materiais/excel")
    @PreAuthorize("hasAnyRole('EMPREITEIRO', 'GESTOR_MATERIAIS')")
    public ResponseEntity<byte[]> exportMateriaisExcel(@PathVariable Long obraId) {
        byte[] excelContent = exportService.exportMateriaisToExcel(obraId).readAllBytes();
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
        headers.setContentDispositionFormData("attachment", "materiais_obra_" + obraId + ".xlsx");
        
        return ResponseEntity.ok()
                .headers(headers)
                .body(excelContent);
    }
    
    @GetMapping("/presencas/excel")
    @PreAuthorize("hasAnyRole('EMPREITEIRO', 'ENGENHEIRO', 'TECNICO_OBRA')")
    public ResponseEntity<byte[]> exportPresencasExcel(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fim) {
        byte[] excelContent = exportService.exportPresencasToExcel(inicio, fim).readAllBytes();
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
        headers.setContentDispositionFormData("attachment", "presencas_" + inicio + "_ate_" + fim + ".xlsx");
        
        return ResponseEntity.ok()
                .headers(headers)
                .body(excelContent);
    }
}

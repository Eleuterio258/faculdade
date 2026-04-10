package com.construction.gestao.controller;

import com.construction.gestao.model.Obra;
import com.construction.gestao.repository.ObraRepository;
import com.construction.gestao.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/relatorios")
@RequiredArgsConstructor
public class ReportController {
    
    private final ReportService reportService;
    private final ObraRepository obraRepository;
    
    @GetMapping("/obra/{obraId}")
    @PreAuthorize("hasAnyRole('EMPREITEIRO', 'ENGENHEIRO', 'GESTOR_MATERIAIS', 'TECNICO_OBRA')")
    public ResponseEntity<Map<String, Object>> gerarRelatorioObra(@PathVariable Long obraId) {
        Map<String, Object> relatorio = reportService.gerarRelatorioObra(obraId);
        return ResponseEntity.ok(relatorio);
    }
    
    @GetMapping("/obra/{obraId}/dados-gerais")
    @PreAuthorize("hasAnyRole('EMPREITEIRO', 'ENGENHEIRO', 'GESTOR_MATERIAIS', 'TECNICO_OBRA')")
    public ResponseEntity<Map<String, Object>> getDadosGerais(@PathVariable Long obraId) {
        Obra obra = obraRepository.findById(obraId)
                .orElseThrow(() -> new RuntimeException("Obra não encontrada"));
        Map<String, Object> dados = reportService.getDadosGerais(obra);
        return ResponseEntity.ok(dados);
    }
    
    @GetMapping("/obra/{obraId}/progresso")
    @PreAuthorize("hasAnyRole('EMPREITEIRO', 'ENGENHEIRO', 'TECNICO_OBRA')")
    public ResponseEntity<Map<String, Object>> getProgresso(@PathVariable Long obraId) {
        Obra obra = obraRepository.findById(obraId)
                .orElseThrow(() -> new RuntimeException("Obra não encontrada"));
        Map<String, Object> progresso = reportService.getProgresso(obra);
        return ResponseEntity.ok(progresso);
    }
    
    @GetMapping("/obra/{obraId}/financas")
    @PreAuthorize("hasAnyRole('EMPREITEIRO', 'ENGENHEIRO')")
    public ResponseEntity<Map<String, Object>> getFinancas(@PathVariable Long obraId) {
        Obra obra = obraRepository.findById(obraId)
                .orElseThrow(() -> new RuntimeException("Obra não encontrada"));
        Map<String, Object> financas = reportService.getFinancas(obra);
        return ResponseEntity.ok(financas);
    }
    
    @GetMapping("/obra/{obraId}/materiais")
    @PreAuthorize("hasAnyRole('EMPREITEIRO', 'GESTOR_MATERIAIS')")
    public ResponseEntity<Map<String, Object>> getMateriais(@PathVariable Long obraId) {
        Obra obra = obraRepository.findById(obraId)
                .orElseThrow(() -> new RuntimeException("Obra não encontrada"));
        Map<String, Object> materiais = reportService.getMateriais(obra);
        return ResponseEntity.ok(materiais);
    }
    
    @GetMapping("/obra/{obraId}/equipas")
    @PreAuthorize("hasAnyRole('EMPREITEIRO', 'ENGENHEIRO', 'TECNICO_OBRA')")
    public ResponseEntity<Map<String, Object>> getEquipas(@PathVariable Long obraId) {
        Obra obra = obraRepository.findById(obraId)
                .orElseThrow(() -> new RuntimeException("Obra não encontrada"));
        Map<String, Object> equipas = reportService.getEquipas(obra);
        return ResponseEntity.ok(equipas);
    }
    
    @GetMapping("/obra/{obraId}/ocorrencias")
    @PreAuthorize("hasAnyRole('EMPREITEIRO', 'ENGENHEIRO', 'TECNICO_OBRA')")
    public ResponseEntity<Map<String, Object>> getOcorrencias(@PathVariable Long obraId) {
        Obra obra = obraRepository.findById(obraId)
                .orElseThrow(() -> new RuntimeException("Obra não encontrada"));
        Map<String, Object> ocorrencias = reportService.getOcorrencias(obra);
        return ResponseEntity.ok(ocorrencias);
    }
    
    @GetMapping("/obra/{obraId}/produtividade")
    @PreAuthorize("hasAnyRole('EMPREITEIRO', 'ENGENHEIRO', 'TECNICO_OBRA')")
    public ResponseEntity<Map<String, Object>> getProdutividade(
            @PathVariable Long obraId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fim) {
        Map<String, Object> relatorio = reportService.gerarRelatorioProdutividade(obraId, inicio, fim);
        return ResponseEntity.ok(relatorio);
    }
    
    @GetMapping("/comparativo-obras")
    @PreAuthorize("hasRole('EMPREITEIRO')")
    public ResponseEntity<List<Map<String, Object>>> gerarRelatorioComparativo(
            @RequestParam List<Long> obraIds) {
        List<Map<String, Object>> relatorios = reportService.gerarRelatorioComparativoObras(obraIds);
        return ResponseEntity.ok(relatorios);
    }
}

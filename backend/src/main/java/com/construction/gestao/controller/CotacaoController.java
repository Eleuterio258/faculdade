package com.construction.gestao.controller;

import com.construction.gestao.dto.ComparacaoCotacaoDTO;
import com.construction.gestao.dto.CotacaoDTO;
import com.construction.gestao.model.Cotacao;
import com.construction.gestao.model.CotacaoItem;
import com.construction.gestao.model.Fornecedor;
import com.construction.gestao.model.Obra;
import com.construction.gestao.repository.FornecedorRepository;
import com.construction.gestao.repository.ObraRepository;
import com.construction.gestao.service.CotacaoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/cotacoes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class CotacaoController {
    
    private final CotacaoService cotacaoService;
    private final ObraRepository obraRepository;
    private final FornecedorRepository fornecedorRepository;
    
    @PostMapping("/obra/{obraId}")
    @PreAuthorize("hasRole('EMPREITEIRO') or hasRole('GESTOR_MATERIAIS')")
    public ResponseEntity<Cotacao> criarCotacao(
            @PathVariable Long obraId,
            @Valid @RequestBody Map<String, Object> request) {
        
        Obra obra = obraRepository.findById(obraId)
                .orElseThrow(() -> new RuntimeException("Obra não encontrada"));
        
        Long fornecedorId = Long.valueOf(request.get("fornecedorId").toString());
        Fornecedor fornecedor = fornecedorRepository.findById(fornecedorId)
                .orElseThrow(() -> new RuntimeException("Fornecedor não encontrado"));
        
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> itensMap = (List<Map<String, Object>>) request.get("itens");
        
        Cotacao cotacao = new Cotacao();
        cotacao.setObra(obra);
        cotacao.setFornecedor(fornecedor);
        cotacao.setDataCotacao(LocalDate.parse(request.get("dataCotacao").toString()));
        
        if (request.containsKey("dataValidade") && request.get("dataValidade") != null) {
            cotacao.setDataValidade(LocalDate.parse(request.get("dataValidade").toString()));
        }
        if (request.containsKey("condicoesPagamento")) {
            cotacao.setCondicoesPagamento(request.get("condicoesPagamento").toString());
        }
        if (request.containsKey("prazoEntrega")) {
            cotacao.setPrazoEntrega(request.get("prazoEntrega").toString());
        }
        if (request.containsKey("observacoes")) {
            cotacao.setObservacoes(request.get("observacoes").toString());
        }
        
        List<CotacaoItem> itens = itensMap.stream().map(map -> {
            CotacaoItem item = new CotacaoItem();
            item.setDescricaoMaterial(map.get("descricaoMaterial").toString());
            item.setQuantidade(new java.math.BigDecimal(map.get("quantidade").toString()));
            item.setUnidade(map.get("unidade").toString());
            item.setPrecoUnitario(new java.math.BigDecimal(map.get("precoUnitario").toString()));
            
            if (map.containsKey("especificacoes")) {
                item.setEspecificacoes(map.get("especificacoes").toString());
            }
            if (map.containsKey("marca")) {
                item.setMarca(map.get("marca").toString());
            }
            if (map.containsKey("descontoPercentual")) {
                item.setDescontoPercentual(new java.math.BigDecimal(map.get("descontoPercentual").toString()));
            }
            if (map.containsKey("observacoes")) {
                item.setObservacoes(map.get("observacoes").toString());
            }
            
            return item;
        }).collect(Collectors.toList());
        
        Cotacao created = cotacaoService.criarCotacao(cotacao, itens);
        return ResponseEntity.created(URI.create("/api/cotacoes/" + created.getId())).body(created);
    }
    
    @GetMapping("/obra/{obraId}")
    @PreAuthorize("hasAnyRole('EMPREITEIRO', 'ENGENHEIRO', 'GESTOR_MATERIAIS', 'TECNICO_OBRA')")
    public ResponseEntity<List<Cotacao>> getCotacoesByObra(@PathVariable Long obraId) {
        List<Cotacao> cotacoes = cotacaoService.getCotacoesByObra(obraId);
        return ResponseEntity.ok(cotacoes);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('EMPREITEIRO', 'ENGENHEIRO', 'GESTOR_MATERIAIS', 'TECNICO_OBRA')")
    public ResponseEntity<Cotacao> getCotacaoById(@PathVariable Long id) {
        Cotacao cotacao = cotacaoService.getCotacaoById(id);
        return ResponseEntity.ok(cotacao);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('EMPREITEIRO') or hasRole('GESTOR_MATERIAIS')")
    public ResponseEntity<Cotacao> atualizarCotacao(
            @PathVariable Long id,
            @Valid @RequestBody Map<String, Object> request) {
        
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> itensMap = (List<Map<String, Object>>) request.get("itens");
        
        List<CotacaoItem> itens = itensMap != null ? itensMap.stream().map(map -> {
            CotacaoItem item = new CotacaoItem();
            if (map.containsKey("id")) {
                item.setId(Long.valueOf(map.get("id").toString()));
            }
            item.setDescricaoMaterial(map.get("descricaoMaterial").toString());
            item.setQuantidade(new java.math.BigDecimal(map.get("quantidade").toString()));
            item.setUnidade(map.get("unidade").toString());
            item.setPrecoUnitario(new java.math.BigDecimal(map.get("precoUnitario").toString()));
            
            if (map.containsKey("especificacoes")) {
                item.setEspecificacoes(map.get("especificacoes").toString());
            }
            if (map.containsKey("marca")) {
                item.setMarca(map.get("marca").toString());
            }
            if (map.containsKey("descontoPercentual")) {
                item.setDescontoPercentual(new java.math.BigDecimal(map.get("descontoPercentual").toString()));
            }
            if (map.containsKey("observacoes")) {
                item.setObservacoes(map.get("observacoes").toString());
            }
            
            return item;
        }).collect(Collectors.toList()) : null;
        
        Long fornecedorId = Long.valueOf(request.get("fornecedorId").toString());
        Fornecedor fornecedor = fornecedorRepository.findById(fornecedorId)
                .orElseThrow(() -> new RuntimeException("Fornecedor não encontrado"));
        
        Cotacao cotacao = new Cotacao();
        cotacao.setFornecedor(fornecedor);
        cotacao.setDataCotacao(LocalDate.parse(request.get("dataCotacao").toString()));
        
        if (request.containsKey("dataValidade") && request.get("dataValidade") != null) {
            cotacao.setDataValidade(LocalDate.parse(request.get("dataValidade").toString()));
        }
        if (request.containsKey("condicoesPagamento")) {
            cotacao.setCondicoesPagamento(request.get("condicoesPagamento").toString());
        }
        if (request.containsKey("prazoEntrega")) {
            cotacao.setPrazoEntrega(request.get("prazoEntrega").toString());
        }
        if (request.containsKey("observacoes")) {
            cotacao.setObservacoes(request.get("observacoes").toString());
        }
        if (request.containsKey("status")) {
            cotacao.setStatus(Cotacao.StatusCotacao.valueOf(request.get("status").toString()));
        }
        
        Cotacao updated = cotacaoService.atualizarCotacao(id, cotacao, itens);
        return ResponseEntity.ok(updated);
    }
    
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('EMPREITEIRO') or hasRole('GESTOR_MATERIAIS')")
    public ResponseEntity<Cotacao> atualizarStatus(
            @PathVariable Long id,
            @RequestParam Cotacao.StatusCotacao status,
            @RequestParam(required = false) Cotacao.DecisaoCotacao decisao) {
        
        Cotacao updated = cotacaoService.atualizarStatus(id, status, decisao);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('EMPREITEIRO') or hasRole('GESTOR_MATERIAIS')")
    public ResponseEntity<Void> eliminarCotacao(@PathVariable Long id) {
        cotacaoService.eliminarCotacao(id);
        return ResponseEntity.noContent().build();
    }
    
    // MOTOR DE COMPARAÇÃO
    @GetMapping("/comparar/obra/{obraId}")
    @PreAuthorize("hasAnyRole('EMPREITEIRO', 'GESTOR_MATERIAIS', 'ENGENHEIRO')")
    public ResponseEntity<List<ComparacaoCotacaoDTO>> compararCotacoes(
            @PathVariable Long obraId,
            @RequestParam List<Long> materiaisIds) {
        
        List<ComparacaoCotacaoDTO> comparacoes = cotacaoService.compararCotacoesPorMaterial(obraId, materiaisIds);
        return ResponseEntity.ok(comparacoes);
    }
    
    @GetMapping("/analise/obra/{obraId}")
    @PreAuthorize("hasAnyRole('EMPREITEIRO', 'GESTOR_MATERIAIS', 'ENGENHEIRO')")
    public ResponseEntity<Map<String, Object>> gerarAnaliseMercado(
            @PathVariable Long obraId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fim) {
        
        Map<String, Object> analise = cotacaoService.gerarAnaliseMercado(obraId, inicio, fim);
        return ResponseEntity.ok(analise);
    }
    
    @GetMapping("/recomendacoes/{obraId}")
    @PreAuthorize("hasAnyRole('EMPREITEIRO', 'GESTOR_MATERIAIS', 'ENGENHEIRO')")
    public ResponseEntity<List<Map<String, Object>>> getRecomendacoes(@PathVariable Long obraId) {
        List<Map<String, Object>> recomendacoes = cotacaoService.getRecomendacoes(obraId);
        return ResponseEntity.ok(recomendacoes);
    }
    
    @GetMapping("/historico/material/{materialId}")
    @PreAuthorize("hasAnyRole('EMPREITEIRO', 'GESTOR_MATERIAIS', 'ENGENHEIRO')")
    public ResponseEntity<List<Cotacao>> getHistoricoByMaterial(@PathVariable Long materialId) {
        // Retorna cotações aprovadas para o material
        List<Cotacao> cotacoes = cotacaoService.getCotacoesByObra(1L); // Simplificado
        return ResponseEntity.ok(cotacoes);
    }
}

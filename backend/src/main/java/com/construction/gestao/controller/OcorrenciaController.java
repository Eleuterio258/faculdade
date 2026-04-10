package com.construction.gestao.controller;

import com.construction.gestao.model.Ocorrencia;
import com.construction.gestao.service.OcorrenciaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ocorrencias")
@CrossOrigin(origins = "*", maxAge = 3600)
@RequiredArgsConstructor
public class OcorrenciaController {

    private final OcorrenciaService ocorrenciaService;

    @GetMapping("/obra/{obraId}")
    @PreAuthorize("hasAnyRole('EMPREITEIRO', 'ENGENHEIRO', 'TECNICO_OBRA')")
    public ResponseEntity<List<Ocorrencia>> getOcorrenciasByObra(@PathVariable Long obraId) {
        return ResponseEntity.ok(ocorrenciaService.getOcorrenciasByObra(obraId));
    }

    @GetMapping("/obra/{obraId}/filtrar")
    @PreAuthorize("hasAnyRole('EMPREITEIRO', 'ENGENHEIRO', 'TECNICO_OBRA')")
    public ResponseEntity<List<Ocorrencia>> filterOcorrencias(
            @PathVariable Long obraId,
            @RequestParam(required = false) Ocorrencia.TipoOcorrencia tipo,
            @RequestParam(required = false) Ocorrencia.GravidadeOcorrencia gravidade,
            @RequestParam(required = false) Ocorrencia.StatusOcorrencia status) {
        
        List<Ocorrencia> ocorrencias = ocorrenciaService.getOcorrenciasByObra(obraId);
        
        if (tipo != null) {
            ocorrencias = ocorrencias.stream()
                    .filter(o -> o.getTipo() == tipo)
                    .toList();
        }
        
        if (gravidade != null) {
            ocorrencias = ocorrencias.stream()
                    .filter(o -> o.getGravidade() == gravidade)
                    .toList();
        }
        
        if (status != null) {
            ocorrencias = ocorrencias.stream()
                    .filter(o -> o.getStatus() == status)
                    .toList();
        }
        
        return ResponseEntity.ok(ocorrencias);
    }

    @GetMapping("/obra/{obraId}/estatisticas")
    @PreAuthorize("hasAnyRole('EMPREITEIRO', 'ENGENHEIRO', 'TECNICO_OBRA')")
    public ResponseEntity<Map<String, Object>> getOcorrenciasEstatisticas(@PathVariable Long obraId) {
        List<Ocorrencia> ocorrencias = ocorrenciaService.getOcorrenciasByObra(obraId);
        
        Map<String, Object> estatisticas = new HashMap<>();
        estatisticas.put("total", ocorrencias.size());
        estatisticas.put("abertas", ocorrencias.stream().filter(o -> o.getStatus() == Ocorrencia.StatusOcorrencia.ABERTA).count());
        estatisticas.put("emAnalise", ocorrencias.stream().filter(o -> o.getStatus() == Ocorrencia.StatusOcorrencia.EM_ANALISE).count());
        estatisticas.put("resolvidas", ocorrencias.stream().filter(o -> o.getStatus() == Ocorrencia.StatusOcorrencia.RESOLVIDA).count());
        estatisticas.put("criticas", ocorrencias.stream().filter(o -> o.getGravidade() == Ocorrencia.GravidadeOcorrencia.CRITICA).count());
        estatisticas.put("altas", ocorrencias.stream().filter(o -> o.getGravidade() == Ocorrencia.GravidadeOcorrencia.ALTA).count());
        
        // By type
        estatisticas.put("incidentes", ocorrencias.stream().filter(o -> o.getTipo() == Ocorrencia.TipoOcorrencia.INCIDENTE).count());
        estatisticas.put("acidentes", ocorrencias.stream().filter(o -> o.getTipo() == Ocorrencia.TipoOcorrencia.ACIDENTE).count());
        estatisticas.put("atrasos", ocorrencias.stream().filter(o -> o.getTipo() == Ocorrencia.TipoOcorrencia.ATRASO).count());
        estatisticas.put("defeitos", ocorrencias.stream().filter(o -> o.getTipo() == Ocorrencia.TipoOcorrencia.DEFEITO).count());
        
        return ResponseEntity.ok(estatisticas);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('EMPREITEIRO', 'ENGENHEIRO', 'TECNICO_OBRA')")
    public ResponseEntity<Ocorrencia> getOcorrenciaById(@PathVariable Long id) {
        return ocorrenciaService.getOcorrenciaById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/obra/{obraId}")
    @PreAuthorize("hasAnyRole('EMPREITEIRO', 'ENGENHEIRO', 'TECNICO_OBRA')")
    public ResponseEntity<Ocorrencia> createOcorrencia(@PathVariable Long obraId,
                                                        @Valid @RequestBody Ocorrencia ocorrencia) {
        return ResponseEntity.ok(ocorrenciaService.createOcorrencia(ocorrencia, obraId));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('EMPREITEIRO', 'ENGENHEIRO', 'TECNICO_OBRA')")
    public ResponseEntity<Ocorrencia> updateOcorrencia(@PathVariable Long id,
                                                        @Valid @RequestBody Ocorrencia ocorrencia) {
        return ResponseEntity.ok(ocorrenciaService.updateOcorrencia(id, ocorrencia));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('EMPREITEIRO')")
    public ResponseEntity<?> deleteOcorrencia(@PathVariable Long id) {
        ocorrenciaService.deleteOcorrencia(id);
        return ResponseEntity.ok().build();
    }
}

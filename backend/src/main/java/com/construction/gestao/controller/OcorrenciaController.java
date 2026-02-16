package com.construction.gestao.controller;

import com.construction.gestao.model.Ocorrencia;
import com.construction.gestao.service.OcorrenciaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/ocorrencias")
@CrossOrigin(origins = "*", maxAge = 3600)
public class OcorrenciaController {

    @Autowired
    private OcorrenciaService ocorrenciaService;

    @GetMapping("/obra/{obraId}")
    public ResponseEntity<List<Ocorrencia>> getOcorrenciasByObra(@PathVariable Long obraId) {
        return ResponseEntity.ok(ocorrenciaService.getOcorrenciasByObra(obraId));
    }

    @PostMapping("/obra/{obraId}")
    public ResponseEntity<Ocorrencia> createOcorrencia(@PathVariable Long obraId,
                                                        @Valid @RequestBody Ocorrencia ocorrencia) {
        return ResponseEntity.ok(ocorrenciaService.createOcorrencia(ocorrencia, obraId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Ocorrencia> updateOcorrencia(@PathVariable Long id,
                                                        @Valid @RequestBody Ocorrencia ocorrencia) {
        return ResponseEntity.ok(ocorrenciaService.updateOcorrencia(id, ocorrencia));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOcorrencia(@PathVariable Long id) {
        ocorrenciaService.deleteOcorrencia(id);
        return ResponseEntity.ok().build();
    }
}

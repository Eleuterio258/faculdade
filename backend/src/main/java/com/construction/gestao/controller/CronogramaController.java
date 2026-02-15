package com.construction.gestao.controller;

import com.construction.gestao.model.Cronograma;
import com.construction.gestao.service.CronogramaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/cronogramas")
@CrossOrigin(origins = "*", maxAge = 3600)
public class CronogramaController {

    @Autowired
    private CronogramaService cronogramaService;

    @GetMapping("/obra/{obraId}")
    public ResponseEntity<List<Cronograma>> getCronogramasByObra(@PathVariable Long obraId) {
        List<Cronograma> cronogramas = cronogramaService.getCronogramasByObra(obraId);
        return ResponseEntity.ok(cronogramas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cronograma> getCronogramaById(@PathVariable Long id) {
        Cronograma cronograma = cronogramaService.getCronogramaById(id);
        return ResponseEntity.ok(cronograma);
    }

    @PostMapping("/obra/{obraId}")
    public ResponseEntity<Cronograma> createCronograma(@PathVariable Long obraId,
                                                        @Valid @RequestBody Cronograma cronograma) {
        Cronograma createdCronograma = cronogramaService.createCronograma(cronograma, obraId);
        return ResponseEntity.ok(createdCronograma);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Cronograma> updateCronograma(@PathVariable Long id,
                                                         @Valid @RequestBody Cronograma cronogramaDetails) {
        Cronograma updatedCronograma = cronogramaService.updateCronograma(id, cronogramaDetails);
        return ResponseEntity.ok(updatedCronograma);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCronograma(@PathVariable Long id) {
        cronogramaService.deleteCronograma(id);
        return ResponseEntity.ok().build();
    }
}


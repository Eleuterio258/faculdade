package com.construction.gestao.controller;

import com.construction.gestao.model.Atividade;
import com.construction.gestao.service.AtividadeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/atividades")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AtividadeController {

    @Autowired
    private AtividadeService atividadeService;

    @GetMapping("/cronograma/{cronogramaId}")
    public ResponseEntity<List<Atividade>> getAtividadesByCronograma(@PathVariable Long cronogramaId) {
        List<Atividade> atividades = atividadeService.getAtividadesByCronograma(cronogramaId);
        return ResponseEntity.ok(atividades);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Atividade> getAtividadeById(@PathVariable Long id) {
        Atividade atividade = atividadeService.getAtividadeById(id);
        return ResponseEntity.ok(atividade);
    }

    @PostMapping("/cronograma/{cronogramaId}")

    public ResponseEntity<Atividade> createAtividade(@PathVariable Long cronogramaId,
                                                      @Valid @RequestBody Atividade atividade) {
        Atividade createdAtividade = atividadeService.createAtividade(atividade, cronogramaId);
        return ResponseEntity.ok(createdAtividade);
    }

    @PutMapping("/{id}")

    public ResponseEntity<Atividade> updateAtividade(@PathVariable Long id,
                                                      @Valid @RequestBody Atividade atividadeDetails) {
        Atividade updatedAtividade = atividadeService.updateAtividade(id, atividadeDetails);
        return ResponseEntity.ok(updatedAtividade);
    }

    @DeleteMapping("/{id}")

    public ResponseEntity<?> deleteAtividade(@PathVariable Long id) {
        atividadeService.deleteAtividade(id);
        return ResponseEntity.ok().build();
    }
}


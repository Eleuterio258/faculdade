package com.construction.gestao.controller;

import com.construction.gestao.model.DiarioObra;
import com.construction.gestao.security.UserPrincipal;
import com.construction.gestao.service.DiarioObraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/diarios-obra")
@CrossOrigin(origins = "*", maxAge = 3600)
public class DiarioObraController {

    @Autowired
    private DiarioObraService diarioObraService;

    @GetMapping("/obra/{obraId}")
    public ResponseEntity<List<DiarioObra>> getDiariosByObra(@PathVariable Long obraId) {
        List<DiarioObra> diarios = diarioObraService.getDiariosByObra(obraId);
        return ResponseEntity.ok(diarios);
    }

    @GetMapping("/obra/{obraId}/periodo")
    public ResponseEntity<List<DiarioObra>> getDiariosByPeriodo(
            @PathVariable Long obraId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<DiarioObra> diarios = diarioObraService.getDiariosByObraAndDateRange(obraId, startDate, endDate);
        return ResponseEntity.ok(diarios);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DiarioObra> getDiarioObraById(@PathVariable Long id) {
        DiarioObra diarioObra = diarioObraService.getDiarioObraById(id);
        return ResponseEntity.ok(diarioObra);
    }

    @PostMapping("/obra/{obraId}")
    public ResponseEntity<DiarioObra> createDiarioObra(@PathVariable Long obraId,
                                                        @Valid @RequestBody DiarioObra diarioObra,
                                                        @AuthenticationPrincipal UserPrincipal currentUser) {
        DiarioObra createdDiarioObra = diarioObraService.createDiarioObra(diarioObra, obraId, currentUser.getId());
        return ResponseEntity.ok(createdDiarioObra);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DiarioObra> updateDiarioObra(@PathVariable Long id,
                                                        @Valid @RequestBody DiarioObra diarioObraDetails) {
        DiarioObra updatedDiarioObra = diarioObraService.updateDiarioObra(id, diarioObraDetails);
        return ResponseEntity.ok(updatedDiarioObra);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDiarioObra(@PathVariable Long id) {
        diarioObraService.deleteDiarioObra(id);
        return ResponseEntity.ok().build();
    }
}


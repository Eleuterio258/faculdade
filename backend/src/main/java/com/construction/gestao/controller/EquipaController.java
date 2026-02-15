package com.construction.gestao.controller;

import com.construction.gestao.model.Equipa;
import com.construction.gestao.service.EquipaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/equipas")
@CrossOrigin(origins = "*", maxAge = 3600)
public class EquipaController {

    @Autowired
    private EquipaService equipaService;

    @GetMapping("/obra/{obraId}")
    public ResponseEntity<List<Equipa>> getEquipasByObra(@PathVariable Long obraId) {
        List<Equipa> equipas = equipaService.getEquipasByObra(obraId);
        return ResponseEntity.ok(equipas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Equipa> getEquipaById(@PathVariable Long id) {
        Equipa equipa = equipaService.getEquipaById(id);
        return ResponseEntity.ok(equipa);
    }

    @PostMapping("/obra/{obraId}")
    public ResponseEntity<Equipa> createEquipa(@PathVariable Long obraId,
                                               @Valid @RequestBody Equipa equipa,
                                               @RequestParam(required = false) Long liderId) {
        Equipa createdEquipa = equipaService.createEquipa(equipa, obraId, liderId);
        return ResponseEntity.ok(createdEquipa);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Equipa> updateEquipa(@PathVariable Long id,
                                               @Valid @RequestBody Equipa equipaDetails) {
        Equipa updatedEquipa = equipaService.updateEquipa(id, equipaDetails);
        return ResponseEntity.ok(updatedEquipa);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEquipa(@PathVariable Long id) {
        equipaService.deleteEquipa(id);
        return ResponseEntity.ok().build();
    }
}


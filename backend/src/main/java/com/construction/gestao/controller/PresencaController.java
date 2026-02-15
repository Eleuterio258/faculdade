package com.construction.gestao.controller;

import com.construction.gestao.model.Presenca;
import com.construction.gestao.service.PresencaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/presencas")
@CrossOrigin(origins = "*", maxAge = 3600)
public class PresencaController {

    @Autowired
    private PresencaService presencaService;

    @GetMapping("/equipa/{equipaId}")
    public ResponseEntity<List<Presenca>> getPresencasByEquipa(@PathVariable Long equipaId) {
        List<Presenca> presencas = presencaService.getPresencasByEquipa(equipaId);
        return ResponseEntity.ok(presencas);
    }

    @GetMapping("/equipa/{equipaId}/data")
    public ResponseEntity<List<Presenca>> getPresencasByEquipaAndData(
            @PathVariable Long equipaId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data) {
        List<Presenca> presencas = presencaService.getPresencasByEquipaAndData(equipaId, data);
        return ResponseEntity.ok(presencas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Presenca> getPresencaById(@PathVariable Long id) {
        Presenca presenca = presencaService.getPresencaById(id);
        return ResponseEntity.ok(presenca);
    }

    @PostMapping("/equipa/{equipaId}/trabalhador/{trabalhadorId}")
    public ResponseEntity<Presenca> createPresenca(@PathVariable Long equipaId,
                                                    @PathVariable Long trabalhadorId,
                                                    @Valid @RequestBody Presenca presenca) {
        Presenca createdPresenca = presencaService.createPresenca(presenca, equipaId, trabalhadorId);
        return ResponseEntity.ok(createdPresenca);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Presenca> updatePresenca(@PathVariable Long id,
                                                    @Valid @RequestBody Presenca presencaDetails) {
        Presenca updatedPresenca = presencaService.updatePresenca(id, presencaDetails);
        return ResponseEntity.ok(updatedPresenca);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePresenca(@PathVariable Long id) {
        presencaService.deletePresenca(id);
        return ResponseEntity.ok().build();
    }
}


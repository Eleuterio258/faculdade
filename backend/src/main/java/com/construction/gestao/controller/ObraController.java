package com.construction.gestao.controller;

import com.construction.gestao.model.Obra;
import com.construction.gestao.security.UserPrincipal;
import com.construction.gestao.service.ObraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/obras")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ObraController {

    @Autowired
    private ObraService obraService;

    @GetMapping
    public ResponseEntity<List<Obra>> getAllObras(@AuthenticationPrincipal UserPrincipal currentUser) {
        List<Obra> obras = obraService.getObrasByUsuario(currentUser.getId());
        return ResponseEntity.ok(obras);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Obra> getObraById(@PathVariable Long id) {
        Obra obra = obraService.getObraById(id);
        return ResponseEntity.ok(obra);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('EMPREITEIRO','ENGENHEIRO')")
    public ResponseEntity<Obra> createObra(@Valid @RequestBody Obra obra,
                                            @AuthenticationPrincipal UserPrincipal currentUser) {
        Obra createdObra = obraService.createObra(obra, currentUser.getId());
        return ResponseEntity.ok(createdObra);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('EMPREITEIRO','ENGENHEIRO')")
    public ResponseEntity<Obra> updateObra(@PathVariable Long id,
                                            @Valid @RequestBody Obra obraDetails) {
        Obra updatedObra = obraService.updateObra(id, obraDetails);
        return ResponseEntity.ok(updatedObra);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('EMPREITEIRO','ENGENHEIRO')")
    public ResponseEntity<?> deleteObra(@PathVariable Long id) {
        obraService.deleteObra(id);
        return ResponseEntity.ok().build();
    }
}


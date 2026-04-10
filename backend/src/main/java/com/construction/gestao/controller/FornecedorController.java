package com.construction.gestao.controller;

import com.construction.gestao.model.Fornecedor;
import com.construction.gestao.service.FornecedorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/fornecedores")
@CrossOrigin(origins = "*", maxAge = 3600)
@RequiredArgsConstructor
public class FornecedorController {

    private final FornecedorService fornecedorService;

    @GetMapping("/obra/{obraId}")
    @PreAuthorize("hasAnyRole('EMPREITEIRO', 'GESTOR_MATERIAIS')")
    public ResponseEntity<List<Fornecedor>> getFornecedoresByObra(@PathVariable Long obraId) {
        return ResponseEntity.ok(fornecedorService.getFornecedoresByObra(obraId));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('EMPREITEIRO', 'GESTOR_MATERIAIS')")
    public ResponseEntity<Fornecedor> getFornecedorById(@PathVariable Long id) {
        return fornecedorService.getFornecedorById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/obra/{obraId}")
    @PreAuthorize("hasRole('EMPREITEIRO') or hasRole('GESTOR_MATERIAIS')")
    public ResponseEntity<Fornecedor> createFornecedor(@PathVariable Long obraId,
                                                        @Valid @RequestBody Fornecedor fornecedor) {
        Fornecedor created = fornecedorService.createFornecedor(fornecedor, obraId);
        return ResponseEntity.created(URI.create("/api/fornecedores/" + created.getId())).body(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('EMPREITEIRO') or hasRole('GESTOR_MATERIAIS')")
    public ResponseEntity<Fornecedor> updateFornecedor(@PathVariable Long id,
                                                        @Valid @RequestBody Fornecedor fornecedorDetails) {
        return fornecedorService.updateFornecedor(id, fornecedorDetails)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('EMPREITEIRO') or hasRole('GESTOR_MATERIAIS')")
    public ResponseEntity<?> deleteFornecedor(@PathVariable Long id) {
        fornecedorService.deleteFornecedor(id);
        return ResponseEntity.ok().build();
    }
}

package com.construction.gestao.controller;

import com.construction.gestao.model.Fornecedor;
import com.construction.gestao.service.FornecedorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/fornecedores")
@CrossOrigin(origins = "*", maxAge = 3600)
public class FornecedorController {

    @Autowired
    private FornecedorService fornecedorService;

    @GetMapping("/obra/{obraId}")
    public ResponseEntity<List<Fornecedor>> getFornecedoresByObra(@PathVariable Long obraId) {
        return ResponseEntity.ok(fornecedorService.getFornecedoresByObra(obraId));
    }

    @PostMapping("/obra/{obraId}")
    public ResponseEntity<Fornecedor> createFornecedor(@PathVariable Long obraId,
                                                        @Valid @RequestBody Fornecedor fornecedor) {
        return ResponseEntity.ok(fornecedorService.createFornecedor(fornecedor, obraId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFornecedor(@PathVariable Long id) {
        fornecedorService.deleteFornecedor(id);
        return ResponseEntity.ok().build();
    }
}

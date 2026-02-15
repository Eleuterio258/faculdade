package com.construction.gestao.controller;

import com.construction.gestao.model.Custo;
import com.construction.gestao.security.UserPrincipal;
import com.construction.gestao.service.CustoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/custos")
@CrossOrigin(origins = "*", maxAge = 3600)
public class CustoController {

    @Autowired
    private CustoService custoService;

    @GetMapping("/obra/{obraId}")
    public ResponseEntity<List<Custo>> getCustosByObra(@PathVariable Long obraId) {
        List<Custo> custos = custoService.getCustosByObra(obraId);
        return ResponseEntity.ok(custos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Custo> getCustoById(@PathVariable Long id) {
        Custo custo = custoService.getCustoById(id);
        return ResponseEntity.ok(custo);
    }

    @PostMapping("/obra/{obraId}")
    public ResponseEntity<Custo> createCusto(@PathVariable Long obraId,
                                             @Valid @RequestBody Custo custo,
                                             @AuthenticationPrincipal UserPrincipal currentUser) {
        Custo createdCusto = custoService.createCusto(custo, obraId, currentUser.getId());
        return ResponseEntity.ok(createdCusto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Custo> updateCusto(@PathVariable Long id,
                                              @Valid @RequestBody Custo custoDetails) {
        Custo updatedCusto = custoService.updateCusto(id, custoDetails);
        return ResponseEntity.ok(updatedCusto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCusto(@PathVariable Long id) {
        custoService.deleteCusto(id);
        return ResponseEntity.ok().build();
    }
}


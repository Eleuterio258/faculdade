package com.construction.gestao.controller;

import com.construction.gestao.model.Material;
import com.construction.gestao.model.MovimentoMaterial;
import com.construction.gestao.service.MaterialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/materiais")
@CrossOrigin(origins = "*", maxAge = 3600)
public class MaterialController {

    @Autowired
    private MaterialService materialService;

    @GetMapping("/obra/{obraId}")
    public ResponseEntity<List<Material>> getMateriaisByObra(@PathVariable Long obraId) {
        List<Material> materiais = materialService.getMateriaisByObra(obraId);
        return ResponseEntity.ok(materiais);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Material> getMaterialById(@PathVariable Long id) {
        Material material = materialService.getMaterialById(id);
        return ResponseEntity.ok(material);
    }

    @PostMapping("/obra/{obraId}")
    public ResponseEntity<Material> createMaterial(@PathVariable Long obraId,
                                                    @Valid @RequestBody Material material) {
        Material createdMaterial = materialService.createMaterial(material, obraId);
        return ResponseEntity.ok(createdMaterial);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Material> updateMaterial(@PathVariable Long id,
                                                    @Valid @RequestBody Material materialDetails) {
        Material updatedMaterial = materialService.updateMaterial(id, materialDetails);
        return ResponseEntity.ok(updatedMaterial);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMaterial(@PathVariable Long id) {
        materialService.deleteMaterial(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{materialId}/movimentos")
    public ResponseEntity<MovimentoMaterial> registrarMovimento(@PathVariable Long materialId,
                                                                 @Valid @RequestBody MovimentoMaterial movimento) {
        MovimentoMaterial createdMovimento = materialService.registrarMovimento(materialId, movimento);
        return ResponseEntity.ok(createdMovimento);
    }
}


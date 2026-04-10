package com.construction.gestao.controller;

import com.construction.gestao.model.Material;
import com.construction.gestao.model.MovimentoMaterial;
import com.construction.gestao.model.Obra;
import com.construction.gestao.repository.MaterialRepository;
import com.construction.gestao.repository.ObraRepository;
import com.construction.gestao.service.MaterialService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/materiais")
@CrossOrigin(origins = "*", maxAge = 3600)
@RequiredArgsConstructor
public class MaterialController {

    private final MaterialService materialService;
    private final MaterialRepository materialRepository;
    private final ObraRepository obraRepository;

    @GetMapping("/obra/{obraId}")
    @PreAuthorize("hasAnyRole('EMPREITEIRO', 'ENGENHEIRO', 'GESTOR_MATERIAIS', 'TECNICO_OBRA')")
    public ResponseEntity<List<Material>> getMateriaisByObra(@PathVariable Long obraId) {
        List<Material> materiais = materialService.getMateriaisByObra(obraId);
        return ResponseEntity.ok(materiais);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('EMPREITEIRO', 'ENGENHEIRO', 'GESTOR_MATERIAIS', 'TECNICO_OBRA')")
    public ResponseEntity<Material> getMaterialById(@PathVariable Long id) {
        Material material = materialService.getMaterialById(id);
        return ResponseEntity.ok(material);
    }

    @GetMapping("/obra/{obraId}/stock-critico")
    @PreAuthorize("hasAnyRole('EMPREITEIRO', 'GESTOR_MATERIAIS')")
    public ResponseEntity<List<Material>> getMateriaisStockCritico(@PathVariable Long obraId) {
        Obra obra = obraRepository.findById(obraId)
                .orElseThrow(() -> new RuntimeException("Obra não encontrada"));
        
        List<Material> stockCritico = materialRepository.findByObraAndQuantidadeEstoqueLessThanEqual(
                obra, obra.getMateriais().stream()
                        .findFirst()
                        .map(Material::getQuantidadeMinima)
                        .orElse(BigDecimal.ZERO));
        
        return ResponseEntity.ok(stockCritico);
    }

    @GetMapping("/obra/{obraId}/resumo")
    @PreAuthorize("hasAnyRole('EMPREITEIRO', 'GESTOR_MATERIAIS')")
    public ResponseEntity<Map<String, Object>> getResumoMateriais(@PathVariable Long obraId) {
        List<Material> materiais = materialService.getMateriaisByObra(obraId);
        
        Map<String, Object> resumo = new HashMap<>();
        resumo.put("totalMateriais", materiais.size());
        
        long stockCritico = materiais.stream()
                .filter(m -> m.getQuantidadeEstoque().compareTo(m.getQuantidadeMinima()) <= 0)
                .count();
        resumo.put("materiaisStockCritico", stockCritico);
        
        BigDecimal valorTotalStock = materiais.stream()
                .map(m -> m.getQuantidadeEstoque().multiply(m.getPrecoUnitario() != null ? m.getPrecoUnitario() : BigDecimal.ZERO))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        resumo.put("valorTotalStock", valorTotalStock);
        
        Double consumoMedio = materiais.stream()
                .mapToDouble(m -> {
                    BigDecimal totalSaidas = m.getMovimentos().stream()
                            .filter(mov -> mov.getTipo() == MovimentoMaterial.TipoMovimento.SAIDA)
                            .map(MovimentoMaterial::getQuantidade)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);
                    return totalSaidas.doubleValue();
                })
                .average()
                .orElse(0.0);
        resumo.put("consumoMedio", consumoMedio);
        
        return ResponseEntity.ok(resumo);
    }

    @PostMapping("/obra/{obraId}")
    @PreAuthorize("hasRole('EMPREITEIRO') or hasRole('GESTOR_MATERIAIS')")
    public ResponseEntity<Material> createMaterial(@PathVariable Long obraId,
                                                    @Valid @RequestBody Material material) {
        Material createdMaterial = materialService.createMaterial(material, obraId);
        return ResponseEntity.ok(createdMaterial);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('EMPREITEIRO') or hasRole('GESTOR_MATERIAIS')")
    public ResponseEntity<Material> updateMaterial(@PathVariable Long id,
                                                    @Valid @RequestBody Material materialDetails) {
        Material updatedMaterial = materialService.updateMaterial(id, materialDetails);
        return ResponseEntity.ok(updatedMaterial);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('EMPREITEIRO') or hasRole('GESTOR_MATERIAIS')")
    public ResponseEntity<?> deleteMaterial(@PathVariable Long id) {
        materialService.deleteMaterial(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{materialId}/movimentos")
    @PreAuthorize("hasAnyRole('EMPREITEIRO', 'GESTOR_MATERIAIS', 'TECNICO_OBRA')")
    public ResponseEntity<MovimentoMaterial> registrarMovimento(@PathVariable Long materialId,
                                                                 @Valid @RequestBody MovimentoMaterial movimento) {
        MovimentoMaterial createdMovimento = materialService.registrarMovimento(materialId, movimento);
        return ResponseEntity.ok(createdMovimento);
    }
    
    @GetMapping("/{materialId}/movimentos")
    @PreAuthorize("hasAnyRole('EMPREITEIRO', 'GESTOR_MATERIAIS', 'TECNICO_OBRA')")
    public ResponseEntity<List<MovimentoMaterial>> getMovimentosByMaterial(@PathVariable Long materialId) {
        Material material = materialService.getMaterialById(materialId);
        return ResponseEntity.ok(material.getMovimentos());
    }
}


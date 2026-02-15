package com.construction.gestao.service;

import com.construction.gestao.model.Material;
import com.construction.gestao.model.MovimentoMaterial;
import com.construction.gestao.model.Obra;
import com.construction.gestao.repository.MaterialRepository;
import com.construction.gestao.repository.MovimentoMaterialRepository;
import com.construction.gestao.repository.ObraRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class MaterialService {

    @Autowired
    private MaterialRepository materialRepository;

    @Autowired
    private ObraRepository obraRepository;

    @Autowired
    private MovimentoMaterialRepository movimentoMaterialRepository;

    @Transactional
    public Material createMaterial(Material material, Long obraId) {
        Obra obra = obraRepository.findById(obraId)
                .orElseThrow(() -> new RuntimeException("Obra não encontrada"));
        material.setObra(obra);
        return materialRepository.save(material);
    }

    @Transactional(readOnly = true)
    public List<Material> getMateriaisByObra(Long obraId) {
        Obra obra = obraRepository.findById(obraId)
                .orElseThrow(() -> new RuntimeException("Obra não encontrada"));
        return materialRepository.findByObra(obra);
    }

    @Transactional(readOnly = true)
    public Material getMaterialById(Long id) {
        return materialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Material não encontrado"));
    }

    @Transactional
    public Material updateMaterial(Long id, Material materialDetails) {
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Material não encontrado"));

        material.setNome(materialDetails.getNome());
        material.setDescricao(materialDetails.getDescricao());
        material.setUnidade(materialDetails.getUnidade());
        material.setQuantidadeMinima(materialDetails.getQuantidadeMinima());
        material.setPrecoUnitario(materialDetails.getPrecoUnitario());

        return materialRepository.save(material);
    }

    @Transactional
    public MovimentoMaterial registrarMovimento(Long materialId, MovimentoMaterial movimento) {
        Material material = materialRepository.findById(materialId)
                .orElseThrow(() -> new RuntimeException("Material não encontrado"));

        movimento.setMaterial(material);

        // Atualizar estoque
        BigDecimal quantidadeAtual = material.getQuantidadeEstoque();
        if (movimento.getTipo() == MovimentoMaterial.TipoMovimento.ENTRADA) {
            material.setQuantidadeEstoque(quantidadeAtual.add(movimento.getQuantidade()));
        } else if (movimento.getTipo() == MovimentoMaterial.TipoMovimento.SAIDA) {
            material.setQuantidadeEstoque(quantidadeAtual.subtract(movimento.getQuantidade()));
        } else if (movimento.getTipo() == MovimentoMaterial.TipoMovimento.AJUSTE) {
            material.setQuantidadeEstoque(movimento.getQuantidade());
        }

        materialRepository.save(material);
        return movimentoMaterialRepository.save(movimento);
    }

    @Transactional
    public void deleteMaterial(Long id) {
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Material não encontrado"));
        materialRepository.delete(material);
    }
}


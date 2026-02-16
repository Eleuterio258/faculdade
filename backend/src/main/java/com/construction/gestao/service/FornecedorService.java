package com.construction.gestao.service;

import com.construction.gestao.model.Fornecedor;
import com.construction.gestao.model.Obra;
import com.construction.gestao.repository.FornecedorRepository;
import com.construction.gestao.repository.ObraRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FornecedorService {

    @Autowired
    private FornecedorRepository fornecedorRepository;

    @Autowired
    private ObraRepository obraRepository;

    public List<Fornecedor> getFornecedoresByObra(Long obraId) {
        Obra obra = obraRepository.findById(obraId)
                .orElseThrow(() -> new RuntimeException("Obra não encontrada"));
        return fornecedorRepository.findByObra(obra);
    }

    @Transactional
    public Fornecedor createFornecedor(Fornecedor fornecedor, Long obraId) {
        Obra obra = obraRepository.findById(obraId)
                .orElseThrow(() -> new RuntimeException("Obra não encontrada"));
        fornecedor.setObra(obra);
        return fornecedorRepository.save(fornecedor);
    }

    @Transactional
    public void deleteFornecedor(Long id) {
        fornecedorRepository.deleteById(id);
    }
}

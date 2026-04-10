package com.construction.gestao.service;

import com.construction.gestao.model.Fornecedor;
import com.construction.gestao.model.Obra;
import com.construction.gestao.repository.FornecedorRepository;
import com.construction.gestao.repository.ObraRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FornecedorService {

    private final FornecedorRepository fornecedorRepository;
    private final ObraRepository obraRepository;

    @Transactional(readOnly = true)
    public List<Fornecedor> getFornecedoresByObra(Long obraId) {
        Obra obra = obraRepository.findById(obraId)
                .orElseThrow(() -> new RuntimeException("Obra não encontrada"));
        return fornecedorRepository.findByObra(obra);
    }

    @Transactional(readOnly = true)
    public Optional<Fornecedor> getFornecedorById(Long id) {
        return fornecedorRepository.findById(id);
    }

    @Transactional
    public Fornecedor createFornecedor(Fornecedor fornecedor, Long obraId) {
        Obra obra = obraRepository.findById(obraId)
                .orElseThrow(() -> new RuntimeException("Obra não encontrada"));
        fornecedor.setObra(obra);
        return fornecedorRepository.save(fornecedor);
    }

    @Transactional
    public Optional<Fornecedor> updateFornecedor(Long id, Fornecedor fornecedorDetails) {
        return fornecedorRepository.findById(id)
                .map(fornecedor -> {
                    fornecedor.setNome(fornecedorDetails.getNome());
                    fornecedor.setContacto(fornecedorDetails.getContacto());
                    fornecedor.setEmail(fornecedorDetails.getEmail());
                    fornecedor.setEndereco(fornecedorDetails.getEndereco());
                    fornecedor.setTipoFornecimento(fornecedorDetails.getTipoFornecimento());
                    fornecedor.setObservacoes(fornecedorDetails.getObservacoes());
                    return fornecedorRepository.save(fornecedor);
                });
    }

    @Transactional
    public void deleteFornecedor(Long id) {
        fornecedorRepository.deleteById(id);
    }
}

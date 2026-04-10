package com.construction.gestao.service;

import com.construction.gestao.model.Atividade;
import com.construction.gestao.repository.AtividadeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AtividadeService {
    
    private final AtividadeRepository atividadeRepository;
    
    @Transactional(readOnly = true)
    public List<Atividade> buscarTodas() {
        return atividadeRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public List<Atividade> buscarPorStatus(Atividade.StatusAtividade status) {
        return atividadeRepository.findByStatus(status);
    }
}

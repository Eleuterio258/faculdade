package com.construction.gestao.service;

import com.construction.gestao.model.Obra;
import com.construction.gestao.model.Ocorrencia;
import com.construction.gestao.repository.ObraRepository;
import com.construction.gestao.repository.OcorrenciaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OcorrenciaService {

    private final OcorrenciaRepository ocorrenciaRepository;
    private final ObraRepository obraRepository;

    @Transactional(readOnly = true)
    public List<Ocorrencia> getOcorrenciasByObra(Long obraId) {
        Obra obra = obraRepository.findById(obraId)
                .orElseThrow(() -> new RuntimeException("Obra não encontrada"));
        return ocorrenciaRepository.findByObraOrderByDataDesc(obra);
    }

    @Transactional(readOnly = true)
    public Optional<Ocorrencia> getOcorrenciaById(Long id) {
        return ocorrenciaRepository.findById(id);
    }

    @Transactional
    public Ocorrencia createOcorrencia(Ocorrencia ocorrencia, Long obraId) {
        Obra obra = obraRepository.findById(obraId)
                .orElseThrow(() -> new RuntimeException("Obra não encontrada"));
        ocorrencia.setObra(obra);
        return ocorrenciaRepository.save(ocorrencia);
    }

    @Transactional
    public Ocorrencia updateOcorrencia(Long id, Ocorrencia details) {
        Ocorrencia ocorrencia = ocorrenciaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ocorrência não encontrada"));
        ocorrencia.setTitulo(details.getTitulo());
        ocorrencia.setDescricao(details.getDescricao());
        ocorrencia.setData(details.getData());
        ocorrencia.setTipo(details.getTipo());
        ocorrencia.setGravidade(details.getGravidade());
        ocorrencia.setStatus(details.getStatus());
        ocorrencia.setResolucao(details.getResolucao());
        return ocorrenciaRepository.save(ocorrencia);
    }

    @Transactional
    public void deleteOcorrencia(Long id) {
        ocorrenciaRepository.deleteById(id);
    }
}

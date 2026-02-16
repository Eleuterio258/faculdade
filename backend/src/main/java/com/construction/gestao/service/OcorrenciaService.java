package com.construction.gestao.service;

import com.construction.gestao.model.Obra;
import com.construction.gestao.model.Ocorrencia;
import com.construction.gestao.repository.ObraRepository;
import com.construction.gestao.repository.OcorrenciaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class OcorrenciaService {

    @Autowired
    private OcorrenciaRepository ocorrenciaRepository;

    @Autowired
    private ObraRepository obraRepository;

    public List<Ocorrencia> getOcorrenciasByObra(Long obraId) {
        Obra obra = obraRepository.findById(obraId)
                .orElseThrow(() -> new RuntimeException("Obra não encontrada"));
        return ocorrenciaRepository.findByObraOrderByDataDesc(obra);
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

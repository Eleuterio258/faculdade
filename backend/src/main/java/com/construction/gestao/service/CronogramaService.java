package com.construction.gestao.service;

import com.construction.gestao.model.Cronograma;
import com.construction.gestao.model.Obra;
import com.construction.gestao.repository.CronogramaRepository;
import com.construction.gestao.repository.ObraRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CronogramaService {

    @Autowired
    private CronogramaRepository cronogramaRepository;

    @Autowired
    private ObraRepository obraRepository;

    @Transactional
    public Cronograma createCronograma(Cronograma cronograma, Long obraId) {
        Obra obra = obraRepository.findById(obraId)
                .orElseThrow(() -> new RuntimeException("Obra não encontrada"));
        cronograma.setObra(obra);
        return cronogramaRepository.save(cronograma);
    }

    @Transactional(readOnly = true)
    public List<Cronograma> getCronogramasByObra(Long obraId) {
        Obra obra = obraRepository.findById(obraId)
                .orElseThrow(() -> new RuntimeException("Obra não encontrada"));
        return cronogramaRepository.findByObra(obra);
    }

    @Transactional(readOnly = true)
    public Cronograma getCronogramaById(Long id) {
        return cronogramaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cronograma não encontrado"));
    }

    @Transactional
    public Cronograma updateCronograma(Long id, Cronograma cronogramaDetails) {
        Cronograma cronograma = cronogramaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cronograma não encontrado"));

        cronograma.setNome(cronogramaDetails.getNome());
        cronograma.setDescricao(cronogramaDetails.getDescricao());

        return cronogramaRepository.save(cronograma);
    }

    @Transactional
    public void deleteCronograma(Long id) {
        Cronograma cronograma = cronogramaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cronograma não encontrado"));
        cronogramaRepository.delete(cronograma);
    }
}


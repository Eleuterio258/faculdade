package com.construction.gestao.service;

import com.construction.gestao.model.Atividade;
import com.construction.gestao.model.Cronograma;
import com.construction.gestao.repository.AtividadeRepository;
import com.construction.gestao.repository.CronogramaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AtividadeService {

    @Autowired
    private AtividadeRepository atividadeRepository;

    @Autowired
    private CronogramaRepository cronogramaRepository;

    @Transactional
    public Atividade createAtividade(Atividade atividade, Long cronogramaId) {
        Cronograma cronograma = cronogramaRepository.findById(cronogramaId)
                .orElseThrow(() -> new RuntimeException("Cronograma não encontrado"));
        atividade.setCronograma(cronograma);
        return atividadeRepository.save(atividade);
    }

    @Transactional(readOnly = true)
    public List<Atividade> getAtividadesByCronograma(Long cronogramaId) {
        Cronograma cronograma = cronogramaRepository.findById(cronogramaId)
                .orElseThrow(() -> new RuntimeException("Cronograma não encontrado"));
        return atividadeRepository.findByCronograma(cronograma);
    }

    @Transactional(readOnly = true)
    public Atividade getAtividadeById(Long id) {
        return atividadeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Atividade não encontrada"));
    }

    @Transactional
    public Atividade updateAtividade(Long id, Atividade atividadeDetails) {
        Atividade atividade = atividadeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Atividade não encontrada"));

        atividade.setNome(atividadeDetails.getNome());
        atividade.setDescricao(atividadeDetails.getDescricao());
        atividade.setDataInicioPrevista(atividadeDetails.getDataInicioPrevista());
        atividade.setDataFimPrevista(atividadeDetails.getDataFimPrevista());
        atividade.setDataInicioReal(atividadeDetails.getDataInicioReal());
        atividade.setDataFimReal(atividadeDetails.getDataFimReal());
        atividade.setStatus(atividadeDetails.getStatus());
        atividade.setPercentualConclusao(atividadeDetails.getPercentualConclusao());
        atividade.setPrioridade(atividadeDetails.getPrioridade());

        return atividadeRepository.save(atividade);
    }

    @Transactional
    public void deleteAtividade(Long id) {
        Atividade atividade = atividadeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Atividade não encontrada"));
        atividadeRepository.delete(atividade);
    }
}


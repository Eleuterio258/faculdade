package com.construction.gestao.service;

import com.construction.gestao.model.DiarioObra;
import com.construction.gestao.model.Obra;
import com.construction.gestao.model.Usuario;
import com.construction.gestao.repository.DiarioObraRepository;
import com.construction.gestao.repository.ObraRepository;
import com.construction.gestao.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class DiarioObraService {

    @Autowired
    private DiarioObraRepository diarioObraRepository;

    @Autowired
    private ObraRepository obraRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Transactional
    public DiarioObra createDiarioObra(DiarioObra diarioObra, Long obraId, Long usuarioId) {
        Obra obra = obraRepository.findById(obraId)
                .orElseThrow(() -> new RuntimeException("Obra não encontrada"));
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        diarioObra.setObra(obra);
        diarioObra.setResponsavel(usuario);
        return diarioObraRepository.save(diarioObra);
    }

    @Transactional(readOnly = true)
    public List<DiarioObra> getDiariosByObra(Long obraId) {
        Obra obra = obraRepository.findById(obraId)
                .orElseThrow(() -> new RuntimeException("Obra não encontrada"));
        return diarioObraRepository.findByObra(obra);
    }

    @Transactional(readOnly = true)
    public List<DiarioObra> getDiariosByObraAndDateRange(Long obraId, LocalDate startDate, LocalDate endDate) {
        Obra obra = obraRepository.findById(obraId)
                .orElseThrow(() -> new RuntimeException("Obra não encontrada"));
        return diarioObraRepository.findByObraAndDataBetween(obra, startDate, endDate);
    }

    @Transactional(readOnly = true)
    public DiarioObra getDiarioObraById(Long id) {
        return diarioObraRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Diário de obra não encontrado"));
    }

    @Transactional
    public DiarioObra updateDiarioObra(Long id, DiarioObra diarioObraDetails) {
        DiarioObra diarioObra = diarioObraRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Diário de obra não encontrado"));

        diarioObra.setData(diarioObraDetails.getData());
        diarioObra.setDescricao(diarioObraDetails.getDescricao());
        diarioObra.setCondicoesClimaticas(diarioObraDetails.getCondicoesClimaticas());
        diarioObra.setObservacoes(diarioObraDetails.getObservacoes());
        diarioObra.setNumeroTrabalhadores(diarioObraDetails.getNumeroTrabalhadores());
        diarioObra.setHorasTrabalhadas(diarioObraDetails.getHorasTrabalhadas());

        return diarioObraRepository.save(diarioObra);
    }

    @Transactional
    public void deleteDiarioObra(Long id) {
        DiarioObra diarioObra = diarioObraRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Diário de obra não encontrado"));
        diarioObraRepository.delete(diarioObra);
    }
}


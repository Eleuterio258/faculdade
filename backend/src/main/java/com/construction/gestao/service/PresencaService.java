package com.construction.gestao.service;

import com.construction.gestao.model.Equipa;
import com.construction.gestao.model.Presenca;
import com.construction.gestao.model.Usuario;
import com.construction.gestao.repository.EquipaRepository;
import com.construction.gestao.repository.PresencaRepository;
import com.construction.gestao.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class PresencaService {

    @Autowired
    private PresencaRepository presencaRepository;

    @Autowired
    private EquipaRepository equipaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Transactional
    public Presenca createPresenca(Presenca presenca, Long equipaId, Long trabalhadorId) {
        Equipa equipa = equipaRepository.findById(equipaId)
                .orElseThrow(() -> new RuntimeException("Equipa não encontrada"));
        Usuario trabalhador = usuarioRepository.findById(trabalhadorId)
                .orElseThrow(() -> new RuntimeException("Trabalhador não encontrado"));

        presenca.setEquipa(equipa);
        presenca.setTrabalhador(trabalhador);
        return presencaRepository.save(presenca);
    }

    @Transactional(readOnly = true)
    public List<Presenca> getPresencasByEquipa(Long equipaId) {
        Equipa equipa = equipaRepository.findById(equipaId)
                .orElseThrow(() -> new RuntimeException("Equipa não encontrada"));
        return presencaRepository.findByEquipa(equipa);
    }

    @Transactional(readOnly = true)
    public List<Presenca> getPresencasByEquipaAndData(Long equipaId, LocalDate data) {
        Equipa equipa = equipaRepository.findById(equipaId)
                .orElseThrow(() -> new RuntimeException("Equipa não encontrada"));
        return presencaRepository.findByEquipaAndData(equipa, data);
    }

    @Transactional(readOnly = true)
    public Presenca getPresencaById(Long id) {
        return presencaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Presença não encontrada"));
    }

    @Transactional
    public Presenca updatePresenca(Long id, Presenca presencaDetails) {
        Presenca presenca = presencaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Presença não encontrada"));

        presenca.setData(presencaDetails.getData());
        presenca.setHorasTrabalhadas(presencaDetails.getHorasTrabalhadas());
        presenca.setPresente(presencaDetails.getPresente());
        presenca.setObservacoes(presencaDetails.getObservacoes());

        return presencaRepository.save(presenca);
    }

    @Transactional
    public void deletePresenca(Long id) {
        Presenca presenca = presencaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Presença não encontrada"));
        presencaRepository.delete(presenca);
    }
}


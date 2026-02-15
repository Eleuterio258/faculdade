package com.construction.gestao.service;

import com.construction.gestao.model.Equipa;
import com.construction.gestao.model.Obra;
import com.construction.gestao.model.Usuario;
import com.construction.gestao.repository.EquipaRepository;
import com.construction.gestao.repository.ObraRepository;
import com.construction.gestao.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EquipaService {

    @Autowired
    private EquipaRepository equipaRepository;

    @Autowired
    private ObraRepository obraRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Transactional
    public Equipa createEquipa(Equipa equipa, Long obraId, Long liderId) {
        Obra obra = obraRepository.findById(obraId)
                .orElseThrow(() -> new RuntimeException("Obra não encontrada"));
        equipa.setObra(obra);

        if (liderId != null) {
            Usuario lider = usuarioRepository.findById(liderId)
                    .orElseThrow(() -> new RuntimeException("Líder não encontrado"));
            equipa.setLider(lider);
        }

        return equipaRepository.save(equipa);
    }

    @Transactional(readOnly = true)
    public List<Equipa> getEquipasByObra(Long obraId) {
        Obra obra = obraRepository.findById(obraId)
                .orElseThrow(() -> new RuntimeException("Obra não encontrada"));
        return equipaRepository.findByObra(obra);
    }

    @Transactional(readOnly = true)
    public Equipa getEquipaById(Long id) {
        return equipaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipa não encontrada"));
    }

    @Transactional
    public Equipa updateEquipa(Long id, Equipa equipaDetails) {
        Equipa equipa = equipaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipa não encontrada"));

        equipa.setNome(equipaDetails.getNome());
        equipa.setDescricao(equipaDetails.getDescricao());

        if (equipaDetails.getLider() != null && equipaDetails.getLider().getId() != null) {
            Usuario lider = usuarioRepository.findById(equipaDetails.getLider().getId())
                    .orElseThrow(() -> new RuntimeException("Líder não encontrado"));
            equipa.setLider(lider);
        }

        return equipaRepository.save(equipa);
    }

    @Transactional
    public void deleteEquipa(Long id) {
        Equipa equipa = equipaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipa não encontrada"));
        equipaRepository.delete(equipa);
    }
}


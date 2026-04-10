package com.construction.gestao.service;

import com.construction.gestao.model.Obra;
import com.construction.gestao.model.Usuario;
import com.construction.gestao.repository.ObraRepository;
import com.construction.gestao.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ObraService {

    @Autowired
    private ObraRepository obraRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Transactional
    public Obra createObra(Obra obra, Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        obra.setUsuario(usuario);
        return obraRepository.save(obra);
    }

    @Transactional(readOnly = true)
    public List<Obra> getAllObras() {
        return obraRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Obra> getObrasByUsuario(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        // Admin (ENGENHEIRO) e EMPREITEIRO veem TODAS as obras
        if (usuario.getPerfil() == Usuario.PerfilUsuario.ENGENHEIRO || 
            usuario.getPerfil() == Usuario.PerfilUsuario.EMPREITEIRO) {
            return obraRepository.findAll();
        }
        
        // Outros perfis veem apenas as suas obras
        return obraRepository.findByUsuario(usuario);
    }

    @Transactional(readOnly = true)
    public Obra getObraById(Long id) {
        return obraRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Obra não encontrada"));
    }

    @Transactional
    public Obra updateObra(Long id, Obra obraDetails) {
        Obra obra = obraRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Obra não encontrada"));

        obra.setNome(obraDetails.getNome());
        obra.setDescricao(obraDetails.getDescricao());
        obra.setEndereco(obraDetails.getEndereco());
        obra.setLocalizacao(obraDetails.getLocalizacao());
        obra.setDataInicio(obraDetails.getDataInicio());
        obra.setDataFimPrevista(obraDetails.getDataFimPrevista());
        obra.setDataFimReal(obraDetails.getDataFimReal());
        obra.setStatus(obraDetails.getStatus());
        obra.setOrcamentoPrevisto(obraDetails.getOrcamentoPrevisto());
        obra.setCustoRealizado(obraDetails.getCustoRealizado());
        obra.setPercentualConclusao(obraDetails.getPercentualConclusao());

        return obraRepository.save(obra);
    }

    @Transactional
    public void deleteObra(Long id) {
        Obra obra = obraRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Obra não encontrada"));
        obraRepository.delete(obra);
    }
}


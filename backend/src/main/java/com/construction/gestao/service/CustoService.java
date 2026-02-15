package com.construction.gestao.service;

import com.construction.gestao.model.Custo;
import com.construction.gestao.model.Obra;
import com.construction.gestao.model.Usuario;
import com.construction.gestao.repository.CustoRepository;
import com.construction.gestao.repository.ObraRepository;
import com.construction.gestao.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class CustoService {

    @Autowired
    private CustoRepository custoRepository;

    @Autowired
    private ObraRepository obraRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Transactional
    public Custo createCusto(Custo custo, Long obraId, Long usuarioId) {
        Obra obra = obraRepository.findById(obraId)
                .orElseThrow(() -> new RuntimeException("Obra não encontrada"));
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        custo.setObra(obra);
        custo.setResponsavel(usuario);

        // Atualizar custo realizado da obra
        BigDecimal custoAtual = obra.getCustoRealizado() != null ? obra.getCustoRealizado() : BigDecimal.ZERO;
        obra.setCustoRealizado(custoAtual.add(custo.getValor()));
        obraRepository.save(obra);

        return custoRepository.save(custo);
    }

    @Transactional(readOnly = true)
    public List<Custo> getCustosByObra(Long obraId) {
        Obra obra = obraRepository.findById(obraId)
                .orElseThrow(() -> new RuntimeException("Obra não encontrada"));
        return custoRepository.findByObra(obra);
    }

    @Transactional(readOnly = true)
    public Custo getCustoById(Long id) {
        return custoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Custo não encontrado"));
    }

    @Transactional
    public Custo updateCusto(Long id, Custo custoDetails) {
        Custo custo = custoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Custo não encontrado"));

        Obra obra = custo.getObra();
        BigDecimal valorAnterior = custo.getValor();
        BigDecimal novoValor = custoDetails.getValor();

        // Ajustar custo realizado da obra
        BigDecimal custoAtual = obra.getCustoRealizado() != null ? obra.getCustoRealizado() : BigDecimal.ZERO;
        obra.setCustoRealizado(custoAtual.subtract(valorAnterior).add(novoValor));
        obraRepository.save(obra);

        custo.setDescricao(custoDetails.getDescricao());
        custo.setTipo(custoDetails.getTipo());
        custo.setValor(novoValor);
        custo.setData(custoDetails.getData());
        custo.setObservacoes(custoDetails.getObservacoes());

        return custoRepository.save(custo);
    }

    @Transactional
    public void deleteCusto(Long id) {
        Custo custo = custoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Custo não encontrado"));

        // Ajustar custo realizado da obra
        Obra obra = custo.getObra();
        BigDecimal custoAtual = obra.getCustoRealizado() != null ? obra.getCustoRealizado() : BigDecimal.ZERO;
        obra.setCustoRealizado(custoAtual.subtract(custo.getValor()));
        obraRepository.save(obra);

        custoRepository.delete(custo);
    }
}


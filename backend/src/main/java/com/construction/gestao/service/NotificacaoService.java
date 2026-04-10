package com.construction.gestao.service;

import com.construction.gestao.model.Notificacao;
import com.construction.gestao.model.Obra;
import com.construction.gestao.model.Usuario;
import com.construction.gestao.repository.NotificacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificacaoService {
    
    private final NotificacaoRepository notificacaoRepository;
    
    @Transactional
    public Notificacao criarNotificacao(Notificacao notificacao) {
        return notificacaoRepository.save(notificacao);
    }
    
    @Transactional
    public Notificacao criarNotificacao(String titulo, String mensagem, 
                                       Notificacao.TipoNotificacao tipo,
                                       Notificacao.PrioridadeNotificacao prioridade,
                                       Usuario destinatario, Obra obra) {
        Notificacao notificacao = new Notificacao();
        notificacao.setTitulo(titulo);
        notificacao.setMensagem(mensagem);
        notificacao.setTipo(tipo);
        notificacao.setPrioridade(prioridade);
        notificacao.setDestinatario(destinatario);
        notificacao.setObra(obra);
        return notificacaoRepository.save(notificacao);
    }
    
    @Transactional(readOnly = true)
    public Page<Notificacao> buscarPorUsuario(Usuario usuario, Pageable pageable) {
        return notificacaoRepository.findByDestinatario(usuario, pageable);
    }
    
    @Transactional(readOnly = true)
    public Page<Notificacao> buscarPorUsuarioELida(Usuario usuario, Boolean lida, Pageable pageable) {
        return notificacaoRepository.findByDestinatarioAndLida(usuario, lida, pageable);
    }
    
    @Transactional(readOnly = true)
    public List<Notificacao> buscarNaoLidasPorUsuario(Usuario usuario) {
        return notificacaoRepository.findNaoLidasByUsuario(usuario);
    }
    
    @Transactional(readOnly = true)
    public Long contarNaoLidasPorUsuario(Usuario usuario) {
        return notificacaoRepository.countNaoLidasByUsuario(usuario);
    }
    
    @Transactional(readOnly = true)
    public Page<Notificacao> buscarPorObra(Obra obra, Pageable pageable) {
        return notificacaoRepository.findByObra(obra, pageable);
    }
    
    @Transactional(readOnly = true)
    public List<Notificacao> buscarPorObraAndPeriodo(Obra obra, LocalDateTime inicio, LocalDateTime fim) {
        return notificacaoRepository.findByObraAndPeriodo(obra, inicio, fim);
    }
    
    @Transactional
    public Notificacao marcarComoLida(Long notificacaoId) {
        Notificacao notificacao = notificacaoRepository.findById(notificacaoId)
                .orElseThrow(() -> new RuntimeException("Notificação não encontrada"));
        notificacao.setLida(true);
        return notificacaoRepository.save(notificacao);
    }
    
    @Transactional
    public void marcarTodasComoLidas(Usuario usuario) {
        List<Notificacao> naoLidas = notificacaoRepository.findNaoLidasByUsuario(usuario);
        naoLidas.forEach(n -> n.setLida(true));
        notificacaoRepository.saveAll(naoLidas);
    }
    
    @Transactional(readOnly = true)
    public List<Notificacao> buscarPorTipo(Notificacao.TipoNotificacao tipo, LocalDateTime data) {
        return notificacaoRepository.findByTipoAndDataAfter(tipo, data);
    }
}

package com.construction.gestao.controller;

import com.construction.gestao.model.Notificacao;
import com.construction.gestao.service.NotificacaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notificacoes")
@RequiredArgsConstructor
public class NotificacaoController {
    
    private final NotificacaoService notificacaoService;
    
    @GetMapping
    @PreAuthorize("hasAnyRole('EMPREITEIRO', 'ENGENHEIRO', 'GESTOR_MATERIAIS', 'TECNICO_OBRA')")
    public ResponseEntity<Page<Notificacao>> listarNotificacoes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        // In a real implementation, you would get the current user from SecurityContext
        // For now, this is a placeholder - you'll need to inject the current user
        Page<Notificacao> notificacoes = notificacaoService.buscarPorUsuario(null, pageable);
        return ResponseEntity.ok(notificacoes);
    }
    
    @GetMapping("/nao-lidas")
    @PreAuthorize("hasAnyRole('EMPREITEIRO', 'ENGENHEIRO', 'GESTOR_MATERIAIS', 'TECNICO_OBRA')")
    public ResponseEntity<List<Notificacao>> listarNaoLidas() {
        List<Notificacao> naoLidas = notificacaoService.buscarNaoLidasPorUsuario(null);
        return ResponseEntity.ok(naoLidas);
    }
    
    @GetMapping("/count-nao-lidas")
    @PreAuthorize("hasAnyRole('EMPREITEIRO', 'ENGENHEIRO', 'GESTOR_MATERIAIS', 'TECNICO_OBRA')")
    public ResponseEntity<Map<String, Long>> contarNaoLidas() {
        Long count = notificacaoService.contarNaoLidasPorUsuario(null);
        Map<String, Long> response = new HashMap<>();
        response.put("count", count);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('EMPREITEIRO', 'ENGENHEIRO', 'GESTOR_MATERIAIS', 'TECNICO_OBRA')")
    public ResponseEntity<Notificacao> obterNotificacao(@PathVariable Long id) {
        Notificacao notificacao = notificacaoService.buscarPorUsuario(null, PageRequest.of(0, 1))
                .getContent().stream()
                .filter(n -> n.getId().equals(id))
                .findFirst()
                .orElse(null);
        return ResponseEntity.ok(notificacao);
    }
    
    @PutMapping("/{id}/marcar-lida")
    @PreAuthorize("hasAnyRole('EMPREITEIRO', 'ENGENHEIRO', 'GESTOR_MATERIAIS', 'TECNICO_OBRA')")
    public ResponseEntity<Notificacao> marcarComoLida(@PathVariable Long id) {
        Notificacao notificacao = notificacaoService.marcarComoLida(id);
        return ResponseEntity.ok(notificacao);
    }
    
    @PutMapping("/marcar-todas-lidas")
    @PreAuthorize("hasAnyRole('EMPREITEIRO', 'ENGENHEIRO', 'GESTOR_MATERIAIS', 'TECNICO_OBRA')")
    public ResponseEntity<Void> marcarTodasComoLidas() {
        notificacaoService.marcarTodasComoLidas(null);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping
    @PreAuthorize("hasRole('EMPREITEIRO') or hasRole('ENGENHEIRO')")
    public ResponseEntity<Notificacao> criarNotificacao(@RequestBody Notificacao notificacao) {
        Notificacao criada = notificacaoService.criarNotificacao(notificacao);
        return ResponseEntity.ok(criada);
    }
}

package com.construction.gestao.repository;

import com.construction.gestao.model.Notificacao;
import com.construction.gestao.model.Obra;
import com.construction.gestao.model.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificacaoRepository extends JpaRepository<Notificacao, Long> {
    
    Page<Notificacao> findByDestinatario(Usuario destinatario, Pageable pageable);
    
    Page<Notificacao> findByDestinatarioAndLida(Usuario destinatario, Boolean lida, Pageable pageable);
    
    Page<Notificacao> findByObra(Obra obra, Pageable pageable);
    
    @Query("SELECT n FROM Notificacao n WHERE n.destinatario = :usuario AND n.lida = false ORDER BY n.dataCriacao DESC")
    List<Notificacao> findNaoLidasByUsuario(@Param("usuario") Usuario usuario);
    
    @Query("SELECT COUNT(n) FROM Notificacao n WHERE n.destinatario = :usuario AND n.lida = false")
    Long countNaoLidasByUsuario(@Param("usuario") Usuario usuario);
    
    @Query("SELECT n FROM Notificacao n WHERE n.obra = :obra AND n.dataCriacao BETWEEN :inicio AND :fim ORDER BY n.dataCriacao DESC")
    List<Notificacao> findByObraAndPeriodo(@Param("obra") Obra obra, 
                                            @Param("inicio") LocalDateTime inicio, 
                                            @Param("fim") LocalDateTime fim);
    
    @Query("SELECT n FROM Notificacao n WHERE n.tipo = :tipo AND n.dataCriacao >= :data ORDER BY n.dataCriacao DESC")
    List<Notificacao> findByTipoAndDataAfter(@Param("tipo") Notificacao.TipoNotificacao tipo, 
                                             @Param("data") LocalDateTime data);
}

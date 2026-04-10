package com.construction.gestao.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "notificacoes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notificacao {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    private String titulo;
    
    @NotBlank
    @Column(columnDefinition = "TEXT")
    private String mensagem;
    
    @NotNull
    @Enumerated(EnumType.STRING)
    private TipoNotificacao tipo;
    
    @NotNull
    @Enumerated(EnumType.STRING)
    private PrioridadeNotificacao prioridade;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private Usuario destinatario;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "obra_id")
    private Obra obra;
    
    private Boolean lida = false;
    
    private LocalDateTime dataCriacao;
    
    private LocalDateTime dataNotificacao;
    
    @PrePersist
    public void prePersist() {
        if (dataCriacao == null) {
            dataCriacao = LocalDateTime.now();
        }
        if (dataNotificacao == null) {
            dataNotificacao = LocalDateTime.now();
        }
        if (lida == null) {
            lida = false;
        }
    }
    
    public enum TipoNotificacao {
        PRAZO,
        DESVIO_CUSTO,
        STOCK_CRITICO,
        ATRASO_ATIVIDADE,
        OCORRENCIA,
        GENERICA
    }
    
    public enum PrioridadeNotificacao {
        BAIXA,
        MEDIA,
        ALTA,
        URGENTE
    }
}

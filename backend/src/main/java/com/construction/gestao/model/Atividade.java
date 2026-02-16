package com.construction.gestao.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "atividades")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Atividade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String nome;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cronograma_id", nullable = false)
    private Cronograma cronograma;

    @NotNull
    @Column(name = "data_inicio_prevista", nullable = false)
    private LocalDate dataInicioPrevista;

    @NotNull
    @Column(name = "data_fim_prevista", nullable = false)
    private LocalDate dataFimPrevista;

    @Column(name = "data_inicio_real")
    private LocalDate dataInicioReal;

    @Column(name = "data_fim_real")
    private LocalDate dataFimReal;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusAtividade status = StatusAtividade.PLANEJADA;

    @Column(name = "percentual_conclusao")
    private Double percentualConclusao = 0.0;

    @Column(name = "prioridade")
    @Enumerated(EnumType.STRING)
    private Prioridade prioridade = Prioridade.MEDIA;

    @Column(name = "data_criacao", nullable = false, updatable = false)
    private LocalDateTime dataCriacao;

    @Column(name = "data_atualizacao")
    private LocalDateTime dataAtualizacao;

    @PrePersist
    protected void onCreate() {
        dataCriacao = LocalDateTime.now();
        dataAtualizacao = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        dataAtualizacao = LocalDateTime.now();
    }

    public enum StatusAtividade {
        PLANEJADA,
        EM_ANDAMENTO,
        CONCLUIDA,
        ATRASADA,
        CANCELADA
    }

    public enum Prioridade {
        BAIXA,
        MEDIA,
        ALTA,
        URGENTE
    }
}


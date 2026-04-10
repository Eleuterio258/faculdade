package com.construction.gestao.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cotacoes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Cotacao {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Column(name = "numero_cotacao", nullable = false, unique = true)
    private String numeroCotacao;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fornecedor_id", nullable = false)
    private Fornecedor fornecedor;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "obra_id", nullable = false)
    @JsonIgnore
    private Obra obra;
    
    @NotNull
    @Column(name = "data_cotacao", nullable = false)
    private LocalDate dataCotacao;
    
    @Column(name = "data_validade")
    private LocalDate dataValidade;
    
    @Column(name = "condicoes_pagamento")
    private String condicoesPagamento;
    
    @Column(name = "prazo_entrega")
    private String prazoEntrega;
    
    @Column(name = "observacoes", columnDefinition = "TEXT")
    private String observacoes;
    
    @Column(name = "valor_total", precision = 15, scale = 2)
    private BigDecimal valorTotal = BigDecimal.ZERO;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusCotacao status = StatusCotacao.PENDENTE;
    
    @Column(name = "data_decisao")
    private LocalDate dataDecisao;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "decisao")
    private DecisaoCotacao decisao;
    
    @OneToMany(mappedBy = "cotacao", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CotacaoItem> itens = new ArrayList<>();
    
    @Column(name = "data_criacao", nullable = false, updatable = false)
    private LocalDateTime dataCriacao;
    
    @Column(name = "data_atualizacao")
    private LocalDateTime dataAtualizacao;
    
    @PrePersist
    protected void onCreate() {
        dataCriacao = LocalDateTime.now();
        dataAtualizacao = LocalDateTime.now();
        if (numeroCotacao == null || numeroCotacao.isEmpty()) {
            numeroCotacao = "COT-" + System.currentTimeMillis();
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        dataAtualizacao = LocalDateTime.now();
        calcularValorTotal();
    }
    
    public void calcularValorTotal() {
        this.valorTotal = itens.stream()
                .map(item -> item.getQuantidade().multiply(item.getPrecoUnitario()))
                .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);
    }
    
    public enum StatusCotacao {
        PENDENTE,
        ENVIADA,
        RECEBIDA,
        EM_ANALISE,
        APROVADA,
        REJEITADA,
        EXPIRADA
    }
    
    public enum DecisaoCotacao {
        APROVADA,
        REJEITADA_PRECO,
        REJEITADA_PRAZO,
        REJEITADA_CONDICOES,
        REJEITADA_QUALIDADE,
        AGUARDANDO_MELHOR_CONDICOES
    }
}

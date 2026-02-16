package com.construction.gestao.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
@Table(name = "obras")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Obra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String nome;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @NotBlank
    private String endereco;

    @NotBlank
    private String localizacao;

    @NotNull
    @Column(name = "data_inicio", nullable = false)
    private LocalDate dataInicio;

    @Column(name = "data_fim_prevista")
    private LocalDate dataFimPrevista;

    @Column(name = "data_fim_real")
    private LocalDate dataFimReal;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusObra status = StatusObra.PLANEAMENTO;

    @Column(name = "orcamento_previsto", precision = 15, scale = 2)
    private BigDecimal orcamentoPrevisto;

    @Column(name = "custo_realizado", precision = 15, scale = 2)
    private BigDecimal custoRealizado = BigDecimal.ZERO;

    @Column(name = "percentual_conclusao")
    private Double percentualConclusao = 0.0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    @JsonIgnoreProperties({"obras", "password"})
    private Usuario usuario;

    @OneToMany(mappedBy = "obra", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("obra")
    private List<Cronograma> cronogramas = new ArrayList<>();

    @OneToMany(mappedBy = "obra", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("obra")
    private List<DiarioObra> diarios = new ArrayList<>();

    @OneToMany(mappedBy = "obra", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("obra")
    private List<Material> materiais = new ArrayList<>();

    @OneToMany(mappedBy = "obra", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("obra")
    private List<Custo> custos = new ArrayList<>();

    @OneToMany(mappedBy = "obra", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("obra")
    private List<Equipa> equipas = new ArrayList<>();

    @OneToMany(mappedBy = "obra", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("obra")
    private List<Documento> documentos = new ArrayList<>();

    @OneToMany(mappedBy = "obra", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("obra")
    private List<Ocorrencia> ocorrencias = new ArrayList<>();

    @OneToMany(mappedBy = "obra", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("obra")
    private List<Fornecedor> fornecedores = new ArrayList<>();

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

    public enum StatusObra {
        PLANEAMENTO,
        EM_ANDAMENTO,
        PARALISADA,
        CONCLUIDA,
        CANCELADA
    }
}


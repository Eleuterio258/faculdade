package com.construction.gestao.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "cotacao_itens")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CotacaoItem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cotacao_id", nullable = false)
    @JsonIgnore
    private Cotacao cotacao;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "material_id")
    private Material material;
    
    @NotBlank
    @Column(name = "descricao_material", nullable = false)
    private String descricaoMaterial;
    
    @NotNull
    @Column(nullable = false)
    private BigDecimal quantidade;
    
    @NotBlank
    private String unidade;
    
    @NotNull
    @Column(name = "preco_unitario", nullable = false, precision = 12, scale = 2)
    private BigDecimal precoUnitario;
    
    @Column(name = "preco_total", precision = 15, scale = 2)
    private BigDecimal precoTotal;
    
    @Column(name = "especificacoes", columnDefinition = "TEXT")
    private String especificacoes;
    
    @Column(name = "marca")
    private String marca;
    
    @Column(name = "desconto_percentual")
    private BigDecimal descontoPercentual = BigDecimal.ZERO;
    
    @Column(name = "observacoes", columnDefinition = "TEXT")
    private String observacoes;
    
    @PrePersist
    @PreUpdate
    protected void calcularPrecoTotal() {
        if (quantidade != null && precoUnitario != null) {
            BigDecimal subtotal = quantidade.multiply(precoUnitario);
            if (descontoPercentual != null && descontoPercentual.compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal desconto = subtotal.multiply(descontoPercentual).divide(BigDecimal.valueOf(100));
                this.precoTotal = subtotal.subtract(desconto);
            } else {
                this.precoTotal = subtotal;
            }
        }
    }
}

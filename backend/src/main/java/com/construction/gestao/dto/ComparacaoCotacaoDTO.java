package com.construction.gestao.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComparacaoCotacaoDTO {
    
    private Long materialId;
    private String materialNome;
    private List<FornecedorComparacaoDTO> comparacoes;
    private MelhorPrecoDTO melhorPreco;
    private EstatisticasDTO estatisticas;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FornecedorComparacaoDTO {
        private Long fornecedorId;
        private String fornecedorNome;
        private BigDecimal precoUnitario;
        private BigDecimal precoTotal;
        private String condicoesPagamento;
        private String prazoEntrega;
        private boolean menorPreco;
        private double percentualDiferenca;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MelhorPrecoDTO {
        private Long fornecedorId;
        private String fornecedorNome;
        private BigDecimal precoUnitario;
        private BigDecimal economiaPotencial;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EstatisticasDTO {
        private BigDecimal menorPreco;
        private BigDecimal maiorPreco;
        private BigDecimal precoMedio;
        private BigDecimal desvioPadrao;
        private int totalFornecedores;
        private Map<String, BigDecimal> detalhesPorFornecedor;
    }
}

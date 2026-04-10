package com.construction.gestao.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CotacaoDTO {
    
    private Long id;
    private String numeroCotacao;
    private Long fornecedorId;
    private String fornecedorNome;
    private Long obraId;
    private String dataCotacao;
    private String dataValidade;
    private String condicoesPagamento;
    private String prazoEntrega;
    private String observacoes;
    private BigDecimal valorTotal;
    private String status;
    private List<CotacaoItemDTO> itens;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CotacaoItemDTO {
        private Long id;
        private Long materialId;
        private String descricaoMaterial;
        private BigDecimal quantidade;
        private String unidade;
        private BigDecimal precoUnitario;
        private BigDecimal precoTotal;
        private String especificacoes;
        private String marca;
        private BigDecimal descontoPercentual;
        private String observacoes;
    }
}

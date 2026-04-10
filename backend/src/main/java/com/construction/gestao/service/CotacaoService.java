package com.construction.gestao.service;

import com.construction.gestao.dto.ComparacaoCotacaoDTO;
import com.construction.gestao.dto.CotacaoDTO;
import com.construction.gestao.model.*;
import com.construction.gestao.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CotacaoService {
    
    private final CotacaoRepository cotacaoRepository;
    private final CotacaoItemRepository cotacaoItemRepository;
    private final FornecedorRepository fornecedorRepository;
    private final ObraRepository obraRepository;
    private final MaterialRepository materialRepository;
    
    @Transactional
    public Cotacao criarCotacao(Cotacao cotacao, List<CotacaoItem> itens) {
        cotacao.setStatus(Cotacao.StatusCotacao.PENDENTE);
        cotacao.setItens(itens);
        
        itens.forEach(item -> item.setCotacao(cotacao));
        cotacao.calcularValorTotal();
        
        return cotacaoRepository.save(cotacao);
    }
    
    @Transactional(readOnly = true)
    public List<Cotacao> getCotacoesByObra(Long obraId) {
        Obra obra = obraRepository.findById(obraId)
                .orElseThrow(() -> new RuntimeException("Obra não encontrada"));
        return cotacaoRepository.findByObra(obra);
    }
    
    @Transactional(readOnly = true)
    public Cotacao getCotacaoById(Long id) {
        return cotacaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cotação não encontrada"));
    }
    
    @Transactional
    public Cotacao atualizarCotacao(Long id, Cotacao cotacaoDetails, List<CotacaoItem> itens) {
        Cotacao cotacao = getCotacaoById(id);
        
        cotacao.setFornecedor(cotacaoDetails.getFornecedor());
        cotacao.setDataCotacao(cotacaoDetails.getDataCotacao());
        cotacao.setDataValidade(cotacaoDetails.getDataValidade());
        cotacao.setCondicoesPagamento(cotacaoDetails.getCondicoesPagamento());
        cotacao.setPrazoEntrega(cotacaoDetails.getPrazoEntrega());
        cotacao.setObservacoes(cotacaoDetails.getObservacoes());
        cotacao.setStatus(cotacaoDetails.getStatus());
        
        if (itens != null) {
            cotacao.getItens().clear();
            itens.forEach(item -> {
                item.setCotacao(cotacao);
                cotacao.getItens().add(item);
            });
        }
        
        cotacao.calcularValorTotal();
        return cotacaoRepository.save(cotacao);
    }
    
    @Transactional
    public Cotacao atualizarStatus(Long id, Cotacao.StatusCotacao status, Cotacao.DecisaoCotacao decisao) {
        Cotacao cotacao = getCotacaoById(id);
        cotacao.setStatus(status);
        cotacao.setDecisao(decisao);
        
        if (status == Cotacao.StatusCotacao.APROVADA || status == Cotacao.StatusCotacao.REJEITADA) {
            cotacao.setDataDecisao(LocalDate.now());
        }
        
        return cotacaoRepository.save(cotacao);
    }
    
    @Transactional(readOnly = true)
    public List<ComparacaoCotacaoDTO> compararCotacoesPorMaterial(Long obraId, List<Long> materiaisIds) {
        Obra obra = obraRepository.findById(obraId)
                .orElseThrow(() -> new RuntimeException("Obra não encontrada"));
        
        List<ComparacaoCotacaoDTO> comparacoes = new ArrayList<>();
        
        for (Long materialId : materiaisIds) {
            Material material = materialRepository.findById(materialId)
                    .orElseThrow(() -> new RuntimeException("Material não encontrado: " + materialId));
            
            ComparacaoCotacaoDTO comparacao = analisarMaterial(obra, material);
            comparacoes.add(comparacao);
        }
        
        return comparacoes;
    }
    
    @Transactional(readOnly = true)
    public ComparacaoCotacaoDTO analisarMaterial(Obra obra, Material material) {
        List<Cotacao> cotacoes = cotacaoRepository.findByObraEMaterial(obra, material);
        
        ComparacaoCotacaoDTO dto = new ComparacaoCotacaoDTO();
        dto.setMaterialId(material.getId());
        dto.setMaterialNome(material.getNome());
        
        List<ComparacaoCotacaoDTO.FornecedorComparacaoDTO> comparacoes = new ArrayList<>();
        BigDecimal menorPreco = BigDecimal.valueOf(Double.MAX_VALUE);
        BigDecimal maiorPreco = BigDecimal.ZERO;
        BigDecimal somaPrecos = BigDecimal.ZERO;
        int count = 0;
        
        for (Cotacao cotacao : cotacoes) {
            Optional<CotacaoItem> itemOpt = cotacao.getItens().stream()
                    .filter(i -> i.getMaterial() != null && i.getMaterial().getId().equals(material.getId()))
                    .findFirst();
            
            if (itemOpt.isPresent()) {
                CotacaoItem item = itemOpt.get();
                
                comparacoes.add(new ComparacaoCotacaoDTO.FornecedorComparacaoDTO(
                        cotacao.getFornecedor().getId(),
                        cotacao.getFornecedor().getNome(),
                        item.getPrecoUnitario(),
                        item.getPrecoTotal(),
                        cotacao.getCondicoesPagamento(),
                        cotacao.getPrazoEntrega(),
                        false,
                        0.0
                ));
                
                if (item.getPrecoUnitario().compareTo(menorPreco) < 0) {
                    menorPreco = item.getPrecoUnitario();
                }
                if (item.getPrecoUnitario().compareTo(maiorPreco) > 0) {
                    maiorPreco = item.getPrecoUnitario();
                }
                somaPrecos = somaPrecos.add(item.getPrecoUnitario());
                count++;
            }
        }
        
        // Calcular percentual de diferença e marcar menor preço
        for (ComparacaoCotacaoDTO.FornecedorComparacaoDTO comp : comparacoes) {
            double diff = comp.getPrecoUnitario().subtract(menorPreco).doubleValue();
            double percentual = menorPreco.compareTo(BigDecimal.ZERO) > 0 ? 
                    (diff / menorPreco.doubleValue()) * 100 : 0;
            comp.setPercentualDiferenca(Math.round(percentual * 100.0) / 100.0);
            comp.setMenorPreco(comp.getPrecoUnitario().equals(menorPreco));
        }
        
        dto.setComparacoes(comparacoes);
        
        // Melhor preço
        if (!comparacoes.isEmpty()) {
            ComparacaoCotacaoDTO.FornecedorComparacaoDTO melhor = comparacoes.stream()
                    .filter(ComparacaoCotacaoDTO.FornecedorComparacaoDTO::isMenorPreco)
                    .findFirst()
                    .orElse(null);
            
            if (melhor != null) {
                BigDecimal economia = maiorPreco.subtract(menorPreco);
                dto.setMelhorPreco(new ComparacaoCotacaoDTO.MelhorPrecoDTO(
                        melhor.getFornecedorId(),
                        melhor.getFornecedorNome(),
                        melhor.getPrecoUnitario(),
                        economia
                ));
            }
        }
        
        // Estatísticas
        BigDecimal precoMedio = count > 0 ? somaPrecos.divide(BigDecimal.valueOf(count), 2, RoundingMode.HALF_UP) : BigDecimal.ZERO;
        Map<String, BigDecimal> detalhesPorFornecedor = comparacoes.stream()
                .collect(Collectors.toMap(
                        ComparacaoCotacaoDTO.FornecedorComparacaoDTO::getFornecedorNome,
                        ComparacaoCotacaoDTO.FornecedorComparacaoDTO::getPrecoUnitario
                ));
        
        dto.setEstatisticas(new ComparacaoCotacaoDTO.EstatisticasDTO(
                menorPreco.equals(BigDecimal.valueOf(Double.MAX_VALUE)) ? BigDecimal.ZERO : menorPreco,
                maiorPreco,
                precoMedio,
                BigDecimal.ZERO, // Desvio padrão pode ser calculado se necessário
                comparacoes.size(),
                detalhesPorFornecedor
        ));
        
        return dto;
    }
    
    @Transactional(readOnly = true)
    public Map<String, Object> gerarAnaliseMercado(Long obraId, LocalDate inicio, LocalDate fim) {
        Obra obra = obraRepository.findById(obraId)
                .orElseThrow(() -> new RuntimeException("Obra não encontrada"));
        
        List<Cotacao> cotacoes = cotacaoRepository.findByObraAndPeriodo(obra, inicio, fim);
        
        Map<String, Object> analise = new HashMap<>();
        analise.put("totalCotacoes", cotacoes.size());
        analise.put("cotacoesAprovadas", cotacoes.stream().filter(c -> c.getStatus() == Cotacao.StatusCotacao.APROVADA).count());
        analise.put("cotacoesPendentes", cotacoes.stream().filter(c -> c.getStatus() == Cotacao.StatusCotacao.PENDENTE).count());
        analise.put("valorTotalCotacoes", cotacoes.stream().map(Cotacao::getValorTotal).reduce(BigDecimal.ZERO, BigDecimal::add));
        
        // Fornecedor mais utilizado
        Map<Fornecedor, Long> fornecedoresCount = cotacoes.stream()
                .collect(Collectors.groupingBy(Cotacao::getFornecedor, Collectors.counting()));
        
        Fornecedor fornecedorTop = fornecedoresCount.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse(null);
        
        analise.put("fornecedorMaisUtilizado", fornecedorTop != null ? fornecedorTop.getNome() : null);
        analise.put("economiaPotencial", calcularEconomiaPotencial(cotacoes));
        
        return analise;
    }
    
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getRecomendacoes(Long obraId) {
        Obra obra = obraRepository.findById(obraId)
                .orElseThrow(() -> new RuntimeException("Obra não encontrada"));
        
        List<Cotacao> cotacoes = cotacaoRepository.findByObra(obra);
        List<Map<String, Object>> recomendacoes = new ArrayList<>();
        
        // Recomendação 1: Cotações pendentes há muito tempo
        long pendentesAntigas = cotacoes.stream()
                .filter(c -> c.getStatus() == Cotacao.StatusCotacao.PENDENTE)
                .filter(c -> c.getDataCotacao().isBefore(LocalDate.now().minusDays(7)))
                .count();
        
        if (pendentesAntigas > 0) {
            Map<String, Object> rec = new HashMap<>();
            rec.put("tipo", "URGENTE");
            rec.put("mensagem", String.format("Existem %d cotações pendentes há mais de 7 dias", pendentesAntigas));
            rec.put("acao", "Avaliar e decidir sobre as cotações pendentes");
            recomendacoes.add(rec);
        }
        
        // Recomendação 2: Cotações prestes a expirar
        long prestesExpirar = cotacoes.stream()
                .filter(c -> c.getDataValidade() != null)
                .filter(c -> c.getDataValidade().isAfter(LocalDate.now()) && c.getDataValidade().isBefore(LocalDate.now().plusDays(3)))
                .count();
        
        if (prestesExpirar > 0) {
            Map<String, Object> rec = new HashMap<>();
            rec.put("tipo", "ALERTA");
            rec.put("mensagem", String.format("%d cotações estão prestes a expirar", prestesExpirar));
            rec.put("acao", "Renovar ou decidir antes do vencimento");
            recomendacoes.add(rec);
        }
        
        // Recomendação 3: Oportunidade de economia
        BigDecimal economiaPotencial = calcularEconomiaPotencial(cotacoes);
        if (economiaPotencial.compareTo(BigDecimal.valueOf(1000)) > 0) {
            Map<String, Object> rec = new HashMap<>();
            rec.put("tipo", "ECONOMIA");
            rec.put("mensagem", String.format("Potencial de economia: %s MZN", economiaPotencial));
            rec.put("acao", "Considerar fornecedores com melhores preços");
            recomendacoes.add(rec);
        }
        
        return recomendacoes;
    }
    
    private BigDecimal calcularEconomiaPotencial(List<Cotacao> cotacoes) {
        // Simplificação: calcula diferença entre menor e maior preço por material
        BigDecimal economia = BigDecimal.ZERO;
        
        // Agrupar cotações por material
        Map<Material, List<CotacaoItem>> itensPorMaterial = new HashMap<>();
        for (Cotacao cotacao : cotacoes) {
            for (CotacaoItem item : cotacao.getItens()) {
                if (item.getMaterial() != null) {
                    itensPorMaterial.computeIfAbsent(item.getMaterial(), k -> new ArrayList<>()).add(item);
                }
            }
        }
        
        // Calcular economia para cada material
        for (List<CotacaoItem> itens : itensPorMaterial.values()) {
            if (itens.size() > 1) {
                BigDecimal menor = itens.stream().map(CotacaoItem::getPrecoUnitario).min(BigDecimal::compareTo).orElse(BigDecimal.ZERO);
                BigDecimal maior = itens.stream().map(CotacaoItem::getPrecoUnitario).max(BigDecimal::compareTo).orElse(BigDecimal.ZERO);
                economia = economia.add(maior.subtract(menor));
            }
        }
        
        return economia;
    }
    
    @Transactional
    public void eliminarCotacao(Long id) {
        if (!cotacaoRepository.existsById(id)) {
            throw new RuntimeException("Cotação não encontrada");
        }
        cotacaoRepository.deleteById(id);
    }
}

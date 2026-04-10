package com.construction.gestao.service;

import com.construction.gestao.model.*;
import com.construction.gestao.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {
    
    private final ObraRepository obraRepository;
    private final CronogramaRepository cronogramaRepository;
    private final AtividadeRepository atividadeRepository;
    private final CustoRepository custoRepository;
    private final MaterialRepository materialRepository;
    private final MovimentoMaterialRepository movimentoMaterialRepository;
    private final EquipaRepository equipaRepository;
    private final PresencaRepository presencaRepository;
    private final DiarioObraRepository diarioObraRepository;
    private final OcorrenciaRepository ocorrenciaRepository;
    
    @Transactional(readOnly = true)
    public Map<String, Object> gerarRelatorioObra(Long obraId) {
        Obra obra = obraRepository.findById(obraId)
                .orElseThrow(() -> new RuntimeException("Obra não encontrada"));
        
        Map<String, Object> relatorio = new HashMap<>();
        relatorio.put("obra", obra);
        relatorio.put("dadosGerais", getDadosGerais(obra));
        relatorio.put("progresso", getProgresso(obra));
        relatorio.put("financas", getFinancas(obra));
        relatorio.put("materiais", getMateriais(obra));
        relatorio.put("equipas", getEquipas(obra));
        relatorio.put("ocorrencias", getOcorrencias(obra));
        
        return relatorio;
    }
    
    @Transactional(readOnly = true)
    public Map<String, Object> getDadosGerais(Obra obra) {
        Map<String, Object> dados = new HashMap<>();
        dados.put("nome", obra.getNome());
        dados.put("descricao", obra.getDescricao());
        dados.put("endereco", obra.getEndereco());
        dados.put("localizacao", obra.getLocalizacao());
        dados.put("dataInicio", obra.getDataInicio());
        dados.put("dataFimPrevista", obra.getDataFimPrevista());
        dados.put("dataFimReal", obra.getDataFimReal());
        dados.put("status", obra.getStatus());
        dados.put("orcamentoPrevisto", obra.getOrcamentoPrevisto());
        dados.put("custoRealizado", obra.getCustoRealizado());
        dados.put("percentualConclusao", obra.getPercentualConclusao());
        
        long diasDecorridos = java.time.temporal.ChronoUnit.DAYS.between(obra.getDataInicio(), LocalDate.now());
        dados.put("diasDecorridos", diasDecorridos);
        
        if (obra.getDataFimPrevista() != null) {
            long diasRestantes = java.time.temporal.ChronoUnit.DAYS.between(LocalDate.now(), obra.getDataFimPrevista());
            dados.put("diasRestantes", diasRestantes);
        }
        
        return dados;
    }
    
    @Transactional(readOnly = true)
    public Map<String, Object> getProgresso(Obra obra) {
        Map<String, Object> progresso = new HashMap<>();
        
        List<Cronograma> cronogramas = cronogramaRepository.findByObra(obra);
        List<Atividade> todasAtividades = new ArrayList<>();
        cronogramas.forEach(c -> todasAtividades.addAll(c.getAtividades()));
        
        progresso.put("totalAtividades", todasAtividades.size());
        progresso.put("atividadesConcluidas", todasAtividades.stream()
                .filter(a -> a.getStatus() == Atividade.StatusAtividade.CONCLUIDA)
                .count());
        progresso.put("atividadesEmAndamento", todasAtividades.stream()
                .filter(a -> a.getStatus() == Atividade.StatusAtividade.EM_ANDAMENTO)
                .count());
        progresso.put("atividadesAtrasadas", todasAtividades.stream()
                .filter(this::isAtrasada)
                .count());
        progresso.put("percentualConclusao", obra.getPercentualConclusao());
        
        return progresso;
    }
    
    @Transactional(readOnly = true)
    public Map<String, Object> getFinancas(Obra obra) {
        Map<String, Object> financas = new HashMap<>();
        
        List<Custo> custos = custoRepository.findByObra(obra);
        BigDecimal custoTotal = custos.stream()
                .map(Custo::getValor)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        Map<Custo.TipoCusto, BigDecimal> custosPorTipo = custos.stream()
                .collect(Collectors.groupingBy(
                        Custo::getTipo,
                        Collectors.reducing(BigDecimal.ZERO, Custo::getValor, BigDecimal::add)
                ));
        
        BigDecimal orcamento = obra.getOrcamentoPrevisto() != null ? obra.getOrcamentoPrevisto() : BigDecimal.ZERO;
        BigDecimal desvio = custoTotal.subtract(orcamento);
        Double percentualDesvio = orcamento.compareTo(BigDecimal.ZERO) > 0 ? 
                (desvio.doubleValue() / orcamento.doubleValue()) * 100 : 0.0;
        
        financas.put("orcamentoPrevisto", orcamento);
        financas.put("custoRealizado", custoTotal);
        financas.put("desvio", desvio);
        financas.put("percentualDesvio", percentualDesvio);
        financas.put("custosPorTipo", custosPorTipo);
        financas.put("totalCustos", custos.size());
        
        return financas;
    }
    
    @Transactional(readOnly = true)
    public Map<String, Object> getMateriais(Obra obra) {
        Map<String, Object> materiais = new HashMap<>();
        
        List<Material> listaMateriais = materialRepository.findByObra(obra);
        long totalMateriais = listaMateriais.size();
        long materiaisStockCritico = listaMateriais.stream()
                .filter(m -> m.getQuantidadeEstoque().compareTo(m.getQuantidadeMinima()) <= 0)
                .count();
        
        BigDecimal valorTotalStock = listaMateriais.stream()
                .map(m -> m.getQuantidadeEstoque().multiply(m.getPrecoUnitario() != null ? m.getPrecoUnitario() : BigDecimal.ZERO))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        materiais.put("totalMateriais", totalMateriais);
        materiais.put("materiaisStockCritico", materiaisStockCritico);
        materiais.put("valorTotalStock", valorTotalStock);
        materiais.put("listaMateriais", listaMateriais);
        
        return materiais;
    }
    
    @Transactional(readOnly = true)
    public Map<String, Object> getEquipas(Obra obra) {
        Map<String, Object> equipas = new HashMap<>();
        
        List<Equipa> listaEquipas = equipaRepository.findByObra(obra);
        equipas.put("totalEquipas", listaEquipas.size());
        equipas.put("equipas", listaEquipas);
        
        return equipas;
    }
    
    @Transactional(readOnly = true)
    public Map<String, Object> getOcorrencias(Obra obra) {
        Map<String, Object> ocorrencias = new HashMap<>();
        
        List<Ocorrencia> listaOcorrencias = ocorrenciaRepository.findByObra(obra);
        
        long totalOcorrencias = listaOcorrencias.size();
        long abertas = listaOcorrencias.stream()
                .filter(o -> o.getStatus() == Ocorrencia.StatusOcorrencia.ABERTA)
                .count();
        long emAnalise = listaOcorrencias.stream()
                .filter(o -> o.getStatus() == Ocorrencia.StatusOcorrencia.EM_ANALISE)
                .count();
        long resolvidas = listaOcorrencias.stream()
                .filter(o -> o.getStatus() == Ocorrencia.StatusOcorrencia.RESOLVIDA)
                .count();
        
        ocorrencias.put("totalOcorrencias", totalOcorrencias);
        ocorrencias.put("abertas", abertas);
        ocorrencias.put("emAnalise", emAnalise);
        ocorrencias.put("resolvidas", resolvidas);
        ocorrencias.put("listaOcorrencias", listaOcorrencias);
        
        return ocorrencias;
    }
    
    @Transactional(readOnly = true)
    public Map<String, Object> gerarRelatorioProdutividade(Long obraId, LocalDate inicio, LocalDate fim) {
        Obra obra = obraRepository.findById(obraId)
                .orElseThrow(() -> new RuntimeException("Obra não encontrada"));
        
        Map<String, Object> relatorio = new HashMap<>();
        
        List<DiarioObra> diarios = diarioObraRepository.findByObraAndDataBetween(obra, inicio, fim);
        List<Presenca> presencas = presencaRepository.findByDataBetween(inicio, fim);
        
        relatorio.put("periodo", inicio + " até " + fim);
        relatorio.put("totalDiasTrabalhados", diarios.size());
        relatorio.put("totalPresencas", presencas.size());
        
        return relatorio;
    }
    
    private boolean isAtrasada(Atividade atividade) {
        if (atividade.getDataFimPrevista() == null) {
            return false;
        }
        return atividade.getStatus() != Atividade.StatusAtividade.CONCLUIDA &&
               LocalDate.now().isAfter(atividade.getDataFimPrevista());
    }
    
    @Transactional(readOnly = true)
    public List<Map<String, Object>> gerarRelatorioComparativoObras(List<Long> obraIds) {
        List<Map<String, Object>> relatorios = new ArrayList<>();
        
        for (Long obraId : obraIds) {
            relatorios.add(gerarRelatorioObra(obraId));
        }
        
        return relatorios;
    }
}

package com.construction.gestao.config;

import com.construction.gestao.model.*;
import com.construction.gestao.repository.*;
import com.construction.gestao.service.NotificacaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
public class ScheduledTasks {
    
    private final ObraRepository obraRepository;
    private final AtividadeRepository atividadeRepository;
    private final MaterialRepository materialRepository;
    private final NotificacaoService notificacaoService;
    private final UsuarioRepository usuarioRepository;
    
    // Check daily at 8 AM
    @Scheduled(cron = "0 0 8 * * ?")
    public void checkPrazosObras() {
        List<Obra> obras = obraRepository.findAll();
        
        for (Obra obra : obras) {
            if (obra.getDataFimPrevista() != null) {
                long diasRestantes = java.time.temporal.ChronoUnit.DAYS.between(LocalDate.now(), obra.getDataFimPrevista());
                
                if (diasRestantes <= 7 && diasRestantes > 0 && obra.getStatus() == Obra.StatusObra.EM_ANDAMENTO) {
                    String titulo = "Prazo próximo - " + obra.getNome();
                    String mensagem = "A obra '" + obra.getNome() + "' tem o prazo de término em " + diasRestantes + " dia(s).";
                    
                    notificacaoService.criarNotificacao(
                            titulo,
                            mensagem,
                            Notificacao.TipoNotificacao.PRAZO,
                            Notificacao.PrioridadeNotificacao.ALTA,
                            obra.getUsuario(),
                            obra
                    );
                } else if (diasRestantes <= 0 && obra.getStatus() == Obra.StatusObra.EM_ANDAMENTO) {
                    String titulo = "Prazo ultrapassado - " + obra.getNome();
                    String mensagem = "A obra '" + obra.getNome() + "' ultrapassou o prazo previsto.";
                    
                    notificacaoService.criarNotificacao(
                            titulo,
                            mensagem,
                            Notificacao.TipoNotificacao.PRAZO,
                            Notificacao.PrioridadeNotificacao.URGENTE,
                            obra.getUsuario(),
                            obra
                    );
                }
            }
        }
    }
    
    // Check daily at 8 AM
    @Scheduled(cron = "0 0 8 * * ?")
    public void checkAtividadesAtrasadas() {
        List<Atividade> atividades = atividadeRepository.findAll();
        
        for (Atividade atividade : atividades) {
            if (atividade.getDataFimPrevista() != null && 
                LocalDate.now().isAfter(atividade.getDataFimPrevista()) &&
                atividade.getStatus() != Atividade.StatusAtividade.CONCLUIDA) {
                
                String titulo = "Atividade atrasada - " + atividade.getNome();
                String mensagem = "A atividade '" + atividade.getNome() + "' está atrasada.";
                
                notificacaoService.criarNotificacao(
                        titulo,
                        mensagem,
                        Notificacao.TipoNotificacao.ATRASO_ATIVIDADE,
                        Notificacao.PrioridadeNotificacao.ALTA,
                        atividade.getCronograma().getObra().getUsuario(),
                        atividade.getCronograma().getObra()
                );
            }
        }
    }
    
    // Check daily at 9 AM
    @Scheduled(cron = "0 0 9 * * ?")
    public void checkStockCritico() {
        List<Material> materiais = materialRepository.findAll();
        
        for (Material material : materiais) {
            if (material.getQuantidadeEstoque().compareTo(material.getQuantidadeMinima()) <= 0) {
                String titulo = "Stock crítico - " + material.getNome();
                String mensagem = "O material '" + material.getNome() + "' está com stock crítico (Qtd: " + 
                                material.getQuantidadeEstoque() + ", Mín: " + material.getQuantidadeMinima() + ").";
                
                notificacaoService.criarNotificacao(
                        titulo,
                        mensagem,
                        Notificacao.TipoNotificacao.STOCK_CRITICO,
                        Notificacao.PrioridadeNotificacao.URGENTE,
                        material.getObra().getUsuario(),
                        material.getObra()
                );
            }
        }
    }
    
    // Check daily at 10 AM
    @Scheduled(cron = "0 0 10 * * ?")
    public void checkDesvioCustos() {
        List<Obra> obras = obraRepository.findAll();
        
        for (Obra obra : obras) {
            if (obra.getOrcamentoPrevisto() != null && obra.getCustoRealizado() != null) {
                BigDecimal desvio = obra.getCustoRealizado().subtract(obra.getOrcamentoPrevisto());
                double percentualDesvio = obra.getOrcamentoPrevisto().compareTo(BigDecimal.ZERO) > 0 ?
                        (desvio.doubleValue() / obra.getOrcamentoPrevisto().doubleValue()) * 100 : 0.0;
                
                if (percentualDesvio > 10) {
                    String titulo = "Desvio de custo - " + obra.getNome();
                    String mensagem = String.format("A obra '%s' apresenta um desvio de custo de %.2f%%.", 
                                                   obra.getNome(), percentualDesvio);
                    
                    notificacaoService.criarNotificacao(
                            titulo,
                            mensagem,
                            Notificacao.TipoNotificacao.DESVIO_CUSTO,
                            Notificacao.PrioridadeNotificacao.ALTA,
                            obra.getUsuario(),
                            obra
                    );
                }
            }
        }
    }
}

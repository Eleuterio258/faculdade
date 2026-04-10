package com.construction.gestao.controller;

import com.construction.gestao.model.Atividade;
import com.construction.gestao.model.Cronograma;
import com.construction.gestao.model.Obra;
import com.construction.gestao.repository.AtividadeRepository;
import com.construction.gestao.repository.CronogramaRepository;
import com.construction.gestao.repository.ObraRepository;
import com.construction.gestao.service.AtividadeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/atividades")
@RequiredArgsConstructor
public class AtividadeController {
    
    private final AtividadeService atividadeService;
    private final AtividadeRepository atividadeRepository;
    private final CronogramaRepository cronogramaRepository;
    
    @GetMapping("/cronograma/{cronogramaId}")
    @PreAuthorize("hasAnyRole('EMPREITEIRO', 'ENGENHEIRO', 'TECNICO_OBRA')")
    public ResponseEntity<List<Atividade>> getAtividadesByCronograma(@PathVariable Long cronogramaId) {
        Cronograma cronograma = cronogramaRepository.findById(cronogramaId)
                .orElseThrow(() -> new RuntimeException("Cronograma não encontrado"));
        List<Atividade> atividades = atividadeRepository.findByCronograma(cronograma);
        return ResponseEntity.ok(atividades);
    }
    
    @GetMapping("/cronograma/{cronogramaId}/atrasadas")
    @PreAuthorize("hasAnyRole('EMPREITEIRO', 'ENGENHEIRO', 'TECNICO_OBRA')")
    public ResponseEntity<List<Atividade>> getAtividadesAtrasadas(@PathVariable Long cronogramaId) {
        Cronograma cronograma = cronogramaRepository.findById(cronogramaId)
                .orElseThrow(() -> new RuntimeException("Cronograma não encontrado"));
        
        List<Atividade> atrasadas = atividadeRepository.findByCronograma(cronograma).stream()
                .filter(a -> a.getDataFimPrevista() != null && 
                             LocalDate.now().isAfter(a.getDataFimPrevista()) &&
                             a.getStatus() != Atividade.StatusAtividade.CONCLUIDA)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(atrasadas);
    }
    
    @GetMapping("/cronograma/{cronogramaId}/progresso")
    @PreAuthorize("hasAnyRole('EMPREITEIRO', 'ENGENHEIRO', 'TECNICO_OBRA')")
    public ResponseEntity<Map<String, Object>> getProgressoCronograma(@PathVariable Long cronogramaId) {
        Cronograma cronograma = cronogramaRepository.findById(cronogramaId)
                .orElseThrow(() -> new RuntimeException("Cronograma não encontrado"));
        
        List<Atividade> atividades = atividadeRepository.findByCronograma(cronograma);
        
        Map<String, Object> progresso = new HashMap<>();
        progresso.put("totalAtividades", atividades.size());
        progresso.put("concluidas", atividades.stream().filter(a -> a.getStatus() == Atividade.StatusAtividade.CONCLUIDA).count());
        progresso.put("emAndamento", atividades.stream().filter(a -> a.getStatus() == Atividade.StatusAtividade.EM_ANDAMENTO).count());
        progresso.put("planejadas", atividades.stream().filter(a -> a.getStatus() == Atividade.StatusAtividade.PLANEJADA).count());
        progresso.put("atrasadas", atividades.stream().filter(a -> a.getDataFimPrevista() != null && 
                                                                     LocalDate.now().isAfter(a.getDataFimPrevista()) &&
                                                                     a.getStatus() != Atividade.StatusAtividade.CONCLUIDA).count());
        
        double percentualMedio = atividades.isEmpty() ? 0 : 
                atividades.stream().mapToDouble(a -> a.getPercentualConclusao() != null ? a.getPercentualConclusao() : 0).average().getAsDouble();
        progresso.put("percentualMedio", percentualMedio);
        
        return ResponseEntity.ok(progresso);
    }
    
    @GetMapping("/cronograma/{cronogramaId}/gantt")
    @PreAuthorize("hasAnyRole('EMPREITEIRO', 'ENGENHEIRO', 'TECNICO_OBRA')")
    public ResponseEntity<List<Map<String, Object>>> getGanttData(@PathVariable Long cronogramaId) {
        Cronograma cronograma = cronogramaRepository.findById(cronogramaId)
                .orElseThrow(() -> new RuntimeException("Cronograma não encontrado"));
        
        List<Atividade> atividades = atividadeRepository.findByCronograma(cronograma);
        
        List<Map<String, Object>> ganttData = atividades.stream().map(a -> {
            Map<String, Object> item = new HashMap<>();
            item.put("id", a.getId());
            item.put("nome", a.getNome());
            item.put("dataInicio", a.getDataInicioPrevista());
            item.put("dataFim", a.getDataFimPrevista());
            item.put("dataInicioReal", a.getDataInicioReal());
            item.put("dataFimReal", a.getDataFimReal());
            item.put("percentualConclusao", a.getPercentualConclusao());
            item.put("status", a.getStatus());
            item.put("prioridade", a.getPrioridade());
            return item;
        }).collect(Collectors.toList());
        
        return ResponseEntity.ok(ganttData);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('EMPREITEIRO', 'ENGENHEIRO', 'TECNICO_OBRA')")
    public ResponseEntity<Atividade> getAtividadeById(@PathVariable Long id) {
        return atividadeRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping("/cronograma/{cronogramaId}")
    @PreAuthorize("hasRole('EMPREITEIRO') or hasRole('ENGENHEIRO')")
    public ResponseEntity<Atividade> createAtividade(@PathVariable Long cronogramaId,
                                                     @Valid @RequestBody Atividade atividade) {
        Cronograma cronograma = cronogramaRepository.findById(cronogramaId)
                .orElseThrow(() -> new RuntimeException("Cronograma não encontrado"));
        
        atividade.setCronograma(cronograma);
        Atividade created = atividadeRepository.save(atividade);
        
        return ResponseEntity.created(URI.create("/api/atividades/" + created.getId())).body(created);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('EMPREITEIRO') or hasRole('ENGENHEIRO')")
    public ResponseEntity<Atividade> updateAtividade(@PathVariable Long id,
                                                     @Valid @RequestBody Atividade atividadeDetails) {
        return atividadeRepository.findById(id)
                .map(atividade -> {
                    atividade.setNome(atividadeDetails.getNome());
                    atividade.setDescricao(atividadeDetails.getDescricao());
                    atividade.setDataInicioPrevista(atividadeDetails.getDataInicioPrevista());
                    atividade.setDataFimPrevista(atividadeDetails.getDataFimPrevista());
                    atividade.setDataInicioReal(atividadeDetails.getDataInicioReal());
                    atividade.setDataFimReal(atividadeDetails.getDataFimReal());
                    atividade.setStatus(atividadeDetails.getStatus());
                    atividade.setPercentualConclusao(atividadeDetails.getPercentualConclusao());
                    atividade.setPrioridade(atividadeDetails.getPrioridade());
                    return atividadeRepository.save(atividade);
                })
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('EMPREITEIRO') or hasRole('ENGENHEIRO')")
    public ResponseEntity<Void> deleteAtividade(@PathVariable Long id) {
        if (!atividadeRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        atividadeRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

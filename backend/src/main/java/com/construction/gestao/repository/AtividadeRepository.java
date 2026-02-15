package com.construction.gestao.repository;

import com.construction.gestao.model.Atividade;
import com.construction.gestao.model.Cronograma;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AtividadeRepository extends JpaRepository<Atividade, Long> {
    List<Atividade> findByCronograma(Cronograma cronograma);
    List<Atividade> findByStatus(Atividade.StatusAtividade status);
}


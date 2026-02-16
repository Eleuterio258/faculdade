package com.construction.gestao.repository;

import com.construction.gestao.model.Ocorrencia;
import com.construction.gestao.model.Obra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OcorrenciaRepository extends JpaRepository<Ocorrencia, Long> {
    List<Ocorrencia> findByObraOrderByDataDesc(Obra obra);
}

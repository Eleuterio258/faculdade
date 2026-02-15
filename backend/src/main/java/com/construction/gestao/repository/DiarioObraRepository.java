package com.construction.gestao.repository;

import com.construction.gestao.model.DiarioObra;
import com.construction.gestao.model.Obra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DiarioObraRepository extends JpaRepository<DiarioObra, Long> {
    List<DiarioObra> findByObra(Obra obra);
    Optional<DiarioObra> findByObraAndData(Obra obra, LocalDate data);
    List<DiarioObra> findByObraAndDataBetween(Obra obra, LocalDate startDate, LocalDate endDate);
}


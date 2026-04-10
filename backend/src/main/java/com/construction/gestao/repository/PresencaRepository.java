package com.construction.gestao.repository;

import com.construction.gestao.model.Equipa;
import com.construction.gestao.model.Presenca;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PresencaRepository extends JpaRepository<Presenca, Long> {
    List<Presenca> findByEquipa(Equipa equipa);
    List<Presenca> findByEquipaAndData(Equipa equipa, LocalDate data);
    List<Presenca> findByDataBetween(LocalDate inicio, LocalDate fim);
}


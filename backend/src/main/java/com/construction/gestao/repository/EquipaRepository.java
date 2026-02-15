package com.construction.gestao.repository;

import com.construction.gestao.model.Equipa;
import com.construction.gestao.model.Obra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EquipaRepository extends JpaRepository<Equipa, Long> {
    List<Equipa> findByObra(Obra obra);
}


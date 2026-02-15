package com.construction.gestao.repository;

import com.construction.gestao.model.Custo;
import com.construction.gestao.model.Obra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustoRepository extends JpaRepository<Custo, Long> {
    List<Custo> findByObra(Obra obra);
}


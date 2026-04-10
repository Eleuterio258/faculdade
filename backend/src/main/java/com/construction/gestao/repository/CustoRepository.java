package com.construction.gestao.repository;

import com.construction.gestao.model.Custo;
import com.construction.gestao.model.Obra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Repository
public interface CustoRepository extends JpaRepository<Custo, Long> {
    List<Custo> findByObra(Obra obra);
    
    @Query("SELECT c.tipo, SUM(c.valor) FROM Custo c WHERE c.obra = :obra GROUP BY c.tipo")
    List<Object[]> sumValorByTipo(@Param("obra") Obra obra);
    
    @Query("SELECT c FROM Custo c WHERE c.obra = :obra AND c.data BETWEEN :inicio AND :fim")
    List<Custo> findByObraAndDataBetween(@Param("obra") Obra obra, 
                                         @Param("inicio") LocalDate inicio, 
                                         @Param("fim") LocalDate fim);
}


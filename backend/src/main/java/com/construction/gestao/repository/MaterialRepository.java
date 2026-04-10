package com.construction.gestao.repository;

import com.construction.gestao.model.Material;
import com.construction.gestao.model.Obra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface MaterialRepository extends JpaRepository<Material, Long> {
    List<Material> findByObra(Obra obra);
    
    List<Material> findByQuantidadeEstoqueLessThanEqual(BigDecimal quantidade);
    
    List<Material> findByObraAndQuantidadeEstoqueLessThanEqual(Obra obra, BigDecimal quantidade);
}


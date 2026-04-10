package com.construction.gestao.repository;

import com.construction.gestao.model.Cotacao;
import com.construction.gestao.model.CotacaoItem;
import com.construction.gestao.model.Material;
import com.construction.gestao.model.Obra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface CotacaoItemRepository extends JpaRepository<CotacaoItem, Long> {
    
    List<CotacaoItem> findByCotacao(Cotacao cotacao);
    
    List<CotacaoItem> findByMaterial(Material material);
    
    @Query("SELECT ci FROM CotacaoItem ci WHERE ci.material = :material AND ci.cotacao.status IN ('APROVADA', 'RECEBIDA') ORDER BY ci.precoUnitario ASC")
    List<CotacaoItem> findMenorPrecoByMaterial(@Param("material") Material material);
    
    @Query("SELECT MIN(ci.precoUnitario) FROM CotacaoItem ci WHERE ci.material = :material AND ci.cotacao.status IN ('APROVADA', 'RECEBIDA')")
    BigDecimal getMenorPrecoByMaterial(@Param("material") Material material);
    
    @Query("SELECT MAX(ci.precoUnitario) FROM CotacaoItem ci WHERE ci.material = :material AND ci.cotacao.status IN ('APROVADA', 'RECEBIDA')")
    BigDecimal getMaiorPrecoByMaterial(@Param("material") Material material);
    
    @Query("SELECT AVG(ci.precoUnitario) FROM CotacaoItem ci WHERE ci.material = :material AND ci.cotacao.status IN ('APROVADA', 'RECEBIDA')")
    BigDecimal getPrecoMedioByMaterial(@Param("material") Material material);
    
    @Query("SELECT ci.material, MIN(ci.precoUnitario), AVG(ci.precoUnitario), COUNT(ci) FROM CotacaoItem ci WHERE ci.cotacao.obra = :obra AND ci.cotacao.status IN ('APROVADA', 'RECEBIDA') GROUP BY ci.material")
    List<Object[]> findEstatisticasByObra(@Param("obra") Obra obra);
}

package com.construction.gestao.repository;

import com.construction.gestao.model.Cotacao;
import com.construction.gestao.model.Fornecedor;
import com.construction.gestao.model.Material;
import com.construction.gestao.model.Obra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface CotacaoRepository extends JpaRepository<Cotacao, Long> {
    
    List<Cotacao> findByObra(Obra obra);
    
    List<Cotacao> findByFornecedor(Fornecedor fornecedor);
    
    List<Cotacao> findByObraAndStatus(Obra obra, Cotacao.StatusCotacao status);
    
    Optional<Cotacao> findByNumeroCotacao(String numeroCotacao);
    
    @Query("SELECT c FROM Cotacao c WHERE c.obra = :obra AND c.dataCotacao BETWEEN :inicio AND :fim ORDER BY c.dataCotacao DESC")
    List<Cotacao> findByObraAndPeriodo(@Param("obra") Obra obra, 
                                       @Param("inicio") LocalDate inicio, 
                                       @Param("fim") LocalDate fim);
    
    @Query("SELECT c FROM Cotacao c JOIN c.itens i WHERE i.material = :material AND c.status = 'APROVADA' ORDER BY c.dataCotacao DESC")
    List<Cotacao> findAprovadasByMaterial(@Param("material") Material material);
    
    @Query("SELECT DISTINCT c FROM Cotacao c JOIN c.itens i WHERE c.obra = :obra AND i.material = :material")
    List<Cotacao> findByObraEMaterial(@Param("obra") Obra obra, @Param("material") Material material);
    
    @Query("SELECT c.fornecedor, AVG(i.precoUnitario) FROM Cotacao c JOIN c.itens i WHERE i.material = :material AND c.status IN ('APROVADA', 'RECEBIDA') GROUP BY c.fornecedor")
    List<Object[]> findPrecoMedioByFornecedorEMaterial(@Param("material") Material material);
    
    long countByObra(Obra obra);
    
    long countByObraAndStatus(Obra obra, Cotacao.StatusCotacao status);
}

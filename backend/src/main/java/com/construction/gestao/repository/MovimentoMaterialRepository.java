package com.construction.gestao.repository;

import com.construction.gestao.model.Material;
import com.construction.gestao.model.MovimentoMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovimentoMaterialRepository extends JpaRepository<MovimentoMaterial, Long> {
    List<MovimentoMaterial> findByMaterial(Material material);
}


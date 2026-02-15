package com.construction.gestao.repository;

import com.construction.gestao.model.Obra;
import com.construction.gestao.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ObraRepository extends JpaRepository<Obra, Long> {
    List<Obra> findByUsuario(Usuario usuario);
    List<Obra> findByStatus(Obra.StatusObra status);
}


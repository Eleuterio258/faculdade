package com.construction.gestao.controller;

import com.construction.gestao.model.Obra;
import com.construction.gestao.repository.ObraRepository;
import com.construction.gestao.service.S3StorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/obras")
@RequiredArgsConstructor
public class ObraImagemController {

    private final ObraRepository obraRepository;
    private final S3StorageService storageService;

    @PostMapping("/{id}/imagem")
    @PreAuthorize("hasRole('EMPREITEIRO') or hasRole('ENGENHEIRO')")
    public ResponseEntity<?> uploadImagemObra(@PathVariable Long id,
                                              @RequestParam("imagem") MultipartFile file) throws IOException {
        Obra obra = obraRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Obra não encontrada"));

        // Delete old image if exists
        if (obra.getImagemUrl() != null) {
            storageService.delete(obra.getImagemUrl());
        }

        String imageUrl = storageService.upload(file, "obras/imagens");
        obra.setImagemUrl(imageUrl);
        obraRepository.save(obra);

        return ResponseEntity.ok(Map.of(
                "imageUrl", imageUrl,
                "message", "Imagem carregada com sucesso"
        ));
    }

    @DeleteMapping("/{id}/imagem")
    @PreAuthorize("hasRole('EMPREITEIRO') or hasRole('ENGENHEIRO')")
    public ResponseEntity<?> deleteImagemObra(@PathVariable Long id) {
        Obra obra = obraRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Obra não encontrada"));

        if (obra.getImagemUrl() != null && !obra.getImagemUrl().isEmpty()) {
            storageService.delete(obra.getImagemUrl());
            obra.setImagemUrl(null);
            obraRepository.save(obra);
        }

        return ResponseEntity.ok(Map.of("message", "Imagem removida com sucesso"));
    }
}

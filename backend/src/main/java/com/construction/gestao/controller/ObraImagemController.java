package com.construction.gestao.controller;

import com.construction.gestao.model.Obra;
import com.construction.gestao.repository.ObraRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@RestController
@RequestMapping("/api/obras")
@RequiredArgsConstructor
public class ObraImagemController {
    
    private final ObraRepository obraRepository;
    
    private final Path UPLOAD_PATH = Paths.get("uploads/obras/imagens");
    
    @PostMapping("/{id}/imagem")
    @PreAuthorize("hasRole('EMPREITEIRO') or hasRole('ENGENHEIRO')")
    public ResponseEntity<?> uploadImagemObra(@PathVariable Long id,
                                              @RequestParam("imagem") MultipartFile file) {
        Obra obra = obraRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Obra não encontrada"));
        
        try {
            // Create upload directory if it doesn't exist
            if (!Files.exists(UPLOAD_PATH)) {
                Files.createDirectories(UPLOAD_PATH);
            }
            
            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".") 
                    ? originalFilename.substring(originalFilename.lastIndexOf(".")) 
                    : ".jpg";
            String filename = UUID.randomUUID() + extension;
            
            // Save file
            Path filePath = UPLOAD_PATH.resolve(filename);
            Files.copy(file.getInputStream(), filePath);
            
            // Update obra with image URL
            String imageUrl = "/uploads/obras/imagens/" + filename;
            obra.setImagemUrl(imageUrl);
            obraRepository.save(obra);
            
            return ResponseEntity.ok().body(new java.util.HashMap<String, String>() {{
                put("imageUrl", imageUrl);
                put("message", "Imagem carregada com sucesso");
            }});
            
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Erro ao salvar imagem: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/{id}/imagem")
    @PreAuthorize("hasRole('EMPREITEIRO') or hasRole('ENGENHEIRO')")
    public ResponseEntity<?> deleteImagemObra(@PathVariable Long id) {
        Obra obra = obraRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Obra não encontrada"));
        
        try {
            if (obra.getImagemUrl() != null && !obra.getImagemUrl().isEmpty()) {
                String filename = Paths.get(obra.getImagemUrl()).getFileName().toString();
                Path filePath = UPLOAD_PATH.resolve(filename);
                
                // Delete file if it exists
                if (Files.exists(filePath)) {
                    Files.delete(filePath);
                }
                
                obra.setImagemUrl(null);
                obraRepository.save(obra);
            }
            
            return ResponseEntity.ok().body(new java.util.HashMap<String, String>() {{
                put("message", "Imagem removida com sucesso");
            }});
            
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Erro ao remover imagem: " + e.getMessage());
        }
    }
}

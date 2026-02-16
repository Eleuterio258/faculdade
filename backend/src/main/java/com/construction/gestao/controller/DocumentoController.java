package com.construction.gestao.controller;

import com.construction.gestao.model.Documento;
import com.construction.gestao.service.DocumentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.util.List;

@RestController
@RequestMapping("/api/documentos")
@CrossOrigin(origins = "*", maxAge = 3600)
public class DocumentoController {

    @Autowired
    private DocumentoService documentoService;

    @GetMapping("/obra/{obraId}")
    public ResponseEntity<List<Documento>> getDocumentosByObra(@PathVariable Long obraId) {
        return ResponseEntity.ok(documentoService.getDocumentosByObra(obraId));
    }

    @PostMapping("/obra/{obraId}")
    public ResponseEntity<Documento> uploadDocumento(
            @PathVariable Long obraId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "nome", required = false) String nome,
            @RequestParam(value = "descricao", required = false) String descricao) throws IOException {
        return ResponseEntity.ok(documentoService.uploadDocumento(file, nome, descricao, obraId));
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> downloadDocumento(@PathVariable Long id) throws IOException {
        Path filePath = documentoService.getDocumentoPath(id);
        Resource resource = new UrlResource(filePath.toUri());
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filePath.getFileName() + "\"")
                .body(resource);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDocumento(@PathVariable Long id) throws IOException {
        documentoService.deleteDocumento(id);
        return ResponseEntity.ok().build();
    }
}

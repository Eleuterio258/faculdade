package com.construction.gestao.controller;

import com.construction.gestao.model.Documento;
import com.construction.gestao.service.DocumentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
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
    public ResponseEntity<Void> downloadDocumento(@PathVariable Long id) {
        String url = documentoService.getDocumentoUrl(id);
        return ResponseEntity.status(HttpStatus.FOUND)
                .location(URI.create(url))
                .build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDocumento(@PathVariable Long id) throws IOException {
        documentoService.deleteDocumento(id);
        return ResponseEntity.ok().build();
    }
}

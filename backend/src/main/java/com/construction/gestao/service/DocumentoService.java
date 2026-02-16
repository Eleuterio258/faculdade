package com.construction.gestao.service;

import com.construction.gestao.model.Documento;
import com.construction.gestao.model.Obra;
import com.construction.gestao.repository.DocumentoRepository;
import com.construction.gestao.repository.ObraRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
public class DocumentoService {

    private final String uploadDir = "uploads/documentos";

    @Autowired
    private DocumentoRepository documentoRepository;

    @Autowired
    private ObraRepository obraRepository;

    public List<Documento> getDocumentosByObra(Long obraId) {
        Obra obra = obraRepository.findById(obraId)
                .orElseThrow(() -> new RuntimeException("Obra não encontrada"));
        return documentoRepository.findByObra(obra);
    }

    @Transactional
    public Documento uploadDocumento(MultipartFile file, String nome, String descricao, Long obraId) throws IOException {
        Obra obra = obraRepository.findById(obraId)
                .orElseThrow(() -> new RuntimeException("Obra não encontrada"));

        Path uploadPath = Paths.get(uploadDir, obraId.toString());
        Files.createDirectories(uploadPath);

        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : "";
        String storedFilename = UUID.randomUUID().toString() + extension;
        Path filePath = uploadPath.resolve(storedFilename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        Documento documento = new Documento();
        documento.setNome(nome != null && !nome.isBlank() ? nome : originalFilename);
        documento.setDescricao(descricao);
        documento.setCaminhoArquivo(filePath.toString());
        documento.setTipoArquivo(extension.replace(".", ""));
        documento.setTamanhoArquivo(file.getSize());
        documento.setObra(obra);

        return documentoRepository.save(documento);
    }

    @Transactional
    public void deleteDocumento(Long id) throws IOException {
        Documento documento = documentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Documento não encontrado"));
        Path filePath = Paths.get(documento.getCaminhoArquivo());
        Files.deleteIfExists(filePath);
        documentoRepository.deleteById(id);
    }

    public Path getDocumentoPath(Long id) {
        Documento documento = documentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Documento não encontrado"));
        return Paths.get(documento.getCaminhoArquivo());
    }
}

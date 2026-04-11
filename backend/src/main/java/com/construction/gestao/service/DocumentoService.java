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
import java.util.List;

@Service
public class DocumentoService {

    @Autowired
    private DocumentoRepository documentoRepository;

    @Autowired
    private ObraRepository obraRepository;

    @Autowired
    private S3StorageService storageService;

    public List<Documento> getDocumentosByObra(Long obraId) {
        Obra obra = obraRepository.findById(obraId)
                .orElseThrow(() -> new RuntimeException("Obra não encontrada"));
        return documentoRepository.findByObra(obra);
    }

    @Transactional
    public Documento uploadDocumento(MultipartFile file, String nome, String descricao, Long obraId) throws IOException {
        Obra obra = obraRepository.findById(obraId)
                .orElseThrow(() -> new RuntimeException("Obra não encontrada"));

        String originalFilename = file.getOriginalFilename();
        String extension = (originalFilename != null && originalFilename.contains("."))
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : "";

        String fileUrl = storageService.upload(file, "obras/" + obraId + "/documentos");

        Documento documento = new Documento();
        documento.setNome(nome != null && !nome.isBlank() ? nome : originalFilename);
        documento.setDescricao(descricao);
        documento.setCaminhoArquivo(fileUrl);
        documento.setTipoArquivo(extension.replace(".", ""));
        documento.setTamanhoArquivo(file.getSize());
        documento.setObra(obra);

        return documentoRepository.save(documento);
    }

    @Transactional
    public void deleteDocumento(Long id) {
        Documento documento = documentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Documento não encontrado"));
        storageService.delete(documento.getCaminhoArquivo());
        documentoRepository.deleteById(id);
    }

    public String getDocumentoUrl(Long id) {
        Documento documento = documentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Documento não encontrado"));
        return documento.getCaminhoArquivo();
    }
}

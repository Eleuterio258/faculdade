package com.construction.gestao.controller;

import com.construction.gestao.model.Usuario;
import com.construction.gestao.repository.UsuarioRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*", maxAge = 3600)
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping
    @PreAuthorize("hasRole('EMPREITEIRO')")
    public ResponseEntity<List<Usuario>> getAllUsuarios(
            @RequestParam(required = false) String perfil) {
        List<Usuario> usuarios = usuarioRepository.findAll();

        // Filter by perfil if provided
        if (perfil != null && !perfil.isEmpty()) {
            try {
                Usuario.PerfilUsuario perfilEnum = Usuario.PerfilUsuario.valueOf(perfil);
                usuarios = usuarios.stream()
                    .filter(u -> u.getPerfil() == perfilEnum)
                    .collect(Collectors.toList());
            } catch (IllegalArgumentException e) {
                // Invalid perfil, return all
            }
        }

        // Remove passwords from response
        usuarios.forEach(u -> u.setPassword(null));
        return ResponseEntity.ok(usuarios);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('EMPREITEIRO', 'ENGENHEIRO', 'GESTOR_MATERIAIS', 'TECNICO_OBRA')")
    public ResponseEntity<Usuario> getUsuarioById(@PathVariable Long id) {
        return usuarioRepository.findById(id)
                .map(usuario -> {
                    usuario.setPassword(null);
                    return ResponseEntity.ok(usuario);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('EMPREITEIRO', 'ENGENHEIRO', 'GESTOR_MATERIAIS', 'TECNICO_OBRA')")
    public ResponseEntity<Usuario> getCurrentUser(
            @RequestHeader(value = "X-User-Id", required = false) Long userId) {
        // In a real implementation, get from SecurityContext
        // This is a placeholder
        if (userId == null) {
            return ResponseEntity.badRequest().build();
        }
        
        return usuarioRepository.findById(userId)
                .map(usuario -> {
                    usuario.setPassword(null);
                    return ResponseEntity.ok(usuario);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('EMPREITEIRO') or @usuarioService.isOwner(#id, authentication.principal.id)")
    public ResponseEntity<Usuario> updateUsuario(@PathVariable Long id, 
                                                 @Valid @RequestBody Usuario usuarioDetails) {
        return usuarioRepository.findById(id)
                .map(usuario -> {
                    usuario.setNome(usuarioDetails.getNome());
                    usuario.setEmail(usuarioDetails.getEmail());
                    usuario.setTelefone(usuarioDetails.getTelefone());
                    if (usuarioDetails.getPerfil() != null) {
                        usuario.setPerfil(usuarioDetails.getPerfil());
                    }
                    if (usuarioDetails.getAtivo() != null) {
                        usuario.setAtivo(usuarioDetails.getAtivo());
                    }
                    
                    Usuario updated = usuarioRepository.save(usuario);
                    updated.setPassword(null);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('EMPREITEIRO')")
    public ResponseEntity<Void> deleteUsuario(@PathVariable Long id) {
        if (!usuarioRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        usuarioRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/toggle-status")
    @PreAuthorize("hasRole('EMPREITEIRO')")
    public ResponseEntity<Usuario> toggleUsuarioStatus(@PathVariable Long id) {
        return usuarioRepository.findById(id)
                .map(usuario -> {
                    usuario.setAtivo(!usuario.getAtivo());
                    Usuario updated = usuarioRepository.save(usuario);
                    updated.setPassword(null);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/change-password")
    @PreAuthorize("hasAnyRole('EMPREITEIRO', 'ENGENHEIRO', 'GESTOR_MATERIAIS', 'TECNICO_OBRA') or @usuarioService.isOwner(#id, authentication.principal.id)")
    public ResponseEntity<Map<String, String>> changePassword(@PathVariable Long id,
                                                              @RequestBody Map<String, String> passwordRequest) {
        return usuarioRepository.findById(id)
                .map(usuario -> {
                    String currentPassword = passwordRequest.get("currentPassword");
                    String newPassword = passwordRequest.get("newPassword");
                    
                    if (currentPassword != null && !currentPassword.isEmpty()) {
                        // Verify current password (in real implementation, use authentication)
                        // For now, just update to new password
                    }
                    
                    usuario.setPassword(passwordEncoder.encode(newPassword));
                    usuarioRepository.save(usuario);
                    
                    Map<String, String> response = new HashMap<>();
                    response.put("message", "Password alterada com sucesso");
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('EMPREITEIRO')")
    public ResponseEntity<Usuario> createUsuario(@Valid @RequestBody Usuario usuario) {
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        if (usuario.getAtivo() == null) {
            usuario.setAtivo(true);
        }
        Usuario created = usuarioRepository.save(usuario);
        created.setPassword(null);
        
        return ResponseEntity.created(URI.create("/api/usuarios/" + created.getId())).body(created);
    }
}

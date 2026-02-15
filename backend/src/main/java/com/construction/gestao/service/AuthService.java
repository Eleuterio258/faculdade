package com.construction.gestao.service;

import com.construction.gestao.dto.JwtAuthenticationResponse;
import com.construction.gestao.dto.LoginRequest;
import com.construction.gestao.dto.SignUpRequest;
import com.construction.gestao.model.Usuario;
import com.construction.gestao.repository.UsuarioRepository;
import com.construction.gestao.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Transactional
    public JwtAuthenticationResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        Usuario usuario = usuarioRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        return new JwtAuthenticationResponse(
                jwt,
                "Bearer",
                usuario.getId(),
                usuario.getUsername(),
                usuario.getEmail(),
                usuario.getPerfil().name()
        );
    }

    @Transactional
    public Usuario registerUser(SignUpRequest signUpRequest) {
        if (usuarioRepository.existsByUsername(signUpRequest.getUsername())) {
            throw new RuntimeException("Username já está em uso!");
        }

        if (usuarioRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new RuntimeException("Email já está em uso!");
        }

        Usuario usuario = new Usuario();
        usuario.setUsername(signUpRequest.getUsername());
        usuario.setEmail(signUpRequest.getEmail());
        usuario.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
        usuario.setNome(signUpRequest.getNome());
        usuario.setTelefone(signUpRequest.getTelefone());
        usuario.setPerfil(Usuario.PerfilUsuario.valueOf(signUpRequest.getPerfil()));
        usuario.setAtivo(true);

        return usuarioRepository.save(usuario);
    }
}


package com.construction.gestao.controller;

import com.construction.gestao.dto.JwtAuthenticationResponse;
import com.construction.gestao.dto.LoginRequest;
import com.construction.gestao.dto.SignUpRequest;
import com.construction.gestao.model.Usuario;
import com.construction.gestao.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        JwtAuthenticationResponse response = authService.authenticateUser(loginRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignUpRequest signUpRequest) {
        Usuario usuario = authService.registerUser(signUpRequest);
        return ResponseEntity.ok("Usuário registrado com sucesso!");
    }
}


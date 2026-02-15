package com.construction.gestao.dto;

import com.construction.gestao.model.Usuario;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SignUpRequest {
    @NotBlank
    @Size(min = 3, max = 50)
    private String username;

    @NotBlank
    @Size(max = 100)
    @Email
    private String email;

    @NotBlank
    @Size(min = 6)
    private String password;

    @NotBlank
    @Size(max = 100)
    private String nome;

    @Size(max = 20)
    private String telefone;

    @NotBlank
    private String perfil; // EMPREITEIRO, ENGENHEIRO, etc.
}


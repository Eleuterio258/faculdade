package com.construction.gestao.config;

import com.construction.gestao.model.Usuario;
import com.construction.gestao.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.security.crypto.password.PasswordEncoder;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Só faz seed se ainda não houver usuários
        if (usuarioRepository.count() > 0) {
            return;
        }

        // Usuário principal (pode usar como "admin" do sistema)
        criarUsuarioSeNaoExistir(
                "admin",
                "admin@gestaoobras.com",
                "admin123",
                "Administrador do Sistema",
                "999999999",
                Usuario.PerfilUsuario.ENGENHEIRO
        );

        // Exemplos adicionais (um por perfil) - opcional
        criarUsuarioSeNaoExistir(
                "empreiteiro1",
                "empreiteiro1@gestaoobras.com",
                "senha123",
                "Empreiteiro Exemplo",
                "910000001",
                Usuario.PerfilUsuario.EMPREITEIRO
        );

        criarUsuarioSeNaoExistir(
                "gestor.materiais",
                "gestor.materiais@gestaoobras.com",
                "senha123",
                "Gestor de Materiais Exemplo",
                "910000002",
                Usuario.PerfilUsuario.GESTOR_MATERIAIS
        );

        criarUsuarioSeNaoExistir(
                "tecnico.obra",
                "tecnico.obra@gestaoobras.com",
                "senha123",
                "Técnico de Obra Exemplo",
                "910000003",
                Usuario.PerfilUsuario.TECNICO_OBRA
        );

        criarUsuarioSeNaoExistir(
                "trabalhador1",
                "trabalhador1@gestaoobras.com",
                "senha123",
                "Trabalhador Exemplo",
                "910000004",
                Usuario.PerfilUsuario.TRABALHADOR
        );
    }

    private void criarUsuarioSeNaoExistir(
            String username,
            String email,
            String senhaPura,
            String nome,
            String telefone,
            Usuario.PerfilUsuario perfil
    ) {
        if (usuarioRepository.existsByUsername(username) || usuarioRepository.existsByEmail(email)) {
            return;
        }

        Usuario usuario = new Usuario();
        usuario.setUsername(username);
        usuario.setEmail(email);
        usuario.setPassword(passwordEncoder.encode(senhaPura));
        usuario.setNome(nome);
        usuario.setTelefone(telefone);
        usuario.setPerfil(perfil);
        usuario.setAtivo(true);

        usuarioRepository.save(usuario);
    }
}



package br.edu.aps.sgaigo.service;

import br.edu.aps.sgaigo.dto.LoginRequest;
import br.edu.aps.sgaigo.dto.UsuarioAdminRequest;
import br.edu.aps.sgaigo.dto.UsuarioResponse;
import br.edu.aps.sgaigo.exception.RecursoNaoEncontradoException;
import br.edu.aps.sgaigo.exception.RegraNegocioException;
import br.edu.aps.sgaigo.model.Usuario;
import br.edu.aps.sgaigo.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public UsuarioResponse criarUsuario(LoginRequest req){

        Usuario newUsuario = new Usuario();
        String email = req.email().toLowerCase().trim();
        String nome = email.split("@")[0];


        newUsuario.setAtivo(true);
        newUsuario.setEmail(email);
        newUsuario.setNome(nome);
        newUsuario.setSenhaHash(passwordEncoder.encode(req.senha()));
        newUsuario.setPerfil(Usuario.Perfil.CONSULTOR);

        usuarioRepository.save(newUsuario);

        return UsuarioResponse.de(newUsuario);
    }

    /** Criação por ADMIN (perfil livre). E-mail duplicado → 409 tratado no controller. */
    @Transactional
    public UsuarioResponse criarComoAdmin(UsuarioAdminRequest.Criar req) {
        Usuario novo = new Usuario();
        novo.setAtivo(true);
        novo.setEmail(req.email().toLowerCase());
        novo.setNome(req.nome());
        novo.setSenhaHash(passwordEncoder.encode(req.senha()));
        novo.setPerfil(req.perfil());
        usuarioRepository.save(novo);
        return UsuarioResponse.de(novo);
    }

    /** Atualiza nome e perfil. Trava autopromoção/rebaixamento próprio e último ADMIN. */
    @Transactional
    public UsuarioResponse atualizar(Long id, UsuarioAdminRequest.Atualizar req, String executorEmail) {
        Usuario alvo = usuarioRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário não encontrado"));
        boolean proprio = alvo.getEmail().equalsIgnoreCase(executorEmail);
        if (proprio && alvo.getPerfil() != req.perfil()) {
            throw new RegraNegocioException("Não é permitido alterar o próprio perfil de acesso");
        }
        if (alvo.getPerfil() == Usuario.Perfil.ADMIN && req.perfil() != Usuario.Perfil.ADMIN
                && usuarioRepository.countByPerfilAndAtivoTrue(Usuario.Perfil.ADMIN) <= 1) {
            throw new RegraNegocioException("Não é permitido rebaixar o último administrador ativo");
        }
        alvo.setNome(req.nome());
        alvo.setPerfil(req.perfil());
        return UsuarioResponse.de(alvo);
    }

    /** Ativa/desativa conta. Nunca a própria; nunca o último ADMIN ativo. */
    @Transactional
    public UsuarioResponse alterarStatus(Long id, boolean ativo, String executorEmail) {
        Usuario alvo = usuarioRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário não encontrado"));
        if (alvo.getEmail().equalsIgnoreCase(executorEmail)) {
            throw new RegraNegocioException("Não é permitido alterar o status da própria conta");
        }
        if (!ativo && alvo.getPerfil() == Usuario.Perfil.ADMIN
                && usuarioRepository.countByPerfilAndAtivoTrue(Usuario.Perfil.ADMIN) <= 1) {
            throw new RegraNegocioException("Não é permitido desativar o último administrador ativo");
        }
        alvo.setAtivo(ativo);
        return UsuarioResponse.de(alvo);
    }

}

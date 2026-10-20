package br.edu.aps.sgaigo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import br.edu.aps.sgaigo.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

	Optional<Usuario> findByEmail(String email);

	List<Usuario> findByAtivoTrue();

	long countByPerfilAndAtivoTrue(Usuario.Perfil perfil);
}

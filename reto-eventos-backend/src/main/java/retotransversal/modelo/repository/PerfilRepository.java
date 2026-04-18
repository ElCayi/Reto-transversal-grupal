package retotransversal.modelo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import retotransversal.modelo.entities.Perfil;

public interface PerfilRepository extends JpaRepository<Perfil, Integer> {

	Optional<Perfil> findByNombre(String nombre);
}

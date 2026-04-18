package retotransversal.modelo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import retotransversal.modelo.entities.TipoEvento;

public interface TipoEventoRepository extends JpaRepository<TipoEvento, Integer> {

	Optional<TipoEvento> findByNombre(String nombre);
}

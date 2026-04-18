package retotransversal.modelo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import retotransversal.modelo.entities.EstadoEvento;
import retotransversal.modelo.entities.Evento;

public interface EventoRepository extends JpaRepository<Evento, Integer> {

	List<Evento> findByEstado(EstadoEvento estado);

	List<Evento> findByDestacadoAndEstado(String destacado, EstadoEvento estado);

	List<Evento> findByTipoEventoIdTipoAndEstado(Integer idTipo, EstadoEvento estado);
}

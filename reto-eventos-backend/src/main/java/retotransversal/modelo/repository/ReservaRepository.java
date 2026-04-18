package retotransversal.modelo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import retotransversal.modelo.entities.Reserva;

public interface ReservaRepository extends JpaRepository<Reserva, Integer> {

	List<Reserva> findByUsuarioUsername(String username);

	List<Reserva> findByEventoIdEvento(Integer idEvento);

	List<Reserva> findByUsuarioUsernameAndEventoIdEvento(String username, Integer idEvento);
}

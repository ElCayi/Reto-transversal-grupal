package retotransversal.modelo.service;

import java.util.List;

import retotransversal.modelo.entities.Reserva;

public interface ReservaService extends CrudGenerico<Reserva, Integer> {

	List<Reserva> findByUsuario(String username);

	Reserva reservarEvento(Integer idEvento, String username, Integer cantidad, String observaciones);

	int cancelarReserva(Integer idReserva, String username);
}

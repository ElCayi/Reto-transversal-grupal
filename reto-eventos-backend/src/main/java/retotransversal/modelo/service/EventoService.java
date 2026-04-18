package retotransversal.modelo.service;

import java.util.List;

import retotransversal.modelo.entities.Evento;

public interface EventoService extends CrudGenerico<Evento, Integer> {

	List<Evento> findActivos();

	List<Evento> findDestacados();

	List<Evento> findCancelados();

	List<Evento> findTerminados();

	List<Evento> findActivosPorTipo(Integer idTipo);

	Evento cancelarEvento(Integer idEvento);

	Evento cambiarDestacado(Integer idEvento, String destacado);
}

package retotransversal.modelo.service.impl;

import java.util.List;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import retotransversal.exception.RecursoNoEncontradoException;
import retotransversal.modelo.entities.EstadoEvento;
import retotransversal.modelo.entities.Evento;
import retotransversal.modelo.repository.EventoRepository;
import retotransversal.modelo.service.EventoService;

@Service
@RequiredArgsConstructor
public class EventoServiceImpl implements EventoService {

	private final EventoRepository eventoRepository;

	@Override
	public Evento findById(Integer id) {
		return eventoRepository.findById(id)
				.orElseThrow(() -> new RecursoNoEncontradoException("Evento no encontrado"));
	}

	@Override
	public List<Evento> findAll() {
		return eventoRepository.findAll();
	}

	@Override
	public Evento insertOne(Evento entidad) {
		if (entidad.getEstado() == null) {
			entidad.setEstado(EstadoEvento.ACTIVO);
		}
		if (entidad.getDestacado() == null || entidad.getDestacado().isBlank()) {
			entidad.setDestacado("N");
		}
		return eventoRepository.save(entidad);
	}

	@Override
	public Evento updateOne(Evento entidad) {
		findById(entidad.getIdEvento());
		return eventoRepository.save(entidad);
	}

	@Override
	public int deleteOne(Integer id) {
		findById(id);
		eventoRepository.deleteById(id);
		return 1;
	}

	@Override
	public List<Evento> findActivos() {
		return eventoRepository.findByEstado(EstadoEvento.ACTIVO);
	}

	@Override
	public List<Evento> findDestacados() {
		return eventoRepository.findByDestacadoAndEstado("S", EstadoEvento.ACTIVO);
	}

	@Override
	public List<Evento> findCancelados() {
		return eventoRepository.findByEstado(EstadoEvento.CANCELADO);
	}

	@Override
	public List<Evento> findTerminados() {
		return eventoRepository.findByEstado(EstadoEvento.TERMINADO);
	}

	@Override
	public List<Evento> findActivosPorTipo(Integer idTipo) {
		return eventoRepository.findByTipoEventoIdTipoAndEstado(idTipo, EstadoEvento.ACTIVO);
	}

	@Override
	public Evento cancelarEvento(Integer idEvento) {
		Evento evento = findById(idEvento);
		evento.setEstado(EstadoEvento.CANCELADO);
		return eventoRepository.save(evento);
	}

	@Override
	public Evento cambiarDestacado(Integer idEvento, String destacado) {
		Evento evento = findById(idEvento);
		if (!"S".equalsIgnoreCase(destacado) && !"N".equalsIgnoreCase(destacado)) {
			throw new IllegalArgumentException("El valor destacado debe ser S o N");
		}
		evento.setDestacado(destacado.toUpperCase());
		return eventoRepository.save(evento);
	}
}

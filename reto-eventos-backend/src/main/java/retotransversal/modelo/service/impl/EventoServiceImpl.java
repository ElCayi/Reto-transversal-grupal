package retotransversal.modelo.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import retotransversal.exception.RecursoNoEncontradoException;
import retotransversal.modelo.entities.EstadoEvento;
import retotransversal.modelo.entities.Evento;
import retotransversal.modelo.repository.EventoRepository;
import retotransversal.modelo.repository.ReservaRepository;
import retotransversal.modelo.service.EventoService;

@Service
@RequiredArgsConstructor
public class EventoServiceImpl implements EventoService {

	private final EventoRepository eventoRepository;
	private final ReservaRepository reservaRepository;

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
		return eventoRepository.save(entidad);
	}

	@Override
	public Evento updateOne(Evento entidad) {
		findById(entidad.getIdEvento());
		return eventoRepository.save(entidad);
	}

	@Override
	@Transactional
	public int deleteOne(Integer id) {
		findById(id);
		reservaRepository.deleteAll(reservaRepository.findByEventoIdEvento(id));
		eventoRepository.deleteById(id);
		return 1;
	}

	@Override
	public List<Evento> findActivos() {
		return eventoRepository.findByEstado(EstadoEvento.ACTIVO);
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
}

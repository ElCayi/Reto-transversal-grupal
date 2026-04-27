package retotransversal.modelo.service.impl;

import java.math.BigDecimal;
import java.util.List;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import retotransversal.exception.ConflictoNegocioException;
import retotransversal.exception.OperacionNoPermitidaException;
import retotransversal.exception.RecursoNoEncontradoException;
import retotransversal.modelo.entities.EstadoEvento;
import retotransversal.modelo.entities.Evento;
import retotransversal.modelo.entities.Reserva;
import retotransversal.modelo.entities.Usuario;
import retotransversal.modelo.repository.ReservaRepository;
import retotransversal.modelo.service.EventoService;
import retotransversal.modelo.service.ReservaService;
import retotransversal.modelo.service.UsuarioService;

@Service
@RequiredArgsConstructor
public class ReservaServiceImpl implements ReservaService {

	private final ReservaRepository reservaRepository;
	private final EventoService eventoService;
	private final UsuarioService usuarioService;

	@Override
	public Reserva findById(Integer id) {
		return reservaRepository.findById(id)
				.orElseThrow(() -> new RecursoNoEncontradoException("Reserva no encontrada"));
	}

	@Override
	public List<Reserva> findAll() {
		return reservaRepository.findAll();
	}

	@Override
	public Reserva insertOne(Reserva entidad) {
		return reservaRepository.save(entidad);
	}

	@Override
	public Reserva updateOne(Reserva entidad) {
		findById(entidad.getIdReserva());
		return reservaRepository.save(entidad);
	}

	@Override
	public int deleteOne(Integer id) {
		findById(id);
		reservaRepository.deleteById(id);
		return 1;
	}

	@Override
	public List<Reserva> findByUsuario(String username) {
		return reservaRepository.findByUsuarioUsername(username);
	}

	@Override
	public Reserva reservarEvento(Integer idEvento, String username, Integer cantidad, String observaciones) {
		Evento evento = eventoService.findById(idEvento);
		Usuario usuario = usuarioService.findById(username);
		validarReserva(evento, username, cantidad);

		Reserva reserva = Reserva.builder()
				.evento(evento)
				.usuario(usuario)
				.cantidad(cantidad)
				.observaciones(observaciones)
				.precioVenta(evento.getPrecio().multiply(BigDecimal.valueOf(cantidad.longValue())))
				.build();

		return reservaRepository.save(reserva);
	}

	@Override
	public int cancelarReserva(Integer idReserva, String username) {
		Reserva reserva = findById(idReserva);
		if (!reserva.getUsuario().getUsername().equals(username)) {
			throw new OperacionNoPermitidaException("Solo puedes cancelar tus propias reservas");
		}
		reservaRepository.deleteById(idReserva);
		return 1;
	}

	@Override
	public int cancelarReservaAdmin(Integer idReserva) {
		findById(idReserva);
		reservaRepository.deleteById(idReserva);
		return 1;
	}

	private void validarReserva(Evento evento, String username, Integer cantidad) {
		if (cantidad == null || cantidad < 1) {
			throw new ConflictoNegocioException("La cantidad debe ser al menos 1");
		}
		if (cantidad > 10) {
			throw new ConflictoNegocioException("No se permiten reservas superiores a 10 entradas");
		}
		if (evento.getEstado() != EstadoEvento.ACTIVO) {
			throw new ConflictoNegocioException("Solo se permiten reservas en eventos activos");
		}

		int aforoReservado = reservaRepository.findByEventoIdEvento(evento.getIdEvento())
				.stream()
				.mapToInt(Reserva::getCantidad)
				.sum();

		if (aforoReservado + cantidad > evento.getAforoMaximo()) {
			throw new ConflictoNegocioException("La reserva supera el aforo maximo disponible");
		}

		int entradasUsuario = reservaRepository.findByUsuarioUsernameAndEventoIdEvento(username, evento.getIdEvento())
				.stream()
				.mapToInt(Reserva::getCantidad)
				.sum();

		if (entradasUsuario + cantidad > 10) {
			throw new ConflictoNegocioException("El usuario no puede superar 10 entradas en el mismo evento");
		}
	}
}

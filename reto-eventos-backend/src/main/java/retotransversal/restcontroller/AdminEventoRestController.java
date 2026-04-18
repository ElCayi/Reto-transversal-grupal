package retotransversal.restcontroller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import retotransversal.modelo.dto.EventoDetalleDto;
import retotransversal.modelo.dto.EventoEntradaDto;
import retotransversal.modelo.dto.EventoListadoDto;
import retotransversal.modelo.entities.EstadoEvento;
import retotransversal.modelo.entities.Evento;
import retotransversal.modelo.service.EventoService;
import retotransversal.modelo.service.TipoEventoService;

@RestController
@RequestMapping("/api/admin/eventos")
@RequiredArgsConstructor
public class AdminEventoRestController {

	private final EventoService eventoService;
	private final TipoEventoService tipoEventoService;

	@GetMapping
	public ResponseEntity<List<EventoListadoDto>> findAll() {
		return ResponseEntity.ok(eventoService.findAll().stream().map(EventoListadoDto::fromEntity).toList());
	}

	@PostMapping
	public ResponseEntity<EventoDetalleDto> create(@RequestBody EventoEntradaDto dto) {
		Evento guardado = eventoService.insertOne(toEntity(dto, null));
		return ResponseEntity.status(HttpStatus.CREATED).body(EventoDetalleDto.fromEntity(guardado));
	}

	@PutMapping("/{idEvento}")
	public ResponseEntity<EventoDetalleDto> update(@PathVariable Integer idEvento, @RequestBody EventoEntradaDto dto) {
		Evento actualizado = eventoService.updateOne(toEntity(dto, idEvento));
		return ResponseEntity.ok(EventoDetalleDto.fromEntity(actualizado));
	}

	@PatchMapping("/{idEvento}/cancelar")
	public ResponseEntity<EventoDetalleDto> cancelar(@PathVariable Integer idEvento) {
		return ResponseEntity.ok(EventoDetalleDto.fromEntity(eventoService.cancelarEvento(idEvento)));
	}

	@PatchMapping("/{idEvento}/destacado/{valor}")
	public ResponseEntity<EventoDetalleDto> destacado(@PathVariable Integer idEvento, @PathVariable String valor) {
		return ResponseEntity.ok(EventoDetalleDto.fromEntity(eventoService.cambiarDestacado(idEvento, valor)));
	}

	@DeleteMapping("/{idEvento}")
	public ResponseEntity<Void> delete(@PathVariable Integer idEvento) {
		eventoService.deleteOne(idEvento);
		return ResponseEntity.noContent().build();
	}

	private Evento toEntity(EventoEntradaDto dto, Integer idEvento) {
		return Evento.builder()
				.idEvento(idEvento)
				.nombre(dto.getNombre())
				.descripcion(dto.getDescripcion())
				.fechaInicio(dto.getFechaInicio())
				.duracion(dto.getDuracion())
				.direccion(dto.getDireccion())
				.estado(dto.getEstado() == null ? EstadoEvento.ACTIVO : EstadoEvento.valueOf(dto.getEstado().toUpperCase()))
				.destacado(dto.getDestacado() == null ? "N" : dto.getDestacado().toUpperCase())
				.aforoMaximo(dto.getAforoMaximo())
				.minimoAsistencia(dto.getMinimoAsistencia())
				.precio(dto.getPrecio())
				.tipoEvento(tipoEventoService.findById(dto.getIdTipo()))
				.build();
	}
}

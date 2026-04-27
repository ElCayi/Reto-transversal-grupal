package retotransversal.restcontroller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import retotransversal.modelo.dto.EventoDetalleDto;
import retotransversal.modelo.dto.EventoListadoDto;
import retotransversal.modelo.service.EventoService;

@RestController
@RequestMapping("/api/eventos")
@RequiredArgsConstructor
public class EventoRestController {

	private final EventoService eventoService;

	@GetMapping("/activos")
	public ResponseEntity<List<EventoListadoDto>> activos() {
		return ResponseEntity.ok(eventoService.findActivos().stream().map(EventoListadoDto::fromEntity).toList());
	}

	@GetMapping("/cancelados")
	public ResponseEntity<List<EventoListadoDto>> cancelados() {
		return ResponseEntity.ok(eventoService.findCancelados().stream().map(EventoListadoDto::fromEntity).toList());
	}

	@GetMapping("/terminados")
	public ResponseEntity<List<EventoListadoDto>> terminados() {
		return ResponseEntity.ok(eventoService.findTerminados().stream().map(EventoListadoDto::fromEntity).toList());
	}

	@GetMapping("/tipo/{idTipo}")
	public ResponseEntity<List<EventoListadoDto>> porTipo(@PathVariable Integer idTipo) {
		return ResponseEntity.ok(eventoService.findActivosPorTipo(idTipo).stream().map(EventoListadoDto::fromEntity).toList());
	}

	@GetMapping("/{idEvento}")
	public ResponseEntity<EventoDetalleDto> detalle(@PathVariable Integer idEvento) {
		return ResponseEntity.ok(EventoDetalleDto.fromEntity(eventoService.findById(idEvento)));
	}
}

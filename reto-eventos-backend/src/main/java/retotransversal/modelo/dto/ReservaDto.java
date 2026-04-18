package retotransversal.modelo.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import retotransversal.modelo.entities.Reserva;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class ReservaDto {

	private Integer idReserva;
	private Integer idEvento;
	private String nombreEvento;
	private String username;
	private Integer cantidad;
	private BigDecimal precioVenta;
	private String observaciones;
	private LocalDate fechaInicioEvento;
	private String estadoEvento;

	public static ReservaDto fromEntity(Reserva reserva) {
		return ReservaDto.builder()
				.idReserva(reserva.getIdReserva())
				.idEvento(reserva.getEvento().getIdEvento())
				.nombreEvento(reserva.getEvento().getNombre())
				.username(reserva.getUsuario().getUsername())
				.cantidad(reserva.getCantidad())
				.precioVenta(reserva.getPrecioVenta())
				.observaciones(reserva.getObservaciones())
				.fechaInicioEvento(reserva.getEvento().getFechaInicio())
				.estadoEvento(reserva.getEvento().getEstado().name())
				.build();
	}
}

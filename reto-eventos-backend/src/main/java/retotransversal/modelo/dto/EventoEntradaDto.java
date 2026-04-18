package retotransversal.modelo.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class EventoEntradaDto {

	private String nombre;
	private String descripcion;
	private LocalDate fechaInicio;
	private Integer duracion;
	private String direccion;
	private String estado;
	private String destacado;
	private Integer aforoMaximo;
	private Integer minimoAsistencia;
	private BigDecimal precio;
	private Integer idTipo;
}

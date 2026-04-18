package retotransversal.modelo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import retotransversal.modelo.entities.TipoEvento;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class TipoEventoDto {

	private Integer idTipo;
	private String nombre;
	private String descripcion;

	public static TipoEventoDto fromEntity(TipoEvento tipoEvento) {
		return TipoEventoDto.builder()
				.idTipo(tipoEvento.getIdTipo())
				.nombre(tipoEvento.getNombre())
				.descripcion(tipoEvento.getDescripcion())
				.build();
	}
}

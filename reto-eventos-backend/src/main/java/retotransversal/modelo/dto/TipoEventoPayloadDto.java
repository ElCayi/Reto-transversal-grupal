package retotransversal.modelo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import retotransversal.modelo.entities.TipoEvento;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class TipoEventoPayloadDto {

	private String nombre;
	private String descripcion;

	public TipoEvento toEntity() {
		return TipoEvento.builder()
				.nombre(this.nombre)
				.descripcion(this.descripcion)
				.build();
	}
}

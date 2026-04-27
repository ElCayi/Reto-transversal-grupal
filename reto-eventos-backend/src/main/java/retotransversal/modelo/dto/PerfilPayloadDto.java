package retotransversal.modelo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import retotransversal.modelo.entities.Perfil;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class PerfilPayloadDto {

	private String nombre;

	public Perfil toEntity() {
		return Perfil.builder()
				.nombre(this.nombre)
				.build();
	}
}

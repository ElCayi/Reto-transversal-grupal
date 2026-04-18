package retotransversal.modelo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import retotransversal.modelo.entities.Perfil;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class PerfilDto {

	private Integer idPerfil;
	private String nombre;

	public static PerfilDto fromEntity(Perfil perfil) {
		return PerfilDto.builder()
				.idPerfil(perfil.getIdPerfil())
				.nombre(perfil.getNombre())
				.build();
	}
}

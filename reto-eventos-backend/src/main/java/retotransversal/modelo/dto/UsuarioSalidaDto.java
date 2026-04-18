package retotransversal.modelo.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import retotransversal.modelo.entities.Usuario;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class UsuarioSalidaDto {

	private String username;
	private String email;
	private String nombre;
	private String apellidos;
	private String direccion;
	private Integer enabled;
	private LocalDate fechaRegistro;
	private Integer idPerfil;
	private String perfil;

	public static UsuarioSalidaDto fromEntity(Usuario usuario) {
		return UsuarioSalidaDto.builder()
				.username(usuario.getUsername())
				.email(usuario.getEmail())
				.nombre(usuario.getNombre())
				.apellidos(usuario.getApellidos())
				.direccion(usuario.getDireccion())
				.enabled(usuario.getEnabled())
				.fechaRegistro(usuario.getFechaRegistro())
				.idPerfil(usuario.getPerfil().getIdPerfil())
				.perfil(usuario.getPerfil().getNombre())
				.build();
	}
}

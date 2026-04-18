package retotransversal.modelo.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class UsuarioEntradaDto {

	private String username;
	private String password;
	private String email;
	private String nombre;
	private String apellidos;
	private String direccion;
	private Integer enabled;
	private LocalDate fechaRegistro;
	private Integer idPerfil;
}

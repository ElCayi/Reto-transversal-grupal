package retotransversal.modelo.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class AuthUsuarioDto {

	private String username;
	private String nombre;
	private String perfil;
	private List<String> authorities;
}

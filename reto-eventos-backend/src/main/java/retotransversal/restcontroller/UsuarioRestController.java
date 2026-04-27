package retotransversal.restcontroller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import retotransversal.modelo.dto.UsuarioEntradaDto;
import retotransversal.modelo.dto.UsuarioSalidaDto;
import retotransversal.modelo.entities.Usuario;
import retotransversal.modelo.service.PerfilService;
import retotransversal.modelo.service.UsuarioService;

@RestController
@RequestMapping("/api/admin/usuarios")
@RequiredArgsConstructor
public class UsuarioRestController {

	private final UsuarioService usuarioService;
	private final PerfilService perfilService;

	@GetMapping
	public ResponseEntity<List<UsuarioSalidaDto>> findAll(@RequestParam(required = false) String perfil) {
		List<Usuario> usuarios = perfil == null || perfil.isBlank()
				? usuarioService.findAll()
				: usuarioService.findByPerfilNombre(perfil);
		return ResponseEntity.ok(usuarios.stream().map(UsuarioSalidaDto::fromEntity).toList());
	}

	@GetMapping("/{username}")
	public ResponseEntity<UsuarioSalidaDto> findById(@PathVariable String username) {
		return ResponseEntity.ok(UsuarioSalidaDto.fromEntity(usuarioService.findById(username)));
	}

	@PostMapping
	public ResponseEntity<UsuarioSalidaDto> create(@RequestBody UsuarioEntradaDto dto) {
		if (dto.getPassword() == null || dto.getPassword().isBlank()) {
			dto.setPassword("1234");
		}
		return ResponseEntity.status(org.springframework.http.HttpStatus.CREATED)
				.body(UsuarioSalidaDto.fromEntity(usuarioService.insertOne(toEntity(dto))));
	}

	@PutMapping("/{username}")
	public ResponseEntity<UsuarioSalidaDto> update(@PathVariable String username, @RequestBody UsuarioEntradaDto dto) {
		dto.setUsername(username);
		return ResponseEntity.ok(UsuarioSalidaDto.fromEntity(usuarioService.updateOne(toEntity(dto))));
	}

	@DeleteMapping("/{username}")
	public ResponseEntity<Void> delete(@PathVariable String username) {
		usuarioService.deleteOne(username);
		return ResponseEntity.noContent().build();
	}

	private Usuario toEntity(UsuarioEntradaDto dto) {
		return Usuario.builder()
				.username(dto.getUsername())
				.password(dto.getPassword())
				.email(dto.getEmail())
				.nombre(dto.getNombre())
				.apellidos(dto.getApellidos())
				.direccion(dto.getDireccion())
				.enabled(dto.getEnabled())
				.fechaRegistro(dto.getFechaRegistro())
				.perfil(perfilService.findById(dto.getIdPerfil()))
				.build();
	}
}

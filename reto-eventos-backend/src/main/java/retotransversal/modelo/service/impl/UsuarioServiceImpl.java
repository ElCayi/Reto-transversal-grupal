package retotransversal.modelo.service.impl;

import java.time.LocalDate;
import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import retotransversal.exception.ConflictoNegocioException;
import retotransversal.exception.RecursoNoEncontradoException;
import retotransversal.modelo.entities.Usuario;
import retotransversal.modelo.repository.ReservaRepository;
import retotransversal.modelo.repository.UsuarioRepository;
import retotransversal.modelo.service.UsuarioService;

@Service
@RequiredArgsConstructor
public class UsuarioServiceImpl implements UsuarioService {

	private final UsuarioRepository usuarioRepository;
	private final ReservaRepository reservaRepository;
	private final PasswordEncoder passwordEncoder;

	@Override
	public Usuario findById(String username) {
		return usuarioRepository.findById(username)
				.orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado"));
	}

	@Override
	public List<Usuario> findAll() {
		return usuarioRepository.findAll();
	}

	@Override
	public Usuario insertOne(Usuario entidad) {
		validarDuplicadosAlta(entidad);
		if (entidad.getFechaRegistro() == null) {
			entidad.setFechaRegistro(LocalDate.now());
		}
		if (entidad.getEnabled() == null) {
			entidad.setEnabled(1);
		}
		entidad.setPassword(codificarPasswordSiHaceFalta(entidad.getPassword()));
		return usuarioRepository.save(entidad);
	}

	@Override
	public Usuario updateOne(Usuario entidad) {
		Usuario usuarioExistente = findById(entidad.getUsername());
		validarDuplicadosEdicion(entidad);
		if (entidad.getPassword() == null || entidad.getPassword().isBlank()) {
			entidad.setPassword(usuarioExistente.getPassword());
		} else {
			entidad.setPassword(codificarPasswordSiHaceFalta(entidad.getPassword()));
		}
		return usuarioRepository.save(entidad);
	}

	@Override
	@Transactional
	public int deleteOne(String username) {
		findById(username);
		reservaRepository.deleteAll(reservaRepository.findByUsuarioUsername(username));
		usuarioRepository.deleteById(username);
		return 1;
	}

	@Override
	public List<Usuario> findByPerfilNombre(String nombrePerfil) {
		return usuarioRepository.findByPerfilNombre(nombrePerfil);
	}

	private String codificarPasswordSiHaceFalta(String password) {
		if (password == null || password.isBlank()) {
			throw new IllegalArgumentException("La password es obligatoria");
		}
		if (password.startsWith("{")) {
			return password;
		}
		return passwordEncoder.encode(password);
	}

	private void validarDuplicadosAlta(Usuario entidad) {
		if (usuarioRepository.existsById(entidad.getUsername())) {
			throw new ConflictoNegocioException("El username ya existe");
		}
		if (usuarioRepository.findByEmail(entidad.getEmail()).isPresent()) {
			throw new ConflictoNegocioException("El email ya existe");
		}
	}

	private void validarDuplicadosEdicion(Usuario entidad) {
		usuarioRepository.findByEmail(entidad.getEmail())
				.filter(usuario -> !usuario.getUsername().equals(entidad.getUsername()))
				.ifPresent(usuario -> {
					throw new ConflictoNegocioException("El email ya existe");
				});
	}
}

package retotransversal.security;

import java.util.List;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import retotransversal.modelo.entities.Usuario;
import retotransversal.modelo.repository.UsuarioRepository;

@Service
@RequiredArgsConstructor
public class DatabaseUserDetailsService implements UserDetailsService {

	private final UsuarioRepository usuarioRepository;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		Usuario usuario = usuarioRepository.findById(username)
				.orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

		return User.withUsername(usuario.getUsername())
				.password(usuario.getPassword())
				.disabled(usuario.getEnabled() == null || usuario.getEnabled() == 0)
				.authorities(List.of(new SimpleGrantedAuthority(usuario.getPerfil().getNombre())))
				.build();
	}
}

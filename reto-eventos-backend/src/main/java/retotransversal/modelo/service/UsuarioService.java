package retotransversal.modelo.service;

import java.util.List;

import retotransversal.modelo.entities.Usuario;

public interface UsuarioService extends CrudGenerico<Usuario, String> {

	List<Usuario> findByPerfilNombre(String nombrePerfil);
}

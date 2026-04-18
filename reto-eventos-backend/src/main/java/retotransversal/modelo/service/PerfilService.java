package retotransversal.modelo.service;

import retotransversal.modelo.entities.Perfil;

public interface PerfilService extends CrudGenerico<Perfil, Integer> {

	Perfil findByNombre(String nombre);
}

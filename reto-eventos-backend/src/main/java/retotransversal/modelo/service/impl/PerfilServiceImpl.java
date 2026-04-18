package retotransversal.modelo.service.impl;

import java.util.List;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import retotransversal.exception.RecursoNoEncontradoException;
import retotransversal.modelo.entities.Perfil;
import retotransversal.modelo.repository.PerfilRepository;
import retotransversal.modelo.service.PerfilService;

@Service
@RequiredArgsConstructor
public class PerfilServiceImpl implements PerfilService {

	private final PerfilRepository perfilRepository;

	@Override
	public Perfil findById(Integer id) {
		return perfilRepository.findById(id)
				.orElseThrow(() -> new RecursoNoEncontradoException("Perfil no encontrado"));
	}

	@Override
	public List<Perfil> findAll() {
		return perfilRepository.findAll();
	}

	@Override
	public Perfil insertOne(Perfil entidad) {
		return perfilRepository.save(entidad);
	}

	@Override
	public Perfil updateOne(Perfil entidad) {
		findById(entidad.getIdPerfil());
		return perfilRepository.save(entidad);
	}

	@Override
	public int deleteOne(Integer id) {
		findById(id);
		perfilRepository.deleteById(id);
		return 1;
	}

	@Override
	public Perfil findByNombre(String nombre) {
		return perfilRepository.findByNombre(nombre)
				.orElseThrow(() -> new RecursoNoEncontradoException("Perfil no encontrado"));
	}
}

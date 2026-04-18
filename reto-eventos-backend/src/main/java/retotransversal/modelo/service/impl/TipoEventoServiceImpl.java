package retotransversal.modelo.service.impl;

import java.util.List;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import retotransversal.exception.RecursoNoEncontradoException;
import retotransversal.modelo.entities.TipoEvento;
import retotransversal.modelo.repository.TipoEventoRepository;
import retotransversal.modelo.service.TipoEventoService;

@Service
@RequiredArgsConstructor
public class TipoEventoServiceImpl implements TipoEventoService {

	private final TipoEventoRepository tipoEventoRepository;

	@Override
	public TipoEvento findById(Integer id) {
		return tipoEventoRepository.findById(id)
				.orElseThrow(() -> new RecursoNoEncontradoException("Tipo de evento no encontrado"));
	}

	@Override
	public List<TipoEvento> findAll() {
		return tipoEventoRepository.findAll();
	}

	@Override
	public TipoEvento insertOne(TipoEvento entidad) {
		return tipoEventoRepository.save(entidad);
	}

	@Override
	public TipoEvento updateOne(TipoEvento entidad) {
		findById(entidad.getIdTipo());
		return tipoEventoRepository.save(entidad);
	}

	@Override
	public int deleteOne(Integer id) {
		findById(id);
		tipoEventoRepository.deleteById(id);
		return 1;
	}
}

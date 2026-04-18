package retotransversal.modelo.service;

import java.util.List;

public interface CrudGenerico<T, ID> {

	T findById(ID id);

	List<T> findAll();

	T insertOne(T entidad);

	T updateOne(T entidad);

	int deleteOne(ID id);
}

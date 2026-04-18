# Ejercicio Examen: Endpoint `/activos`

## Enunciado resumido

Implementar el flujo completo para el endpoint `/activos`, que debe devolver el listado de todos los eventos que se encuentren en estado `ACTIVO`.

Arquitectura exigida por Tomas:

- `Repository`
- `Service`
- `ServiceImpl`
- `RestController`
- `DTO` de salida
- Ejemplo de `JSON`

No hace falta montar el proyecto desde cero, ni escribir `imports`, ni configurar `application.properties`, ni volver a anotar entidades JPA.

---

## 1. Repository

```java
package retotransversal.modelo.repository;

import java.util.List;

import retotransversal.modelo.entities.EstadoEvento;
import retotransversal.modelo.entities.Evento;

public interface EventoRepository extends CrudGenerico<Evento, Integer> {

    List<Evento> findByEstado(EstadoEvento estado);
}
```

Idea clave:

- Se usa un metodo derivado de Spring Data.
- Tomas suele preferir esto antes que queries mas complejas si no hacen falta.

---

## 2. DTO de salida

```java
package retotransversal.modelo.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import retotransversal.modelo.entities.Evento;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class EventoActivoDto {

    private Integer idEvento;
    private String nombre;
    private LocalDate fechaInicio;
    private BigDecimal precio;
    private String destacado;
    private String tipoEvento;

    public static EventoActivoDto fromEntity(Evento evento) {
        return EventoActivoDto.builder()
                .idEvento(evento.getIdEvento())
                .nombre(evento.getNombre())
                .fechaInicio(evento.getFechaInicio())
                .precio(evento.getPrecio())
                .destacado(evento.getDestacado())
                .tipoEvento(evento.getTipoEvento().getNombre())
                .build();
    }
}
```

Idea clave:

- No devolvemos directamente la entidad `Evento`.
- Devolvemos solo los datos necesarios para la respuesta.

---

## 3. Service (interfaz)

```java
package retotransversal.modelo.service;

import java.util.List;

import retotransversal.modelo.entities.Evento;

public interface EventoService extends CrudGenerico<Evento, Integer> {

    List<Evento> findActivos();
}
```

Idea clave:

- El `RestController` nunca debe llamar directamente al `Repository`.
- Siempre pasa por `Service`.

---

## 4. ServiceImpl

```java
package retotransversal.modelo.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import retotransversal.modelo.entities.EstadoEvento;
import retotransversal.modelo.entities.Evento;
import retotransversal.modelo.repository.EventoRepository;
import retotransversal.modelo.service.EventoService;

@Service
@RequiredArgsConstructor
public class EventoServiceImpl implements EventoService {

    private final EventoRepository eventoRepository;

    @Override
    public List<Evento> findActivos() {
        return eventoRepository.findByEstado(EstadoEvento.ACTIVO);
    }

    @Override
    public Evento findById(Integer id) {
        return eventoRepository.findById(id).orElse(null);
    }

    @Override
    public List<Evento> findAll() {
        return eventoRepository.findAll();
    }

    @Override
    public Evento insertOne(Evento entidad) {
        return eventoRepository.save(entidad);
    }

    @Override
    public Evento updateOne(Evento entidad) {
        return eventoRepository.save(entidad);
    }

    @Override
    public int deleteOne(Integer id) {
        eventoRepository.deleteById(id);
        return 1;
    }
}
```

Idea clave:

- La logica de negocio queda en el `ServiceImpl`.
- En este caso es simple: pedir al repositorio los eventos en estado `ACTIVO`.

---

## 5. RestController

```java
package retotransversal.restcontroller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import retotransversal.modelo.dto.EventoActivoDto;
import retotransversal.modelo.service.EventoService;

@RestController
@RequestMapping("/api/eventos")
@RequiredArgsConstructor
public class EventoRestController {

    private final EventoService eventoService;

    @GetMapping("/activos")
    public ResponseEntity<List<EventoActivoDto>> findActivos() {
        List<EventoActivoDto> respuesta = eventoService.findActivos()
                .stream()
                .map(EventoActivoDto::fromEntity)
                .toList();

        return ResponseEntity.ok(respuesta);
    }
}
```

Idea clave:

- Se usa `ResponseEntity`.
- El controlador llama al `Service`.
- El `Service` devuelve entidades.
- El controlador las convierte a `DTO`.

---

## 6. JSON de ejemplo

```json
[
  {
    "idEvento": 1,
    "nombre": "Cata de Leche Abducida",
    "fechaInicio": "2026-05-20",
    "precio": 35.00,
    "destacado": "S",
    "tipoEvento": "CATA_COSMICA"
  },
  {
    "idEvento": 2,
    "nombre": "Abduccion Suave para Principiantes",
    "fechaInicio": "2026-05-28",
    "precio": 22.50,
    "destacado": "N",
    "tipoEvento": "ABDUCCION_SUAVE"
  }
]
```

---

## 7. Que quiere ver Tomas aqui

Si esto sale en examen, lo importante no es la perfeccion absoluta, sino que se vea esta estructura:

1. `Repository` con metodo derivado
2. `Service` con la firma del metodo
3. `ServiceImpl` llamando al repositorio
4. `RestController` usando `ResponseEntity`
5. `DTO` de salida
6. `JSON` coherente con la ruta

---

## 8. Esquema mental rapido para memorizar

```text
GET /api/eventos/activos
        |
        v
RestController
        |
        v
EventoService.findActivos()
        |
        v
EventoRepository.findByEstado(EstadoEvento.ACTIVO)
        |
        v
List<Evento>
        |
        v
map(EventoActivoDto::fromEntity)
        |
        v
ResponseEntity.ok(listaDto)
```

---

## 9. Frase de examen corta

Si te bloqueas, piensa asi:

`Me piden listar eventos activos, asi que hago un findByEstado en Repository, lo paso por Service, y en el Controller devuelvo una lista de DTOs con ResponseEntity.ok().`

package retotransversal.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityScheme;

@Configuration
public class OpenApiConfig {

	@Bean
	public OpenAPI retoOpenAPI() {
		return new OpenAPI()
				.components(new Components().addSecuritySchemes("basicAuth",
						new SecurityScheme().type(SecurityScheme.Type.HTTP).scheme("basic")))
				.info(new Info()
						.title("API Reto Transversal - Reserva de Eventos")
						.version("1.0.0")
						.description(
								"API REST base para la gestion de perfiles, usuarios, tipos de evento, eventos y reservas.")
						.contact(new Contact().name("Reto Transversal 2 DAW")));
	}
}

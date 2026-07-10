package com.asthood.techstore;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan; // 👈 Importante
import org.springframework.data.web.config.EnableSpringDataWebSupport;
import static org.springframework.data.web.config.EnableSpringDataWebSupport.PageSerializationMode.VIA_DTO;

@SpringBootApplication
@ComponentScan(basePackages = "com.asthood.techstore") // 👈 Esto obliga a Spring a buscar tu SecurityConfig
@EnableSpringDataWebSupport(pageSerializationMode = VIA_DTO)
public class TechstoreApplication {

	public static void main(String[] args) {
		SpringApplication.run(TechstoreApplication.class, args);
	}
}
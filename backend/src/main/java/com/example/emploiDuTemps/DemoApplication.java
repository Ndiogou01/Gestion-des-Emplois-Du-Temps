	package com.example.emploiDuTemps;

	import org.springframework.boot.SpringApplication;
	import org.springframework.boot.autoconfigure.SpringBootApplication;
	import org.springframework.boot.autoconfigure.domain.EntityScan;
	import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

	@SpringBootApplication
	@EntityScan("com.example.emploiDuTemps.entity")
	@EnableJpaRepositories("com.example.emploiDuTemps.repository")
	public class DemoApplication {

		public static void main(String[] args) {
			SpringApplication.run(DemoApplication.class, args);
		}
	}

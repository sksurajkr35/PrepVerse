package com.prepverse;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * PrepVerse Backend - Java (Spring Boot) entry point.
 * Run with: mvn spring-boot:run  (needs MySQL running, see application.properties)
 */
@SpringBootApplication
public class PrepverseApplication {

    public static void main(String[] args) {
        SpringApplication.run(PrepverseApplication.class, args);
    }
}

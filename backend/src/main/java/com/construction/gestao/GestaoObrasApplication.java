package com.construction.gestao;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class GestaoObrasApplication {

    public static void main(String[] args) {
        SpringApplication.run(GestaoObrasApplication.class, args);
    }
}


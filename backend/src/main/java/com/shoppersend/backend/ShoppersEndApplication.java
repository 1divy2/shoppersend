package com.shoppersend.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class ShoppersEndApplication {

    public static void main(String[] args) {
        SpringApplication.run(ShoppersEndApplication.class, args);
    }

}

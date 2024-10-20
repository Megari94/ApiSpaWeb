package com.madeTUP.AppSpa; // Asegúrate de que el paquete coincida con el de tu proyecto

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("https://apispaweb-production.up.railway.app") // Especifica tu origen permitido
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*") // Permitir cualquier encabezado
                .allowCredentials(true); // Permitir el uso de credenciales (cookies, encabezados de autenticación, etc.)
    }
}

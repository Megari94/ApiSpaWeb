package com.madeTUP.AppSpa.DTO;

import lombok.Getter;
import lombok.Setter;

@Setter @Getter
public class ClienteAdminDTO {
      private Long id;
     private String nombre;
    private String apellido;
     private String correo;
     private String contrasenia;
    private String nombre_usuario;

    public ClienteAdminDTO() {
    }

    public ClienteAdminDTO(Long id, String nombre, String apellido, String correo, String contrasenia, String nombre_usuario) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.correo = correo;
        this.contrasenia = contrasenia;
        this.nombre_usuario = nombre_usuario;
    }

     
     
}
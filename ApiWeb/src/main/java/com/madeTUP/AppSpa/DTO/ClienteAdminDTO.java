package com.madeTUP.AppSpa.DTO;

import lombok.Getter;
import lombok.Setter;

@Setter @Getter
public class ClienteAdminDTO {
      private Long id;
     private String nombre;
    private String apellido;
     private String correo;

    public ClienteAdminDTO() {
    }

    public ClienteAdminDTO(Long id, String nombre, String apellido, String correo) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.correo = correo;
    }
     
     
}

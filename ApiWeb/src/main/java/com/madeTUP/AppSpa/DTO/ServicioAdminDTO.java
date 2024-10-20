/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.madeTUP.AppSpa.DTO;

import lombok.Getter;
import lombok.Setter;

/**
 *
 * @author Virginia
 */
@Getter @Setter
public class ServicioAdminDTO {
     private Long id;
    private String nombreServicio;
    private Long nroEtapas;
    private String personalNombre;
    private String personalApellido; 

    public ServicioAdminDTO() {
    }

    public ServicioAdminDTO(Long id, String nombreServicio, Long nroEtapas, String personalNombre) {
        this.id = id;
        this.nombreServicio = nombreServicio;
        this.nroEtapas = nroEtapas;
        this.personalNombre = personalNombre;
    }

    
}

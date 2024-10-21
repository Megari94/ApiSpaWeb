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
public class ServicioAdministradorDTO {
    private Long id;
     private String nombreServicio;
    private Long nroEtapas;
    private Long personalId;

    public ServicioAdministradorDTO() {
    }

    public ServicioAdministradorDTO(Long id,String nombreServicio, Long nroEtapas, Long personalId) {
        this.id=id;
        this.nombreServicio = nombreServicio;
        this.nroEtapas = nroEtapas;
        this.personalId = personalId;
    }
    
    
}

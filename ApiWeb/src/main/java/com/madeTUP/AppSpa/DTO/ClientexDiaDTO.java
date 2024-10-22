/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.madeTUP.AppSpa.DTO;

import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

/**
 *
 * @author Virginia
 */
@Getter @Setter
public class ClientexDiaDTO {
 private Long id ;
private LocalDateTime Fecha;
private String Cliente;
private String Servicio;
private String Profesional;

    public ClientexDiaDTO() {
    }

    public ClientexDiaDTO(Long id, LocalDateTime Fecha, String Cliente, String Servicio, String Profesional) {
        this.id = id;
        this.Fecha = Fecha;
        this.Cliente = Cliente;
        this.Servicio = Servicio;
        this.Profesional = Profesional;
    }


}

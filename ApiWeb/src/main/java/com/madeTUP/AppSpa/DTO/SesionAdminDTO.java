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
public class SesionAdminDTO {
    
    private Long id;
    private String asistencia;
    private Double Costo;
    private LocalDateTime fecha;
    private String nombre_completo;
    private String nombre_servicio;
    private String metPago;

    public SesionAdminDTO() {
    }

    public SesionAdminDTO(Long id, String asistencia, Double Costo, LocalDateTime fecha, String nombre_completo, String nombre_servicio, String metPago) {
        this.id = id;
        this.asistencia = asistencia;
        this.Costo = Costo;
        this.fecha = fecha;
        this.nombre_completo = nombre_completo;
        this.nombre_servicio = nombre_servicio;
        this.metPago = metPago;
    }

   
   
    
}

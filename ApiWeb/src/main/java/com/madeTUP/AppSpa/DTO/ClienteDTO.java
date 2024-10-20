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
@Setter @Getter
public class ClienteDTO {
    private Long id;
     private String nombre;
    

    public ClienteDTO() {
    }

    public ClienteDTO(Long id, String nombre) {
        this.id = id;
        this.nombre = nombre;
        
    }

    public Long getId(){
            return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

}

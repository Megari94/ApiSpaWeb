/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.madeTUP.AppSpa.Model;

import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

/**
 *
 * @author Virginia
 */
@Entity
@Getter @Setter
public class Secretaria extends Usuario {

    public Secretaria() {
    }
    
    // Constructor que hereda los atributos de Usuario
    public Secretaria(Long id, String nombre, String apellido, String nombre_usuario, String correo, String contrasenia, String tipoUsuario) {
        super(id, nombre, apellido, nombre_usuario, correo, contrasenia, tipoUsuario);
    }
}

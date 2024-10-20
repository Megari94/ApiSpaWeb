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
public class UsuarioAdminDTO{
    private Long id;
 private String nombre;
 private String apellido;
 private String nombre_usuario;
 private String correo;
 private String contrasenia;
private String tipoUsuario;

    public UsuarioAdminDTO() {
    }

    public UsuarioAdminDTO(Long id, String nombre, String apellido, String nombre_usuario, String correo, String contrasenia, String tipoUsuario) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.nombre_usuario = nombre_usuario;
        this.correo = correo;
        this.contrasenia = contrasenia;
        this.tipoUsuario = tipoUsuario;
    }


}

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.madeTUP.AppSpa.Service;
import com.madeTUP.AppSpa.Model.Administrador;
import java.util.List;

/**
 *
 * @author Virginia
 */
public interface IAdministradorService {
     public List<Administrador> getAdministrador();
    public void saveAdministrador (Administrador administrador);
    public void deleteAdministrador (Long id);
    public Administrador findAdministrador (Long id);
    public void editAdministrador (Long id, String nombre, String apellido, String correo, String nombre_usuario, String contrasenia, String tipoUsuario);
    public void editAdministradorII (Administrador administrador);
}

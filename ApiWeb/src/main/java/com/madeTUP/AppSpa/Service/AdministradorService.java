/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.madeTUP.AppSpa.Service;

import com.madeTUP.AppSpa.Model.Administrador;
import com.madeTUP.AppSpa.Repository.IAdministradorRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author Virginia
 */
@Service
public class AdministradorService implements IAdministradorService{

    @Autowired 
    private IAdministradorRepository adminRepo;
    
    @Override
    public List<Administrador> getAdministrador() {
        return adminRepo.findAll();
    }

    @Override
    public void saveAdministrador(Administrador administrador) {
        adminRepo.save(administrador);
    }

    @Override
    public void deleteAdministrador(Long id) {
        adminRepo.deleteById(id);
    }

    @Override
    public Administrador findAdministrador(Long id) {
        Administrador admin= adminRepo.findById(id).orElse(null);
        return admin;
    }
@Override
public void editAdministrador(Long id, String nombre, String apellido, String correo, String nombre_usuario, String contrasenia, String tipoUsuario) {
    Administrador admin = this.findAdministrador(id);
    
    // Actualizar solo los campos que no sean nulos
    if (nombre != null) admin.setNombre(nombre);
    if (apellido != null) admin.setApellido(apellido);
    if (correo != null) admin.setCorreo(correo);
    if (nombre_usuario != null) admin.setNombre_usuario(nombre_usuario);
    if (contrasenia != null) admin.setContrasenia(contrasenia);
    if (tipoUsuario != null) admin.setTipoUsuario(tipoUsuario);
    
    // Guardar el objeto actualizado
    this.saveAdministrador(admin);
}


    @Override
    public void editAdministradorII(Administrador administrador) {
        this.saveAdministrador(administrador);
    }
    
}

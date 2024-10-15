/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.madeTUP.AppSpa.Service;

import com.madeTUP.AppSpa.Model.Secretaria;
import com.madeTUP.AppSpa.Model.Usuario;
import com.madeTUP.AppSpa.Repository.ISecretariaRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author Virginia
 */
@Service
public class SecretariaService implements ISecretariaService {

    @Autowired
    private ISecretariaRepository secrerepo;
    
    @Override
    public List<Secretaria> getSecretaria() {
        return secrerepo.findAll();
    }

    @Override
    public void saveSecretaria(Secretaria secretaria) {
        secrerepo.save(secretaria);
    }

    @Override
    public void deleteSecretaria(Long id) {
        secrerepo.deleteById(id);
    }

    @Override
    public Secretaria findSecretaria(Long id) {
        Secretaria secre=secrerepo.findById(id).orElse(null);
        return secre;
    }

   @Override
public void editSecretaria(Long id, String nombre, String apellido, String correo, String nombre_usuario, String contrasenia, String tipoUsuario) {
    Secretaria secre = this.findSecretaria(id);

    // Actualizar solo los campos que no sean nulos
    if (nombre != null) secre.setNombre(nombre);
    if (apellido != null) secre.setApellido(apellido);
    if (correo != null) secre.setCorreo(correo);
    if (nombre_usuario != null) secre.setNombre_usuario(nombre_usuario);
    if (contrasenia != null) secre.setContrasenia(contrasenia);
    if (tipoUsuario != null) secre.setTipoUsuario(tipoUsuario);
    
    this.saveSecretaria(secre); // Guardar los cambios en la secretaria
}


    @Override
    public void editSecretariaII(Secretaria secretaria) {
        this.saveSecretaria(secretaria);
    }

}

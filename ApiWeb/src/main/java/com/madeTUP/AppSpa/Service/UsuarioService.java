/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.madeTUP.AppSpa.Service;

import com.madeTUP.AppSpa.Model.Administrador;
import com.madeTUP.AppSpa.Model.Personal;
import com.madeTUP.AppSpa.Model.Secretaria;
import com.madeTUP.AppSpa.Model.Usuario;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author Virginia
 */
@Service
public class UsuarioService implements IUsuarioService{
    @Autowired 
    private AdministradorService serviAdmin;
    @Autowired
    private PersonalService serviPer;
    @Autowired
    private SecretariaService serviSecre;
    
    @Override
public Usuario findByUsernameOrEmail(String username) {
    
    List<Usuario> listaUsuario = new ArrayList<>();
    List<Personal> listaPersonal = serviPer.getPersonal();
    List<Administrador> listaAdmin = serviAdmin.getAdministrador();
    List<Secretaria> listaSecre = serviSecre.getSecretaria();
    listaUsuario.addAll(listaPersonal);
    listaUsuario.addAll(listaAdmin);
    listaUsuario.addAll(listaSecre);
    
    for (Usuario usuario : listaUsuario) {
        if (usuario.getNombre_usuario().equals(username) || usuario.getCorreo().equals(username)) {
            return usuario;
            
        }
    }
    
    return null; // Retorna null si no se encuentra
}
   
@Override
public boolean verifyPassword(Usuario usuario, String password) {
    // Verificar si el usuario es null
    if (usuario == null) {
        return false; // Retornar false si el usuario no existe
    }
    
    // Comparar la contraseña proporcionada con la contraseña almacenada
    return usuario.getContrasenia().equals(password);
}

    
}

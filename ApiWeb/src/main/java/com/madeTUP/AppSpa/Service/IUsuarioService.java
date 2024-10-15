/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.madeTUP.AppSpa.Service;

import com.madeTUP.AppSpa.Model.Usuario;

/**
 *
 * @author Virginia
 */
public interface IUsuarioService  {
     public Usuario findByUsernameOrEmail(String username);
     public boolean verifyPassword(Usuario usuario, String password);
}

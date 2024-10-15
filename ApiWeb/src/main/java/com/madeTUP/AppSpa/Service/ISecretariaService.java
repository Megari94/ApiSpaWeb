/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.madeTUP.AppSpa.Service;

import com.madeTUP.AppSpa.Model.Secretaria;
import java.util.List;

/**
 *
 * @author Virginia
 */
public interface ISecretariaService {
     public List<Secretaria> getSecretaria();
    public void saveSecretaria (Secretaria secretaria);
    public void deleteSecretaria (Long id);
    public Secretaria findSecretaria (Long id);
    public void editSecretaria (Long id, String nombre, String apellido, String correo, String nombre_usuario, String contrasenia, String tipoUsuario);
    public void editSecretariaII (Secretaria secretaria);
}

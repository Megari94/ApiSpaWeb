/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.madeTUP.AppSpa.Service;

import com.madeTUP.AppSpa.DTO.SesionPersonalDTO;
import com.madeTUP.AppSpa.Model.Personal;
import com.madeTUP.AppSpa.Model.Servicio;
import com.madeTUP.AppSpa.Model.Sesion;
import com.madeTUP.AppSpa.Repository.IPersonalRepository;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author Virginia
 */
@Service
public class PersonalService implements IPersonalService {
    
    @Autowired 
    private IPersonalRepository personalrepo;
    @Autowired
    private ISesionService servisSesion;
    
    @Override
    public List<Personal> getPersonal() {
       return personalrepo.findAll();
    }

    @Override
    public void savePersonal(Personal personal) {
     personalrepo.save(personal);
    }

    @Override
    public void deletePersonal(Long id) {
    personalrepo.deleteById(id);
    }

    @Override
    public Personal findPersonal(Long id) {
        return personalrepo.findById(id).orElse(null);
    }

   

    @Override
    public void editPersonalII(Personal personal) {
        this.savePersonal(personal);
    }

    

    @Override
    public void editPersonal(Long id, String nombre, String apellido, String correo, String nombre_usuario, String contrasenia, List<Servicio> listaServicio, String tipoUsuario) {
 Personal personal=this.findPersonal(id);
        // Actualizar solo los campos que no sean nulos
    if (nombre != null) personal.setNombre(nombre);
    if (apellido != null) personal.setApellido(apellido);
    if (correo != null) personal.setCorreo(correo);
    if (nombre_usuario != null) personal.setNombre_usuario(nombre_usuario);
    if (contrasenia != null) personal.setContrasenia(contrasenia);
    if (listaServicio != null) personal.setListaServicio(listaServicio);
    if (tipoUsuario != null) personal.setTipoUsuario(tipoUsuario);
        this.savePersonal(personal);
    }

   
    @Override
    public List<SesionPersonalDTO> listaSesiones(Long idPersonal){
        List<SesionPersonalDTO> listaSesionesDos = new ArrayList<>();
        personalrepo.findSesionesByPersonalId(idPersonal);
               return listaSesionesDos;
    }   
}

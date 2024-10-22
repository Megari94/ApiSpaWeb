/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.madeTUP.AppSpa.Service;

import com.madeTUP.AppSpa.DTO.SesionAdminDTO;
import com.madeTUP.AppSpa.DTO.SesionPersonalDTO;
import com.madeTUP.AppSpa.Model.Personal;
import com.madeTUP.AppSpa.Model.Servicio;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.repository.query.Param;

/**
 *
 * @author Virginia
 */
public interface IPersonalService {
     public List<Personal> getPersonal();
    public void savePersonal (Personal personal);
    public void deletePersonal (Long id);
    public Personal findPersonal (Long id);
    public void editPersonal (Long id, String nombre, String apellido, String correo, String nombre_usuario, String contrasenia, List<Servicio> listaServicio, String tipoUsuario);
    public void editPersonalII (Personal personal);
    public List<SesionPersonalDTO> listaSesiones(Long idPersonal);
    List<SesionAdminDTO> findConfirmedSessionsByPersonalBetweenDates(@Param("personalId") Long personalId, 
                                                                     @Param("startDate") LocalDateTime startDate, 
                                                                     @Param("endDate") LocalDateTime endDate);

    
}

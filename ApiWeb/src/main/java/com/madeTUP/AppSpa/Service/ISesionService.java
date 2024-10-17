/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.madeTUP.AppSpa.Service;

import com.madeTUP.AppSpa.DTO.SesionDTO;
import com.madeTUP.AppSpa.DTO.SesionPersonalDTO;
import com.madeTUP.AppSpa.Model.Cliente;
import com.madeTUP.AppSpa.Model.Servicio;
import com.madeTUP.AppSpa.Model.Sesion;
import java.time.LocalDate;
import com.madeTUP.AppSpa.DTO.SesionAdminDTO;
import java.time.LocalDateTime;
import java.util.List;

/**
 *
 * @author Virginia
 */
public interface ISesionService {
    public List<Sesion> getServicio();
    public void saveSesion (Sesion sesion);
    public void deleteSesion (Long id);
    public Sesion findSesion (Long id);
    public void editSesion (Long id,Servicio servicio,Cliente cliente,LocalDateTime fecha,Double costo,String asistencia);
    public void editSesionII (Sesion sesion);
    public boolean cancelarAsistencia(Long id);
    public List<SesionDTO> getSesionCliente(Long id_Cliente);
public List<SesionAdminDTO> sesionesAdmin();
    public List<SesionPersonalDTO> getSesionFecha(LocalDateTime localDate);
}

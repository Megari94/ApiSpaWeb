/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.madeTUP.AppSpa.Repository;

import com.madeTUP.AppSpa.DTO.ServicioAdminDTO;
import com.madeTUP.AppSpa.Model.Servicio;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

/**
 *
 * @author Virginia
 */
@Repository
public interface IServicioRepository extends JpaRepository<Servicio,Long>{
    @Query("SELECT new com.madeTUP.AppSpa.DTO.ServicioAdminDTO(s.id, s.nombreServicio, s.nroEtapas, u.nombre, u.apellido) " +
           "FROM Servicio s " +
           "JOIN s.personal u")
   List<ServicioAdminDTO> findAllServiciosWithPersonal();
}

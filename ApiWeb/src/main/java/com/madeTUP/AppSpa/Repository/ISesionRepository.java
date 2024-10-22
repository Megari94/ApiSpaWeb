/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.madeTUP.AppSpa.Repository;

import com.madeTUP.AppSpa.DTO.SesionAdminDTO;
import com.madeTUP.AppSpa.Model.Sesion;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


/**
 *
 * @author Virginia
 */
@Repository
public interface ISesionRepository extends JpaRepository<Sesion,Long>{
@Query("SELECT new com.madeTUP.AppSpa.DTO.SesionAdminDTO(s.id, s.asistencia, s.costo, s.fecha, CONCAT(c.nombre, ' ', c.apellido), se.nombreServicio) " +
           "FROM Sesion s " +
           "JOIN s.cliente c " +
           "JOIN s.servicio se " +
           "WHERE s.fecha BETWEEN :startDate AND :endDate AND s.asistencia = 'CONFIRMADO'")
    List<SesionAdminDTO> findConfirmedSessionsBetweenDates(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

}

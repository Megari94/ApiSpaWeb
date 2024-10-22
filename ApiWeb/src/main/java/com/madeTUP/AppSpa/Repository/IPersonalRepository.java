package com.madeTUP.AppSpa.Repository;

import com.madeTUP.AppSpa.DTO.SesionAdminDTO;
import com.madeTUP.AppSpa.DTO.SesionPersonalDTO;
import com.madeTUP.AppSpa.Model.Personal;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface IPersonalRepository extends JpaRepository<Personal, Long> {
@Query("SELECT new com.madeTUP.AppSpa.DTO.SesionPersonalDTO(s.id, c.id, CONCAT(c.nombre, ' ', c.apellido), ser.nombreServicio, s.fecha, s.costo, s.asistencia) " +
           "FROM Sesion s " +
           "JOIN s.cliente c " +
           "JOIN s.servicio ser " +
           "JOIN ser.personal p " +
           "WHERE p.id = :personalId")
    List<SesionPersonalDTO> findSesionesByPersonalId(@Param("personalId") Long personalId);

    @Query("SELECT new com.madeTUP.AppSpa.DTO.SesionAdminDTO(s.id, s.asistencia, s.costo, s.fecha, CONCAT(c.nombre, ' ', c.apellido), se.nombreServicio) " +
           "FROM Sesion s " +
           "JOIN s.cliente c " +
           "JOIN s.servicio se " +
           "JOIN se.personal p " +
           "WHERE p.id = :personalId " +
           "AND s.asistencia = 'CONFIRMADO' " +
           "AND s.fecha BETWEEN :startDate AND :endDate")
    List<SesionAdminDTO> findConfirmedSessionsByPersonalBetweenDates(@Param("personalId") Long personalId, 
                                                                     @Param("startDate") LocalDateTime startDate, 
                                                                     @Param("endDate") LocalDateTime endDate);

}

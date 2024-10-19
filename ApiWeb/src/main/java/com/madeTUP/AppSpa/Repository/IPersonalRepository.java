package com.madeTUP.AppSpa.Repository;

import com.madeTUP.AppSpa.DTO.SesionPersonalDTO;
import com.madeTUP.AppSpa.Model.Personal;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface IPersonalRepository extends JpaRepository<Personal, Long> {
@Query("SELECT new com.tu.package.SesionPersonalDTO(s.id, c.id, CONCAT(c.nombre, ' ', c.apellido), ser.nombreServicio, s.fecha, s.costo, s.asistencia) " +
           "FROM Sesion s " +
           "JOIN s.cliente c " +
           "JOIN s.servicio ser " +
           "JOIN ser.personal p " +
           "WHERE p.id = :personalId")
    List<SesionPersonalDTO> findSesionesByPersonalId(@Param("personalId") Long personalId);

}

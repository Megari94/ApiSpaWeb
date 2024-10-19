/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.madeTUP.AppSpa.Controller;

import com.madeTUP.AppSpa.DTO.NewSesionDTO;
import com.madeTUP.AppSpa.DTO.SesionDTO;
import com.madeTUP.AppSpa.DTO.SesionPersonalDTO;
import com.madeTUP.AppSpa.Model.Cliente;
import com.madeTUP.AppSpa.Model.Servicio;
import com.madeTUP.AppSpa.Model.Sesion;
import com.madeTUP.AppSpa.DTO.SesionAdminDTO;
import com.madeTUP.AppSpa.Service.IClienteService;
import com.madeTUP.AppSpa.Service.IServicioService;
import com.madeTUP.AppSpa.Service.ISesionService;


import java.time.LocalDate;
import java.time.ZonedDateTime;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Virginia
 */
@RestController
public class SesionController {
    @Autowired 
    private ISesionService servis;
     @Autowired 
    private IServicioService servis1;
     @Autowired 
    private IClienteService servis2;

    @PutMapping("/Sesion/cancelarAsistencia/{id}")
    public ResponseEntity<?> cancelarAsistencia(@PathVariable Long id) {
        boolean success = servis.cancelarAsistencia(id);  // Asegúrate de pasar el ID
        if (success) {
            return ResponseEntity.ok().body(Map.of("success", true));
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("success", false));
        }
    }


    @GetMapping ("/Sesion/MostrarFecha")
    public List<SesionPersonalDTO> getSesionesPorFecha(@RequestParam("fecha") String fecha) {
        LocalDateTime localDateTime = LocalDateTime.parse(fecha);
        // Aquí se consulta la base de datos por las sesiones de la fecha dada
        List<SesionPersonalDTO> sesiones = servis.getSesionFecha(localDateTime);
        return sesiones;
    }
     @GetMapping("/Sesion/traer")
    public List<Sesion> getSesion(){
        return servis.getServicio();
    }
        
    @PostMapping("/Sesion/crear")    
    public String crearSesion(@RequestBody Sesion c){
        servis.saveSesion(c);
        return "Sesion creada";
    }
    @PostMapping("/Sesion/crearDos")    
    public String crearSesionDTO(@RequestBody NewSesionDTO se){
        Sesion sesion= new Sesion();
        Cliente c= servis2.findCliente(se.getId_Cliente());
        sesion.setCliente(c);
        Servicio s=servis1.findServicio(se.getId_Servicio());
        sesion.setServicio(s);
        LocalDateTime fecha=LocalDateTime.parse(se.getFecha());
        sesion.setFecha(fecha);
        sesion.setAsistencia(se.getAsistencia());
       sesion.setCosto(se.getCosto());
       
        servis.saveSesion(sesion);
        return "Sesion creada";
    }
    @GetMapping("/Sesion/encontrar/{id_sesion}")
    public Sesion findSesion(@PathVariable Long id_sesion){
        return servis.findSesion(id_sesion);
    }
    @DeleteMapping("/Sesion/eliminar/{id_sesion}")
     public String deleteSesion(@PathVariable Long id_sesion){
       servis.deleteSesion(id_sesion);
       return "Sesion eliminado";
    }
     @PutMapping("/Sesion/editar/{id_sesion}")
public ResponseEntity<?> editSesion(@PathVariable Long id_sesion,
        @RequestParam(required=false,name="servicio")Servicio servicio,
        @RequestParam(required=false, name="cliente")Cliente cliente,
        @RequestParam(required=false,name="fecha")LocalDateTime fecha,
        @RequestParam(required=false,name="costo")Double costo,
        @RequestParam(required=false,name="asistencia") String asistencia) {
    try {
        servis.editSesion(id_sesion, servicio, cliente, fecha, costo, asistencia);
        Sesion c = this.findSesion(id_sesion);
        return ResponseEntity.ok(c);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al editar la sesión: " + e.getMessage());
    }
}

     @PutMapping("/Sesion/editarII")
     public Sesion editSesionII(@RequestBody Sesion c)
     {
         servis.editSesionII(c);
         return servis.findSesion(c.getId());
     }
     
     
      @GetMapping("/Sesion/sesionCliente/{idCliente}")
    public List<SesionDTO> getSesionCliente(@PathVariable Long idCliente){
        return servis.getSesionCliente(idCliente);
    }
     
    @PostMapping("/Sesion/agregarSesion")
public ResponseEntity<String> agregarSesion(@RequestBody NewSesionDTO nuevaSesion, @RequestHeader("Authorization") String token) {
    try {
        // Verificamos si el cliente existe
        Cliente cliente = servis2.findCliente(nuevaSesion.getId_Cliente());
        if (cliente == null) {
            return new ResponseEntity<>("Cliente no encontrado", HttpStatus.NOT_FOUND);
        }

        // Verificamos si el servicio existe
        Servicio servicio = servis1.findServicio(nuevaSesion.getId_Servicio());
        if (servicio == null) {
            return new ResponseEntity<>("Servicio no encontrado", HttpStatus.NOT_FOUND);
        }

        // Creamos la nueva sesión
        Sesion sesion = new Sesion();
        sesion.setCliente(cliente);
        sesion.setServicio(servicio);
       ZonedDateTime zonedDateTime = ZonedDateTime.parse(nuevaSesion.getFecha());
        LocalDateTime localDateTime = zonedDateTime.toLocalDateTime();
        sesion.setFecha(localDateTime);
        sesion.setAsistencia("SOLICITADO"); // Puedes ajustarlo según la lógica del negocio

        // Guardamos la sesión
        servis.saveSesion(sesion);

        return new ResponseEntity<>("Sesión creada con éxito", HttpStatus.CREATED);

    } catch (Exception e) {
        return new ResponseEntity<>("Error al crear la sesión: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
@GetMapping("/Sesion/traerAdmin")
    public List<SesionAdminDTO> getSesionAdmin(){
        return servis.sesionesAdmin();
    }
    @PutMapping("/Sesion/aceptar/{id_sesion}")
public ResponseEntity<String> aceptarSesion(@PathVariable Long id) {
    Sesion sesion = servis.findSesion(id);
    if (sesion != null) {
        sesion.setAsistencia("CONFIRMADO"); // Actualiza la asistencia a "confirmado"
        servis.saveSesion(sesion); // Guarda los cambios
        return ResponseEntity.ok("Asistencia confirmada");
    } else {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Sesión no encontrada");
    }
}

// Método para denegar la sesión
@PutMapping("/Sesion/rechazar/{id_sesion}")
public ResponseEntity<String> rechazarSesion(@PathVariable Long id) {
    Sesion sesion = servis.findSesion(id);
    if (sesion != null) {
        sesion.setAsistencia("RECHAZADO"); // Actualiza la asistencia a "rechazado"
        servis.saveSesion(sesion); // Guarda los cambios
        return ResponseEntity.ok("Asistencia rechazada");
    } else {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Sesión no encontrada");
    }
}

}
 
    

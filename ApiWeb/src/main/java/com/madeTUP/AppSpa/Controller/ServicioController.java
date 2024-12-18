/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.madeTUP.AppSpa.Controller;

import com.madeTUP.AppSpa.DTO.ServicioAdminDTO;
import com.madeTUP.AppSpa.DTO.ServicioAdministradorDTO;
import com.madeTUP.AppSpa.DTO.ServicioDTO;
import com.madeTUP.AppSpa.Model.Personal;
import com.madeTUP.AppSpa.Model.Servicio;
import com.madeTUP.AppSpa.Model.Sesion;
import com.madeTUP.AppSpa.Service.IPersonalService;
import com.madeTUP.AppSpa.Service.IServicioService;
import com.madeTUP.AppSpa.Service.ISesionService;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

/**
 *
 * @author Virginia
 */

@RestController
@RequestMapping("/servicio")

public class ServicioController {
    @Autowired 
    private IServicioService servis;
    @Autowired
    private IPersonalService servisP;
    @Autowired
    private ISesionService servisS;
    
    @GetMapping("/traerServicioAdmin")
    public ResponseEntity<List<ServicioAdminDTO>> obtenerServiciosAdmin() {
        // Mapear a ServicioAdminDTO
        List<ServicioAdminDTO> serviciosAdminDTO = servis.getAllServiciosAdmin();
        return ResponseEntity.ok(serviciosAdminDTO);
    }

    

    @GetMapping("/traerServicio")
    public ResponseEntity<List<ServicioDTO>> obtenerServicios() {
        // Lógica para obtener servicios
        List<ServicioDTO> servicios = servis.getAllServicios();
        return ResponseEntity.ok(servicios);
    }
    @GetMapping("/traer")
    public List<Servicio> getServicio(){
        return servis.getServicio();
    }
    
    @PostMapping("/Servicio/crear")
    public String crearServicio(@RequestBody Servicio c){
        servis.saveServicio(c);
        return "Servicio creado";
    }
    @GetMapping("/Servicio/encontrar/{id_servicio}")
    public Servicio findServicio(@PathVariable Long id_servicio){
        return servis.findServicio(id_servicio);
    }
   @DeleteMapping("/Servicio/eliminar/{id_servicio}")
public ResponseEntity<Map<String, String>> deleteServicio(@PathVariable Long id_servicio) {
    // Buscar el servicio a eliminar
    Servicio servi = servis.findServicio(id_servicio);
    
    // Comprobar si el servicio existe
    if (servi == null) {
        return new ResponseEntity<>(Map.of("message", "Servicio no encontrado"), HttpStatus.NOT_FOUND);
    }

    // Obtener todas las sesiones relacionadas
    List<Sesion> listaSesiones = servisS.getServicio(); // Asegúrate de que esto obtiene todas las sesiones

    // Eliminar las sesiones asociadas al servicio
    for (Sesion s : listaSesiones) {
        if (s.getId_Servicio().equals(servi)) { // Asegúrate de comparar el ID correctamente
            servisS.deleteSesion(s.getId());
        }
    }

    // Eliminar el servicio
    servis.deleteServicio(id_servicio);
    
    // Retornar respuesta en formato JSON
    return new ResponseEntity<>(Map.of("message", "Servicio y sesiones eliminadas"), HttpStatus.OK);
}

     
//     @PutMapping("/Servicio/editar/{id_servicio}")
//     public Servicio editServicio(@PathVariable Long id_servicio,
//             @RequestParam(required=false,name="nombre_servicio")String newname,
//            @RequestParam(required=false, name="nroEtapas")Long nroEtapas){
//         
//               servis.editServicio(id_servicio, newname, nroEtapas);
//               Servicio c=this.findServicio(id_servicio);
//               return c;
//}
     @PutMapping("/Servicio/editarII")
     public Servicio editServicioII(@RequestBody Servicio c)
     {
         servis.editServicioII(c);
         return servis.findServicio(c.getId());
     }
     
     
   @PostMapping("/crearAdmin")
public ResponseEntity<Map<String, Object>> crearServicio(@RequestBody ServicioAdministradorDTO c) {
    Servicio servicio = new Servicio();
    servicio.setNombreServicio(c.getNombreServicio());
    servicio.setNroEtapas(c.getNroEtapas());

    // Validar que el ID del personal sea válido
    Personal personal = servisP.findPersonal(c.getPersonalId());
    if (personal == null) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Personal no encontrado"));
    }
    servicio.setPersonal(personal);
    
    // Guardar el servicio
    servis.saveServicio(servicio);

    // Crear la respuesta JSON
    Map<String, Object> response = new HashMap<>();
    response.put("message", "Servicio creado");
    response.put("id", servicio.getId()); // Suponiendo que el servicio tiene un método getId()

    return ResponseEntity.status(HttpStatus.CREATED).body(response);
}


    @PutMapping("/editarAdmin")
public ResponseEntity<Map<String, String>> editServicioIIAdmin(@RequestBody ServicioAdministradorDTO c) {
    // Buscar el servicio existente
    Servicio servicio = servis.findServicio(c.getId());
    if (servicio == null) {
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Servicio no encontrado");
    }
    
    // Actualizar los atributos
    servicio.setNombreServicio(c.getNombreServicio());
    servicio.setNroEtapas(c.getNroEtapas());
    
    // Validar que el ID del personal sea válido
    Personal personal = servisP.findPersonal(c.getPersonalId());
    if (personal == null) {
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Personal no encontrado");
    }
    servicio.setPersonal(personal);
    
    servis.editServicioII(servicio);
    
    // Devolver una respuesta vacía pero en formato JSON
    Map<String, String> response = new HashMap<>();
    response.put("message", "Servicio actualizado correctamente");
    return ResponseEntity.ok(response);
}


}
 

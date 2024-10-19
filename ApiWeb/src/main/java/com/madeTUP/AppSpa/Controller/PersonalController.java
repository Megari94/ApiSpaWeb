/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.madeTUP.AppSpa.Controller;

import com.madeTUP.AppSpa.DTO.ClienteLoginDTO;
import com.madeTUP.AppSpa.DTO.SesionPersonalDTO;
import com.madeTUP.AppSpa.DTO.PersonalPerfilDTO;
import com.madeTUP.AppSpa.Model.Personal;
import com.madeTUP.AppSpa.Model.Servicio;
import com.madeTUP.AppSpa.Model.Sesion;
import com.madeTUP.AppSpa.Service.IPersonalService;
import com.madeTUP.AppSpa.Service.ISesionService;
import java.util.ArrayList;
import java.util.HashMap;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Virginia
 */
@RestController
public class PersonalController {
    @Autowired
    private IPersonalService servis;
    @Autowired
    private ISesionService servisSesion;
    
    
     @GetMapping("/Personal/traer")
    public List<Personal> getPersonal(){
        return servis.getPersonal();
    }
    
    @PostMapping("/Personal/crear")
    public String crearPersonal(@RequestBody Personal c){
        servis.savePersonal(c);
        return "Personal creado";
    }
    @GetMapping("/Personal/encontrar/{id_personal}")
    public Personal findPersonal(@PathVariable Long id_personal){
        return servis.findPersonal(id_personal);
    }
    @DeleteMapping("/Personal/eliminar/{id_personal}")
     public String deletePersonal(@PathVariable Long id_personal){
       servis.deletePersonal(id_personal);
       return "Personal eliminado";
    }
@PutMapping("/Personal/editar/{id_personal}")
public Personal editPersonal(@PathVariable Long id_personal,
                             @RequestParam(required = false, name = "nombre_usuario") String newname,
                             @RequestParam(required = false, name = "contrasenia") String newcontrasenia,
                             @RequestParam(required = false, name = "nombre") String newNombre,
                             @RequestParam(required = false, name = "apellido") String newApellido,
                             @RequestParam(required = false, name = "correo") String newCorreo,
                             @RequestParam(required = false, name = "tipoUsuario") String newTipoUsuario,
                             @RequestParam(required = false, name = "listaServicio") List<Servicio> newListaServicio) {
    
    // Llamada al servicio para editar los datos del personal
    servis.editPersonal(id_personal,newNombre, newApellido, newCorreo, newname, newcontrasenia, newListaServicio,newTipoUsuario);
    
    // Obtener el objeto actualizado
    Personal c = this.findPersonal(id_personal);
    return c;
}

     @PutMapping("/Personal/editarII")
     public Personal editPersonalII(@RequestBody Personal c)
     {
         servis.editPersonalII(c);
         return servis.findPersonal(c.getId());
     }
@PostMapping("Personal/login")
    public ResponseEntity<Map<String, Object>> loginPersonal(@RequestBody ClienteLoginDTO pers) {
        String token = "token-appspa-24";
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Bienvenido, " + pers.getUsername() + ". Inicio de sesión exitoso.");
        return ResponseEntity.ok(response);
    }
        
 @GetMapping("/personal/turnos/{personalId}")
    public ResponseEntity<List<SesionPersonalDTO>> obtenerSesionesPorPersonal(@PathVariable Long personalId) {
        List<SesionPersonalDTO> sesiones = servis.listaSesiones(personalId);
        if (sesiones.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(sesiones);
    }



}

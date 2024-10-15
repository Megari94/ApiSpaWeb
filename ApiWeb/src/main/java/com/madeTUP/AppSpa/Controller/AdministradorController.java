/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.madeTUP.AppSpa.Controller;

/**
 *
 * @author Virginia
 */

import com.madeTUP.AppSpa.DTO.ClienteLoginDTO;
import com.madeTUP.AppSpa.Model.Administrador;
import com.madeTUP.AppSpa.Service.AdministradorService;
import com.madeTUP.AppSpa.Service.IAdministradorService;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AdministradorController {
    @Autowired 
    private IAdministradorService servis;
    
     @GetMapping("/Administrador/traer")
    public List<Administrador> getAdministrador(){
        return servis.getAdministrador();
    }
    
    @PostMapping("/Administrador/crear")
    public String crearAdministrador(@RequestBody Administrador c){
        servis.saveAdministrador(c);
        return "Administrador creado";
    }
    @GetMapping("/Administrador/encontrar/{id_administrador}")
    public Administrador findAdministrador(@PathVariable Long id_administrador){
        return servis.findAdministrador(id_administrador);
    }
    @DeleteMapping("/Administrador/eliminar/{id_administrador}")
     public String deleteAdministrador(@PathVariable Long id_administrador){
       servis.deleteAdministrador(id_administrador);
       return "Administrador eliminado";
    }
     @PutMapping("/Administrador/editar/{id_administrador}")
public Administrador editAdministrador(@PathVariable Long id_administrador,
                                       @RequestParam(required = false, name = "nombre") String newNombre,
                                       @RequestParam(required = false, name = "apellido") String newApellido,
                                       @RequestParam(required = false, name = "correo") String newCorreo,
                                       @RequestParam(required = false, name = "nombre_usuario") String newNombreUsuario,
                                       @RequestParam(required = false, name = "contrasenia") String newContrasenia,
                                       @RequestParam(required = false, name = "tipoUsuario") String newTipoUsuario) {
    
    // Llamada al servicio para editar los datos del administrador
    servis.editAdministrador(id_administrador, newNombre, newApellido, newCorreo, newNombreUsuario, newContrasenia, newTipoUsuario);
    
    // Obtener el objeto actualizado
    Administrador admin = this.findAdministrador(id_administrador);
    return admin;
}

      @PutMapping("/Administrador/editarII")
     public Administrador editAdministradorII(@RequestBody Administrador a)
     {
         servis.editAdministradorII(a);
         return servis.findAdministrador(a.getId());
     }

    @PostMapping("Administrador/login")
    public ResponseEntity<Map<String, Object>> loginAdministrador(@RequestBody ClienteLoginDTO pers) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Bienvenido, " + pers.getUsername() + ". Inicio de sesión exitoso.");
        return ResponseEntity.ok(response);
    }
}

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
import com.madeTUP.AppSpa.DTO.UsuarioAdminDTO;
import com.madeTUP.AppSpa.DTO.UsuarioDTO;
import com.madeTUP.AppSpa.Model.Administrador;
import com.madeTUP.AppSpa.Model.Personal;
import com.madeTUP.AppSpa.Model.Secretaria;
import com.madeTUP.AppSpa.Model.Servicio;
import com.madeTUP.AppSpa.Model.Usuario;
import com.madeTUP.AppSpa.Service.IAdministradorService;
import com.madeTUP.AppSpa.Service.IPersonalService;
import com.madeTUP.AppSpa.Service.ISecretariaService;
import com.madeTUP.AppSpa.Service.IUsuarioService;
import java.util.ArrayList;
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
    @Autowired
    private IUsuarioService servisUsu;
    @Autowired
    private IPersonalService servisP;
    @Autowired
    private ISecretariaService servisS;
    
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
    
    @GetMapping("Administrador/traerPersonal")
    public List<UsuarioAdminDTO> traerUsuarios(){
        return servisUsu.traerUsuarios();
    }
    @PostMapping("/Administrador/crearUsuario")
public ResponseEntity<String> crearPerfilUsuario(@RequestBody UsuarioDTO c) {
    try {
        switch (c.getTipoUsuario()) {
            case "PERSONAL" -> {
                Personal p = new Personal();
                p.setNombre(c.getNombre());
                p.setApellido(c.getApellido());
                p.setNombre_usuario(c.getNombre_usuario());
                p.setCorreo(c.getCorreo());
                p.setContrasenia(c.getContrasenia());
                p.setTipoUsuario(c.getTipoUsuario());
                p.setListaServicio(new ArrayList<>()); // Inicializa la lista de servicios
                servisP.savePersonal(p);
            }
            case "SECRETARIA" -> {
                Secretaria p = new Secretaria();
                p.setNombre(c.getNombre());
                p.setApellido(c.getApellido());
                p.setNombre_usuario(c.getNombre_usuario());
                p.setCorreo(c.getCorreo());
                p.setContrasenia(c.getContrasenia());
                p.setTipoUsuario(c.getTipoUsuario());
                servisS.saveSecretaria(p);
            }
            default -> {
                Administrador p = new Administrador();
                p.setNombre(c.getNombre());
                p.setApellido(c.getApellido());
                p.setNombre_usuario(c.getNombre_usuario());
                p.setCorreo(c.getCorreo());
                p.setContrasenia(c.getContrasenia());
                p.setTipoUsuario(c.getTipoUsuario() == null ? "ADMINISTRADOR" : c.getTipoUsuario());
                servis.saveAdministrador(p);
            }
        }
        return ResponseEntity.status(HttpStatus.CREATED).body("Usuario creado exitosamente");
    } catch (Exception e) {
        // Devuelve una respuesta con un error interno en caso de excepción
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al crear el usuario: " + e.getMessage());
    }
}

}

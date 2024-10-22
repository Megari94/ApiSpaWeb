/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.madeTUP.AppSpa.Controller;

import com.madeTUP.AppSpa.DTO.ClienteAdminDTO;
import com.madeTUP.AppSpa.DTO.ClienteLoginDTO;
import com.madeTUP.AppSpa.DTO.ClientePerfilDTO;
import com.madeTUP.AppSpa.DTO.ClienteDTO;
import com.madeTUP.AppSpa.DTO.SesionDTO;
import com.madeTUP.AppSpa.Model.Cliente;
import com.madeTUP.AppSpa.Model.Consulta;
import com.madeTUP.AppSpa.Model.Servicio;
import com.madeTUP.AppSpa.Model.Sesion;
import com.madeTUP.AppSpa.Service.IClienteService;
import com.madeTUP.AppSpa.Service.IConsultaService;
import com.madeTUP.AppSpa.Service.IServicioService;
import com.madeTUP.AppSpa.Service.ISesionService;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
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
public class ClienteController {
    @Autowired
    private IClienteService servis;
    @Autowired
    private IServicioService servis2;
    @Autowired
    private ISesionService servis3;
        @Autowired
    private IConsultaService servis4;
    
    
    @GetMapping("/clientes/traer")
    public List<Cliente> getClientes(){
        return servis.getClientes();
    }
            
    @PostMapping("/clientes/crear")
    public String crearCliente(@RequestBody Cliente c){
        servis.saveCliente(c);
        return "Cliente creado";
    }
    @GetMapping("/clientes/encontrar/{id_cliente}")
    public Cliente findCliente(@PathVariable Long id_cliente){
        return servis.findCliente(id_cliente);
    }
    @DeleteMapping("/clientes/eliminar/{id_cliente}")
     public String deleteCliente(@PathVariable Long id_cliente){
       servis.deleteCliente(id_cliente);
       return "Cliente eliminado";
    }
     @PutMapping("/clientes/editar/{id_cliente}")
     public Cliente editCliente(@PathVariable Long id_cliente,
             @RequestParam(required=false,name="nombre")String newname,
            @RequestParam(required=false, name="apellido")String newlastname,
            @RequestParam(required=false,name="correo")String newcorreo,
           @RequestParam(required=false,name="contrasenia")String newcontrasenia,
            @RequestParam(required=false,name="nombre_usuario")String newnomusuario,
             @RequestParam(required=false,name="listaSesiones")List<Sesion> newlistasesiones,
              @RequestParam(required=false,name="listaConsultas")List<Consulta> newlistaconsultas,
               @RequestParam(required=false,name="listaServicio")List<Servicio> newlistaservicios){
         
               servis.editCliente(id_cliente, newname, newlastname, newcorreo, newcontrasenia, newnomusuario, newlistasesiones, newlistaconsultas, newlistaservicios);
               Cliente c=this.findCliente(id_cliente);
               return c;
}
     @PutMapping("/clientes/editarII")
     public Cliente editClienteII(@RequestBody Cliente c)
     {
         servis.editClienteII(c);
         return servis.findCliente(c.getId());
     }
     
     @PutMapping("/clientes/agregarServicio/{id_c}/{id_s}")
     public String agregarServicio(@PathVariable Long id_c,@PathVariable Long id_s){
         Cliente c= servis.findCliente(id_c);
         Servicio s=servis2.findServicio(id_s);
         c.getListaServicio().add(s);
       servis.editClienteII(c);

         return "Servicio Agregado";
     }
     @PutMapping("/clientes/agregarSesion/{id_c}/{id_s}")
     public String agregarSesion(@PathVariable Long id_c,@PathVariable Long id_s,@RequestBody Sesion se){
         Cliente c= servis.findCliente(id_c);
         Servicio s=servis2.findServicio(id_s);
         se.setCliente(c);
         se.setServicio(s);
       servis3.editSesionII(se);
         return "Sesion Agregado";
     }
     
     @PutMapping("/clientes/agregarConsulta/{id_c}")
     public String agregarConsulta(@PathVariable Long id_c,@RequestBody Consulta co){
         Cliente c= servis.findCliente(id_c);
         co.setCliente(c);
       servis4.editConsultaII(co);
         return "Consulta Agregada";
     }
     
 @CrossOrigin(origins = "*")
@PostMapping("/Cliente/login")
public ResponseEntity<Map<String, Object>> loginCliente(@RequestBody ClienteLoginDTO clienteDTO) {
    List<Cliente> listaClientes = servis.getClientes();
    
    for (Cliente cliente : listaClientes) {
        if (cliente.getNombre_usuario().equals(clienteDTO.getUsername()) || cliente.getCorreo().equals(clienteDTO.getUsername())) {
            if (cliente.getContrasenia().equals(clienteDTO.getPassword())) {
                // Token predeterminado
                String token = "token-appspa-2024";  // Aquí defines el token fijo

                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Inicio de sesión exitoso.");
                response.put("clienteId", cliente.getId());
                response.put("token", token);  // Devuelve el token fijo

                return ResponseEntity.ok(response);
            }
        }
    }

    Map<String, Object> response = new HashMap<>();
    response.put("success", false);
    response.put("message", "Nombre de usuario o contraseña incorrectos.");
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
}



@CrossOrigin(origins = "*")
@GetMapping("/cliente/perfil")
    public ResponseEntity<ClientePerfilDTO> getPerfilCliente(@RequestParam Long clienteId) {
        Cliente cliente1= servis.findCliente(clienteId);
        ClientePerfilDTO perfilDTO = new ClientePerfilDTO();
        perfilDTO.setId(clienteId);
        perfilDTO.setNombre(cliente1.getNombre());
        perfilDTO.setApellido(cliente1.getApellido());
        
        List<SesionDTO> listaSesionDTO=new ArrayList<>();
        
        for(Sesion sesion: cliente1.getListaSesiones()){
           SesionDTO s= new SesionDTO(sesion.getServicio().getNombreServicio(),sesion.getFecha(),sesion.getCosto(),sesion.getAsistencia());
           listaSesionDTO.add(s);
        }
        perfilDTO.setLista_Sesiones(listaSesionDTO);
        return ResponseEntity.ok(perfilDTO);
    }
    
    @CrossOrigin(origins = "*")
@GetMapping("/clientes/traerClientes")
public ResponseEntity<List<ClienteDTO>> getClientesD() {
    List<Cliente> clientes = servis.getClientes();
    List<ClienteDTO> clienteDTOs = new ArrayList<>();
    
    for (Cliente cliente : clientes) {
        ClienteDTO clienteDTO = new ClienteDTO(cliente.getId(), cliente.getNombre());
        clienteDTOs.add(clienteDTO);
    }
    
    return new ResponseEntity<>(clienteDTOs, HttpStatus.OK);
}

 @CrossOrigin(origins = "*")
@GetMapping("/clientes/traerClientesAdmin")
public ResponseEntity<List<ClientePerfilDTO>> getClientesAdmin() {
    List<Cliente> clientes = servis.getClientes();
    List<ClientePerfilDTO> clienteDTOs = new ArrayList<>();
    
    for (Cliente cliente : clientes) {
        ClientePerfilDTO clienteDTO = new ClientePerfilDTO();
        // Establecer los atributos del DTO desde el objeto Cliente
        clienteDTO.setId(cliente.getId());
        clienteDTO.setNombre(cliente.getNombre());
        clienteDTO.setApellido(cliente.getApellido());
        clienteDTO.setLista_Sesiones(new ArrayList<>());
        clienteDTOs.add(clienteDTO);
    }
    
    return new ResponseEntity<>(clienteDTOs, HttpStatus.OK);
}

@GetMapping("/clientes/traerClientesADMIN")
public ResponseEntity<List<ClienteAdminDTO>> getClientesH(){
    List<Cliente> clientes = servis.getClientes();
    List<ClienteAdminDTO> clienteDTOs = new ArrayList<>();
    
    for (Cliente cliente : clientes) {
        ClienteAdminDTO clienteDTO = new ClienteAdminDTO(cliente.getId(), cliente.getNombre(),cliente.getApellido(),cliente.getCorreo());
        clienteDTOs.add(clienteDTO);
    }
    
    return new ResponseEntity<>(clienteDTOs, HttpStatus.OK);
}
}

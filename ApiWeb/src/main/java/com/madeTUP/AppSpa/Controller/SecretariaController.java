package com.madeTUP.AppSpa.Controller;

import com.madeTUP.AppSpa.DTO.ClienteLoginDTO;
import com.madeTUP.AppSpa.Model.Secretaria; // Asegúrate de importar la clase Secretaria
import com.madeTUP.AppSpa.Service.ISecretariaService;
import com.madeTUP.AppSpa.Service.SecretariaService; // Asegúrate de importar el servicio de Secretaria
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
public class SecretariaController {

    @Autowired 
    private ISecretariaService servis; // Servicio para manejar la lógica de Secretaria

    @GetMapping("/Secretaria/traer")
    public List<Secretaria> getSecretarias() {
        return servis.getSecretaria(); // Método que devuelve una lista de secretarias
    }

    @PostMapping("/Secretaria/crear")
    public String crearSecretaria(@RequestBody Secretaria s) {
        servis.saveSecretaria(s); // Método que guarda una nueva secretaria
        return "Secretaria creada";
    }

    @GetMapping("/Secretaria/encontrar/{id_secretaria}")
    public Secretaria findSecretaria(@PathVariable Long id_secretaria) {
        return servis.findSecretaria(id_secretaria); // Método que busca una secretaria por ID
    }

    @DeleteMapping("/Secretaria/eliminar/{id_secretaria}")
    public String deleteSecretaria(@PathVariable Long id_secretaria) {
        servis.deleteSecretaria(id_secretaria); // Método que elimina una secretaria
        return "Secretaria eliminada";
    }

    @PutMapping("/Secretaria/editar/{id_secretaria}")
    public Secretaria editSecretaria(@PathVariable Long id_secretaria,
                                      @RequestParam(required = false, name = "nombre") String newNombre,
                                      @RequestParam(required = false, name = "apellido") String newApellido,
                                      @RequestParam(required = false, name = "correo") String newCorreo,
                                      @RequestParam(required = false, name = "nombre_usuario") String newNombreUsuario,
                                      @RequestParam(required = false, name = "contrasenia") String newContrasenia,
                                      @RequestParam(required = false, name = "tipoUsuario") String newTipoUsuario) {

        // Llamada al servicio para editar los datos de la secretaria
        servis.editSecretaria(id_secretaria, newNombre, newApellido, newCorreo, newNombreUsuario, newContrasenia, newTipoUsuario);

        // Obtener el objeto actualizado
        Secretaria secretaria = this.findSecretaria(id_secretaria);
        return secretaria;
    }

    @PutMapping("/Secretaria/editarII")
    public Secretaria editSecretariaII(@RequestBody Secretaria s) {
        servis.editSecretariaII(s); // Método para editar secretaria con objeto completo
        return servis.findSecretaria(s.getId());
    }

   @PostMapping("Secretaria/login")
    public ResponseEntity<Map<String, Object>> loginSecretaria(@RequestBody ClienteLoginDTO pers) {
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Bienvenido, " + pers.getUsername() + ". Inicio de sesión exitoso.");
        return ResponseEntity.ok(response);
    }
}

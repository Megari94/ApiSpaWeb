package com.madeTUP.AppSpa.Controller;

import com.madeTUP.AppSpa.Model.Usuario; // Suponiendo que tienes una clase Usuario que represente a todos los tipos de usuarios
import com.madeTUP.AppSpa.Service.UsuarioService; // Un servicio que maneje la lógica de usuarios
import com.madeTUP.AppSpa.DTO.ClienteLoginDTO; // DTO para recibir el login
import com.madeTUP.AppSpa.Service.IUsuarioService;
import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class LoginController {

    @Autowired
    private IUsuarioService usuarioService; // Servicio que maneja la lógica de usuarios

   @PostMapping("/login")
public ResponseEntity<?> login(@RequestBody ClienteLoginDTO loginRequest) {
    // Buscar el usuario por su nombre de usuario o correo
    Usuario usuario = usuarioService.findByUsernameOrEmail(loginRequest.getUsername());

    if (usuario == null) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario no encontrado");
    }

    // Verificar la contraseña
    if (!usuarioService.verifyPassword(usuario, loginRequest.getPassword())) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Contraseña incorrecta");
    }
    // Generar el token
    String token = jwtUtil.generateToken(usuario.getUsername()); // Usar el nombre de usuario o el ID
   
    Map<String, Object> response = new HashMap<>();
    response.put("success", true);
    response.put("message", "Inicio de sesión exitoso.");
    response.put("rol", usuario.getTipoUsuario()); // Devolver el rol del usuario
    response.put("Id", usuario.getId());
    response.put("nombre_usuario", usuario.getNombre_usuario());
    response.put("token", token);
    return ResponseEntity.ok(response);
}

}
